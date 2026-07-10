'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdmissionApplications } from '../../../../lib/api/admission';
import { Student } from '../../../../lib/api/students';
import LoadingScreen from '../../../../components/LoadingScreen';

export default function AdmissionDashboard() {
  const [applications, setApplications] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAdmissionApplications();
        setApplications(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load admission metrics');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const counts = {
    TOTAL: applications.length,
    APPLICATION_CREATED: applications.filter(
      (a) => a.status === 'APPLICATION_CREATED',
    ).length,
    REGISTRATION_FEE_PAID: applications.filter(
      (a) => a.status === 'REGISTRATION_FEE_PAID',
    ).length,
    SLOT_BOOKED: applications.filter((a) => a.status === 'SLOT_BOOKED').length,
    EXAM_COMPLETED: applications.filter((a) => a.status === 'EXAM_COMPLETED')
      .length,
    ADMISSION_COMPLETED: applications.filter(
      (a) => a.status === 'ADMISSION_COMPLETED',
    ).length,
  };

  if (loading) {
    return <LoadingScreen message="Loading metrics..." fullScreen={false} />;
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Admission Workspace
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Monitor workflow checkpoints, review entrance exams, and assign courses.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Files', count: counts.TOTAL, icon: '📋', color: 'border-slate-800 bg-slate-900/40 text-slate-350' },
          { label: 'New Applied', count: counts.APPLICATION_CREATED, icon: '✍️', color: 'border-amber-500/20 bg-amber-500/5 text-amber-450' },
          { label: 'Fee Verified', count: counts.REGISTRATION_FEE_PAID, icon: '💳', color: 'border-blue-500/20 bg-blue-500/5 text-blue-400' },
          { label: 'Slots Reserved', count: counts.SLOT_BOOKED, icon: '📅', color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400' },
          { label: 'Exams Graded', count: counts.EXAM_COMPLETED, icon: '📝', color: 'border-purple-500/20 bg-purple-500/5 text-purple-400' },
          { label: 'Completed', count: counts.ADMISSION_COMPLETED, icon: '🎓', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' },
        ].map((metric) => (
          <div
            key={metric.label}
            className={`border rounded-xl p-5 text-center shadow-lg flex flex-col items-center justify-center space-y-2 ${metric.color}`}
          >
            <span className="text-xl">{metric.icon}</span>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {metric.label}
            </span>
            <span className="block text-3xl font-black">
              {metric.count}
            </span>
          </div>
        ))}
      </div>

      {/* Workspace Sections Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Manage Applications',
            desc: 'Review applicants, log entrance test results, and finalise enrollments.',
            link: '/admission/applications',
            actionText: 'Open Pipeline',
            icon: '📋',
          },
          {
            title: 'Admission Completed',
            desc: 'View finalized admissions, assigned classrooms, and student list roster.',
            link: '/admission/completed',
            actionText: 'View Roster',
            icon: '🎓',
          },
          {
            title: 'Configure Exam Slots',
            desc: 'Define time slots and seating limits for upcoming entrance testing dates.',
            link: '/admission/slots',
            actionText: 'Configure Slots',
            icon: '📅',
          },
        ].map((sec) => (
          <div
            key={sec.title}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl transition-all"
          >
            <div className="space-y-3">
              <div className="text-3xl">{sec.icon}</div>
              <h3 className="text-xl font-bold text-white">{sec.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{sec.desc}</p>
            </div>
            <Link
              href={sec.link}
              className="mt-6 inline-block text-center border border-slate-700 hover:border-slate-500 bg-transparent text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
            >
              {sec.actionText}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
