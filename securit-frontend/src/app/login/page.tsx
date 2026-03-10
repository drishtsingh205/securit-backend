'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Demo login — bypass API for demonstration
    setTimeout(() => {
      if (email && password.length >= 8) {
        localStorage.setItem('privacylens_token', 'demo-jwt-token');
        localStorage.setItem(
          'privacylens_user',
          JSON.stringify({
            id: '1',
            email,
            name: 'Security Analyst',
            role: 'admin',
          })
        );
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Password must be at least 8 characters.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl mb-4 animate-glow">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-accent">
            PRIVACYLENS
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Real-Time Behavioral Privacy Intelligence
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-8 h-px bg-navy-700" />
            <span className="text-xs text-text-muted tracking-widest uppercase">
              Secure Access
            </span>
            <div className="w-8 h-px bg-navy-700" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-navy-800 border border-navy-700/50 rounded-2xl p-8 shadow-glow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 text-sm text-critical bg-critical/10 border border-critical/20 rounded-lg px-4 py-3 animate-slide-up">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-text-secondary"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@privacylens.io"
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-text-secondary"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-10 pr-12 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-navy-900 border-navy-700 rounded text-accent focus:ring-accent/30"
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-accent hover:text-accent-hover transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent-hover text-navy-900 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-navy-700/50 text-center">
            <p className="text-xs text-text-muted">
              Protected by end-to-end encryption
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Shield className="w-3 h-3 text-success" />
              <span className="text-xs text-success">TLS 1.3 Secured</span>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-text-muted mt-6">
          PRIVACYLENS v1.0.0 · Government Use Only · Classification: UNCLASSIFIED
        </p>
      </div>
    </div>
  );
}
