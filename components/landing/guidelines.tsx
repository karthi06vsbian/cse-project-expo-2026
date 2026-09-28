import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export function Guidelines() {
  return (
    <section id="guidelines" className="py-20 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Requirements */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
              <Cpu className="w-3.5 h-3.5" />
              Submission Rules & Eligibility
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Essential Submission Requirements
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              To ensure rigorous technical standards and industry relevance, all participating teams must adhere to the following departmental guidelines:
            </p>

            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong className="text-white">Software + Hardware Integration:</strong> Purely theoretical projects or software-only apps are strictly ineligible. Every entry must demonstrate a physical microcontroller, sensor array, or embedded hardware subsystem communicating with a software frontend/backend.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong className="text-white">Team Composition:</strong> Minimum of <strong>2</strong> and maximum of <strong>6</strong> students per team. Inter-section collaboration is permitted, but inter-year collaboration is not allowed (all team members must be from the same academic year).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong className="text-white">1 Submission per Google Account:</strong> The student team leader must authenticate with their Gmail account. Duplicate submissions under the same account are blocked.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  <strong className="text-white">Active WhatsApp Delivery:</strong> Ensure the team leader's WhatsApp number is active and capable of receiving official status templates.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-xl">
                  Register Your Project Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Box */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08]">
                <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Software + Hardware Rule</h3>
                  <p className="text-xs text-slate-400">Department Criteria Specification</p>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Software Layer
                  </span>
                  <p className="text-sm text-slate-300 mt-1">
                    Web/Mobile Dashboards (Next.js, Flutter, React), ML/AI models, Cloud APIs, Edge Inferencing scripts, Database pipelines.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Hardware Layer
                  </span>
                  <p className="text-sm text-slate-300 mt-1">
                    Microcontrollers (ESP32, Raspberry Pi, Arduino, STM32, Jetson), Telemetry sensors, Relays, Actuators, LoRa/GSM modules.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300 leading-relaxed">
                  Working physical hardware demos must be brought to the CSE Department Auditorium for live jury evaluation during the expo exhibition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
