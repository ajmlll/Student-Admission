'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdmissionApplications } from '../../../../lib/api/admission';
import { Student } from '../../../../lib/api/students';
import LoadingScreen from '../../../../components/LoadingScreen';

const STATUS_STEPS = [
  { key: 'ALL', label: 'All Files' },
  { key: 'APPLICATION_CREATED', label: 'Applied' },
  { key: 'REGISTRATION_FEE_PAID', label: 'Fee Paid' },
  { key: 'SLOT_BOOKED', label: 'Slot Booked' },
  { key: 'EXAM_COMPLETED', label: 'Exam finished' },
  { key: 'ADMISSION_COMPLETED', label: 'Admitted' },
];

export default function ApplicationsPipeline() {
  const [applications, setApplications] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAdmissionApplications();
        setApplications(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load pipeline applications');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredApps =
    activeTab === 'ALL'
      ? applications
      : applications.filter((app) => app.status === activeTab);

  if (loading) {
    return <LoadingScreen message="Loading pipeline applications..." fullScreen={false} />;
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          href="/admission/dashboard"
          className="text-amber-500 hover:text-amber-400 text-sm font-semibold transition-colors flex items-center gap-1.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Workspace
        </Link>
        <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
          Applicant Pipeline Tracker
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Track and advance applicants across registration checkpoints.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Tabs / Filter Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-px">
        {STATUS_STEPS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count =
            tab.key === 'ALL'
              ? applications.length
              : applications.filter((a) => a.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                isActive
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-450 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-500'
                    : 'bg-slate-850 text-slate-450'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container (Responsive Scroll) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950/40">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Biographical Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Action Required
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/10">
              {filteredApps.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No applicant files matching this status index.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-850/30 transition-colors"
                  >
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">
                        {app.studentName}
                      </div>
                      <div className="text-xs text-slate-450 mt-0.5">
                        DOB: {new Date(app.dateOfBirth).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-200">
                        {app.applyingGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="text-sm text-slate-400 capitalize">
                        {app.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full border capitalize ${
                          app.status === 'APPLICATION_CREATED'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : app.status === 'REGISTRATION_FEE_PAID'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : app.status === 'SLOT_BOOKED'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : app.status === 'EXAM_COMPLETED'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm">
                      {app.status === 'SLOT_BOOKED' ? (
                        <Link
                          href={`/admission/applications/${app.id}/score`}
                          className="inline-block bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-1.5 px-4 rounded-lg shadow-sm transition-all text-xs"
                        >
                          Enter Test Score
                        </Link>
                      ) : app.status === 'EXAM_COMPLETED' ? (
                        <Link
                          href={`/admission/applications/${app.id}/course`}
                          className="inline-block bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-1.5 px-4 rounded-lg shadow-sm transition-all text-xs"
                        >
                          Assign Course
                        </Link>
                      ) : app.status === 'ADMISSION_COMPLETED' ? (
                        <span className="text-emerald-400 font-bold flex items-center justify-end gap-1 text-xs">
                          <span>✓</span> Enrolled in {app.assignedCourse}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          Awaiting parent action
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
