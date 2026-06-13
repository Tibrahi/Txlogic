'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] px-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-morph" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-morph" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4 animate-pulse-glow">
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              TXLogic
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Cargo Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-3xl bg-[#111827]/70 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-600/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-600/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold text-sm hover:from-cyan-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 TXLogic. All rights reserved.
        </p>
      </div>
    </div>
  );
}