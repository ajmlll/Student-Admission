'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAdmissionApplications, submitExamScore } from '../../../../../../lib/api/admission';
import { Student } from '../../../../../../lib/api/students';

export default function EnterScorePage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [score, setScore] = useState('');
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const apps = await fetchAdmissionApplications();
        const matched = apps.find((a) => a.id === studentId);
        if (matched) {
          setStudent(matched);
        } else {
          setError('Student application not found in pipeline.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load student details.');
      } finally {
        setFetchLoading(false);
      }
    }
    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setScoreError(null);

    const parsedScore = Number(score);

    if (!score.trim()) {
      setScoreError('Exam score is required');
      return;
    }

    if (isNaN(parsedScore)) {
      setScoreError('Score must be a valid integer number');
      return;
    }

    if (!Number.isInteger(parsedScore)) {
      setScoreError('Score must be a whole number (integer)');
      return;
    }

    if (parsedScore < 0 || parsedScore > 100) {
      setScoreError('Entrance score must be between 0 and 100');
      return;
    }

    setLoading(true);
    try {
      await submitExamScore(studentId, parsedScore);
      router.push('/admission/applications');
    } catch (err: any) {
      setError(err.message || 'Failed to update exam score.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-amber-500 animate-pulse font-medium">
          Loading student record...
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-white">Record Not Found</h2>
        <p className="text-slate-400 mt-2">{error || 'Unable to locate student details.'}</p>
        <Link
          href="/admission/applications"
          className="mt-6 inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-5 rounded-lg shadow transition-colors"
        >
          Return to Pipeline
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-3xl w-full mx-auto px-6 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          href="/admission/applications"
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
          Back to Pipeline
        </Link>
        <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
          Enter Entrance Exam Score
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Grade the admission test result for <strong className="text-white">{student.studentName}</strong> (Applying: {student.applyingGrade}).
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label
              htmlFor="score"
              className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Entrance Exam Score (0–100)
            </label>
            <input
              id="score"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-850 border ${
                scoreError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
              } rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
              placeholder="e.g. 85"
            />
            {scoreError && (
              <p className="mt-1.5 text-xs text-red-400">{scoreError}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
            <Link
              href="/admission/applications"
              className="text-slate-450 hover:text-slate-200 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Score...</span>
                </>
              ) : (
                'Submit Score'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
