import { NextResponse } from 'next/server';
import {
  getAllFirestoreTeams,
  updateFirestoreTeam,
  logFirestoreWhatsAppMessage,
} from '@/lib/firebase/teams';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/client';
import {
  buildShortlistedTemplate,
  buildNotShortlistedTemplate,
} from '@/lib/whatsapp/templates';
import { normalizeWhatsAppNumber } from '@/lib/validation/schemas';

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
  }

  try {
    const { teamIds, action } = await request.json(); // action = 'shortlist' | 'reject'

    if (!Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json({ error: 'Please select at least one team' }, { status: 400 });
    }

    const targetStatus = action === 'reject' ? 'rejected' : 'shortlisted';
    const allTeams = await getAllFirestoreTeams();
    const teamsToProcess = allTeams.filter((t) => teamIds.includes(t.id));

    const results: Array<{
      teamId: string;
      teamName: string;
      whatsappSent: boolean;
      error?: string;
    }> = [];

    for (const team of teamsToProcess) {
      // 1. Update status in Firestore
      await updateFirestoreTeam(team.id, { status: targetStatus });

      // 2. Prepare & Send WhatsApp Template
      const normalizedPhone = normalizeWhatsAppNumber(team.whatsapp_number);
      let waStatus: 'sent' | 'failed' = 'failed';
      let providerMsgId: string | null = null;
      let errorMsg: string | null = null;

      try {
        const payload =
          action === 'reject'
            ? buildNotShortlistedTemplate(team.team_leader_name, team.project_title)
            : buildShortlistedTemplate(
                team.team_leader_name,
                team.team_name,
                team.project_title
              );

        const waRes = await sendWhatsAppTemplateMessage(normalizedPhone, payload);

        if (waRes.success) {
          waStatus = 'sent';
          providerMsgId = waRes.providerMessageId || null;
        } else {
          waStatus = 'failed';
          errorMsg = waRes.error || 'WhatsApp message rejected by provider';
        }
      } catch (ex: any) {
        waStatus = 'failed';
        errorMsg = ex.message;
      }

      // 3. Log to Firestore whatsapp_logs
      await logFirestoreWhatsAppMessage({
        team_id: team.id,
        phone_number: normalizedPhone,
        message_type: action === 'reject' ? 'rejected' : 'shortlisted',
        message_status: waStatus,
        provider_message_id: providerMsgId,
        error_message: errorMsg,
      });

      results.push({
        teamId: team.id,
        teamName: team.team_name,
        whatsappSent: waStatus === 'sent',
        error: errorMsg || undefined,
      });
    }

    return NextResponse.json({
      success: true,
      action,
      updatedCount: teamsToProcess.length,
      results,
    });
  } catch (err: any) {
    console.error('[Shortlist Batch Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Error processing batch status' },
      { status: 500 }
    );
  }
}
