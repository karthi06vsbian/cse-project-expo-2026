import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { registrationSchema, normalizeWhatsAppNumber } from '@/lib/validation/schemas';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/client';
import { buildSubmissionSuccessTemplate } from '@/lib/whatsapp/templates';

// GET: Check existing submission for currently logged-in student
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ authenticated: false, team: null });
    }

    const adminSupabase = createAdminClient();
    const { data: team } = await adminSupabase
      .from('teams')
      .select('*, team_members(*)')
      .eq('submitted_by', user.id)
      .maybeSingle();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      },
      team: team || null,
    });
  } catch (err: any) {
    console.error('[Registration GET Error]', err);
    return NextResponse.json({ error: 'Failed to check registration status' }, { status: 500 });
  }
}

// POST: Submit new team registration
export async function POST(request: Request) {
  try {
    // 1. Rate limiting by IP
    const clientIp = request.headers.get('x-forwarded-for') || 'local-client';
    const rateCheck = checkRateLimit(`reg_${clientIp}`, { intervalMs: 60 * 1000, maxRequests: 5 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    // 2. Authentication Check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in with your Gmail account to submit your project.' },
        { status: 401 }
      );
    }

    const adminSupabase = createAdminClient();

    // 3. Duplicate Prevention Check (At Server Level)
    const { data: existingTeam } = await adminSupabase
      .from('teams')
      .select('id, submission_id, team_name, status')
      .eq('submitted_by', user.id)
      .maybeSingle();

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

    // 4. Validate Form Data with Zod
    const body = await request.json();
    const validationResult = registrationSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Invalid form input';
      return NextResponse.json({ error: firstError, details: validationResult.error.flatten() }, { status: 400 });
    }

    const valData = validationResult.data;

    // Normalize phone number to +91XXXXXXXXXX
    const normalizedPhone = normalizeWhatsAppNumber(valData.whatsappNumber);

    // 5. Ensure Profile row exists for this user
    await adminSupabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        full_name: valData.teamLeaderName,
        role: 'student',
      },
      { onConflict: 'id' }
    );

    // 6. Generate human-friendly fallback submission ID if DB trigger sequence is bypassed
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const fallbackSubmissionId = `CSEEXPO-2026-${randomHex}`;

    // 7. Insert Team
    const { data: createdTeam, error: teamInsertError } = await adminSupabase
      .from('teams')
      .insert({
        submission_id: fallbackSubmissionId,
        team_name: valData.teamName,
        team_leader_name: valData.teamLeaderName,
        whatsapp_number: normalizedPhone,
        email: user.email,
        project_title: valData.projectTitle,
        theme: valData.theme,
        problem_description: valData.problemDescription,
        solution_description: valData.solutionDescription,
        technologies_used: valData.technologiesUsed,
        hardware_components: valData.hardwareComponents,
        expected_outcome: valData.expectedOutcome || null,
        status: 'submitted',
        submitted_by: user.id,
      })
      .select()
      .single();

    if (teamInsertError) {
      // Check PostgreSQL unique constraint violation (Code 23505)
      if (teamInsertError.code === '23505') {
        return NextResponse.json(
          { error: 'You have already submitted a project using this Gmail account.' },
          { status: 409 }
        );
      }
      console.error('[Team Insert Error]', teamInsertError);
      return NextResponse.json(
        { error: 'Failed to register team. Please check all fields and try again.' },
        { status: 500 }
      );
    }

    // 8. Insert Team Members (2 to 6)
    const membersToInsert = valData.members.map((m) => ({
      team_id: createdTeam.id,
      name: m.name.trim(),
      year: m.year,
      section: m.section,
    }));

    const { error: membersError } = await adminSupabase
      .from('team_members')
      .insert(membersToInsert);

    if (membersError) {
      console.error('[Members Insert Error]', membersError);
    }

    // 9. Dispatch Meta WhatsApp Cloud API Confirmation
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

    // 10. Audit Log in whatsapp_logs table
    await adminSupabase.from('whatsapp_logs').insert({
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
