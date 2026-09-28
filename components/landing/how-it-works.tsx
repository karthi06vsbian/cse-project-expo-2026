import React from 'react';
import { LogIn, Users, Send, ClipboardCheck, BellRing } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Sign In with Google',
    desc: 'Authenticate with your official Gmail address. Each account can register exactly one team.',
    icon: <LogIn className="w-5 h-5 text-indigo-400" />,
  },
  {
    step: '02',
    title: 'Register Your Team',
    desc: 'Enter your team leader information, WhatsApp contact, and add 2 to 6 team members across 1st to 4th years.',
    icon: <Users className="w-5 h-5 text-indigo-400" />,
  },
  {
    step: '03',
    title: 'Submit Project Specs',
    desc: 'Provide your problem statement, solution architecture, software technologies, and required hardware sensors/boards.',
    icon: <Send className="w-5 h-5 text-indigo-400" />,
  },
  {
    step: '04',
    title: 'Department Review',
    desc: 'Our faculty committee evaluates feasibility, novelty, and the technical depth of your Software + Hardware integration.',
    icon: <ClipboardCheck className="w-5 h-5 text-indigo-400" />,
  },
  {
    step: '05',
    title: 'WhatsApp Notification',
    desc: 'Receive immediate automated WhatsApp confirmation upon submission and real-time updates if your team is shortlisted.',
    icon: <BellRing className="w-5 h-5 text-indigo-400" />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 border-t border-white/[0.08] bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How It Works
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            From team formation to final stage showcase — simple 5-step registration process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {STEPS.map((s, idx) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.08] relative backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-700 tracking-tighter">
                    {s.step}
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
