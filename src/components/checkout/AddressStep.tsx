'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Truck, Store, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { Address } from '@/types/user';
import { useAuth } from '@/lib/hooks/useAuth';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone:    z.string().min(9, 'Valid phone required'),
  street:   z.string().min(5, 'Street address required'),
  area:     z.string().min(2, 'Area is required'),
  emirate:  z.string().min(1, 'Emirate is required'),
  postcode: z.string().optional(),
  isDefault: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const savedAddresses: Address[] = [
  { id: 'a1', fullName: 'Ahmed Al Rashid', phone: '+971501234567', street: 'Villa 12, Al Barsha 1', area: 'Al Barsha', emirate: 'Dubai', isDefault: true },
  { id: 'a2', fullName: 'Ahmed Al Rashid', phone: '+971501234567', street: 'Apartment 504, Marina Tower', area: 'Dubai Marina', emirate: 'Dubai', isDefault: false },
];

const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const STORE_LOCATION = {
  name:    'Amoria Flagship Store',
  address: 'Shop 14, Level 1, Dubai Mall, Downtown Dubai',
  hours:   'Daily 10:00 AM – 10:00 PM',
  phone:   '+971 4 123 4567',
  mapLink: 'https://maps.google.com',
};

export type FulfillmentMethod = 'delivery' | 'pickup';

interface AddressStepProps {
  onNext: (address: Address | null, method: FulfillmentMethod) => void;
}

