'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Valid phone required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((v) => v, 'You must agree to the terms'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(_data: FormData) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  }

  const inputClass = (hasError: boolean) =>
    `w-full border px-3 py-3 text-sm outline-none focus:border-[var(--color-amoria-primary)]`;

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Create Account
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Join Amoria for exclusive offers and faster checkout
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>First Name</label>
            <input {...register('firstName')} className={inputClass(!!errors.firstName)} style={{ borderColor: errors.firstName ? '#ef4444' : 'var(--color-amoria-border)' }} />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Last Name</label>
            <input {...register('lastName')} className={inputClass(!!errors.lastName)} style={{ borderColor: errors.lastName ? '#ef4444' : 'var(--color-amoria-border)' }} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</label>
          <input {...register('email')} type="email" className={inputClass(!!errors.email)} style={{ borderColor: errors.email ? '#ef4444' : 'var(--color-amoria-border)' }} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Phone</label>
          <input {...register('phone')} type="tel" placeholder="+971 XX XXX XXXX" className={inputClass(!!errors.phone)} style={{ borderColor: errors.phone ? '#ef4444' : 'var(--color-amoria-border)' }} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Password</label>
          <div className="relative">
            <input {...register('password')} type={showPw ? 'text' : 'password'} className={`${inputClass(!!errors.password)} pr-10`} style={{ borderColor: errors.password ? '#ef4444' : 'var(--color-amoria-border)' }} />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Confirm Password</label>
          <input {...register('confirmPassword')} type="password" className={inputClass(!!errors.confirmPassword)} style={{ borderColor: errors.confirmPassword ? '#ef4444' : 'var(--color-amoria-border)' }} />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" {...register('agreeTerms')} className="mt-0.5" />
          <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: 'var(--color-amoria-text-muted)' }}>
            I agree to the{' '}
            <Link href="/terms" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>Privacy Policy</Link>
          </label>
        </div>
        {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 text-sm font-semibold tracking-wide disabled:opacity-70"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
          Login
        </Link>
      </p>
    </div>
  );
}
