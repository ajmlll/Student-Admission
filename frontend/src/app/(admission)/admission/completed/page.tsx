'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCompletedAdmissions } from '../../../../lib/api/admission';
import { Student } from '../../../../lib/api/students';

export default function CompletedAdmissionsPage() {
  const [admissions, setAdmissions] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCompletedAdmissions();
        setAdmissions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load completed admissions');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          href="/admission/dashboard"
          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors flex items-center gap-1.5"
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
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-4">
          Completed Admissions
        </h1>
        <p className="text-slate-400 mt-1">
          Archived list of students who have completed all admission, examination, and placement checks.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-16 text-slate-500 animate-pulse">
            Loading completed roster...
          </div>
        ) : admissions.length === 0 ? (
          <div className="text-center py-16 text-slate-450">
            No completed admissions are recorded in the system yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400 bg-slate-950/20">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Grade Applied</th>
                  <th className="py-4 px-6">Exam Score</th>
                  <th className="py-4 px-6">Assigned Course</th>
                  <th className="py-4 px-6">Enrollment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {admissions.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-800/10 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-white">
                      {student.studentName}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {student.applyingGrade}
                    </td>
                    <td className="py-4 px-6 text-slate-350">
                      <span className="font-semibold text-white">
                        {student.examScore}
                      </span>{' '}
                      / 100
                    </td>
                    <td className="py-4 px-6 text-indigo-400 font-semibold">
                      {student.assignedCourse}
                    </td>
                    <td className="py-4 px-6 text-slate-450">
                      {new Date(student.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
