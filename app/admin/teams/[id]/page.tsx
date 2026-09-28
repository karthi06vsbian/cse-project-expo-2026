'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  MessageSquare,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Team, EXPO_THEMES, TeamStatus } from '@/types';
import { formatDate } from '@/lib/utils';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states for editing
  const [editTeamName, setEditTeamName] = useState('');
  const [editLeaderName, setEditLeaderName] = useState('');
  const [editWhatsApp, setEditWhatsApp] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTheme, setEditTheme] = useState('');
  const [editProblem, setEditProblem] = useState('');
  const [editSolution, setEditSolution] = useState('');
  const [editTech, setEditTech] = useState('');
  const [editHardware, setEditHardware] = useState('');
  const [editOutcome, setEditOutcome] = useState('');
  const [editStatus, setEditStatus] = useState<TeamStatus>('submitted');

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch(`/api/admin/teams/${id}`);
        const data = await res.json();
        if (data.team) {
          setTeam(data.team);
          setEditTeamName(data.team.team_name);
          setEditLeaderName(data.team.team_leader_name);
          setEditWhatsApp(data.team.whatsapp_number);
          setEditTitle(data.team.project_title);
          setEditTheme(data.team.theme);
          setEditProblem(data.team.problem_description);
          setEditSolution(data.team.solution_description);
          setEditTech(data.team.technologies_used);
          setEditHardware(data.team.hardware_components);
          setEditOutcome(data.team.expected_outcome || '');
          setEditStatus(data.team.status);
        }
      } catch (err) {
        console.error('Error loading team details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadTeam();
  }, [id]);

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const payload = {
        team_name: editTeamName,
        team_leader_name: editLeaderName,
        whatsapp_number: editWhatsApp,
        project_title: editTitle,
        theme: editTheme,
        problem_description: editProblem,
        solution_description: editSolution,
        technologies_used: editTech,
        hardware_components: editHardware,
        expected_outcome: editOutcome,
        status: editStatus,
      };

      const res = await fetch(`/api/admin/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setTeam((prev: any) => ({ ...prev, ...payload, updated_at: new Date().toISOString() }));
        setIsEditing(false);
        alert('Team details successfully saved.');
      } else {
        alert('Failed to save team modifications.');
      }
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading team dossier...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <h2 className="text-lg font-bold text-white">Team Record Not Found</h2>
        <Link href="/admin/teams">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <Link href="/admin/teams">
            <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-400">
                {team.submission_id}
              </span>
              <StatusBadge status={team.status} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {team.team_name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="text-xs"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                isLoading={isSaving}
                className="text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Team Dossier
            </Button>
          )}
        </div>
      </div>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Project Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Project Specification
                </CardTitle>
                <Badge variant="cyan" size="sm">
                  Software + Hardware
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Project Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <Select
                    label="Problem Theme"
                    value={editTheme}
                    onChange={(e) => setEditTheme(e.target.value)}
                    options={EXPO_THEMES.map((t) => ({ value: t, label: t }))}
                  />
                  <Textarea
                    label="Problem Description"
                    rows={4}
                    value={editProblem}
                    onChange={(e) => setEditProblem(e.target.value)}
                  />
                  <Textarea
                    label="Proposed Solution Architecture"
                    rows={4}
                    value={editSolution}
                    onChange={(e) => setEditSolution(e.target.value)}
                  />
                  <Textarea
                    label="Software Technologies"
                    rows={2}
                    value={editTech}
                    onChange={(e) => setEditTech(e.target.value)}
                  />
                  <Textarea
                    label="Hardware Components"
                    rows={2}
                    value={editHardware}
                    onChange={(e) => setEditHardware(e.target.value)}
                  />
                  <Input
                    label="Expected Outcome"
                    value={editOutcome}
                    onChange={(e) => setEditOutcome(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-5 text-sm">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Title
                    </span>
                    <p className="text-base font-bold text-white mt-1">{team.project_title}</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Problem Statement
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                      {team.problem_description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Engineered Solution
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                      {team.solution_description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                        Software Stack
                      </span>
                      <p className="text-slate-200 text-xs mt-1 leading-relaxed">
                        {team.technologies_used}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                        Hardware Components
                      </span>
                      <p className="text-slate-200 text-xs mt-1 leading-relaxed">
                        {team.hardware_components}
                      </p>
                    </div>
                  </div>

                  {team.expected_outcome && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Expected Outcome
                      </span>
                      <p className="text-slate-300 text-xs mt-1">{team.expected_outcome}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Team Members ({team.team_members?.length || 0})</span>
                <span className="text-xs text-slate-400 font-normal">Min 2 / Max 6</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/[0.06]">
                {team.team_members?.map((member, idx) => (
                  <div key={member.id || idx} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">
                        {idx + 1}. {member.name}
                      </span>
                      {idx === 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">
                          Team Leader
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {member.year}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                        Sec {member.section}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Meta Info, Status & WhatsApp History */}
        <div className="space-y-6">
          {/* Status & Review Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Review & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <Select
                  label="Review Status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as TeamStatus)}
                  options={[
                    { value: 'submitted', label: 'Submitted (Neutral)' },
                    { value: 'under_review', label: 'Under Review (Warning)' },
                    { value: 'shortlisted', label: 'Shortlisted (Success)' },
                    { value: 'rejected', label: 'Rejected (Destructive)' },
                  ]}
                />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Current Pipeline</span>
                    <StatusBadge status={team.status} />
                  </div>
                  <div className="text-xs text-slate-400">
                    Registered on <strong>{formatDate(team.submitted_at)}</strong>
                  </div>
                </div>
              )}

              {/* Team Leader Contact */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Team Leader</span>
                  <span className="font-semibold text-white">{team.team_leader_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Official WhatsApp</span>
                  <a
                    href={`https://wa.me/${team.whatsapp_number.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {team.whatsapp_number}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Authenticated Gmail</span>
                  <span className="font-mono text-slate-300">{team.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Transmission History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                WhatsApp Logs
              </CardTitle>
              <CardDescription>Automated template dispatches to this team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Confirmation Template</span>
                  <span className="text-emerald-400 font-medium">✓ Delivered</span>
                </div>
                <p className="text-[10px] text-slate-400">Template: project_submission_success</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {formatDate(team.submitted_at)}
                </p>
              </div>

              {team.status === 'shortlisted' && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-300">Shortlist Notification</span>
                    <span className="text-emerald-400 font-medium">✓ Sent</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Template: project_shortlisted</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {formatDate(team.updated_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
