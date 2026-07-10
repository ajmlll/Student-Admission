'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-xl text-indigo-400 font-medium animate-pulse">
          Loading parent portal...
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'parent') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
