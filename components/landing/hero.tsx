import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Sparkles, ArrowRight, BookOpen, Cpu, Building2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Department & College Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-inner mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Department of Computer Science & Engineering</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">VSB College of Engineering Technical Campus</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          CSE PROJECT EXPO <span className="gradient-text">2026</span>
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-indigo-400">
          &ldquo;Build. Innovate. Solve.&rdquo;
        </p>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Showcase your Software + Hardware innovation and present your engineered solution to real-world problems.
        </p>

        {/* Requirement Pill */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm font-medium text-indigo-300">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Strict Requirement: Projects must contain both <strong>Software and Hardware</strong> components</span>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-8 py-6 rounded-xl shadow-xl shadow-indigo-600/30">
              Register Your Team
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="#about" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base gap-2 px-6 py-6 rounded-xl border-slate-700 bg-slate-900/60 hover:bg-slate-800">
              <BookOpen className="w-5 h-5 text-slate-400" />
              View Guidelines
            </Button>
          </Link>
        </div>

        {/* Info Badges Grid (Event dates and deadline removed) */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Expo Venue</p>
              <p className="text-sm font-bold text-white">CSE Department Auditorium</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-md flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Institution</p>
              <p className="text-sm font-bold text-white">VSB College of Engineering Technical Campus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
