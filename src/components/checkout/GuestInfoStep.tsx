'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone } from 'lucide-react';
import { GuestInfo } from '@/lib/store/authSlice';

const schema = z.object({
  name:  z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(9, 'Valid UAE phone required'),
});
type FormData = z.infer<typeof schema>;

interface GuestInfoStepProps {
  onNext: (info: GuestInfo) => void;
  defaultValues?: GuestInfo;
  isEditing?: boolean;
}

export function GuestInfoStep({ onNext, defaultValues, isEditing = false }: GuestInfoStepProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {},
  });

  function onSubmit(data: FormData) {
    onNext(data);
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}
        >
          <User size={24} style={{ color: '#C9A84C' }} />
        </div>
        <h2 className="text-xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
          {isEditing ? 'Edit Your Details' : 'Guest Checkout'}
        </h2>
        <p className="text-sm" style={{ color: '#6B6B6B' }}>
          {isEditing
            ? 'Update your name, email or phone number below'
            : 'No account needed — just a few details for your order'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>
            Full Name
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A89880' }} />
            <input
              {...register('name')}
              placeholder="e.g. Ahmed Al Rashid"
              className="w-full border pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1A0A2E] transition-colors"
              style={{ borderColor: errors.name ? '#ef4444' : '#E8E3DC' }}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>
            Email Address
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A89880' }} />
            <input
              {...register('email')}
              type="email"
              placeholder="you@email.com"
              className="w-full border pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1A0A2E] transition-colors"
              style={{ borderColor: errors.email ? '#ef4444' : '#E8E3DC' }}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          <p className="text-[10px] mt-1" style={{ color: '#A89880' }}>Order confirmation will be sent here</p>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>
            Phone Number
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A89880' }} />
            <input
              {...register('phone')}
              type="tel"
              placeholder="+971 50 123 4567"
              className="w-full border pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1A0A2E] transition-colors"
              style={{ borderColor: errors.phone ? '#ef4444' : '#E8E3DC' }}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          <p className="text-[10px] mt-1" style={{ color: '#A89880' }}>For delivery updates via WhatsApp</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 text-sm font-bold tracking-[0.12em] uppercase disabled:opacity-60 transition-opacity mt-2"
          style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
        >
          {isEditing ? 'Save & Continue →' : 'Continue to Delivery →'}
        </button>
      </form>
    </div>
  );
}
