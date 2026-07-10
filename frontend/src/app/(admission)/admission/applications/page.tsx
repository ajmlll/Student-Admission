'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAdmissionApplications } from '../../../../lib/api/admission';
import { Student } from '../../../../lib/api/students';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Applications' },
  { key: 'APPLICATION_CREATED', label: 'Applied' },
  { key: 'REGISTRATION_FEE_PAID', label: 'Fee Paid' },
  { key: 'SLOT_BOOKED', label: 'Slot Booked' },
  { key: 'EXAM_COMPLETED', label: 'Exam Finished' },
  { key: 'ADMISSION_COMPLETED', label: 'Admitted' },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const filterStatus = activeFilter === 'ALL' ? undefined : activeFilter;
        const data = await fetchAdmissionApplications(filterStatus);
        setApplications(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeFilter]);

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Admission Pipeline
          </h1>
          <p className="text-slate-400 mt-1">
            Review applicant workflow states, update test scores, and process placements.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-px">
        {STATUS_FILTERS.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`py-2.5 px-4 text-sm font-medium border-b-2 -mb-px transition-all ${
                isActive
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pipeline Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-16 text-slate-500 animate-pulse">
            Querying pipeline records...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-slate-455">
            No applicants found matching this status filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400 bg-slate-950/20">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6">Parent ID</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {applications.map((student) => {
                  return (
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
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                        {student.parentId}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                            student.status === 'APPLICATION_CREATED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : student.status === 'REGISTRATION_FEE_PAID'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : student.status === 'SLOT_BOOKED'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : student.status === 'EXAM_COMPLETED'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {student.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-3">
                          {student.status === 'SLOT_BOOKED' && (
                            <Link
                              href={`/admission/applications/${student.id}/score`}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-1 px-3.5 rounded text-xs transition-colors shadow-sm"
                            >
                              Enter Score
                            </Link>
                          )}
                          {student.status === 'EXAM_COMPLETED' && (
                            <Link
                              href={`/admission/applications/${student.id}/course`}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-1 px-3.5 rounded text-xs transition-colors shadow-sm"
                            >
                              Assign Course
                            </Link>
                          )}
                          {student.status !== 'SLOT_BOOKED' &&
                            student.status !== 'EXAM_COMPLETED' && (
                              <span className="text-xs text-slate-500 italic">
                                Action Locked
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
