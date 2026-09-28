import { NextResponse } from 'next/server';
import { getAllFirestoreWhatsAppLogs } from '@/lib/firebase/teams';
import { verifyAdminSession } from '@/lib/auth/admin-guard';

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
