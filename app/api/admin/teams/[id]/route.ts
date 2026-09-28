import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
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
    const adminSupabase = createAdminClient();
    const { data: team, error } = await adminSupabase
      .from('teams')
      .select('*, team_members(*), whatsapp_logs(*)')
      .eq('id', params.id)
      .maybeSingle();

    if (error || !team) {
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
    const adminSupabase = createAdminClient();

    const allowedFields = [
      'team_name',
      'team_leader_name',
      'whatsapp_number',
      'project_title',
      'theme',
      'problem_description',
      'solution_description',
      'technologies_used',
      'hardware_components',
      'expected_outcome',
      'status',
    ];

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });

    const { data: updatedTeam, error } = await adminSupabase
      .from('teams')
      .update(updates)
      .eq('id', params.id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: 'Failed to update team details' }, { status: 500 });
    }

    // If members were supplied, update them
    if (Array.isArray(body.members)) {
      await adminSupabase.from('team_members').delete().eq('team_id', params.id);
      const newMembers = body.members.map((m: any) => ({
        team_id: params.id,
        name: m.name,
        year: m.year,
        section: m.section,
      }));
      await adminSupabase.from('team_members').insert(newMembers);
    }

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update error' }, { status: 500 });
  }
}
