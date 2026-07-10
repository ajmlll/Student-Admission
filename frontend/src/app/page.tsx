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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-xl text-indigo-400 font-medium animate-pulse">
          Loading portal session...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          School Admission Management
        </h1>
        <p className="mt-6 max-w-xl text-lg text-slate-400">
          A production-ready full-stack platform for coordinating parent school
          applications and admission team review pipelines.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-500 transition-colors shadow-md"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-900 px-6 py-3 text-base font-medium text-slate-300 hover:text-white transition-colors"
          >
            Create Parent Account
          </Link>
        </div>
      </main>
    </div>
  );
}
