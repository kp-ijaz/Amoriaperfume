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
  firstName:       z.string().min(2, 'First name required'),
  lastName:        z.string().min(2, 'Last name required'),
  email:           z.string().email('Valid email required'),
  phone:           z.string().min(9, 'Valid phone required'),
  password:        z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
  agreeTerms:      z.boolean().refine((v) => v, 'You must agree to the terms'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [showPw,      setShowPw]      = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register: authRegister }    = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') ?? '/';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    const err = await authRegister({
      firstName: data.firstName,
      lastName:  data.lastName,
      email:     data.email,
      phone:     data.phone,
      password:  data.password,
    });
    if (err) { setServerError(err); return; }
    router.push(redirectTo);
  }

  const field = (hasErr: boolean) => ({
    className: 'w-full border px-3 py-3 text-sm outline-none focus:border-[#1A0A2E] transition-colors',
    style:     { borderColor: hasErr ? '#ef4444' : 'var(--color-amoria-border)' },
  });

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Create Account
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Join Amoria for exclusive offers and faster checkout
      </p>

      {serverError && (
        <div className="mb-4 p-3 flex items-start gap-2 text-sm rounded-sm" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
          <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>First Name</label>
            <input {...register('firstName')} {...field(!!errors.firstName)} />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Last Name</label>
            <input {...register('lastName')} {...field(!!errors.lastName)} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</label>
          <input {...register('email')} type="email" {...field(!!errors.email)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Phone</label>
          <input {...register('phone')} type="tel" placeholder="+971 XX XXX XXXX" {...field(!!errors.phone)} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Password</label>
          <div className="relative">
            <input {...register('password')} type={showPw ? 'text' : 'password'} className="w-full border px-3 py-3 text-sm outline-none pr-10 focus:border-[#1A0A2E] transition-colors" style={{ borderColor: errors.password ? '#ef4444' : 'var(--color-amoria-border)' }} />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Confirm Password</label>
          <input {...register('confirmPassword')} type="password" {...field(!!errors.confirmPassword)} />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" {...register('agreeTerms')} className="mt-0.5" />
          <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: 'var(--color-amoria-text-muted)' }}>
            I agree to the{' '}
            <Link href="/terms" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>Privacy Policy</Link>
          </label>
        </div>
        {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-sm font-semibold tracking-wide disabled:opacity-60 transition-opacity"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          {isSubmitting ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Already have an account?{' '}
        <Link href="/login" className="font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>Login</Link>
      </p>
    </div>
  );
}
