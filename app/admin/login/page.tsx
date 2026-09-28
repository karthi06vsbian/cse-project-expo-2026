'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      // Success redirect to dashboard
      router.push('/admin');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#060911] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30 mb-4 border border-indigo-400/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Department Admin Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            CSE Project Expo 2026 Evaluation Committee
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300">{errorMessage}</p>
          </div>
        )}

        <Card className="border-white/10 bg-slate-900/90 shadow-2xl">
          <CardHeader>
            <CardTitle>Faculty Admin Login</CardTitle>
            <CardDescription>
              Sign in with your authorized department administrative credentials.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Admin Email Address"
                type="email"
                placeholder="admin@college.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-11 text-sm font-semibold shadow-lg shadow-indigo-600/25 mt-2"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Authenticate & Enter Dashboard
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-left text-xs space-y-1">
                <span className="font-semibold text-slate-300 block">Development / Demo Access:</span>
                <p className="text-slate-400">
                  Email: <code className="text-indigo-300">admin@college.edu</code>
                </p>
                <p className="text-slate-400">
                  Password: <code className="text-indigo-300">expo2026admin</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
