import { NextResponse } from 'next/server';
import {
  getAllFirestoreTeams,
  updateFirestoreTeam,
  deleteFirestoreTeam,
} from '@/lib/firebase/teams';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { Team } from '@/types';

// GET: List all teams with filters, search, and sorting
export async function GET(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase();
  const theme = searchParams.get('theme');
  const status = searchParams.get('status');
  const year = searchParams.get('year');
  const section = searchParams.get('section');
  const sortBy = searchParams.get('sortBy') || 'newest';

  try {
    let teams: Team[] = await getAllFirestoreTeams();

    // Apply Search Filter across multiple fields
    if (search) {
      teams = teams.filter((t) => {
        const inTeamName = t.team_name.toLowerCase().includes(search);
        const inLeader = t.team_leader_name.toLowerCase().includes(search);
        const inProject = t.project_title.toLowerCase().includes(search);
        const inSubId = t.submission_id.toLowerCase().includes(search);
        const inEmail = t.email.toLowerCase().includes(search);
        const inPhone = t.whatsapp_number.includes(search);
        const inMembers = t.team_members?.some((m) => m.name.toLowerCase().includes(search));
        return inTeamName || inLeader || inProject || inSubId || inEmail || inPhone || inMembers;
      });
    }

    // Filter by Theme
    if (theme && theme !== 'all') {
      teams = teams.filter((t) => t.theme === theme);
    }

    // Filter by Status
    if (status && status !== 'all') {
      teams = teams.filter((t) => t.status === status);
    }

    // Filter by Year
    if (year && year !== 'all') {
      teams = teams.filter((t) => t.team_members?.some((m) => m.year === year));
    }

    // Filter by Section
    if (section && section !== 'all') {
      teams = teams.filter((t) => t.team_members?.some((m) => m.section === section));
    }

    // Apply Sorting
    teams.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
      }
      if (sortBy === 'team_name') {
        return a.team_name.localeCompare(b.team_name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });

    return NextResponse.json({ teams, total: teams.length });
  } catch (err: any) {
    console.error('[Admin Teams GET Error]', err);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

// PUT: Update team status or details
export async function PUT(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    const success = await updateFirestoreTeam(id, updates);
    if (!success) {
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id, updates });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Update error' }, { status: 500 });
  }
}

// DELETE: Delete a team
export async function DELETE(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
    }

    await deleteFirestoreTeam(id);
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Delete error' }, { status: 500 });
  }
}
