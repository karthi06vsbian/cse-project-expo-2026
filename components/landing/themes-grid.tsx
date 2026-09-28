import React from 'react';
import {
  Sprout,
  HeartPulse,
  GraduationCap,
  Leaf,
  Building2,
  Coins,
  Brain,
  Network,
  Cpu,
  ShieldAlert,
  Car,
  Users2,
  Layers,
} from 'lucide-react';

interface ThemeInfo {
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const THEMES_LIST: ThemeInfo[] = [
  {
    name: 'Agriculture',
    desc: 'Smart irrigation, soil telemetry, crop disease detection, automated harvesting.',
    icon: <Sprout className="w-5 h-5 text-emerald-400" />,
    color: 'border-emerald-500/20 hover:border-emerald-500/50',
  },
  {
    name: 'Healthcare',
    desc: 'Patient telemetry, non-invasive sensors, assistive mobility, emergency SOS.',
    icon: <HeartPulse className="w-5 h-5 text-rose-400" />,
    color: 'border-rose-500/20 hover:border-rose-500/50',
  },
  {
    name: 'Education',
    desc: 'Interactive lab hardware, refreshable Braille, AR/VR engineering tools.',
    icon: <GraduationCap className="w-5 h-5 text-amber-400" />,
    color: 'border-amber-500/20 hover:border-amber-500/50',
  },
  {
    name: 'Environment',
    desc: 'Waterway cleanup robots, air quality networks, acoustic wildlife tracking.',
    icon: <Leaf className="w-5 h-5 text-teal-400" />,
    color: 'border-teal-500/20 hover:border-teal-500/50',
  },
  {
    name: 'Smart Campus',
    desc: 'Intelligent microgrid load balancing, lab safety monitoring, automated attendance.',
    icon: <Building2 className="w-5 h-5 text-indigo-400" />,
    color: 'border-indigo-500/20 hover:border-indigo-500/50',
  },
  {
    name: 'FinTech',
    desc: 'Offline soundwave payment terminals, biometric POS systems, crypto tokens.',
    icon: <Coins className="w-5 h-5 text-yellow-400" />,
    color: 'border-yellow-500/20 hover:border-yellow-500/50',
  },
  {
    name: 'Artificial Intelligence',
    desc: 'Edge vision inference, industrial safety vision interlocks, embedded LLMs.',
    icon: <Brain className="w-5 h-5 text-violet-400" />,
    color: 'border-violet-500/20 hover:border-violet-500/50',
  },
  {
    name: 'Machine Learning',
    desc: 'Predictive motor vibration analytics, gesture translation gloves, tinyML.',
    icon: <Network className="w-5 h-5 text-blue-400" />,
    color: 'border-blue-500/20 hover:border-blue-500/50',
  },
  {
    name: 'IoT',
    desc: 'Distributed sensor meshes, LoRa long-range telemetry, smart industrial relays.',
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    color: 'border-cyan-500/20 hover:border-cyan-500/50',
  },
  {
    name: 'Cyber Security',
    desc: 'Hardware security tokens, biometric FIDO2 vaults, physical side-channel defense.',
    icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
    color: 'border-red-500/20 hover:border-red-500/50',
  },
  {
    name: 'Smart City',
    desc: 'Adaptive emergency green corridors, automated street lighting, smart parking.',
    icon: <Car className="w-5 h-5 text-sky-400" />,
    color: 'border-sky-500/20 hover:border-sky-500/50',
  },
  {
    name: 'Social Impact',
    desc: 'Assistive tech for disabled citizens, disaster alert beacons, community power.',
    icon: <Users2 className="w-5 h-5 text-pink-400" />,
    color: 'border-pink-500/20 hover:border-pink-500/50',
  },
  {
    name: 'Other',
    desc: 'Interdisciplinary innovations spanning aerospace, robotics, and emerging domains.',
    icon: <Layers className="w-5 h-5 text-purple-400" />,
    color: 'border-purple-500/20 hover:border-purple-500/50',
  },
];

export function ThemesGrid() {
  return (
    <section id="themes" className="py-20 border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Problem Domains
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Expo Focus Themes
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Select one of the approved themes when submitting your project. Interdisciplinary Software + Hardware implementations are highly encouraged.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {THEMES_LIST.map((theme) => (
            <div
              key={theme.name}
              className={`p-5 rounded-2xl bg-slate-900/60 border ${theme.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md flex flex-col justify-between`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-800/90 flex items-center justify-center mb-4 border border-white/10">
                  {theme.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{theme.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{theme.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
