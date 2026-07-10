'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchExamSlots, createExamSlot, ExamSlot } from '../../../../lib/api/examSlots';

export default function ExamSlotsPage() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('1');

  // Input error states
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const loadSlots = async () => {
    try {
      // Pass true to retrieve all slots (including booked ones)
      const data = await fetchExamSlots(true);
      // Sort slots by date and time
      const sorted = data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      setSlots(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to load exam slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDateError(null);
    setTimeError(null);

    let isValid = true;

    if (!date) {
      setDateError('Date is required');
      isValid = false;
    }

    if (!time.trim()) {
      setTimeError('Time is required');
      isValid = false;
    }

    if (!isValid) return;

    setSubmitting(true);
    try {
      await createExamSlot({
        date,
        time: time.trim(),
        capacity: parseInt(capacity, 10) || 1,
      });

      // Reset form
      setDate('');
      setTime('');
      setCapacity('1');

      // Reload slots list
      await loadSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to create exam slot');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl w-full mx-auto px-6 py-8 animate-fade-in space-y-8">
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
        <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
          Entrance Exam Slots
        </h1>
        <p className="text-slate-400 mt-1">
          Configure available times and capacities for entrance examination sessions.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm animate-shake">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create slot Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-lg font-bold text-white mb-6">Create Predefined Slot</h3>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`mt-1.5 block w-full px-3 py-2 bg-slate-800 border ${
                  dateError ? 'border-red-500' : 'border-slate-700'
                } rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              {dateError && (
                <p className="mt-1 text-xs text-red-400">{dateError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="time"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Time
              </label>
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`mt-1.5 block w-full px-3 py-2 bg-slate-800 border ${
                  timeError ? 'border-red-500' : 'border-slate-700'
                } rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                placeholder="e.g. 10:00 AM"
              />
              {timeError && (
                <p className="mt-1 text-xs text-red-400">{timeError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Seating Capacity
              </label>
              <input
                id="capacity"
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? 'Creating Slot...' : 'Create Predefined Slot'}
            </button>
          </form>
        </div>

        {/* Slots list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 border-b border-slate-800 bg-slate-950/10">
            <h3 className="text-lg font-bold text-white">Configured Sessions</h3>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-500 animate-pulse">
              Loading schedules...
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16 text-slate-455">
              No exam slots have been created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase text-slate-400 bg-slate-950/20">
                    <th className="py-4 px-6">Exam Date</th>
                    <th className="py-4 px-6">Time</th>
                    <th className="py-4 px-6 text-center">Capacity</th>
                    <th className="py-4 px-6">Availability</th>
                    <th className="py-4 px-6">Student ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {slots.map((slot) => (
                    <tr
                      key={slot.id}
                      className="hover:bg-slate-800/10 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-white">
                        {new Date(slot.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6 text-slate-200">{slot.time}</td>
                      <td className="py-4 px-6 text-center text-slate-300">
                        {slot.capacity}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                            slot.isBooked
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {slot.isBooked ? 'Booked' : 'Available'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs font-mono text-slate-500">
                        {slot.bookedByStudentId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
