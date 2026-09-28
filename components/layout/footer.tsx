import React from 'react';
import Link from 'next/link';
import { Cpu, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-slate-950/90 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">CSE PROJECT EXPO 2026</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Empowering student engineers to build, innovate, and solve real-world challenges through combined Software and Hardware solutions.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-950/60 border border-indigo-800/40 text-xs text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Software + Hardware Integration Mandatory
            </div>
          </div>

          {/* Department Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Department & College
            </h4>
            <p className="text-sm text-slate-300 font-medium">Department of Computer Science & Engineering</p>
            <p className="text-sm text-slate-400">VSB College of Engineering Technical Campus</p>
            <p className="text-xs text-indigo-400">Academic Year 2025–2026</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Portals
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-indigo-400 transition-colors">
                  Team Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">
                  Check Submission Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CSE Project Expo. All rights reserved. VSB College of Engineering Technical Campus.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
