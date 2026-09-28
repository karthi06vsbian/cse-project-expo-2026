'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Users2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Team } from '@/types';

export default function AdminDashboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/teams');
        const data = await res.json();
        if (data.teams) {
          setTeams(data.teams);
        }
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalTeams = teams.length;
  const submittedCount = teams.filter((t) => t.status === 'submitted').length;
  const underReviewCount = teams.filter((t) => t.status === 'under_review').length;
  const shortlistedCount = teams.filter((t) => t.status === 'shortlisted').length;
  const rejectedCount = teams.filter((t) => t.status === 'rejected').length;

  const totalMembers = teams.reduce((acc, t) => acc + (t.team_members?.length || 0), 0);

  // Theme Breakdown
  const themeCounts: Record<string, number> = {};
  teams.forEach((t) => {
    themeCounts[t.theme] = (themeCounts[t.theme] || 0) + 1;
  });
  const sortedThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1]);

  // Year Breakdown
  const yearCounts: Record<string, number> = {
    '1st Year': 0,
    '2nd Year': 0,
    '3rd Year': 0,
    '4th Year': 0,
  };
  // Section Breakdown
  const sectionCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

  teams.forEach((t) => {
    t.team_members?.forEach((m) => {
      if (yearCounts[m.year] !== undefined) yearCounts[m.year]++;
      if (sectionCounts[m.section] !== undefined) sectionCounts[m.section]++;
    });
  });

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamIds: [] }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CSE_Project_Expo_2026_All_Teams_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to generate Excel file.');
      }
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading department statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3 h-3" />
            Live Department Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Project Expo Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry on student team registrations, review statuses, and domain distributions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            isLoading={isExporting}
            className="text-xs gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export All to Excel
          </Button>

          <Link href="/admin/teams">
            <Button size="sm" className="text-xs gap-1.5 shadow-md shadow-indigo-600/30">
              <Users2 className="w-4 h-4" />
              Manage Teams
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Teams */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Teams</span>
            <Users2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalTeams}</div>
          <p className="text-[10px] text-slate-400 mt-1">{totalMembers} Total Students</p>
        </div>

        {/* Submitted */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Submitted</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-200">{submittedCount}</div>
          <p className="text-[10px] text-slate-400 mt-1">Awaiting Initial Review</p>
        </div>

        {/* Under Review */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-medium">Under Review</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">{underReviewCount}</div>
          <p className="text-[10px] text-amber-400/80 mt-1">In Faculty Assessment</p>
        </div>

        {/* Shortlisted */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-medium">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">{shortlistedCount}</div>
          <p className="text-[10px] text-emerald-400/80 mt-1">WhatsApp Notified</p>
        </div>

        {/* Rejected */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-medium">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-300">{rejectedCount}</div>
          <p className="text-[10px] text-rose-400/80 mt-1">Not Shortlisted</p>
        </div>

        {/* Unique Themes */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-medium">Active Themes</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">{sortedThemes.length}</div>
          <p className="text-[10px] text-indigo-400/80 mt-1">Diverse Disciplines</p>
        </div>
      </div>

      {/* Analytics Charts & Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Themes Breakdown Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Projects by Problem Theme</span>
              <span className="text-xs font-normal text-slate-400">{sortedThemes.length} Categories</span>
            </CardTitle>
            <CardDescription>
              Volume of Software + Hardware submissions per focus area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedThemes.map(([theme, count]) => {
              const percentage = totalTeams > 0 ? Math.round((count / totalTeams) * 100) : 0;
              return (
                <div key={theme} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{theme}</span>
                    <span className="text-slate-400">
                      {count} {count === 1 ? 'team' : 'teams'} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Year & Section Demographics */}
        <div className="space-y-6">
          {/* Year Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                Participation by Year
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {Object.entries(yearCounts).map(([yr, count]) => {
                const pct = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
                return (
                  <div key={yr} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{yr}</span>
                      <span className="text-slate-400 font-mono">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Section Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Participation by Section
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-2 pt-0">
              {Object.entries(sectionCounts).map(([sec, count]) => (
                <div
                  key={sec}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-center"
                >
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Sec {sec}
                  </span>
                  <span className="text-lg font-bold text-white mt-1 block">{count}</span>
                  <span className="text-[9px] text-slate-500">Students</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Submissions Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Recent Project Registrations</CardTitle>
            <CardDescription>Latest team entries submitted to the portal</CardDescription>
          </div>
          <Link href="/admin/teams">
            <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
              View All Teams
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="px-6 py-3 font-semibold">Submission ID</th>
                  <th className="px-6 py-3 font-semibold">Team Name</th>
                  <th className="px-6 py-3 font-semibold">Leader</th>
                  <th className="px-6 py-3 font-semibold">Project Title</th>
                  <th className="px-6 py-3 font-semibold">Theme</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {teams.slice(0, 5).map((team) => (
                  <tr key={team.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-medium text-indigo-300">
                      {team.submission_id}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-white">{team.team_name}</td>
                    <td className="px-6 py-3.5 text-slate-300">{team.team_leader_name}</td>
                    <td className="px-6 py-3.5 text-slate-200 max-w-xs truncate">
                      {team.project_title}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                        {team.theme}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={team.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link href={`/admin/teams/${team.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-indigo-400">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
