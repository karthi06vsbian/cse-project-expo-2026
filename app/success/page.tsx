'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  CheckCircle2,
  Copy,
  Check,
  Home,
  MessageSquare,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team } from '@/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const isExisting = searchParams.get('existing') === 'true';
  const paramSubmissionId = searchParams.get('submission_id');
  const paramTeamName = searchParams.get('team_name');
  const paramProjectTitle = searchParams.get('project_title');
  const paramWa = searchParams.get('wa') === '1';

  const [copied, setCopied] = useState(false);
  const [teamData, setTeamData] = useState<Team | null>(null);
  const [loading, setLoading] = useState(isExisting || !paramSubmissionId);

  useEffect(() => {
    // Fire confetti for new submissions
    if (!isExisting) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas not supported
      }
    }

    // Fetch team data if existing or missing params
    async function loadTeam() {
      try {
        const res = await fetch('/api/registration');
        const data = await res.json();
        if (data?.team) {
          setTeamData(data.team);
        }
      } catch (err) {
        console.error('Failed to load team data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isExisting || !paramSubmissionId) {
      loadTeam();
    }
  }, [isExisting, paramSubmissionId]);

  const submissionId =
    paramSubmissionId || teamData?.submission_id || 'CSEEXPO-2026-PENDING';
  const teamName = paramTeamName || teamData?.team_name || 'Registered Team';
  const projectTitle =
    paramProjectTitle || teamData?.project_title || 'Software + Hardware Project';
  const status = teamData?.status || 'under_review';

  const copySubmissionId = () => {
    if (submissionId) {
      navigator.clipboard.writeText(submissionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <Card className="border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden">
          {/* Top highlight bar */}
          <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

          <CardContent className="p-8 text-center space-y-6">
            {/* Header Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                {isExisting ? 'Existing Registration' : 'CSE Project Expo 2026'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {isExisting ? 'Project Registered' : 'Registration Successful! 🎉'}
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                {isExisting
                  ? 'You have already submitted a project using this Gmail account.'
                  : 'Your project has been successfully registered. Please keep your Submission ID for future reference.'}
              </p>
            </div>

            {/* Submission ID Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Submission ID
                </span>
                <button
                  onClick={copySubmissionId}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1 px-2 rounded-md hover:bg-indigo-500/10 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-xl sm:text-2xl font-mono font-extrabold text-white tracking-wider">
                {submissionId}
              </div>

              <div className="pt-3 border-t border-white/[0.08] space-y-2 text-sm">
                <div>
                  <span className="text-xs text-slate-400">Team Name:</span>{' '}
                  <span className="font-semibold text-white">{teamName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Project:</span>{' '}
                  <span className="font-medium text-slate-200">{projectTitle}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-400">Status:</span>
                  <StatusBadge status={status} />
                </div>
              </div>
            </div>

            {/* WhatsApp delivery status badge */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-left">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                {paramWa ? (
                  <span>
                    Automated confirmation has been dispatched to the team leader&apos;s registered WhatsApp number.
                  </span>
                ) : (
                  <span>
                    Your submission is safely recorded in the expo database. WhatsApp notifications will be sent as status updates occur.
                  </span>
                )}
              </div>
            </div>

            {/* Next Steps Advisory */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left text-xs text-indigo-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-indigo-200">
                <Clock className="w-3.5 h-3.5" />
                What Happens Next?
              </div>
              <p className="text-indigo-300/90 leading-relaxed">
                The CSE Department Faculty Evaluation Committee is reviewing all submissions. Shortlisted teams will receive direct WhatsApp notification and presentation schedules for the project exhibition.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/" className="w-full">
                <Button variant="secondary" className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
