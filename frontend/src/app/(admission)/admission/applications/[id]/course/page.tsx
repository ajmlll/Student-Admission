'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchStudentById, Student } from '../../../../../../lib/api/students';
import { assignCourse } from '../../../../../../lib/api/admission';

export default function AssignCoursePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [course, setCourse] = useState<
    'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | ''
  >('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseError, setCourseError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudent() {
      try {
        const data = await fetchStudentById(id);
        setStudent(data);

        // Pre-populate with applying grade choice
        if (
          data.applyingGrade === 'Grade 1' ||
          data.applyingGrade === 'Grade 2' ||
          data.applyingGrade === 'Grade 3' ||
          data.applyingGrade === 'Grade 4'
        ) {
          setCourse(data.applyingGrade);
        }

        if (data.status !== 'EXAM_COMPLETED') {
          setError(
            `This applicant is not eligible for course assignment yet. Current status: ${data.status.replace(
              /_/g,
              ' ',
            )}`,
          );
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load applicant profile');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadStudent();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCourseError(null);

    if (!course) {
      setCourseError('Assigned course is required');
      return;
    }

    setSubmitting(true);
    try {
      await assignCourse(id, course);
      router.push('/admission/applications');
    } catch (err: any) {
      setError(err.message || 'Failed to assign course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-indigo-400 animate-pulse">
          Loading applicant details...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-xl w-full mx-auto px-6 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          href="/admission/applications"
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
          Back to Pipeline
        </Link>
        <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
          Assign Grade Course
        </h1>
        {student && (
          <p className="text-slate-400 mt-1">
            Placing student{' '}
            <strong className="text-slate-200">{student.studentName}</strong>. 
            They applied for <strong className="text-slate-200">{student.applyingGrade}</strong> (Exam Score: {student.examScore}/100).
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {student && student.status === 'EXAM_COMPLETED' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="course"
                className="block text-sm font-medium text-slate-300"
              >
                Assigned Grade Level Course
              </label>
              <select
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value as any)}
                className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-800 border ${
                  courseError ? 'border-red-500' : 'border-slate-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              >
                <option value="" disabled className="text-slate-500">
                  Select course placement
                </option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
              </select>
              {courseError && (
                <p className="mt-1.5 text-xs text-red-400">{courseError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-850">
              <Link
                href="/admission/applications"
                className="text-slate-450 hover:text-slate-250 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-5 rounded-lg shadow-md transition-colors disabled:opacity-50"
              >
                {submitting ? 'Assigning placement...' : 'Assign Placement'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
