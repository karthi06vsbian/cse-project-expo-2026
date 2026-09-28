import { NextResponse } from 'next/server';
import { getTeamByDocId, updateFirestoreTeam } from '@/lib/firebase/teams';
import { verifyAdminSession } from '@/lib/auth/admin-guard';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
  }

  try {
    const team = await getTeamByDocId(params.id);

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const success = await updateFirestoreTeam(params.id, body);

    if (!success) {
      return NextResponse.json({ error: 'Failed to update team details' }, { status: 500 });
    }

    const updated = await getTeamByDocId(params.id);
    return NextResponse.json({ success: true, team: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update error' }, { status: 500 });
  }
}
