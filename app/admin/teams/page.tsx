'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  Sparkles,
  Phone,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Send,
  Users,
  CheckSquare,
} from 'lucide-react';
import { Team, EXPO_THEMES, COLLEGE_YEARS, COLLEGE_SECTIONS, TeamStatus } from '@/types';
import { formatDate } from '@/lib/utils';

function AdminTeamsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [yearFilter, setYearFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Custom WhatsApp message state
  const [customMessageModalOpen, setCustomMessageModalOpen] = useState(false);
  const [customMessageText, setCustomMessageText] = useState(
    '🎓 *VSB College of Engineering Technical Campus*\n*CSE Project Expo 2026 Announcement*\n\nDear *{name}* ({team}),\n\n[Type your announcement or instructions here]\n\nBest regards,\n*Organizing Committee - CSE Expo 2026*'
  );
  const [messageTargetIds, setMessageTargetIds] = useState<string[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageResult, setMessageResult] = useState<{
    sent: number;
    failed: number;
    details?: string;
  } | null>(null);

  // Load teams from API
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/teams');
      const data = await res.json();
      if (data.teams) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Update status filter if query param changes
  useEffect(() => {
    if (searchParams.get('status')) {
      setStatusFilter(searchParams.get('status') || 'all');
    }
  }, [searchParams]);

  // Client-side filtering & sorting
  const filteredTeams = useMemo(() => {
    return teams
      .filter((team) => {
        // Search across all fields
        if (search) {
          const q = search.toLowerCase();
          const inName = team.team_name.toLowerCase().includes(q);
          const inLeader = team.team_leader_name.toLowerCase().includes(q);
          const inProject = team.project_title.toLowerCase().includes(q);
          const inSubId = team.submission_id.toLowerCase().includes(q);
          const inEmail = team.email.toLowerCase().includes(q);
          const inPhone = team.whatsapp_number.includes(q);
          const inMembers = team.team_members?.some((m) =>
            m.name.toLowerCase().includes(q)
          );
          if (!inName && !inLeader && !inProject && !inSubId && !inEmail && !inPhone && !inMembers) {
            return false;
          }
        }

        // Filters
        if (themeFilter !== 'all' && team.theme !== themeFilter) return false;
        if (statusFilter !== 'all' && team.status !== statusFilter) return false;
        if (
          yearFilter !== 'all' &&
          !team.team_members?.some((m) => m.year === yearFilter)
        )
          return false;
        if (
          sectionFilter !== 'all' &&
          !team.team_members?.some((m) => m.section === sectionFilter)
        )
          return false;

        return true;
      })
      .sort((a, b) => {
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
  }, [teams, search, themeFilter, statusFilter, yearFilter, sectionFilter, sortBy]);

  // Checkbox management
  const allFilteredSelected =
    filteredTeams.length > 0 &&
    filteredTeams.every((t) => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeams.map((t) => t.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Single status change
  const handleQuickStatusChange = async (teamId: string, newStatus: TeamStatus) => {
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: teamId, status: newStatus }),
      });
      if (res.ok) {
        setTeams((prev) =>
          prev.map((t) => (t.id === teamId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Batch Shortlist with WhatsApp trigger
  const handleConfirmShortlist = async () => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamIds: selectedIds, action: 'shortlist' }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(
          `Successfully shortlisted ${data.updatedCount} teams and triggered WhatsApp notifications!`
        );
        setTeams((prev) =>
          prev.map((t) =>
            selectedIds.includes(t.id) ? { ...t, status: 'shortlisted' } : t
          )
        );
        setSelectedIds([]);
        setShortlistModalOpen(false);
      } else {
        alert(data.error || 'Failed to shortlist teams.');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Batch Reject with WhatsApp trigger
  const handleConfirmReject = async () => {
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/admin/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamIds: selectedIds, action: 'reject' }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Successfully marked ${data.updatedCount} teams as rejected.`);
        setTeams((prev) =>
          prev.map((t) =>
            selectedIds.includes(t.id) ? { ...t, status: 'rejected' } : t
          )
        );
        setSelectedIds([]);
        setRejectModalOpen(false);
      } else {
        alert(data.error || 'Failed to update teams.');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Delete team
  const handleDeleteTeam = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/teams?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeams((prev) => prev.filter((t) => t.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        setDeleteConfirmId(null);
      } else {
        alert('Failed to delete team.');
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // Custom WhatsApp Message Handlers
  const handleOpenCustomMessage = (teamId?: string) => {
    if (teamId) {
      setMessageTargetIds([teamId]);
    } else if (selectedIds.length > 0) {
      setMessageTargetIds(selectedIds);
    } else {
      setMessageTargetIds(filteredTeams.map((t) => t.id));
    }
    setMessageResult(null);
    setCustomMessageModalOpen(true);
  };

  const handleSendCustomWhatsApp = async () => {
    if (messageTargetIds.length === 0 || !customMessageText.trim()) return;

    setIsSendingMessage(true);
    setMessageResult(null);

    const targetTeams = teams.filter((t) => messageTargetIds.includes(t.id));
    const recipients = targetTeams.map((t) => ({
      teamId: t.id,
      name: t.team_leader_name,
      teamName: t.team_name,
      phone: t.whatsapp_number,
      submissionId: t.submission_id,
      projectTitle: t.project_title,
    }));

    try {
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          message: customMessageText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessageResult({
          sent: data.totalSent ?? 0,
          failed: data.totalFailed ?? 0,
        });
      } else {
        setMessageResult({
          sent: 0,
          failed: recipients.length,
          details: data.error || 'Failed to dispatch messages',
        });
      }
    } catch (err: any) {
      setMessageResult({
        sent: 0,
        failed: recipients.length,
        details: err?.message || 'Network error',
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Excel Export Handler (Selected, Filtered, or All)
  const handleExportExcel = async (type: 'selected' | 'filtered' | 'all') => {
    setIsExporting(true);
    let targetIds: string[] = [];

    if (type === 'selected') {
      targetIds = selectedIds;
    } else if (type === 'filtered') {
      targetIds = filteredTeams.map((t) => t.id);
    } else {
      targetIds = []; // all
    }

    try {
      const res = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamIds: targetIds }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `CSE_Expo_Teams_${type}_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to generate Excel file.');
      }
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Batch Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Teams Directory</h1>
          <p className="text-xs text-slate-400">
            Review submissions, evaluate Software + Hardware specs, shortlist teams, and trigger WhatsApp dispatches.
          </p>
        </div>

        {/* Global / Batch Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShortlistModalOpen(true)}
                className="text-xs gap-1.5 shadow-emerald-500/25"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Shortlist Selected ({selectedIds.length})
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => setRejectModalOpen(true)}
                className="text-xs gap-1.5 shadow-rose-500/25"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Selected ({selectedIds.length})
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportExcel('selected')}
                isLoading={isExporting}
                className="text-xs gap-1.5 border-emerald-500/30 text-emerald-400"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export Selected ({selectedIds.length})
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenCustomMessage()}
                className="text-xs gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                WhatsApp Selected ({selectedIds.length})
              </Button>
            </>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenCustomMessage()}
              className="text-xs gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              title="Broadcast custom WhatsApp message to all or selected teams"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Broadcast WhatsApp
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportExcel(selectedIds.length > 0 ? 'filtered' : 'all')}
              isLoading={isExporting}
              className="text-xs gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              {filteredTeams.length !== teams.length ? 'Export Filtered' : 'Export All'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={fetchTeams}
              className="text-xs p-2 text-slate-400 hover:text-white"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search team, leader, project, ID, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Theme Filter */}
          <div>
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Themes</option>
              {EXPO_THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Years</option>
              {COLLEGE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-800 bg-slate-950/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="team_name">Sort: Team Name</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            Showing <strong>{filteredTeams.length}</strong> of <strong>{teams.length}</strong> teams
          </span>
          {(search || themeFilter !== 'all' || statusFilter !== 'all' || yearFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setThemeFilter('all');
                setStatusFilter('all');
                setYearFilter('all');
                setSectionFilter('all');
              }}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Teams Data Table */}
      <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-4 py-3.5 font-semibold">Submission ID</th>
                <th className="px-4 py-3.5 font-semibold">Team Name</th>
                <th className="px-4 py-3.5 font-semibold">Team Leader</th>
                <th className="px-4 py-3.5 font-semibold">WhatsApp</th>
                <th className="px-4 py-3.5 font-semibold">Project Title</th>
                <th className="px-4 py-3.5 font-semibold">Theme</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Submitted</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading registered teams...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                    No matching teams found. Try changing your search query or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team) => {
                  const isSelected = selectedIds.includes(team.id);
                  return (
                    <tr
                      key={team.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(team.id)}
                          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-300 whitespace-nowrap">
                        <Link
                          href={`/admin/teams/${team.id}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {team.submission_id}
                        </Link>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-white whitespace-nowrap">
                        <Link href={`/admin/teams/${team.id}`} className="hover:text-indigo-300">
                          {team.team_name}
                        </Link>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {team.team_members?.length || 0} members
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-200">
                        {team.team_leader_name}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                        <a
                          href={`https://wa.me/${team.whatsapp_number.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-400 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-emerald-500" />
                          {team.whatsapp_number}
                        </a>
                      </td>

                      <td className="px-4 py-3.5 text-slate-200 max-w-xs truncate" title={team.project_title}>
                        {team.project_title}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px]">
                          {team.theme}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={team.status}
                          onChange={(e) =>
                            handleQuickStatusChange(team.id, e.target.value as TeamStatus)
                          }
                          className="bg-transparent border-none text-xs font-semibold focus:ring-0 cursor-pointer p-0"
                        >
                          <option value="submitted" className="bg-slate-900 text-slate-300">
                            Submitted
                          </option>
                          <option value="under_review" className="bg-slate-900 text-amber-400">
                            Under Review
                          </option>
                          <option value="shortlisted" className="bg-slate-900 text-emerald-400">
                            Shortlisted
                          </option>
                          <option value="rejected" className="bg-slate-900 text-rose-400">
                            Rejected
                          </option>
                        </select>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                        {formatDate(team.submitted_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/teams/${team.id}`}>
                            <button
                              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                              title="View Full Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </Link>

                          <button
                            onClick={() => handleOpenCustomMessage(team.id)}
                            className="p-1.5 rounded hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Send WhatsApp Message"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleQuickStatusChange(team.id, 'shortlisted')}
                            className="p-1.5 rounded hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Quick Shortlist"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(team.id)}
                            className="p-1.5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Team"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal: Batch Shortlist & WhatsApp Notification */}
      <Dialog
        isOpen={shortlistModalOpen}
        onClose={() => setShortlistModalOpen(false)}
        title="Confirm Shortlist & WhatsApp Dispatch"
        description={`You are about to shortlist ${selectedIds.length} team(s).`}
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Automated Meta WhatsApp Notification
            </div>
            <p className="leading-relaxed">
              Upon confirmation, the status of each selected team will update to <strong>SHORTLISTED</strong>. The Meta WhatsApp Cloud API template <code>project_shortlisted</code> will be dispatched to each team leader&apos;s registered phone number.
            </p>
          </div>

          <div className="max-h-40 overflow-y-auto rounded-lg bg-slate-950 p-3 border border-slate-800 divide-y divide-slate-800/60 text-xs">
            {teams
              .filter((t) => selectedIds.includes(t.id))
              .map((t) => (
                <div key={t.id} className="py-1.5 flex items-center justify-between">
                  <span className="font-semibold text-white">{t.team_name}</span>
                  <span className="font-mono text-slate-400">{t.whatsapp_number}</span>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShortlistModalOpen(false)}
              disabled={isProcessingAction}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleConfirmShortlist}
              isLoading={isProcessingAction}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Dispatch WhatsApp
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Confirmation Modal: Batch Rejection */}
      <Dialog
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Confirm Team Rejection"
        description={`You are about to mark ${selectedIds.length} team(s) as rejected.`}
      >
        <div className="space-y-4 pt-2">
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            Status will be updated to <strong>REJECTED</strong> and a rejection notice template will be transmitted.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectModalOpen(false)}
              disabled={isProcessingAction}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReject}
              isLoading={isProcessingAction}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Confirmation Modal: Delete Team */}
      <Dialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Team Record"
        description="Are you sure you want to permanently delete this team and all its registered members?"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            Warning: This action is permanent and will cascade-delete all team members and WhatsApp logs.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteConfirmId && handleDeleteTeam(deleteConfirmId)}
            >
              Delete Team Permanently
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal: Custom / Random WhatsApp Message Dispatcher */}
      <Dialog
        isOpen={customMessageModalOpen}
        onClose={() => setCustomMessageModalOpen(false)}
        title="Send Custom WhatsApp Message"
        description="Broadcast customized announcements directly to participants' registered WhatsApp numbers."
        maxWidth="2xl"
      >
        <div className="space-y-4 pt-2">
          {/* Target Recipients Selector */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Target Recipients ({messageTargetIds.length} of {teams.length} teams selected)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMessageTargetIds(teams.map((t) => t.id))}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
                >
                  Select All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() =>
                    setMessageTargetIds(
                      teams.filter((t) => t.status === 'shortlisted').map((t) => t.id)
                    )
                  }
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
                >
                  Only Shortlisted ({teams.filter((t) => t.status === 'shortlisted').length})
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => setMessageTargetIds([])}
                  className="text-[11px] text-slate-400 hover:text-slate-300 underline"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Recipient Chips */}
            <div className="max-h-24 overflow-y-auto flex flex-wrap gap-1.5 p-1 bg-slate-900/60 rounded-lg border border-white/5">
              {teams.map((team) => {
                const isChecked = messageTargetIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => {
                      setMessageTargetIds((prev) =>
                        isChecked ? prev.filter((id) => id !== team.id) : [...prev, team.id]
                      );
                    }}
                    className={`text-[11px] px-2 py-1 rounded-md transition-all flex items-center gap-1 border ${
                      isChecked
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                        : 'bg-slate-800/60 text-slate-400 border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span>{team.team_leader_name}</span>
                    <span className="text-[10px] text-slate-500">({team.team_name})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Template Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Quick Template Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setCustomMessageText(
                    '🎓 *VSB College of Engineering Technical Campus*\n*CSE Project Expo 2026 Announcement*\n\nDear *{name}* ({team}),\n\nThis is an official announcement regarding your project *{project}* (ID: {submission_id}).\n\n[Type your details here]\n\nBest regards,\n*Department of CSE*'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
              >
                📢 General Announcement
              </button>
              <button
                type="button"
                onClick={() =>
                  setCustomMessageText(
                    '⏰ *VSB CSE Project Expo 2026 - Reporting Notice*\n\nDear *{name}*,\n\nPlease report with your project team *{team}* (ID: {submission_id}) on [Date] at 9:00 AM at the CSE Department Seminar Hall.\n\nBring your working prototype, poster chart, and college ID cards.\n\nBest regards,\n*Organizing Committee*'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20"
              >
                ⏰ Reporting & Venue
              </button>
              <button
                type="button"
                onClick={() =>
                  setCustomMessageText(
                    '📑 *VSB CSE Project Expo 2026 - Document Submission*\n\nDear *{name}*,\n\nReminder: Please submit your final project PPT slides and hardware component documentation for *{team}* (ID: {submission_id}) before 5:00 PM today.\n\nBest regards,\n*Faculty Coordinator*'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20"
              >
                📑 PPT & Specs Reminder
              </button>
              <button
                type="button"
                onClick={() =>
                  setCustomMessageText(
                    '🎉 *Congratulations {name}!* \n\nYour project *{project}* (Team: *{team}*, ID: {submission_id}) has been *SHORTLISTED* for the final exhibition round of VSB CSE Project Expo 2026!\n\nPlease check your email for the presentation slot and jury schedule.\n\nBest regards,\n*Head of Department - CSE*'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
              >
                🎯 Shortlist Congratulations
              </button>
            </div>
          </div>

          {/* Placeholders helper */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Dynamic tags (click to insert):</span>
            {['{name}', '{team}', '{submission_id}', '{project}'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setCustomMessageText((prev) => prev + ' ' + tag)}
                className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-mono hover:bg-slate-700"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Message Textarea */}
          <div className="space-y-1">
            <textarea
              value={customMessageText}
              onChange={(e) => setCustomMessageText(e.target.value)}
              rows={6}
              placeholder="Type your message here..."
              className="w-full rounded-xl bg-slate-950 border border-white/10 p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Supports WhatsApp bold (*text*), italic (_text_), and emojis.</span>
              <span>{customMessageText.length} characters</span>
            </div>
          </div>

          {/* WhatsApp Preview Card */}
          {messageTargetIds.length > 0 && (
            <div className="bg-[#0b141a] p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-medium">
                Live WhatsApp Preview (Sample for{' '}
                {teams.find((t) => t.id === messageTargetIds[0])?.team_leader_name || 'Participant'}
                ):
              </span>
              <div className="bg-[#005c4b] text-white p-3 rounded-xl rounded-tl-none max-w-md text-xs shadow-md space-y-1">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {customMessageText
                    .replace(
                      /{name}/gi,
                      teams.find((t) => t.id === messageTargetIds[0])?.team_leader_name || 'Participant'
                    )
                    .replace(
                      /{team}/gi,
                      teams.find((t) => t.id === messageTargetIds[0])?.team_name || 'Team'
                    )
                    .replace(
                      /{submission_id}/gi,
                      teams.find((t) => t.id === messageTargetIds[0])?.submission_id || 'CSEEXPO-0001'
                    )
                    .replace(
                      /{project}/gi,
                      teams.find((t) => t.id === messageTargetIds[0])?.project_title || 'Project Title'
                    )}
                </p>
                <div className="text-[9px] text-emerald-200/60 text-right">Just now ✓✓</div>
              </div>
            </div>
          )}

          {/* Feedback / Result Banner */}
          {messageResult && (
            <div
              className={`p-3 rounded-xl border text-xs ${
                messageResult.failed === 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <div className="font-semibold">
                {messageResult.failed === 0 ? '✓ Broadcast Successful' : 'Broadcast Finished'}
              </div>
              <p className="text-[11px] mt-0.5">
                Sent: {messageResult.sent} | Failed: {messageResult.failed}
                {messageResult.details && ` (${messageResult.details})`}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomMessageModalOpen(false)}
              disabled={isSendingMessage}
            >
              Close
            </Button>

            <div className="flex items-center gap-2">
              {messageTargetIds.length === 1 && (
                <a
                  href={`https://wa.me/${(
                    teams.find((t) => t.id === messageTargetIds[0])?.whatsapp_number || ''
                  ).replace(/\D/g, '')}?text=${encodeURIComponent(
                    customMessageText
                      .replace(
                        /{name}/gi,
                        teams.find((t) => t.id === messageTargetIds[0])?.team_leader_name || 'Participant'
                      )
                      .replace(
                        /{team}/gi,
                        teams.find((t) => t.id === messageTargetIds[0])?.team_name || 'Team'
                      )
                      .replace(
                        /{submission_id}/gi,
                        teams.find((t) => t.id === messageTargetIds[0])?.submission_id || ''
                      )
                      .replace(
                        /{project}/gi,
                        teams.find((t) => t.id === messageTargetIds[0])?.project_title || ''
                      )
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Open in WhatsApp Web
                </a>
              )}

              <Button
                variant="success"
                size="sm"
                onClick={handleSendCustomWhatsApp}
                isLoading={isSendingMessage}
                disabled={messageTargetIds.length === 0 || !customMessageText.trim()}
                className="gap-1.5 shadow-emerald-500/25"
              >
                <Send className="w-3.5 h-3.5" />
                {isSendingMessage
                  ? `Sending (${messageTargetIds.length})...`
                  : `Send via Cloud API (${messageTargetIds.length})`}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default function AdminTeamsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading teams table...</p>
        </div>
      }
    >
      <AdminTeamsContent />
    </Suspense>
  );
}
