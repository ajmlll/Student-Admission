'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admission_team') {
        router.push('/admission/dashboard');
      } else {
        router.push('/parent/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#0B132B] via-slate-950 to-[#1C2541]">
        <div className="text-xl text-amber-500 font-medium animate-pulse">
          Loading portal session...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-tr from-[#0B132B] via-slate-950 to-[#1C2541] text-white">
      {/* Header bar */}
      <header className="px-6 py-5 border-b border-slate-900 flex justify-between items-center max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <svg
            className="w-9 h-9 text-amber-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c0.5-1.5 2-2.5 4.5-2.5H19v7h-2.5c-2.5 0-4 1-4.5 2.5m0-7c-.5-1.5-2-2.5-4.5-2.5H5v7h2.5c2.5 0 4 1 4.5 2.5m0-7v7"
            />
          </svg>
          <span className="flex flex-col leading-none text-left">
            <span className="text-base font-black tracking-wide text-white uppercase">ABC</span>
            <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase mt-0.5">International School</span>
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-slate-350 hover:text-white font-semibold text-sm transition-all py-2 px-4"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2 px-4.5 rounded-lg shadow-lg shadow-amber-500/10 transition-all text-sm"
          >
            Apply Now
          </Link>
        </div>
      </header>

      {/* Main hero area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-12">
        <div className="space-y-6">
          <span className="inline-block bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
            Admissions Open • Academic Year 2026/2027
          </span>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl text-white max-w-3xl leading-[1.15]">
            Nurturing Excellence, <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-550 bg-clip-text text-transparent">
              Inspiring Leaders
            </span>
          </h1>
          <p className="max-w-xl mx-auto text-base text-slate-400 leading-relaxed">
            Welcome to ABC International School's Admission Portal. Apply for new student registrations, track evaluation steps, and schedule examinations.
          </p>
          <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-3 px-8 rounded-lg shadow-xl shadow-amber-500/20 transition-all text-sm uppercase tracking-wider"
            >
              Start Student Application
            </Link>
            <Link
              href="/login"
              className="border border-slate-700 hover:border-slate-500 bg-transparent text-slate-300 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all text-sm uppercase tracking-wider"
            >
              Access Portal account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 ABC International School. All rights reserved.
      </footer>
    </div>
  );
}
