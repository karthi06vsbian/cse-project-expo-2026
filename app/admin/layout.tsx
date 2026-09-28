'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Settings,
  LogOut,
  Cpu,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Skip sidebar on /admin/login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'All Teams', href: '/admin/teams', icon: <Users2 className="w-4 h-4" /> },
    {
      label: 'Shortlisted',
      href: '/admin/teams?status=shortlisted',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      label: 'Under Review',
      href: '/admin/teams?status=under_review',
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    {
      label: 'Rejected',
      href: '/admin/teams?status=rejected',
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
    },
    {
      label: 'WhatsApp Logs',
      href: '/admin/whatsapp-logs',
      icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
    },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-white/[0.08] bg-slate-950/95 backdrop-blur-xl">
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight">CSE EXPO 2026</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Admin Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="truncate">
              <p className="font-semibold text-white truncate text-[11px]">Department Admin</p>
              <p className="text-[10px] text-slate-400 truncate">CSE Faculty Portal</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 h-16 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Portal</span>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-white capitalize">
                {pathname.replace('/admin', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm" className="text-xs">
                View Public Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white text-sm">CSE EXPO 2026</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
