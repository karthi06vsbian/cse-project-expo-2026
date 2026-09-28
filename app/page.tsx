import React from 'react';
import { Hero } from '@/components/landing/hero';
import { ThemesGrid } from '@/components/landing/themes-grid';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Guidelines } from '@/components/landing/guidelines';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div id="about">
        <Guidelines />
      </div>
      <ThemesGrid />
      <HowItWorks />
    </div>
  );
}
