import { NextResponse } from 'next/server';
import {
  getAllFirestoreTeams,
  getTeamByUserId,
  createFirestoreTeam,
  logFirestoreWhatsAppMessage,
} from '@/lib/firebase/teams';
import { registrationSchema, normalizeWhatsAppNumber } from '@/lib/validation/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/client';
import { buildSubmissionSuccessTemplate } from '@/lib/whatsapp/templates';
import { CollegeYear, CollegeSection } from '@/types';

// GET: Check existing submission for currently logged-in student
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json({ authenticated: false, team: null });
    }

    const allTeams = await getAllFirestoreTeams();
    const existing = allTeams.find(
      (t) => (userId && t.submitted_by === userId) || (email && t.email.toLowerCase() === email.toLowerCase())
    );

    return NextResponse.json({
      authenticated: Boolean(email || userId),
      team: existing || null,
    });
  } catch (err: any) {
    console.error('[Registration GET Error]', err);
    return NextResponse.json({ error: 'Failed to check registration status' }, { status: 500 });
  }
}

// POST: Submit new team registration
export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'local-client';
    const rateCheck = checkRateLimit(`reg_${clientIp}`, { intervalMs: 60 * 1000, maxRequests: 5 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // 2. Validate Form Data with Zod
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Invalid form input';
      return NextResponse.json({ error: firstError, details: validationResult.error.flatten() }, { status: 400 });
    }

    const valData = validationResult.data;
    const userId = body.userId || `user_${Date.now()}`;
    const userEmail = valData.email.toLowerCase();

    // 3. Duplicate Prevention Check (1 Account = 1 Submission)
    const allTeams = await getAllFirestoreTeams();
    const existingTeam = allTeams.find(
      (t) => t.submitted_by === userId || t.email.toLowerCase() === userEmail
    );

    if (existingTeam) {
      return NextResponse.json(
        {
          error: 'You have already submitted a project using this Gmail account.',
          alreadySubmitted: true,
          submissionId: existingTeam.submission_id,
          teamName: existingTeam.team_name,
          status: existingTeam.status,
        },
        { status: 409 }
      );
    }

    // 4. Normalize Phone Number to +91XXXXXXXXXX
    const normalizedPhone = normalizeWhatsAppNumber(valData.whatsappNumber);

    // 5. Create Team in Cloud Firestore
    const createdTeam = await createFirestoreTeam({
      team_name: valData.teamName,
      team_leader_name: valData.teamLeaderName,
      whatsapp_number: normalizedPhone,
      email: valData.email,
      project_title: valData.projectTitle,
      theme: valData.theme,
      problem_description: valData.problemDescription,
      solution_description: valData.solutionDescription,
      technologies_used: valData.technologiesUsed,
      hardware_components: valData.hardwareComponents,
      expected_outcome: valData.expectedOutcome || null,
      status: 'submitted',
      submitted_by: userId,
      team_members: valData.members.map((m) => ({
        name: m.name.trim(),
        year: m.year as CollegeYear,
        section: m.section as CollegeSection,
      })),
    });

    // 6. Dispatch Meta WhatsApp Cloud API Confirmation
    let whatsappStatus: 'sent' | 'failed' = 'failed';
    let providerMsgId: string | null = null;
    let whatsappErrorMessage: string | null = null;

    try {
      const templatePayload = buildSubmissionSuccessTemplate(
        createdTeam.team_leader_name,
        createdTeam.project_title,
        createdTeam.submission_id
      );

      const waResult = await sendWhatsAppTemplateMessage(normalizedPhone, templatePayload);

      if (waResult.success) {
        whatsappStatus = 'sent';
        providerMsgId = waResult.providerMessageId || null;
      } else {
        whatsappStatus = 'failed';
        whatsappErrorMessage = waResult.error || 'WhatsApp delivery failed';
      }
    } catch (waEx: any) {
      whatsappStatus = 'failed';
      whatsappErrorMessage = waEx.message || 'WhatsApp API exception';
    }

    // 7. Audit Log in Firestore whatsapp_logs collection
    await logFirestoreWhatsAppMessage({
      team_id: createdTeam.id,
      phone_number: normalizedPhone,
      message_type: 'submission_confirmation',
      message_status: whatsappStatus,
      provider_message_id: providerMsgId,
      error_message: whatsappErrorMessage,
    });

    return NextResponse.json({
      success: true,
      submissionId: createdTeam.submission_id,
      teamId: createdTeam.id,
      teamName: createdTeam.team_name,
      projectTitle: createdTeam.project_title,
      whatsappDelivered: whatsappStatus === 'sent',
      message:
        whatsappStatus === 'sent'
          ? 'Registration successful! Confirmation sent to your WhatsApp.'
          : 'Your project has been successfully submitted. WhatsApp confirmation could not be delivered immediately.',
    });
  } catch (err: any) {
    console.error('[Registration POST Exception]', err);
    return NextResponse.json(
      { error: err?.message || 'Unexpected server error processing registration.' },
      { status: 500 }
    );
  }
}
