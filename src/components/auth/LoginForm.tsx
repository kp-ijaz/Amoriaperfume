'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const schema = z.object({
  email:      z.string().email('Valid email required'),
  password:   z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    const err = await signIn(data.email, data.password);
    if (err) { setServerError(err); return; }
    router.push(redirectTo);
  }

  const inputStyle = (hasErr: boolean) => ({
    borderColor: hasErr ? '#ef4444' : 'var(--color-amoria-border)',
  });

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Welcome Back
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Sign in to your Amoria account
      </p>

      {/* Demo hint */}
      <div className="mb-5 p-3 text-xs rounded-sm" style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', color: '#6B4A1E' }}>
        <strong>Demo:</strong> ahmed@demo.com / password123
      </div>

      {serverError && (
        <div className="mb-4 p-3 flex items-start gap-2 text-sm rounded-sm" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</label>
          <input {...register('email')} type="email" className="w-full border px-3 py-3 text-sm outline-none focus:border-[#1A0A2E] transition-colors" style={inputStyle(!!errors.email)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Password</label>
          <div className="relative">
            <input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full border px-3 py-3 text-sm outline-none pr-10 focus:border-[#1A0A2E] transition-colors" style={inputStyle(!!errors.password)} />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
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
          <Link href="/forgot-password" className="text-sm" style={{ color: 'var(--color-amoria-accent)' }}>Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-sm font-semibold tracking-wide disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-amoria-border)' }} />
        <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>or</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-amoria-border)' }} />
      </div>

      <Link
        href={`/checkout${redirectTo === '/checkout' ? '' : ''}`}
        className="w-full py-3 text-sm font-medium border flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
      >
        Continue as Guest →
      </Link>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>Register</Link>
      </p>
    </div>
  );
}
