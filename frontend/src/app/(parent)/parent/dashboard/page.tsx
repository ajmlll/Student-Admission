'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchStudents, Student } from '../../../../lib/api/students';

const STATUS_STEPS = [
  { key: 'APPLICATION_CREATED', label: 'Applied' },
  { key: 'REGISTRATION_FEE_PAID', label: 'Fee Paid' },
  { key: 'SLOT_BOOKED', label: 'Slot Booked' },
  { key: 'EXAM_COMPLETED', label: 'Exam Finished' },
  { key: 'ADMISSION_COMPLETED', label: 'Admitted' },
];

function getStatusIndex(status: string) {
  const map: Record<string, number> = {
    APPLICATION_CREATED: 0,
    REGISTRATION_FEE_PAID: 1,
    SLOT_BOOKED: 2,
    EXAM_COMPLETED: 3,
    ADMISSION_COMPLETED: 4,
  };
  return map[status] ?? 0;
}

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load student applications');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-indigo-400 animate-pulse">
          Loading student records...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            My Children's Applications
          </h1>
          <p className="text-slate-400 mt-1">
            Create and track the progress of school admission applications.
          </p>
        </div>
        <Link
          href="/parent/students/new"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-5 rounded-lg shadow-md transition-colors"
        >
          + Create New Application
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center shadow-md">
          <svg
            className="mx-auto h-12 w-12 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-white">
            No active applications found
          </h3>
          <p className="mt-2 text-slate-400 text-sm max-w-md mx-auto">
            Get started by adding a student profile and setting up their school
            admission form.
          </p>
          <Link
            href="/parent/students/new"
            className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-5 rounded-lg shadow-sm transition-colors text-sm"
          >
            Add Student Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {students.map((student) => {
            const currentStepIdx = getStatusIndex(student.status);

            return (
              <div
                key={student.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  {/* Student Summary */}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {student.studentName}
                    </h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-400">
                      <span>Applying: <span className="text-slate-200">{student.applyingGrade}</span></span>
                      <span className="text-slate-700">•</span>
                      <span>DOB: <span className="text-slate-200">{new Date(student.dateOfBirth).toLocaleDateString()}</span></span>
                    </div>
                  </div>

                  {/* Stepper Progress Bar */}
                  <div className="flex-1 max-w-2xl">
                    <div className="relative flex justify-between items-center w-full">
                      {/* Connection Line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-10 rounded">
                        <div
                          className="h-full bg-indigo-500 rounded transition-all duration-500"
                          style={{
                            width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Steps */}
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-indigo-600 text-white'
                                  : isCurrent
                                  ? 'bg-indigo-400 text-slate-950 ring-4 ring-indigo-500/20'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {isCompleted ? (
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span
                              className={`text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap ${
                                isCurrent
                                  ? 'text-indigo-400 font-semibold'
                                  : isCompleted
                                  ? 'text-slate-350'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/parent/students/${student.id}`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-5 rounded-lg border border-slate-700 hover:text-white transition-colors text-sm shadow-sm"
                    >
                      Manage Application
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
