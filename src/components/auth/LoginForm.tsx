'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(_data: FormData) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Welcome Back
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Sign in to your Amoria account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full border px-3 py-3 text-sm outline-none"
            style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-amoria-border)' }}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full border px-3 py-3 text-sm outline-none pr-10"
              style={{ borderColor: errors.password ? '#ef4444' : 'var(--color-amoria-border)' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('rememberMe')} />
            <span className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>Remember me</span>
          </label>
          <Link href="/forgot-password" className="text-sm" style={{ color: 'var(--color-amoria-accent)' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm font-semibold tracking-wide disabled:opacity-70"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-amoria-border)' }} />
        <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>or</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-amoria-border)' }} />
      </div>

      <button
        className="w-full py-3 text-sm font-medium border flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
          Register
        </Link>
      </p>
    </div>
  );
}
