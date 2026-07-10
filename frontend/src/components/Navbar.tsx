'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const dashboardLink =
    user.role === 'admission_team'
      ? '/admission/dashboard'
      : '/parent/dashboard';

  return (
    <nav className="bg-[#0B132B] border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-40">
      <Link href={dashboardLink} className="flex items-center gap-2.5">
        <span className="text-xl font-black tracking-tight text-white flex items-center gap-2.5">
          <span className="text-amber-500 text-2xl font-serif">A</span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-black tracking-wide text-white uppercase">ABC</span>
            <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase mt-0.5">International School</span>
          </span>
        </span>
      </Link>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-3 bg-slate-900/40 border border-slate-800/80 rounded-full px-4 py-1.5 shadow-sm">
          <span className="text-sm font-medium text-slate-200">
            {user.name}
          </span>
          <span className="h-3 w-px bg-slate-800"></span>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
            {user.role.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={logout}
          className="border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-wider transition-all py-1.5 px-4 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
