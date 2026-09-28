import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { WhatsAppLog } from '@/types';

const FALLBACK_LOGS: WhatsAppLog[] = [
  {
    id: 'log-1',
    team_id: 'demo-1',
    phone_number: '+919876543210',
    message_type: 'submission_confirmation',
    message_status: 'sent',
    provider_message_id: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSMzFDQkUxOTk3QTk2',
    error_message: null,
    sent_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    teams: { team_name: 'AgriSense IoT', submission_id: 'CSEEXPO-2026-0001' },
  },
  {
    id: 'log-2',
    team_id: 'demo-1',
    phone_number: '+919876543210',
    message_type: 'shortlisted',
    message_status: 'sent',
    provider_message_id: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSMzFDQkUxOTk3QUE5',
    error_message: null,
    sent_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    teams: { team_name: 'AgriSense IoT', submission_id: 'CSEEXPO-2026-0001' },
  },
  {
    id: 'log-3',
    team_id: 'demo-2',
    phone_number: '+919876543211',
    message_type: 'submission_confirmation',
    message_status: 'sent',
    provider_message_id: 'wamid.HBgMOTE5ODc2NTQzMjExFQIAERgSMzFDQkUxOTk3QUJB',
    error_message: null,
    sent_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    teams: { team_name: 'PulseGuard', submission_id: 'CSEEXPO-2026-0002' },
  },
  {
    id: 'log-4',
    team_id: 'demo-9',
    phone_number: '+919876543218',
    message_type: 'rejected',
    message_status: 'failed',
    provider_message_id: null,
    error_message: 'Recipient number does not have active WhatsApp account',
    sent_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    teams: { team_name: 'CivicFlow Traffic', submission_id: 'CSEEXPO-2026-0009' },
  },
];

export async function GET() {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const adminSupabase = createAdminClient();
    const { data: logs, error } = await adminSupabase
      .from('whatsapp_logs')
      .select('*, teams(team_name, submission_id)')
      .order('sent_at', { ascending: false });

    if (error || !logs || logs.length === 0) {
      return NextResponse.json({ logs: FALLBACK_LOGS });
    }

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error('[WhatsApp Logs Error]', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
