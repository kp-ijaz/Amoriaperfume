'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useEffect } from 'react';
import { Truck, Store, MapPin, Clock, CheckCircle2, CalendarDays, Info } from 'lucide-react';
import { Address } from '@/types/user';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateUserAddress, useUserAddresses } from '@/lib/hooks/useApiAddresses';

const schema = z.object({
  fullName:  z.string().min(2, 'Name is required'),
  phone:     z.string().min(9, 'Valid phone required'),
  street:    z.string().min(5, 'Street address required'),
  area:      z.string().min(2, 'Area is required'),
  emirate:   z.string().min(1, 'Emirate is required'),
  postcode:  z.string().optional(),
  isDefault: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const emirates = ['Dubai','Abu Dhabi','Sharjah','Ajman','Ras Al Khaimah','Fujairah','Umm Al Quwain'];

const STORE = {
  name:    'Amoria Flagship Store',
  address: 'Shop 14, Level 1, Dubai Mall, Downtown Dubai',
  hours:   'Daily 10:00 AM – 10:00 PM',
  phone:   '+971 4 123 4567',
  mapLink: 'https://maps.google.com/?q=Dubai+Mall+Downtown+Dubai',
};

// Generate realistic time slots
const ALL_SLOTS = [
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
  '8:00 PM – 9:00 PM',
  '9:00 PM – 10:00 PM',
];


export type FulfillmentMethod = 'delivery' | 'pickup';

export interface PickupSlot {
  date: string;  // "Today" | "Tomorrow" | formatted date
  time: string;  // e.g. "2:00 PM – 3:00 PM"
}

interface AddressStepProps {
  onNext: (address: Address | null, method: FulfillmentMethod, pickupSlot?: PickupSlot) => void;
}

export function AddressStep({ onNext }: AddressStepProps) {
  const { isLoggedIn }                        = useAuth();
  const { data: savedAddresses = [] }         = useUserAddresses();
  const createAddress                          = useCreateUserAddress();
  const [method, setMethod]                   = useState<FulfillmentMethod>('delivery');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showNewForm, setShowNewForm]         = useState(false);

  // Pickup slot state
  const [selectedDate, setSelectedDate]       = useState<'today' | 'tomorrow'>('today');
  const [selectedSlot, setSelectedSlot]       = useState<string>('');
  const [slotError, setSlotError]             = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddress) {
      const defaultAddress = savedAddresses.find((addr) => addr.isDefault) ?? savedAddresses[0];
      setSelectedAddress(defaultAddress.id);
    }
  }, [savedAddresses, selectedAddress]);

  // Returns the slot start time as a decimal hour (e.g. "2:00 PM" → 14.0)
  function slotStartHour(slot: string): number {
    const part = slot.split('–')[0].trim(); // e.g. "2:00 PM"
    const [hStr] = part.split(':');
    const hour   = parseInt(hStr, 10);
    const isPM   = part.includes('PM') && hour !== 12;
    const isAM12 = part.includes('AM') && hour === 12;
    if (isPM)   return hour + 12;
    if (isAM12) return 0;
    return hour;
  }

  // For "today": a slot is unavailable if it starts within 2 hours from now
  // e.g. current time 3:30 PM → earliest available slot starts at 5:30 PM (17.5)
  const isPastSlot = useMemo(() => {
    if (selectedDate === 'tomorrow') return (_slot: string) => false;
    const now        = new Date();
    const nowDecimal = now.getHours() + now.getMinutes() / 60; // e.g. 15.5 for 3:30 PM
    return (slot: string) => slotStartHour(slot) < nowDecimal + 2;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Friendly date labels
  const today    = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const fmt = (d: Date) => d.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' });

  function handleContinue() {
    if (method === 'pickup') {
      if (!selectedSlot) { setSlotError(true); return; }
      const slot: PickupSlot = {
        date: selectedDate === 'today' ? `Today, ${fmt(today)}` : `Tomorrow, ${fmt(tomorrow)}`,
        time: selectedSlot,
      };
      onNext(null, 'pickup', slot);
      return;
    }
    if (showNewForm) return;
    const addr = savedAddresses.find((a) => a.id === selectedAddress);
    if (addr) onNext(addr, 'delivery');
  }

  async function onSubmit(data: FormData) {
    const newAddr: Address = { id: 'new', ...data, isDefault: data.isDefault ?? false };
    if (isLoggedIn) {
      try {
        await createAddress.mutateAsync({
          fullName: data.fullName,
          phone: data.phone,
          street: data.street,
          area: data.area,
          emirate: data.emirate,
          postcode: data.postcode,
          isDefault: data.isDefault ?? false,
        });
      } catch {
        return;
      }
    }
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
        <button
          type="button"
          onClick={() => setMethod('delivery')}
          className="flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200"
          style={{ borderColor: method === 'delivery' ? '#1A0A2E' : '#E8E3DC', backgroundColor: method === 'delivery' ? 'rgba(26,10,46,0.04)' : 'white' }}
        >
          <Truck size={22} style={{ color: method === 'delivery' ? '#1A0A2E' : '#A89880' }} />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: method === 'delivery' ? '#1A0A2E' : '#6B6B6B' }}>Home Delivery</p>
          </div>
          {method === 'delivery' && <CheckCircle2 size={14} style={{ color: '#C9A84C' }} />}
        </button>

        <button
          type="button"
          onClick={() => setMethod('pickup')}
          className="flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200"
          style={{ borderColor: method === 'pickup' ? '#1A0A2E' : '#E8E3DC', backgroundColor: method === 'pickup' ? 'rgba(26,10,46,0.04)' : 'white' }}
        >
          <Store size={22} style={{ color: method === 'pickup' ? '#1A0A2E' : '#A89880' }} />
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: method === 'pickup' ? '#1A0A2E' : '#6B6B6B' }}>Store Pickup</p>
            <p className="text-[10px] mt-0.5" style={{ color: '#A89880' }}>Ready in 2 hours · Free</p>
          </div>
          {method === 'pickup' && <CheckCircle2 size={14} style={{ color: '#C9A84C' }} />}
        </button>
      </div>

      {/* ── DELIVERY ── */}
      {method === 'delivery' && (
        <>
          {isLoggedIn && savedAddresses.length > 0 && !showNewForm && (
            <div className="space-y-3 mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#A89880' }}>Saved Addresses</p>
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className="flex items-start gap-3 p-4 border cursor-pointer transition-colors"
                  style={{ borderColor: selectedAddress === addr.id ? '#1A0A2E' : '#E8E3DC', backgroundColor: selectedAddress === addr.id ? 'rgba(26,10,46,0.03)' : 'white' }}
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
              <button onClick={() => setShowNewForm(true)} className="w-full py-3 border-2 border-dashed text-sm font-medium" style={{ borderColor: '#E8E3DC', color: '#C9A84C' }}>
                + Add New Address
              </button>
            </div>
          )}

          {(showNewForm || !isLoggedIn || savedAddresses.length === 0) && (
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
                  <button type="button" onClick={() => setShowNewForm(false)} className="flex-1 py-3 text-sm border font-medium" style={{ borderColor: '#E8E3DC', color: '#1C1C1C' }}>Cancel</button>
                )}
                <button type="submit" className="flex-1 py-3 text-sm font-bold tracking-wide" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
                  Continue to Payment →
                </button>
              </div>
            </form>
          )}

          {isLoggedIn && savedAddresses.length > 0 && !showNewForm && (
            <button onClick={handleContinue} className="w-full py-3.5 text-sm font-bold tracking-wide" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
              Continue to Payment →
            </button>
          )}
        </>
      )}

      {/* ── PICKUP ── */}
      {method === 'pickup' && (
        <div className="space-y-5">

          {/* Store info card */}
          <div className="p-4" style={{ backgroundColor: '#FAF8F5', border: '1px solid #E8E3DC' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <Store size={18} style={{ color: '#C9A84C' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1A0A2E' }}>{STORE.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>Show your Order ID at the counter to collect</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <p style={{ color: '#1C1C1C' }}>{STORE.address}</p>
                  <a href={STORE.mapLink} target="_blank" rel="noreferrer" className="text-[11px] underline" style={{ color: '#C9A84C' }}>View on Google Maps →</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="flex-shrink-0" style={{ color: '#C9A84C' }} />
                <p style={{ color: '#1C1C1C' }}>{STORE.hours}</p>
              </div>
            </div>
          </div>

          {/* Date selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={15} style={{ color: '#1A0A2E' }} />
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1A0A2E' }}>Select Pickup Date</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['today', 'tomorrow'] as const).map((d) => {
                const label    = d === 'today' ? 'Today' : 'Tomorrow';
                const dateStr  = fmt(d === 'today' ? today : tomorrow);
                const selected = selectedDate === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setSlotError(false);
                      // Clear slot if switching to today and it falls within the 2-hour buffer
                      if (d === 'today' && selectedSlot) {
                        const now        = new Date();
                        const nowDecimal = now.getHours() + now.getMinutes() / 60;
                        if (slotStartHour(selectedSlot) < nowDecimal + 2) setSelectedSlot('');
                      }
                    }}
                    className="p-3.5 border-2 text-left transition-all duration-200"
                    style={{ borderColor: selected ? '#1A0A2E' : '#E8E3DC', backgroundColor: selected ? 'rgba(26,10,46,0.04)' : 'white' }}
                  >
                    <p className="text-sm font-bold" style={{ color: selected ? '#1A0A2E' : '#6B6B6B' }}>{label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#A89880' }}>{dateStr}</p>
                    {d === 'today' && <p className="text-[10px] mt-1 font-semibold" style={{ color: '#22c55e' }}>Ready in ~2 hrs</p>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slot grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} style={{ color: '#1A0A2E' }} />
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1A0A2E' }}>Preferred Pickup Time</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot;
                const isPast     = isPastSlot(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isPast}
                    onClick={() => { if (!isPast) { setSelectedSlot(slot); setSlotError(false); } }}
                    className="relative p-3 text-left border-2 transition-all duration-200"
                    style={{
                      borderColor:     isPast ? '#F0EDE8' : isSelected ? '#1A0A2E' : '#E8E3DC',
                      backgroundColor: isPast ? '#F9F7F5' : isSelected ? 'rgba(26,10,46,0.05)' : 'white',
                      cursor:          isPast ? 'not-allowed' : 'pointer',
                      opacity:         isPast ? 0.45 : 1,
                    }}
                  >
                    <p className="text-xs font-semibold leading-snug" style={{ color: isPast ? '#C0BAB2' : isSelected ? '#1A0A2E' : '#1C1C1C' }}>
                      {slot.split('–')[0].trim()}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: isPast ? '#D4CFC8' : '#A89880' }}>
                      – {slot.split('–')[1]?.trim()}
                    </p>
                    {isSelected && !isPast && (
                      <CheckCircle2 size={12} className="absolute bottom-2 right-2" style={{ color: '#C9A84C' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {slotError && (
              <p className="text-xs text-red-500 mt-2">Please select a pickup time slot to continue.</p>
            )}
          </div>

          {/* Selected summary */}
          {selectedSlot && (
            <div className="flex items-start gap-3 p-4" style={{ backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1A0A2E' }}>
                  {selectedDate === 'today' ? `Today, ${fmt(today)}` : `Tomorrow, ${fmt(tomorrow)}`} · {selectedSlot}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
                  We'll send a WhatsApp notification when your order is ready for pickup.
                </p>
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="flex items-start gap-2.5 text-xs p-3" style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', color: '#6B4A1E' }}>
            <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
            <p>Bring a valid ID and your Order ID. Your order will be held for 24 hours after your selected slot. After that it will be returned to stock.</p>
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
