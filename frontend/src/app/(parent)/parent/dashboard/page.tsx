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
        <div className="text-lg text-amber-500 animate-pulse font-medium">
          Loading student records...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            My Children's Applications
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage your family's school admission registrations and track progress.
          </p>
        </div>
        <Link
          href="/parent/students/new"
          className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-5 rounded-lg shadow-lg shadow-amber-500/10 transition-all text-sm"
        >
          + Create New Application
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-16 text-center shadow-lg max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🍁</div>
          <h3 className="text-lg font-bold text-white">
            No Active Applications
          </h3>
          <p className="mt-2 text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Begin the registration process for your child by creating a student profile.
          </p>
          <Link
            href="/parent/students/new"
            className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2 px-5 rounded-lg shadow-lg shadow-amber-500/10 transition-colors text-sm"
          >
            Create First Application
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {students.map((student) => {
            const currentStepIdx = getStatusIndex(student.status);

            return (
              <div
                key={student.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                  {/* Student Summary */}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {student.studentName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                      <span>
                        Target Grade:{' '}
                        <span className="text-slate-200 font-medium">
                          {student.applyingGrade}
                        </span>
                      </span>
                      <span className="text-slate-750 font-normal">•</span>
                      <span>
                        DOB:{' '}
                        <span className="text-slate-200 font-medium">
                          {new Date(student.dateOfBirth).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Stepper Progress Bar */}
                  <div className="flex-1 max-w-2xl px-4">
                    <div className="relative flex justify-between items-center w-full">
                      {/* Connection Line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-slate-800 -z-10 rounded">
                        <div
                          className="h-full bg-amber-500 rounded transition-all duration-500"
                          style={{
                            width: `${
                              (currentStepIdx / (STATUS_STEPS.length - 1)) * 100
                            }%`,
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
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-amber-500 text-[#0B132B]'
                                  : isCurrent
                                  ? 'bg-amber-500 text-[#0B132B] ring-4 ring-amber-500/20 scale-110'
                                  : 'bg-slate-850 text-slate-500 border border-slate-800'
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
                                    strokeWidth={3.5}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span
                              className={`text-[9px] sm:text-xs mt-1.5 font-bold tracking-tight whitespace-nowrap ${
                                isCurrent
                                  ? 'text-amber-500 font-black'
                                  : isCompleted
                                  ? 'text-slate-300'
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
                      className="border border-slate-700 hover:border-slate-500 bg-transparent text-slate-300 hover:text-white font-semibold py-2 px-5 rounded-lg transition-all text-sm shadow-sm"
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
