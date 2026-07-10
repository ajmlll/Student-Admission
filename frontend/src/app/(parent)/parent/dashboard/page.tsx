'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchStudents, Student } from '../../../../lib/api/students';
import { fetchExamSlots, ExamSlot } from '../../../../lib/api/examSlots';

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

function getInitials(name: string) {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function ParentDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [studentData, slotsData] = await Promise.all([
          fetchStudents(),
          fetchExamSlots(true), // Fetch all slots (even booked ones) so we can map them
        ]);
        setStudents(studentData);
        setSlots(slotsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard records');
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
          Loading student dashboard...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
      {/* Dashboard Welcome Header */}
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
          className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-5 rounded-lg shadow-lg shadow-amber-500/10 transition-all text-sm uppercase tracking-wider"
        >
          + Create New Application
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm animate-fade-in">
          {error}
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-16 text-center shadow-lg max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🏫</div>
          <h3 className="text-lg font-bold text-white">No Active Applications</h3>
          <p className="mt-2 text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Begin the registration process for your child by creating a student profile.
          </p>
          <Link
            href="/parent/students/new"
            className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-amber-500/10 transition-colors text-sm"
          >
            Create First Application
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {students.map((student) => {
            const currentStepIdx = getStatusIndex(student.status);
            const initials = getInitials(student.studentName);

            // Find matching exam slot details
            const matchedSlot = slots.find((s) => s.id === student.examSlot?.slotId);

            return (
              <div
                key={student.id}
                className="bg-[#0f172a]/50 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 shadow-xl transition-all duration-300 flex flex-col gap-6"
              >
                {/* 1. Top Section: Student Summary & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/60">
                  <div className="flex items-center gap-4">
                    {/* Initials Circle */}
                    <div className="w-12 h-12 bg-gradient-to-tr from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 font-bold text-lg shadow-md">
                      {initials}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white capitalize leading-snug">
                        {student.studentName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-slate-400 font-medium">
                        <span>
                          Applying:{' '}
                          <span className="text-slate-200">{student.applyingGrade}</span>
                        </span>
                        <span className="text-slate-800">•</span>
                        <span>
                          DOB:{' '}
                          <span className="text-slate-200">
                            {new Date(student.dateOfBirth).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      href={`/parent/students/${student.id}`}
                      className="inline-block border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 text-slate-300 hover:text-white font-semibold py-2 px-5 rounded-lg transition-all text-xs uppercase tracking-wider"
                    >
                      Manage Application
                    </Link>
                  </div>
                </div>

                {/* 2. Middle Section: Stepper Progress */}
                <div className="px-2">
                  <div className="relative flex justify-between items-center w-full">
                    {/* Connecting Line */}
                    <div className="absolute left-4 right-4 top-[14px] h-[3px] bg-slate-800/60 -z-10 rounded">
                      <div
                        className="h-full bg-amber-500 rounded transition-all duration-500"
                        style={{
                          width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Step Nodes */}
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                              isCompleted
                                ? 'bg-amber-500 text-[#0B132B]'
                                : isCurrent
                                ? 'bg-amber-500 text-[#0B132B] ring-4 ring-amber-500/20 scale-110 shadow-lg shadow-amber-500/10'
                                : 'bg-slate-900 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {isCompleted ? (
                              <svg
                                className="w-4.5 h-4.5"
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
                            className={`text-[9px] sm:text-xs mt-2.5 font-bold tracking-tight whitespace-nowrap ${
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

                {/* 3. Bottom Section: Rich Status Message & Action Info */}
                <div className="mt-2 bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                      Status Detail
                    </span>
                    <div className="text-sm font-semibold text-slate-200">
                      {student.status === 'APPLICATION_CREATED' && (
                        <span className="text-amber-400 flex items-center gap-2">
                          <span>💳</span> Application created. Please pay the $100 registration fee to open scheduling.
                        </span>
                      )}
                      {student.status === 'REGISTRATION_FEE_PAID' && (
                        <span className="text-amber-400 flex items-center gap-2">
                          <span>📅</span> Fee received! Action required: Book your child's entrance examination slot.
                        </span>
                      )}
                      {student.status === 'SLOT_BOOKED' && (
                        <span className="text-slate-200 flex items-center gap-2">
                          <span>⏳</span> Entrance exam scheduled. Waiting for slot evaluation.
                        </span>
                      )}
                      {student.status === 'EXAM_COMPLETED' && (
                        <span className="text-indigo-400 flex items-center gap-2">
                          <span>📝</span> Exam completed! Score: <strong className="text-white">{student.examScore}/100</strong>. Waiting for course placement.
                        </span>
                      )}
                      {student.status === 'ADMISSION_COMPLETED' && (
                        <span className="text-emerald-400 flex items-center gap-2">
                          <span>🎉</span> Admitted! Placed in <strong className="text-white">{student.assignedCourse}</strong>. (Exam Score: {student.examScore}%).
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scheduled Slot/Score/Placement details badge */}
                  {(student.status === 'SLOT_BOOKED' ||
                    student.status === 'EXAM_COMPLETED' ||
                    student.status === 'ADMISSION_COMPLETED') && (
                    <div className="bg-slate-950/40 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-400 min-w-[200px] text-left">
                      {student.status === 'SLOT_BOOKED' && (
                        <>
                          <div className="font-bold text-slate-300">Exam Schedule:</div>
                          <div className="mt-1 text-slate-200">
                            {matchedSlot
                              ? `${new Date(matchedSlot.date).toLocaleDateString()} at ${matchedSlot.time}`
                              : 'Resolving slot schedule...'}
                          </div>
                        </>
                      )}
                      {student.status === 'EXAM_COMPLETED' && (
                        <>
                          <div className="font-bold text-slate-300">Evaluation:</div>
                          <div className="mt-1 text-slate-200">
                            Graded: <span className="font-bold text-indigo-400">{student.examScore}%</span>
                          </div>
                        </>
                      )}
                      {student.status === 'ADMISSION_COMPLETED' && (
                        <>
                          <div className="font-bold text-slate-350">Enrolled Course:</div>
                          <div className="mt-1 font-bold text-amber-500 uppercase tracking-wide">
                            {student.assignedCourse}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
