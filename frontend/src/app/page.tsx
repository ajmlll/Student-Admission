'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

import LoadingScreen from '../components/LoadingScreen';

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
    return <LoadingScreen message="Loading portal session..." fullScreen={true} />;
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

        {/* Steps Section */}
        <section className="max-w-7xl w-full mx-auto px-6 py-16 border-t border-slate-900/50 mt-12 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
              Application Pipeline Steps
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Review the 5 checkpoints to enroll a student in our academic courses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Register Account', desc: 'Create a parent profile account to begin the enrollment process.', icon: '🔑' },
              { step: '02', title: 'Biographical Info', desc: 'Provide student name, age, previous school records, and grades.', icon: '📝' },
              { step: '03', title: 'Verify Registration', desc: 'Pay the biographical processing and examination validation fee.', icon: '💳' },
              { step: '04', title: 'Reserve Seat', desc: 'Select a suitable date/time and book a seating spot for the test.', icon: '📅' },
              { step: '05', title: 'Course Placement', desc: 'Receive examination scores and course assignments from the staff.', icon: '🎓' },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between shadow-lg space-y-4 hover:border-amber-500/30 transition-all duration-300 group h-full"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xs font-bold text-amber-500/80 tracking-widest bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-full uppercase leading-none">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-amber-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950/60 border-t border-slate-900/60 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Logo & Tagline */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-amber-500"
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
                <span className="text-sm font-black tracking-wide text-white uppercase">ABC</span>
                <span className="text-[8px] font-bold tracking-widest text-amber-500 uppercase mt-0.5">International</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Nurturing the leaders of tomorrow with rigorous academic values, creative problem solving, and modern world-class facilities.
            </p>
          </div>

          {/* Quick Links: Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Academic Programs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Primary Academy</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Middle School</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Senior Preparatory</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Advanced Placement (AP)</span></li>
            </ul>
          </div>

          {/* Quick Links: Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Admission Portal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/register" className="hover:text-amber-500 transition-colors">Start Application</Link></li>
              <li><Link href="/login" className="hover:text-amber-500 transition-colors">Portal Account Access</Link></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Important Dates</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Tuition & Scholarships</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Contact Admissions</h4>
            <ul className="space-y-2 text-xs text-slate-450">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span className="hover:text-amber-500 transition-colors cursor-pointer text-slate-400">admissions@abc-school.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span className="text-slate-400">+1 (555) 019-2834</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span className="leading-snug text-slate-400">100 Academy Blvd,<br />Suite 500, VA 22102</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 ABC International School. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
