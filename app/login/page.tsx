'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth, googleProvider } from '@/lib/firebase/client';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Cpu, CheckCircle2, AlertCircle, ArrowRight, LogOut } from 'lucide-react';
import { Team } from '@/types';

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<Team | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get('error');

  const checkUserSubmission = async (userEmail: string, userId: string) => {
    try {
      const res = await fetch(`/api/registration?email=${encodeURIComponent(userEmail)}&userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data?.team) {
        setExistingSubmission(data.team);
      } else {
        setExistingSubmission(null);
      }
    } catch (err) {
      console.error('Error checking submission status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user?.email) {
        await checkUserSubmission(user.email, user.uid);
      } else {
        setExistingSubmission(null);
        setCheckingStatus(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user?.email) {
        await checkUserSubmission(result.user.email, result.user.uid);
      }
    } catch (err: any) {
      // If popup was closed by user or blocked, provide graceful error
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(`Google login error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setExistingSubmission(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/25 mb-4">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CSE Project Expo 2026
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Student Authentication & Status Portal
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300">
              Authentication failed. Please try signing in again with your Google account.
            </p>
          </div>
        )}

        <Card className="border-white/10 bg-slate-900/90 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">
              {existingSubmission
                ? 'Project Already Registered'
                : currentUser
                ? 'Welcome Back'
                : 'Sign In with Google'}
            </CardTitle>
            <CardDescription>
              {existingSubmission
                ? 'You have already submitted a project with this Gmail account.'
                : currentUser
                ? `Logged in as ${currentUser.email}`
                : 'Use your Gmail/Google account to register your team or verify your submission.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4">
            {checkingStatus ? (
              <div className="py-8 text-center text-sm text-slate-400">
                Checking account status...
              </div>
            ) : existingSubmission ? (
              /* Already Submitted Case */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Submission ID
                    </span>
                    <span className="text-sm font-mono font-bold text-white bg-slate-950/60 px-2 py-0.5 rounded border border-white/10">
                      {existingSubmission.submission_id}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Team Name</span>
                    <p className="text-sm font-bold text-white">{existingSubmission.team_name}</p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400">Project Title</span>
                    <p className="text-sm font-medium text-slate-200">{existingSubmission.project_title}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                    <span className="text-xs text-slate-400">Status</span>
                    <StatusBadge status={existingSubmission.status} />
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  Per expo regulations, each Google account is restricted to one team submission. Your project is recorded and being reviewed by the department.
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link href={`/success?submission_id=${encodeURIComponent(existingSubmission.submission_id)}&team_name=${encodeURIComponent(existingSubmission.team_name)}&project_title=${encodeURIComponent(existingSubmission.project_title)}&existing=true`}>
                    <Button className="w-full">
                      View Full Submission Details
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs text-slate-400">
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    Sign Out ({currentUser?.email})
                  </Button>
                </div>
              </div>
            ) : currentUser ? (
              /* Authenticated with no team submitted yet */
              <div className="space-y-4">
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-emerald-300">
                    Logged in as <strong>{currentUser.email}</strong>. Ready to register your project team.
                  </div>
                </div>

                <Link href="/register">
                  <Button className="w-full h-11 text-base">
                    Continue to Registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full text-xs text-slate-400">
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              /* Not authenticated */
              <div className="space-y-4">
                <Button
                  onClick={handleGoogleLogin}
                  isLoading={isLoading}
                  className="w-full h-12 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-semibold gap-3 shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.15C3.25 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.27C.46 8.21 0 10.05 0 12s.46 3.79 1.27 5.41l4.01-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.27 6.59l4.01 3.15c.95-2.84 3.6-4.99 6.72-4.99z"
                    />
                  </svg>
                  Sign in with Google / Gmail
                </Button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Students must sign in using their official Gmail account. Only 1 project submission is permitted per account.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
