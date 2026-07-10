'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdmissionApplications } from '../../../../lib/api/admission';
import { Student } from '../../../../lib/api/students';

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
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-indigo-400 animate-pulse">
          Loading metrics...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Admission Team Workspace
        </h1>
        <p className="text-slate-400 mt-1">
          Monitor workflow checkpoints, review exams, and assign courses.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Files', count: counts.TOTAL, color: 'border-slate-800 bg-slate-900/40 text-slate-300' },
          { label: 'New Applied', count: counts.APPLICATION_CREATED, color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
          { label: 'Fee Verified', count: counts.REGISTRATION_FEE_PAID, color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
          { label: 'Slots Reserved', count: counts.SLOT_BOOKED, color: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400' },
          { label: 'Exams Graded', count: counts.EXAM_COMPLETED, color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
          { label: 'Completed', count: counts.ADMISSION_COMPLETED, color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' },
        ].map((metric) => (
          <div
            key={metric.label}
            className={`border rounded-xl p-5 text-center shadow ${metric.color}`}
          >
            <span className="block text-xs uppercase font-semibold text-slate-400 tracking-wider">
              {metric.label}
            </span>
            <span className="block text-3xl font-black mt-2">
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
            desc: 'View finalized admissions, assigned classrooms, and historical performance.',
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
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col justify-between shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="text-3xl">{sec.icon}</div>
              <h3 className="text-xl font-bold text-white">{sec.title}</h3>
              <p className="text-slate-450 text-sm leading-relaxed">{sec.desc}</p>
            </div>
            <Link
              href={sec.link}
              className="mt-6 inline-block text-center bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition-all"
            >
              {sec.actionText}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
