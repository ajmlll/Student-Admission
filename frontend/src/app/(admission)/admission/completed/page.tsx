'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCompletedAdmissions } from '../../../../lib/api/admission';
import { Student } from '../../../../lib/api/students';

export default function CompletedAdmissions() {
  const [completed, setCompleted] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCompletedAdmissions();
        setCompleted(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load completed roster');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-amber-500 animate-pulse font-medium">
          Loading student roster...
        </div>
      </div>
    );
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
          Completed Admissions Roster
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Roster of students who have completed the admissions pipeline and been assigned classrooms.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

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
                  Target Grade
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Exam Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Assigned Placement
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider"
                >
                  Admitted At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/10">
              {completed.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No students have finalized registration yet.
                  </td>
                </tr>
              ) : (
                completed.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-850/30 transition-colors"
                  >
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">
                        {student.studentName}
                      </div>
                      <div className="text-xs text-slate-450 mt-0.5">
                        DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="text-sm text-slate-300">
                        {student.applyingGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap font-semibold">
                      <span className="text-sm text-amber-500 font-bold">
                        {student.examScore}
                      </span>
                      <span className="text-xs text-slate-500"> / 100</span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className="inline-block bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-xs font-bold px-2.5 py-1 rounded-full">
                        {student.assignedCourse}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-right text-xs text-slate-450">
                      {student.updatedAt
                        ? new Date(student.updatedAt).toLocaleString()
                        : 'N/A'}
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
