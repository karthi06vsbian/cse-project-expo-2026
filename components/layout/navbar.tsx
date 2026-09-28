'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Cpu, UserPlus, Menu, X, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isPublicPage = !pathname.startsWith('/admin');

  if (!isPublicPage) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30 group-hover:scale-105 transition-transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              CSE EXPO <span className="text-indigo-400">2026</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Software + Hardware
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#about"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/#themes"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Themes
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#guidelines"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Guidelines
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link href={user ? '/register' : '/login'}>
            <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-indigo-500/25">
              <UserPlus className="w-3.5 h-3.5" />
              {user ? 'Register Project' : 'Register Your Team'}
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-slate-950 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              About the Expo
            </Link>
            <Link
              href="/#themes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              Themes
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              How It Works
            </Link>
            <Link
              href="/#guidelines"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white py-1"
            >
              Guidelines
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <Link
              href={user ? '/register' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button className="w-full justify-center">
                <UserPlus className="w-4 h-4 mr-2" />
                {user ? 'Register Project' : 'Register Your Team'}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
