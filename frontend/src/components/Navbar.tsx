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
        {/* Glowing/Shining User Profile Container */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900/60 to-slate-800/60 border border-slate-700/50 hover:border-amber-500/40 rounded-full px-4.5 py-1.5 shadow-md shadow-amber-500/5 hover:shadow-amber-500/10 transition-all duration-300 group">
          {/* User/Contact Icon wrapper */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-1.5 rounded-full group-hover:bg-amber-500/20 transition-all duration-300">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">
              {user.name}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-500/95 mt-0.5 leading-none">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Logout Trigger */}
        <button
          onClick={logout}
          className="border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-wider transition-all py-2 px-4.5 rounded-full"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
