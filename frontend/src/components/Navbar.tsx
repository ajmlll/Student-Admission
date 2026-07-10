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
      <Link href={dashboardLink} className="flex items-center space-x-2">
        <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          <span className="text-amber-500">🍁</span> Maplewood{' '}
          <span className="text-amber-500 font-normal">International</span>
        </span>
      </Link>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="font-semibold text-white text-sm">{user.name}</div>
          <span className="inline-block mt-0.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 capitalize">
            {user.role.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={logout}
          className="border border-red-500/30 hover:border-red-500 bg-transparent hover:bg-red-500/10 text-red-400 font-medium py-1.5 px-4 rounded-lg transition-all text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
