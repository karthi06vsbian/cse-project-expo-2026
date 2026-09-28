import { NextResponse } from 'next/server';
import { getAllFirestoreWhatsAppLogs, logFirestoreWhatsAppMessage } from '@/lib/firebase/teams';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { sendWhatsAppTextMessage } from '@/lib/whatsapp/client';
import { normalizeWhatsAppNumber } from '@/lib/validation/schemas';

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const logs = await getAllFirestoreWhatsAppLogs();
    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error('[WhatsApp Logs Error]', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const { recipients, message } = await req.json();
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'At least one recipient is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const results = [];
    for (const r of recipients) {
      const personalizedMsg = message
        .replace(/{name}/gi, r.leaderName || r.name || 'Participant')
        .replace(/{team}/gi, r.teamName || 'Team')
        .replace(/{submission_id}/gi, r.submissionId || '')
        .replace(/{project}/gi, r.projectTitle || '');

      const phone = normalizeWhatsAppNumber(r.phone || r.whatsappNumber || r.whatsapp_number);
      const res = await sendWhatsAppTextMessage(phone, personalizedMsg);

      await logFirestoreWhatsAppMessage({
        team_id: r.teamId || r.id,
        phone_number: phone,
        message_type: 'custom_admin_broadcast',
        message_status: res.success ? 'sent' : 'failed',
        provider_message_id: res.providerMessageId || null,
        error_message: res.error || null,
      });

      results.push({
        teamId: r.teamId || r.id,
        teamName: r.teamName,
        phone,
        success: res.success,
        error: res.error,
      });
    }

    const totalSent = results.filter((r) => r.success).length;
    const totalFailed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      totalSent,
      totalFailed,
      results,
    });
  } catch (err: any) {
    console.error('[WhatsApp Custom Broadcast Error]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