export function AddressStep({ onNext }: AddressStepProps) {
  const { isLoggedIn } = useAuth();
  const [method,          setMethod]          = useState<FulfillmentMethod>('delivery');
  const [selectedAddress, setSelectedAddress] = useState<string>(savedAddresses[0].id);
  const [showNewForm,     setShowNewForm]     = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function handleContinue() {
    if (method === 'pickup') { onNext(null, 'pickup'); return; }
    if (showNewForm) return;
    const addr = savedAddresses.find((a) => a.id === selectedAddress);
    if (addr) onNext(addr, 'delivery');
  }

  function onSubmit(data: FormData) {
    const newAddr: Address = { id: 'new', ...data, isDefault: data.isDefault ?? false };
    onNext(newAddr, 'delivery');
  }

  const inputCls = 'w-full border px-3 py-2.5 text-sm outline-none focus:border-[#1A0A2E] transition-colors bg-white';

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
        How would you like to receive your order?
      </h2>

      {/* Fulfillment toggle */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        {/* Home Delivery */}
        <button
          type="button"
          onClick={() => setMethod('delivery')}
          className="flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200"
          style={{
            borderColor:     method === 'delivery' ? '#1A0A2E' : '#E8E3DC',
            backgroundColor: method === 'delivery' ? 'rgba(26,10,46,0.04)' : 'white',
          }}
        >
          <Truck size={22} style={{ color: method === 'delivery' ? '#1A0A2E' : '#A89880' }} />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: method === 'delivery' ? '#1A0A2E' : '#6B6B6B' }}>Home Delivery</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#A89880' }}>3–5 business days</p>
          </div>
          {method === 'delivery' && <CheckCircle2 size={14} style={{ color: '#C9A84C' }} />}
        </button>

        {/* In-store Pickup */}
        <button
          type="button"
          onClick={() => setMethod('pickup')}
          className="flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200"
          style={{
            borderColor:     method === 'pickup' ? '#1A0A2E' : '#E8E3DC',
            backgroundColor: method === 'pickup' ? 'rgba(26,10,46,0.04)' : 'white',
          }}
        >
          <Store size={22} style={{ color: method === 'pickup' ? '#1A0A2E' : '#A89880' }} />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: method === 'pickup' ? '#1A0A2E' : '#6B6B6B' }}>Store Pickup</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#A89880' }}>Ready in 2 hours</p>
          </div>
          {method === 'pickup' && <CheckCircle2 size={14} style={{ color: '#C9A84C' }} />}
        </button>
      </div>

      {/* ── DELIVERY FLOW ── */}
      {method === 'delivery' && (
        <>
          {/* Saved addresses (logged-in only) */}
          {isLoggedIn && !showNewForm && (
            <div className="space-y-3 mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#A89880' }}>Saved Addresses</p>
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className="flex items-start gap-3 p-4 border cursor-pointer transition-colors"
                  style={{
                    borderColor:     selectedAddress === addr.id ? '#1A0A2E' : '#E8E3DC',
                    backgroundColor: selectedAddress === addr.id ? 'rgba(26,10,46,0.03)' : 'white',
                  }}
                >
                  <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: '#1C1C1C' }}>{addr.fullName}</p>
                    <p className="text-sm" style={{ color: '#6B6B6B' }}>{addr.street}, {addr.area}, {addr.emirate}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>{addr.phone}</p>
                    {addr.isDefault && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Default</span>}
                  </div>
                </label>
              ))}
              <button
                onClick={() => setShowNewForm(true)}
                className="w-full py-3 border-2 border-dashed text-sm font-medium transition-colors hover:border-solid"
                style={{ borderColor: '#E8E3DC', color: '#C9A84C' }}
              >
                + Add New Address
              </button>
            </div>
          )}

          {/* New address form (always shown for guests) */}
          {(showNewForm || !isLoggedIn) && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>Full Name</label>
                  <input {...register('fullName')} className={inputCls} style={{ borderColor: errors.fullName ? '#ef4444' : '#E8E3DC' }} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>Phone</label>
                  <input {...register('phone')} className={inputCls} style={{ borderColor: errors.phone ? '#ef4444' : '#E8E3DC' }} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>Street & Building</label>
                <input {...register('street')} className={inputCls} style={{ borderColor: errors.street ? '#ef4444' : '#E8E3DC' }} />
                {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>Area</label>
                  <input {...register('area')} className={inputCls} style={{ borderColor: errors.area ? '#ef4444' : '#E8E3DC' }} />
                  {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>Emirate</label>
                  <select {...register('emirate')} className={inputCls} style={{ borderColor: errors.emirate ? '#ef4444' : '#E8E3DC' }}>
                    <option value="">Select Emirate</option>
                    {emirates.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {errors.emirate && <p className="text-xs text-red-500 mt-1">{errors.emirate.message}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5 uppercase tracking-wider" style={{ color: '#6B6B6B' }}>Postcode (Optional)</label>
                <input {...register('postcode')} className={inputCls} style={{ borderColor: '#E8E3DC' }} />
              </div>
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="default-addr" {...register('isDefault')} />
                  <label htmlFor="default-addr" className="text-sm cursor-pointer" style={{ color: '#1C1C1C' }}>Save as default address</label>
                </div>
              )}
              <div className="flex gap-3">
                {isLoggedIn && (
                  <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-3 text-sm border font-medium" style={{ borderColor: '#E8E3DC', color: '#1C1C1C' }}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="flex-1 py-3 text-sm font-bold tracking-wide" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {isLoggedIn && !showNewForm && (
            <button
              onClick={handleContinue}
              className="w-full py-3.5 text-sm font-bold tracking-wide"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            >
              Continue to Payment →
            </button>
          )}
        </>
      )}

      {/* ── PICKUP FLOW ── */}
      {method === 'pickup' && (
        <div>
          <div
            className="p-5 mb-5"
            style={{ backgroundColor: '#FAF8F5', border: '1px solid #E8E3DC' }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                <Store size={18} style={{ color: '#C9A84C' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1A0A2E' }}>{STORE_LOCATION.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>Collect your order in person — no delivery charges</p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <p style={{ color: '#1C1C1C' }}>{STORE_LOCATION.address}</p>
                  <a href={STORE_LOCATION.mapLink} target="_blank" rel="noreferrer" className="text-[11px] underline" style={{ color: '#C9A84C' }}>
                    View on Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="flex-shrink-0" style={{ color: '#C9A84C' }} />
                <p style={{ color: '#1C1C1C' }}>{STORE_LOCATION.hours}</p>
              </div>
            </div>

            <div
              className="mt-4 p-3 text-xs rounded-sm"
              style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', color: '#6B4A1E' }}
            >
              🎁 <strong>Bring your Order ID</strong> when you visit. Our team will have your order ready within 2 hours of confirmation.
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3.5 text-sm font-bold tracking-wide"
            style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
          >
            Continue to Payment →
          </button>
        </div>
      )}
    </div>
  );
}
