'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Address } from '@/types/user';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(9, 'Valid phone required'),
  street: z.string().min(5, 'Street address required'),
  area: z.string().min(2, 'Area is required'),
  emirate: z.string().min(1, 'Emirate is required'),
  postcode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const savedAddresses: Address[] = [
  { id: 'a1', fullName: 'Ahmed Al Rashid', phone: '+971501234567', street: 'Villa 12, Al Barsha 1', area: 'Al Barsha', emirate: 'Dubai', isDefault: true },
  { id: 'a2', fullName: 'Ahmed Al Rashid', phone: '+971501234567', street: 'Apartment 504, Marina Tower', area: 'Dubai Marina', emirate: 'Dubai', isDefault: false },
];

const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

interface AddressStepProps {
  onNext: (address: Address) => void;
}

export function AddressStep({ onNext }: AddressStepProps) {
  const [selectedAddress, setSelectedAddress] = useState<string>(savedAddresses[0].id);
  const [showNewForm, setShowNewForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function handleContinue() {
    if (showNewForm) return; // form submission handles it
    const addr = savedAddresses.find((a) => a.id === selectedAddress);
    if (addr) onNext(addr);
  }

  function onSubmit(data: FormData) {
    const newAddr: Address = { id: 'new', ...data, isDefault: data.isDefault ?? false };
    onNext(newAddr);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        Delivery Address
      </h2>

      {/* Saved addresses */}
      {!showNewForm && (
        <div className="space-y-3 mb-6">
          {savedAddresses.map((addr) => (
            <label
              key={addr.id}
              className="flex items-start gap-3 p-4 border cursor-pointer transition-colors"
              style={{
                borderColor: selectedAddress === addr.id ? 'var(--color-amoria-primary)' : 'var(--color-amoria-border)',
                backgroundColor: selectedAddress === addr.id ? 'rgba(26,10,46,0.03)' : 'white',
              }}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddress === addr.id}
                onChange={() => setSelectedAddress(addr.id)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--color-amoria-text)' }}>{addr.fullName}</p>
                <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
                  {addr.street}, {addr.area}, {addr.emirate}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>{addr.phone}</p>
                {addr.isDefault && <span className="text-xs text-green-600 font-medium">Default</span>}
              </div>
            </label>
          ))}

          <button
            onClick={() => setShowNewForm(true)}
            className="w-full py-3 border-2 border-dashed text-sm font-medium transition-colors hover:border-solid"
            style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-accent)' }}
          >
            + Add New Address
          </button>
        </div>
      )}

      {/* New address form */}
      {showNewForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Full Name</label>
              <input {...register('fullName')} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: errors.fullName ? '#ef4444' : 'var(--color-amoria-border)' }} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Phone</label>
              <input {...register('phone')} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: errors.phone ? '#ef4444' : 'var(--color-amoria-border)' }} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Street & Building</label>
            <input {...register('street')} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: errors.street ? '#ef4444' : 'var(--color-amoria-border)' }} />
            {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Area</label>
              <input {...register('area')} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: errors.area ? '#ef4444' : 'var(--color-amoria-border)' }} />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Emirate</label>
              <select {...register('emirate')} className="w-full border px-3 py-2.5 text-sm outline-none bg-white" style={{ borderColor: errors.emirate ? '#ef4444' : 'var(--color-amoria-border)' }}>
                <option value="">Select Emirate</option>
                {emirates.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
              {errors.emirate && <p className="text-xs text-red-500 mt-1">{errors.emirate.message}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Postcode (Optional)</label>
            <input {...register('postcode')} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="default-addr" {...register('isDefault')} />
            <label htmlFor="default-addr" className="text-sm cursor-pointer" style={{ color: 'var(--color-amoria-text)' }}>Set as default address</label>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-3 text-sm border" style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}>
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 text-sm font-semibold" style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}>
              Use This Address
            </button>
          </div>
        </form>
      )}

      {!showNewForm && (
        <button
          onClick={handleContinue}
          className="w-full py-3.5 text-sm font-semibold tracking-wide"
          style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
        >
          Continue to Payment
        </button>
      )}
    </div>
  );
}
