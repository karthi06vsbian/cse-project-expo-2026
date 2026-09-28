import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'CSE Project Expo 2026 | Build. Innovate. Solve.',
  description:
    'Annual Project Exhibition by the Department of Computer Science & Engineering. Showcase your Software + Hardware innovation and present your solution to real-world problems.',
  keywords: [
    'CSE Project Expo 2026',
    'Computer Science',
    'Hardware Software Projects',
    'Engineering Expo',
    'Student Innovation',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
