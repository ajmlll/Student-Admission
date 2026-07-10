'use client';

import React from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({
  message = 'Synchronizing application data...',
  fullScreen = false,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-tr from-[#0B132B] via-slate-950 to-[#1C2541] animate-fade-in ${
        fullScreen
          ? 'min-h-screen w-screen fixed inset-0 z-50'
          : 'min-h-[50vh] w-full rounded-2xl border border-slate-900/50 bg-[#0f172a]/20 backdrop-blur-sm'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing Pulsing Outer Ring */}
        <div className="absolute w-24 h-24 rounded-full border border-amber-500/20 animate-ping" />

        {/* Spinning Outer Segment */}
        <div className="w-20 h-20 rounded-full border-2 border-slate-800/80 border-t-amber-500 animate-spin" />

        {/* Center Logo Shield Icon */}
        <div className="absolute top-[22px] flex items-center justify-center text-amber-500">
          <svg
            className="w-9 h-9 text-amber-500 animate-pulse"
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
        </div>

        {/* Loading Description */}
        <span className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400 animate-pulse text-center max-w-[280px]">
          {message}
        </span>
      </div>
    </div>
  );
}
