'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchExamSlots, createExamSlot, ExamSlot } from '../../../../lib/api/examSlots';

export default function ConfigureSlotsPage() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('1');

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
      if (selectedDate < today) {
        setDateError('Exam date cannot be in the past');
        isValid = false;
      }
    }

    if (!time.trim()) {
      setTimeError('Session start time is required');
      isValid = false;
    }

    const capNum = Number(capacity);
    if (!capacity.trim() || isNaN(capNum) || capNum <= 0 || !Number.isInteger(capNum)) {
      setCapacityError('Capacity must be a positive integer');
      isValid = false;
    }

    if (!isValid) return;

    setSubmitLoading(true);
    try {
      await createExamSlot({
        date,
        time: time.trim(),
        capacity: capNum,
      });
      setSuccess('Exam slot successfully created and opened for registration!');
      setDate('');
      setTime('');
      setCapacity('1');
      await loadSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to create slot.');
    } finally {
      setSubmitLoading(false);
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
          <h3 className="text-lg font-bold text-white mb-4">Create Testing Slot</h3>
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
                Session Time (e.g. "10:00 AM")
              </label>
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2 bg-slate-855 border ${
                  timeError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
                placeholder="10:00 AM"
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-[#0B132B] font-bold py-2.5 px-4 rounded-lg shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {submitLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding Slot...</span>
                  </>
                ) : (
                  'Create Testing Slot'
                )}
              </button>
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
                      Examination Date
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
                      Seat Capacity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      Booked By
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
                        className="hover:bg-slate-850/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                          {new Date(slot.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                          {slot.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {slot.capacity} seat(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {slot.isBooked ? (
                            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                              Reserved
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-400">
                          {slot.isBooked ? (
                            <span className="font-mono text-slate-300">
                              Student ID: {slot.bookedByStudentId || 'N/A'}
                            </span>
                          ) : (
                            <span className="italic text-slate-500">—</span>
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
