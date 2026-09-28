'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, CheckCircle2, ShieldCheck, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { EXPO_THEMES, COLLEGE_YEARS, COLLEGE_SECTIONS } from '@/types';

export default function AdminSettingsPage() {
  const [expoName, setExpoName] = useState('CSE Project Expo 2026');
  const [collegeName, setCollegeName] = useState('VSB College of Engineering Technical Campus');
  const [departmentName, setDepartmentName] = useState('Department of Computer Science & Engineering');
  const [deadline, setDeadline] = useState('2026-03-31');
  const [expoDate, setExpoDate] = useState('2026-04-15');
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-1">
            <Settings className="w-3.5 h-3.5" />
            Expo Configurations
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Event & Department Settings</h1>
          <p className="text-xs text-slate-400">
            Configure exhibition dates, department branding, allowed themes, and operational policies.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Department & Institution Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Institutional Identity</CardTitle>
            <CardDescription>
              Information displayed across student portals, email advisories, and WhatsApp messages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Exhibition Name"
              value={expoName}
              onChange={(e) => setExpoName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />

              <Input
                label="College / University Name"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Registration Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Schedule & Access</CardTitle>
            <CardDescription>Control registration cutoff deadlines and exhibition calendar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registration Deadline Date"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />

              <Input
                label="Project Expo Showcase Date"
                type="date"
                value={expoDate}
                onChange={(e) => setExpoDate(e.target.value)}
                required
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white text-sm block">Registration Portal Status</span>
                <span className="text-xs text-slate-400">
                  Allow or freeze new student team project submissions.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRegistrationOpen}
                  onChange={(e) => setIsRegistrationOpen(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Meta WhatsApp Business Platform
            </CardTitle>
            <CardDescription>
              Backend Cloud API health and registered message templates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Gateway Status</span>
                <Badge variant="success" size="sm">
                  Connected & Active
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Active Templates</span>
                <span className="font-mono text-slate-300">
                  project_submission_success, project_shortlisted, project_not_shortlisted
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Security Note</span>
                <span className="text-indigo-300">
                  Meta Access Tokens & Secrets remain encrypted server-side in environment variables.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allowed Themes & Cohorts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Eligible Themes & Academic Cohorts</CardTitle>
            <CardDescription>Active options available during team registration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-slate-300 block mb-2">Available Themes (13)</span>
              <div className="flex flex-wrap gap-1.5">
                {EXPO_THEMES.map((theme) => (
                  <span
                    key={theme}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.08]">
              <div>
                <span className="font-semibold text-slate-300 block mb-2">Eligible Academic Years</span>
                <div className="flex flex-wrap gap-1.5">
                  {COLLEGE_YEARS.map((yr) => (
                    <span
                      key={yr}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                    >
                      {yr}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-300 block mb-2">Eligible Department Sections</span>
                <div className="flex flex-wrap gap-1.5">
                  {COLLEGE_SECTIONS.map((sec) => (
                    <span
                      key={sec}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium"
                    >
                      Section {sec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="gap-2 px-6">
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
