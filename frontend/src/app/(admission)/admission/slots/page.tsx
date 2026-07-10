'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  fetchExamSlots,
  createExamSlot,
  deleteExamSlot,
  updateExamSlot,
  ExamSlot,
} from '../../../../lib/api/examSlots';

// Helper: Convert 24-hour time ("HH:MM") to 12-hour AM/PM string ("HH:MM AM/PM")
function convert24To12(time24: string): string {
  if (!time24) return '';
  const [hourStr, minStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const min = minStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // hour '0' should be '12'
  const hourFormatted = String(hour).padStart(2, '0');
  return `${hourFormatted}:${min} ${ampm}`;
}

// Helper: Convert 12-hour AM/PM string ("HH:MM AM/PM") to 24-hour time ("HH:MM")
function convert12To24(time12: string): string {
  if (!time12) return '';
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';
  let [_, hourStr, minStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const min = minStr;
  ampm = ampm.toUpperCase();

  if (ampm === 'PM' && hour < 12) {
    hour += 12;
  }
  if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }

  const hourFormatted = String(hour).padStart(2, '0');
  return `${hourFormatted}:${min}`;
}

export default function ConfigureSlotsPage() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState(''); // Holds 24-hour time ("HH:MM")
  const [capacity, setCapacity] = useState('1');

  // Edit states
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadSlots() {
    try {
      const data = await fetchExamSlots(true);
      setSlots(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load exam slots.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDateError(null);
    setTimeError(null);
    setCapacityError(null);

    let isValid = true;

    if (!date) {
      setDateError('Exam date is required');
      isValid = false;
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today && !editingSlotId) {
        setDateError('Exam date cannot be in the past');
        isValid = false;
      }
    }

    if (!time) {
      setTimeError('Session start time is required');
      isValid = false;
    }

    const capNum = Number(capacity);
    if (
      !capacity.trim() ||
      isNaN(capNum) ||
      capNum <= 0 ||
      !Number.isInteger(capNum)
    ) {
      setCapacityError('Capacity must be a positive integer');
      isValid = false;
    }

    if (!isValid) return;

    setSubmitLoading(true);
    try {
      const formattedTime12 = convert24To12(time);
      if (editingSlotId) {
        await updateExamSlot(editingSlotId, {
          date,
          time: formattedTime12,
          capacity: capNum,
        });
        setSuccess('Exam slot successfully updated!');
      } else {
        await createExamSlot({
          date,
          time: formattedTime12,
          capacity: capNum,
        });
        setSuccess('Exam slot successfully created and opened for registration!');
      }
      setEditingSlotId(null);
      setDate('');
      setTime('');
      setCapacity('1');
      await loadSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to process slot action.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStartEdit = (slot: ExamSlot) => {
    setError(null);
    setSuccess(null);
    setEditingSlotId(slot.id);
    const d = new Date(slot.date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
    setTime(convert12To24(slot.time));
    setCapacity(String(slot.capacity));
  };

  const handleCancelEdit = () => {
    setEditingSlotId(null);
    setDate('');
    setTime('');
    setCapacity('1');
    setDateError(null);
    setTimeError(null);
    setCapacityError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam slot?')) return;
    setError(null);
    setSuccess(null);
    try {
      await deleteExamSlot(id);
      setSuccess('Exam slot successfully deleted.');
      if (editingSlotId === id) {
        handleCancelEdit();
      }
      await loadSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to delete slot.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-lg text-amber-500 animate-pulse font-medium">
          Loading slot configuration...
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
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
          Entrance Examination Slot Management
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Create predefined seats and manage active session capacities.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm animate-fade-in">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm animate-fade-in">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingSlotId ? 'Edit Testing Slot' : 'Create Testing Slot'}
          </h3>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Examination Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2 bg-slate-855 border ${
                  dateError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
              />
              {dateError && (
                <p className="mt-1.5 text-xs text-red-400">{dateError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Session Time
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2 bg-slate-855 border ${
                  timeError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
              />
              {timeError && (
                <p className="mt-1.5 text-xs text-red-400">{timeError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Session Seat Capacity
              </label>
              <input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2 bg-slate-855 border ${
                  capacityError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
              />
              {capacityError && (
                <p className="mt-1.5 text-xs text-red-400">{capacityError}</p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {submitLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin"></div>
                    <span>{editingSlotId ? 'Saving Changes...' : 'Adding Slot...'}</span>
                  </>
                ) : (
                  editingSlotId ? 'Save Changes' : 'Create Testing Slot'
                )}
              </button>
              {editingSlotId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full border border-slate-700 hover:border-slate-500 bg-transparent text-slate-300 hover:text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Slots List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Active Examination Sessions</h3>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                Total Sessions: {slots.length}
              </span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950/20">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Time Slot
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Status & Bookings
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {slots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No exam sessions registered yet.
                      </td>
                    </tr>
                  ) : (
                    slots.map((slot) => (
                      <tr
                        key={slot.id}
                        className="hover:bg-slate-855/30 transition-colors"
                      >
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-white">
                          {new Date(slot.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-200">
                          {slot.time}
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-400">
                          {slot.capacity} seat(s)
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div>
                              {slot.isBooked ? (
                                <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                  Reserved
                                </span>
                              ) : (
                                <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Available
                                </span>
                              )}
                            </div>
                            {slot.isBooked && (
                              <span className="text-[10px] text-slate-450 font-mono">
                                ID: {slot.bookedByStudentId}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm">
                          {slot.isBooked ? (
                            <span className="text-xs text-slate-550 italic flex items-center justify-end gap-1.5">
                              🔒 Locked
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleStartEdit(slot)}
                                className="text-amber-500 hover:text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(slot.id)}
                                className="text-red-400 hover:text-red-550 font-bold text-xs uppercase tracking-wider transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
