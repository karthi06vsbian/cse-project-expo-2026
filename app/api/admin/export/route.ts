import { NextResponse } from 'next/server';
import { getAllFirestoreTeams } from '@/lib/firebase/teams';
import { verifyAdminSession } from '@/lib/auth/admin-guard';
import { generateTeamsExcelBuffer } from '@/lib/excel/export';
import { Team } from '@/types';

export async function POST(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required.' }, { status: 403 });
  }

  try {
    const { teamIds } = await request.json(); // optional array of IDs

    let teams: Team[] = await getAllFirestoreTeams();

    if (Array.isArray(teamIds) && teamIds.length > 0) {
      teams = teams.filter((t) => teamIds.includes(t.id));
    }

    if (teams.length === 0) {
      return NextResponse.json({ error: 'No matching team records found to export' }, { status: 404 });
    }

    const excelBuffer = generateTeamsExcelBuffer(teams);

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `CSE_Project_Expo_2026_Teams_${timestamp}.xlsx`;

    // Convert Buffer to Uint8Array for Web BodyInit
    const uint8Array = new Uint8Array(excelBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error('[Excel Export Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Error generating Excel document' },
      { status: 500 }
    );
  }
}
