import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp/client';
import {
  buildSubmissionSuccessTemplate,
  buildShortlistedTemplate,
  buildNotShortlistedTemplate,
} from '@/lib/whatsapp/templates';

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
  }

  try {
    const { logId } = await request.json();
    if (!logId) {
      return NextResponse.json({ error: 'Log ID required' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    const { data: log, error: logError } = await adminSupabase
      .from('whatsapp_logs')
      .select('*, teams(*)')
      .eq('id', logId)
      .maybeSingle();

    if (logError || !log) {
      return NextResponse.json({ error: 'Log entry not found' }, { status: 404 });
    }

    const team = log.teams;
    if (!team) {
      return NextResponse.json({ error: 'Associated team not found' }, { status: 404 });
    }

    let payload;
    if (log.message_type === 'submission_confirmation') {
      payload = buildSubmissionSuccessTemplate(team.team_leader_name, team.project_title, team.submission_id);
    } else if (log.message_type === 'shortlisted') {
      payload = buildShortlistedTemplate(team.team_leader_name, team.team_name, team.project_title);
    } else {
      payload = buildNotShortlistedTemplate(team.team_leader_name, team.project_title);
    }

    const result = await sendWhatsAppTemplateMessage(log.phone_number, payload);

    const updatedStatus = result.success ? 'sent' : 'failed';
    const errorMsg = result.error || null;
    const providerId = result.providerMessageId || null;

    // Update log
    await adminSupabase
      .from('whatsapp_logs')
      .update({
        message_status: updatedStatus,
        provider_message_id: providerId,
        error_message: errorMsg,
        sent_at: new Date().toISOString(),
      })
      .eq('id', logId);

    return NextResponse.json({
      success: result.success,
      status: updatedStatus,
      error: errorMsg,
    });
  } catch (err: any) {
    console.error('[WhatsApp Retry Error]', err);
    return NextResponse.json({ error: err?.message || 'Retry failed' }, { status: 500 });
  }
}
