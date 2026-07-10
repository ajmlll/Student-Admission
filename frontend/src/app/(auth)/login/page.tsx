'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    let isValid = true;

    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#0B132B] via-slate-950 to-[#1C2541] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div className="text-center flex flex-col items-center">
          <svg
            className="w-12 h-12 text-amber-500 mb-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c0.5-1.5 2-2.5 4.5-2.5H19v7h-2.5c-2.5 0-4 1-4.5 2.5m0-7c-.5-1.5-2-2.5-4.5-2.5H5v7h2.5c2.5 0 4 1 4.5 2.5m0-7v7"
            />
          </svg>
          <h1 className="mt-2 text-2xl font-black tracking-wider text-white uppercase">
            ABC <span className="text-amber-500 font-medium">International</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to your school admission account
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-850 border ${
                  emailError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1.5 block w-full px-3.5 py-2.5 bg-slate-850 border ${
                  passwordError ? 'border-red-500' : 'border-slate-800 focus:border-amber-500/50'
                } rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all sm:text-sm`}
                placeholder="••••••••"
              />
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-400">{passwordError}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-bold text-[#0B132B] hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-450">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-amber-550 hover:text-amber-450 transition-colors underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
