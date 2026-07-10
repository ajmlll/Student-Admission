'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createStudent, StudentInput } from '../../../../../lib/api/students';

export default function NewStudentPage() {
  const router = useRouter();
  const [studentName, setStudentName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [applyingGrade, setApplyingGrade] = useState<
    'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | ''
  >('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field validation states
  const [nameError, setNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNameError(null);
    setDobError(null);
    setGenderError(null);
    setGradeError(null);

    let isValid = true;

    if (!studentName.trim()) {
      setNameError('Student full name is required');
      isValid = false;
    }

    if (!dateOfBirth) {
      setDobError('Date of birth is required');
      isValid = false;
    } else {
      const dobDate = new Date(dateOfBirth);
      const today = new Date();
      if (dobDate > today) {
        setDobError('Date of birth cannot be in the future');
        isValid = false;
      }
    }

    if (!gender) {
      setGenderError('Please select a gender');
      isValid = false;
    }

    if (!applyingGrade) {
      setGradeError('Please select a grade level');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const input: StudentInput = {
        studentName,
        dateOfBirth,
        gender: gender as any,
        previousSchool: previousSchool.trim() || undefined,
        applyingGrade: applyingGrade as any,
      };

      const newStudent = await createStudent(input);
      router.push(`/parent/students/${newStudent.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl w-full mx-auto px-6 py-8 animate-fade-in space-y-6">
      <div>
        <Link
          href="/parent/dashboard"
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
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
          Create Student Application
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Provide your child's biographical and academic details to start.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section: Biographical Info */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="studentName"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Student's Full Name
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-850 border ${
                  nameError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
                placeholder="e.g. Alice Doe"
              />
              {nameError && (
                <p className="mt-1.5 text-xs text-red-400">{nameError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="dob"
                  className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-855 border ${
                    dobError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
                />
                {dobError && (
                  <p className="mt-1.5 text-xs text-red-400">{dobError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-855 border ${
                    genderError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
                >
                  <option value="" disabled className="text-slate-500">
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {genderError && (
                  <p className="mt-1.5 text-xs text-red-400">{genderError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section: Academic History */}
          <div className="pt-6 border-t border-slate-850 space-y-6">
            <div>
              <label
                htmlFor="previousSchool"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Previous School (Optional)
              </label>
              <input
                id="previousSchool"
                type="text"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                className="mt-1.5 block w-full px-3.5 py-2.5 bg-slate-855 border border-slate-800 focus:border-amber-500/50 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm"
                placeholder="e.g. Greenfield Primary School"
              />
            </div>

            <div>
              <label
                htmlFor="applyingGrade"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Applying Grade Level
              </label>
              <select
                id="applyingGrade"
                value={applyingGrade}
                onChange={(e) => setApplyingGrade(e.target.value as any)}
                className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-855 border ${
                  gradeError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
              >
                <option value="" disabled className="text-slate-500">
                  Select grade
                </option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
              </select>
              {gradeError && (
                <p className="mt-1.5 text-xs text-red-400">{gradeError}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-850">
            <Link
              href="/parent/dashboard"
              className="text-slate-400 hover:text-slate-200 text-sm font-semibold transition-colors"
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
                  <span>Creating application...</span>
                </>
              ) : (
                'Create Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
