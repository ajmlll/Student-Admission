'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  fetchStudentById,
  updateStudent,
  payRegistrationFee,
  Student,
} from '../../../../../lib/api/students';
import { fetchExamSlots, bookExamSlot, ExamSlot } from '../../../../../lib/api/examSlots';

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

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit form states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female' | 'other'>('male');
  const [editPreviousSchool, setEditPreviousSchool] = useState('');
  const [editGrade, setEditGrade] = useState<'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4'>('Grade 1');
  const [editLoading, setEditLoading] = useState(false);

  // Payment states
  const [paying, setPaying] = useState(false);

  // Exam Slot States
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Load student details
  const loadData = async () => {
    try {
      const data = await fetchStudentById(id);
      setStudent(data);

      // Populate edit states
      setEditName(data.studentName);
      setEditDob(data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '');
      setEditGender(data.gender);
      setEditPreviousSchool(data.previousSchool || '');
      setEditGrade(data.applyingGrade);

      // Fetch slots if status is fee paid
      if (data.status === 'REGISTRATION_FEE_PAID') {
        setSlotsLoading(true);
        const slotsData = await fetchExamSlots();
        setSlots(slotsData);
        setSlotsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  // Handle student update submit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    setEditLoading(true);
    try {
      const updated = await updateStudent(id, {
        studentName: editName,
        dateOfBirth: editDob,
        gender: editGender,
        previousSchool: editPreviousSchool.trim() || undefined,
        applyingGrade: editGrade,
      });
      setStudent(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update student information');
    } finally {
      setEditLoading(false);
    }
  };

  // Mock fee payment trigger
  const handlePayFee = () => {
    setPaying(true);
    // Simulate payment processing for 1.5 seconds
    setTimeout(async () => {
      try {
        const updated = await payRegistrationFee(id);
        setStudent(updated);
        // Automatically trigger slots reload
        const slotsData = await fetchExamSlots();
        setSlots(slotsData);
      } catch (err: any) {
        setError(err.message || 'Fee payment transaction failed.');
      } finally {
        setPaying(false);
      }
    }, 1500);
  };

  // Handle slot reservation submit
  const handleBookSlot = async () => {
    if (!selectedSlotId) return;

    setBookingLoading(true);
    try {
      await bookExamSlot(selectedSlotId, id);
      // Reload student details after successful booking
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to book exam slot');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-indigo-400 animate-pulse">
          Loading application workspace...
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-white">Application Not Found</h2>
        <p className="text-slate-400 mt-2">
          The requested student application could not be located.
        </p>
        <Link
          href="/parent/dashboard"
          className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-5 rounded-lg shadow transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentStepIdx = getStatusIndex(student.status);

  return (
    <main className="max-w-5xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
      {/* Header breadcrumb */}
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Application Workspace: {student.studentName}
          </h1>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
              student.status === 'ADMISSION_COMPLETED'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
            }`}
          >
            {student.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 1. Large Status Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">
          Application Progress Tracker
        </h3>
        <div className="relative flex justify-between items-center w-full">
          {/* Connecting lines */}
          <div className="absolute left-4 right-4 top-[18px] h-[3px] bg-slate-800 -z-10 rounded">
            <div
              className="h-full bg-amber-500 rounded transition-all duration-500"
              style={{
                width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-amber-500 text-[#0B132B]'
                      : isCurrent
                      ? 'bg-amber-500 text-[#0B132B] ring-4 ring-amber-500/20 scale-110'
                      : 'bg-slate-855 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
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
                  className={`text-[10px] sm:text-sm mt-3 font-semibold text-center ${
                    isCurrent
                      ? 'text-amber-500 font-bold'
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

      {/* 2. Core Workflow Info Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Student Details */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Student Info</h3>
            {!isEditing && student.status === 'APPLICATION_CREATED' && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 block w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">DOB</label>
                <input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="mt-1 block w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">Gender</label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value as any)}
                  className="mt-1 block w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">Previous School</label>
                <input
                  type="text"
                  value={editPreviousSchool}
                  onChange={(e) => setEditPreviousSchool(e.target.value)}
                  className="mt-1 block w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400">Grade</label>
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value as any)}
                  className="mt-1 block w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white"
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                 <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-1 px-3 rounded text-xs disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-xs text-slate-400">Student Name</span>
                <span className="font-semibold text-slate-100">{student.studentName}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Date of Birth</span>
                <span className="font-semibold text-slate-100">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Gender</span>
                <span className="font-semibold text-slate-100 capitalize">{student.gender}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Previous School</span>
                <span className="font-semibold text-slate-100">{student.previousSchool || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Grade Level Course</span>
                <span className="font-semibold text-slate-100">{student.applyingGrade}</span>
              </div>
              {student.status !== 'APPLICATION_CREATED' && (
                <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 text-xs text-indigo-400 text-center">
                  🔐 Profile locked after registration fee payment
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right columns: Dynamic Workflow Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stage A: Payment Option */}
          {student.status === 'APPLICATION_CREATED' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-lg">
                💳
              </div>
              <h2 className="text-xl font-bold text-white">Registration Fee Payment Required</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Before booking your child's entrance examination slot, you must complete the student registration payment. 
                This fee is $100 and covers administrative grading costs.
              </p>
              <div className="pt-2">
                <button
                  onClick={handlePayFee}
                  className="bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-6 rounded-lg shadow-lg shadow-amber-500/10 transition-all text-sm"
                >
                  Pay Registration Fee ($100)
                </button>
              </div>
            </div>
          )}

          {/* Stage B: Slot Selection */}
          {student.status === 'REGISTRATION_FEE_PAID' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md space-y-6">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-lg">
                📅
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Book Entrance Examination Slot</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Registration fee successfully verified. Please select an available entrance exam session below.
                </p>
              </div>

              {slotsLoading ? (
                <div className="text-center py-6 text-sm text-slate-500 animate-pulse">
                  Querying available dates...
                </div>
              ) : slots.length === 0 ? (
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-center text-slate-400 text-sm">
                  There are no examination slots available at the moment. Please contact the admission team to configure new slots.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;

                    return (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-4 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500'
                            : 'bg-slate-855 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-sm font-bold text-white">
                          {new Date(slot.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-medium text-slate-400">
                            Time: <span className="text-slate-200">{slot.time}</span>
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              isSelected
                                ? 'bg-amber-500/25 text-amber-450 border border-amber-500/10'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            Selected
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {slots.length > 0 && (
                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    onClick={handleBookSlot}
                    disabled={!selectedSlotId || bookingLoading}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[#0B132B] font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg shadow-amber-500/10 text-sm"
                  >
                    {bookingLoading ? 'Confirming Reservation...' : 'Book Selected Slot'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Stage C: Slot Reserved */}
          {student.status === 'SLOT_BOOKED' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-lg animate-bounce">
                🎉
              </div>
              <h2 className="text-xl font-bold text-white">Entrance Examination Slot Booked</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your child is successfully scheduled to take the entrance examination. Please review the booking slot details:
              </p>

              {/* Slot metadata */}
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800/80 text-sm space-y-2">
                <div>
                  <span className="text-slate-400">Session ID:</span>{' '}
                  <span className="font-semibold text-slate-100">{student.examSlot?.slotId}</span>
                </div>
                <div>
                  <span className="text-slate-400">Booking Time:</span>{' '}
                  <span className="font-semibold text-slate-100">
                    {student.examSlot?.bookedAt ? new Date(student.examSlot.bookedAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="bg-indigo-500/10 p-4 border border-indigo-500/20 rounded-xl flex gap-3 text-sm text-indigo-400">
                <span>📢</span>
                <p>
                  <strong>Note:</strong> Please arrive 15 minutes before the exam starts. We are waiting for the school's admission team to grade the examination and publish the scores.
                </p>
              </div>
            </div>
          )}

          {/* Stage D: Evaluation Finished */}
          {student.status === 'EXAM_COMPLETED' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-md space-y-6">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-lg">
                📝
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Entrance Examination Evaluated</h2>
                <p className="text-slate-400 text-sm mt-1">
                  The entrance exam script has been evaluated by the admission team.
                </p>
              </div>

              {/* Score Display */}
              <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Evaluation Score</span>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {student.examScore} <span className="text-lg font-medium text-slate-500">/ 100</span>
                  </div>
                </div>
                <div
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                    (student.examScore ?? 0) >= 50
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {(student.examScore ?? 0) >= 50 ? 'PASSED' : 'REVALUATION'}
                </div>
              </div>

              <p className="text-slate-400 text-sm">
                We are currently assigning course levels and grade classroom divisions. You will receive final confirmations shortly.
              </p>
            </div>
          )}

          {/* Stage E: Admitted */}
          {student.status === 'ADMISSION_COMPLETED' && (
            <div className="bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden">
              {/* Confetti decoration */}
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none">
                <svg className="w-48 h-48 text-emerald-400" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M10 10l10 50l30-20z" />
                </svg>
              </div>

              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 text-xl animate-bounce">
                🎓
              </div>

              <div>
                <h2 className="text-2xl font-black text-emerald-400 tracking-tight">
                  Admission Form Completed!
                </h2>
                <p className="text-slate-350 text-sm mt-1">
                  Congratulations! All registration steps and admission tests are successfully verified. Your child is officially enrolled.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Test Score</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {student.examScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Assigned Course Grade</span>
                  <div className="text-xl font-bold text-indigo-400 mt-1">
                    {student.assignedCourse}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 p-4 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 leading-relaxed">
                🎉 <strong>Official Notice:</strong> Registration documentation is completed. Welcome to our school! Further details regarding term commencement, books, and uniforms will be sent to your email.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mock Payment Overlay */}
      {paying && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-bold text-white">Processing Payment</h3>
            <p className="text-slate-400 text-sm">
              Establishing secure mock transaction gateway... Please do not close this window.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
