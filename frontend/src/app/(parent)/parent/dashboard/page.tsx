'use client';

import Navbar from '../../../../components/Navbar';
import { useAuth } from '../../../../context/AuthContext';

export default function ParentDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Parent Dashboard
          </h1>
          <p className="mt-4 text-slate-400">
            Welcome,{' '}
            <span className="font-semibold text-indigo-400">{user?.name}</span>!
            Here you can register your children and select examination slots.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 hover:bg-slate-800/60 rounded-xl p-6 border border-slate-800/80 transition-all">
              <h2 className="text-xl font-semibold text-white">
                My Children & Applications
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Register new student profiles, input personal information, and
                submit applications. (Coming soon)
              </p>
            </div>

            <div className="bg-slate-800/40 hover:bg-slate-800/60 rounded-xl p-6 border border-slate-800/80 transition-all">
              <h2 className="text-xl font-semibold text-white">
                Exam Bookings
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Book and manage examination slots for submitted admissions.
                (Coming soon)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
