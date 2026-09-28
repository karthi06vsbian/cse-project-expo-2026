import * as XLSX from 'xlsx';
import { Team } from '@/types';

export function generateTeamsExcelBuffer(teams: Team[]): Buffer {
  const rows = teams.map((team) => {
    const members = team.team_members || [];

    const row: Record<string, string | number> = {
      'Submission ID': team.submission_id,
      'Team Name': team.team_name,
      'Team Leader': team.team_leader_name,
      'WhatsApp Number': team.whatsapp_number,
      'Email': team.email,
      'Project Title': team.project_title,
      'Theme': team.theme,
      'Problem Description': team.problem_description,
      'Proposed Solution': team.solution_description,
      'Technologies Used': team.technologies_used,
      'Hardware Components': team.hardware_components,
      'Expected Outcome': team.expected_outcome || '',
    };

    // Pad up to 6 members
    for (let i = 0; i < 6; i++) {
      const member = members[i];
      const idx = i + 1;
      row[`Member ${idx} Name`] = member?.name || '';
      row[`Member ${idx} Year`] = member?.year || '';
      row[`Member ${idx} Section`] = member?.section || '';
    }

    row['Status'] = team.status.toUpperCase();
    row['Submitted Date'] = new Date(team.submitted_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = Object.keys(rows[0] || {}).map((key) => {
    let maxLen = key.length;
    rows.forEach((r) => {
      const val = String(r[key] || '');
      if (val.length > maxLen) {
        maxLen = Math.min(val.length, 45); // cap wide columns
      }
    });
    return { wch: maxLen + 3 };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Teams');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
