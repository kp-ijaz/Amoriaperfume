'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiResetPassword } from '@/lib/api/public';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error('Reset link is invalid or missing.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiResetPassword(token, password);
      if (!res.success) throw new Error(res.message ?? 'Reset failed');
      setDone(true);
      toast.success(res.data?.message || res.message || 'Password updated');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed');
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
          Choose a New Password
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Enter your new password below
        </p>

        {!token ? (
          <p className="text-sm text-red-600">
            This reset link is invalid. Please request a new one from the{' '}
            <Link href="/forgot-password" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
              forgot password
            </Link>{' '}
            page.
          </p>
        ) : done ? (
          <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Your password has been updated. Redirecting to sign in…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>
                New password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-3 text-sm outline-none"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>
                Confirm password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: 'var(--color-amoria-bg)' }} />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
