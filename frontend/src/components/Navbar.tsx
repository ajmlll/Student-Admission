'use client';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold tracking-tight text-white">
          School Admission <span className="text-indigo-400">Portal</span>
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="font-medium text-white">{user.name}</div>
          <div className="text-xs text-indigo-400 capitalize">
            {user.role.replace('_', ' ')}
          </div>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 text-white font-medium py-1.5 px-4 rounded-md transition-colors text-sm shadow-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
