'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { apiRequestPasswordReset } from '@/lib/api/public';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequestPasswordReset(email);
      if (!res.success) throw new Error(res.message ?? 'Request failed');
      setSent(true);
      toast.success(res.data?.message || res.message || 'Check your email for reset instructions');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-amoria-bg)' }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-1 justify-center mb-8">
          <span className="text-2xl font-bold tracking-[0.15em]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>AMORIA</span>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-amoria-accent)' }} />
        </Link>

        <h1 className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
          Reset Password
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Enter your email and we&apos;ll send you reset instructions if an account exists
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-3 text-sm outline-none"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
            If an account exists for <strong>{email}</strong>, you will receive an email shortly.
          </p>
        )}

        <p className="text-center text-sm mt-6">
          <Link href="/login" className="hover:underline" style={{ color: 'var(--color-amoria-accent)' }}>
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
