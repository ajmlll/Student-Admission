'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!user) return null;

  const dashboardLink =
    user.role === 'admission_team'
      ? '/admission/dashboard'
      : '/parent/dashboard';

  return (
    <nav className="bg-[#0B132B] border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-40">
      <Link href={dashboardLink} className="flex items-center gap-3">
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
      </Link>
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        {/* Glowing/Shining User Profile Container */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900/60 to-slate-800/60 border border-slate-700/50 hover:border-amber-500/40 rounded-full p-1 sm:px-4 sm:py-1.5 shadow-md shadow-amber-500/5 hover:shadow-amber-500/10 transition-all duration-300 group">
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
          <div className="hidden sm:flex flex-col text-left">
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
          onClick={() => setShowLogoutConfirm(true)}
          className="border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-wider transition-all p-2.5 sm:py-2 sm:px-4 rounded-full flex items-center justify-center gap-1.5 group/logout shadow-sm"
          title="Logout"
        >
          <svg
            className="w-4 h-4 text-red-400 group-hover/logout:translate-x-0.5 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            viewBox="0 0 24 24"
          >
            {/* Door/bracket */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
            />
            {/* Arrow pointing right */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H9m10 0l-3-3m3 3l-3 3"
            />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center space-y-5 animate-scale-in">
            {/* Exit Icon */}
            <div className="mx-auto w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 12H9m10 0l-3-3m3 3l-3 3"
                />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to log out of your school admission portal account?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all border border-slate-700/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 bg-red-500 hover:bg-red-650 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-red-500/10"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
