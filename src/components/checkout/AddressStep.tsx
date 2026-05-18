'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useEffect } from 'react';
import {
  Truck, Store, MapPin, Clock, CheckCircle2, CalendarDays,
  Info, Mail, User, Phone, Building2, ChevronRight,
} from 'lucide-react';
import { Address } from '@/types/user';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateUserAddress, useUserAddresses } from '@/lib/hooks/useApiAddresses';

/* ─── Schemas ─────────────────────────────────────────────── */

const deliverySchema = z.object({
  fullName:  z.string().min(2, 'Full name is required'),
  phone:     z.string().min(9, 'Valid phone number required'),
  email:     z.string().email('Valid email address required'),
  street:    z.string().min(5, 'Street address is required'),
  area:      z.string().min(2, 'Area / district is required'),
  emirate:   z.string().min(1, 'Please select an emirate'),
  postcode:  z.string().optional(),
  isDefault: z.boolean().optional(),
});
type DeliveryFormData = z.infer<typeof deliverySchema>;

const pickupGuestSchema = z.object({
  name:  z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email address required'),
});
type PickupGuestData = z.infer<typeof pickupGuestSchema>;

/* ─── Constants ───────────────────────────────────────────── */

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const STORE = {
  name:    'Amoria Flagship Store',
  address: 'Shop 14, Level 1, Dubai Mall, Downtown Dubai',
  hours:   'Daily 10:00 AM – 10:00 PM',
  mapLink: 'https://maps.google.com/?q=Dubai+Mall+Downtown+Dubai',
};

const ALL_SLOTS = [
  '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',   '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',   '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',   '7:00 PM – 8:00 PM',
  '8:00 PM – 9:00 PM',   '9:00 PM – 10:00 PM',
];

/* ─── Types ───────────────────────────────────────────────── */

export type FulfillmentMethod = 'delivery' | 'pickup';
export interface PickupSlot { date: string; time: string; }
export interface GuestPickupContact { name: string; email: string; }

interface AddressStepProps {
  isGuest?: boolean;
  onNext: (
    address: Address | null,
    method: FulfillmentMethod,
    pickupSlot?: PickupSlot,
    guestContact?: GuestPickupContact,
  ) => void;
}

/* ─── Shared style helpers ────────────────────────────────── */

const inputCls = 'w-full border px-3.5 py-3 text-sm outline-none transition-colors bg-white placeholder:text-[#C8C3BB] focus:border-[#1A0A2E]';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: '#6B6B6B' }}>
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">⚠ {message}</p>;
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
      <span className="text-[10px] font-black uppercase tracking-[0.18em] whitespace-nowrap" style={{ color: '#A89880' }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */

export function AddressStep({ isGuest = false, onNext }: AddressStepProps) {
  const { isLoggedIn, user }            = useAuth();
  const { data: savedAddresses = [] }   = useUserAddresses();
  const createAddress                   = useCreateUserAddress();
  const [method, setMethod]             = useState<FulfillmentMethod>('delivery');
  const [selectedAddr, setSelectedAddr] = useState<string>('');
  const [showNewForm, setShowNewForm]   = useState(false);

  /* Pickup slot state */
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slotError, setSlotError]       = useState(false);

  /* Forms */
  const deliveryForm = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { email: user?.email ?? '' },
  });
  const pickupGuestForm = useForm<PickupGuestData>({
    resolver: zodResolver(pickupGuestSchema),
  });

  /* Pre-select default saved address */
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddr) {
      const def = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];
      setSelectedAddr(def.id);
    }
  }, [savedAddresses, selectedAddr]);

  /* ── Slot helpers ── */
  function slotStartHour(slot: string): number {
    const part  = slot.split('–')[0].trim();
    const hour  = parseInt(part.split(':')[0], 10);
    const isPM  = part.includes('PM') && hour !== 12;
    const isAM0 = part.includes('AM') && hour === 12;
    if (isPM)  return hour + 12;
    if (isAM0) return 0;
    return hour;
  }

  const today    = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const fmtDate  = (d: Date) => d.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' });

  const isPastSlot = useMemo(() => {
    if (selectedDate === 'tomorrow') return (_: string) => false;
    const now = new Date();
    const dec = now.getHours() + now.getMinutes() / 60;
    return (slot: string) => slotStartHour(slot) < dec + 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  /* ── Handlers ── */

  async function onDeliverySubmit(data: DeliveryFormData) {
    const newAddr: Address = {
      id: 'new',
      fullName:  data.fullName,
      phone:     data.phone,
      email:     data.email,
      street:    data.street,
      area:      data.area,
      emirate:   data.emirate,
      postcode:  data.postcode,
      isDefault: data.isDefault ?? false,
    };
    if (isLoggedIn) {
      try {
        await createAddress.mutateAsync({
          fullName: data.fullName, phone: data.phone, street: data.street,
          area: data.area, emirate: data.emirate, postcode: data.postcode,
          isDefault: data.isDefault ?? false,
        });
      } catch { return; }
    }
    onNext(newAddr, 'delivery');
  }

  function handleSavedAddressContinue() {
    const addr = savedAddresses.find((a) => a.id === selectedAddr);
    if (addr) onNext(addr, 'delivery');
  }

  async function handlePickupSubmit() {
    if (!selectedSlot) { setSlotError(true); return; }
    const slot: PickupSlot = {
      date: selectedDate === 'today' ? `Today, ${fmtDate(today)}` : `Tomorrow, ${fmtDate(tomorrow)}`,
      time: selectedSlot,
    };
    if (isGuest) {
      const valid = await pickupGuestForm.trigger();
      if (!valid) return;
      const g = pickupGuestForm.getValues();
      onNext(null, 'pickup', slot, { name: g.name, email: g.email });
    } else {
      onNext(null, 'pickup', slot);
    }
  }

  /* ─────────────────────── RENDER ─────────────────────────── */
  return (
    <div>
      {/* Title */}
      <div className="mb-7">
        <h2 className="text-2xl font-light" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
          Delivery Method
        </h2>
        <p className="text-sm mt-1" style={{ color: '#A89880' }}>
          Choose how you'd like to receive your order
        </p>
      </div>

      {/* ── Fulfillment toggle ── */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {(
          [
            {
              id: 'delivery' as const,
              Icon: Truck,
              title: 'Home Delivery',
              sub: 'Arrives in 3–5 days',
              subColor: '#A89880',
            },
            {
              id: 'pickup' as const,
              Icon: Store,
              title: 'Store Pickup',
              sub: 'Free · Ready in ~2 hrs',
              subColor: '#22c55e',
            },
          ] as const
        ).map(({ id, Icon, title, sub, subColor }) => {
          const active = method === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className="relative flex flex-col items-center gap-3 p-5 border-2 transition-all duration-200 text-center focus:outline-none"
              style={{
                borderColor:     active ? '#1A0A2E' : '#E8E3DC',
                backgroundColor: active ? 'rgba(26,10,46,0.04)' : 'white',
              }}
            >
              {active && (
                <span className="absolute top-2.5 right-2.5">
                  <CheckCircle2 size={14} style={{ color: '#C9A84C' }} />
                </span>
              )}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: active ? 'rgba(26,10,46,0.08)' : '#F5F2EE' }}
              >
                <Icon size={22} style={{ color: active ? '#1A0A2E' : '#A89880' }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: active ? '#1A0A2E' : '#6B6B6B' }}>{title}</p>
                <p className="text-[11px] mt-0.5 font-semibold" style={{ color: subColor }}>{sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          DELIVERY
      ════════════════════════════════════════════ */}
      {method === 'delivery' && (
        <>
          {/* Saved addresses */}
          {isLoggedIn && savedAddresses.length > 0 && !showNewForm && (
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: '#A89880' }}>
                Saved Addresses
              </p>
              <div className="space-y-2.5">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex items-start gap-3 p-4 border-2 cursor-pointer transition-all duration-150"
                    style={{
                      borderColor:     selectedAddr === addr.id ? '#1A0A2E' : '#E8E3DC',
                      backgroundColor: selectedAddr === addr.id ? 'rgba(26,10,46,0.03)' : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="saved-address"
                      value={addr.id}
                      checked={selectedAddr === addr.id}
                      onChange={() => setSelectedAddr(addr.id)}
                      className="mt-1 accent-[#1A0A2E]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm" style={{ color: '#1C1C1C' }}>{addr.fullName}</p>
                        {addr.isDefault && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-0.5 truncate" style={{ color: '#6B6B6B' }}>
                        {addr.street}, {addr.area}, {addr.emirate}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={() => setShowNewForm(true)}
                className="w-full mt-3 py-3 border-2 border-dashed text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:border-[#C9A84C]"
                style={{ borderColor: '#E8E3DC', color: '#C9A84C' }}
              >
                + Add New Address
              </button>
            </div>
          )}

          {/* Delivery form */}
          {(showNewForm || !isLoggedIn || savedAddresses.length === 0) && (
            <form onSubmit={deliveryForm.handleSubmit(onDeliverySubmit)}>
              {/* ── Contact info ── */}
              <SectionDivider label="Contact Information" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Full Name</FieldLabel>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C8C3BB' }} />
                      <input
                        {...deliveryForm.register('fullName')}
                        placeholder="Your full name"
                        className={`${inputCls} pl-9`}
                        style={{ borderColor: deliveryForm.formState.errors.fullName ? '#ef4444' : '#E8E3DC' }}
                      />
                    </div>
                    <FieldError message={deliveryForm.formState.errors.fullName?.message} />
                  </div>
                  <div>
                    <FieldLabel>Phone Number</FieldLabel>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C8C3BB' }} />
                      <input
                        {...deliveryForm.register('phone')}
                        type="tel"
                        placeholder="+971 50 000 0000"
                        className={`${inputCls} pl-9`}
                        style={{ borderColor: deliveryForm.formState.errors.phone ? '#ef4444' : '#E8E3DC' }}
                      />
                    </div>
                    <FieldError message={deliveryForm.formState.errors.phone?.message} />
                  </div>
                </div>

                {/* Email — full width, for all users */}
                <div>
                  <FieldLabel>
                    Email Address{' '}
                    <span className="normal-case font-normal tracking-normal ml-1" style={{ color: '#B0A898' }}>
                      — order confirmation & updates
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C8C3BB' }} />
                    <input
                      {...deliveryForm.register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className={`${inputCls} pl-9`}
                      style={{ borderColor: deliveryForm.formState.errors.email ? '#ef4444' : '#E8E3DC' }}
                    />
                  </div>
                  <FieldError message={deliveryForm.formState.errors.email?.message} />
                </div>
              </div>

              {/* ── Delivery address ── */}
              <SectionDivider label="Delivery Address" />
              <div className="space-y-4">
                <div>
                  <FieldLabel>Street & Building</FieldLabel>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C8C3BB' }} />
                    <input
                      {...deliveryForm.register('street')}
                      placeholder="Building name, apartment, street"
                      className={`${inputCls} pl-9`}
                      style={{ borderColor: deliveryForm.formState.errors.street ? '#ef4444' : '#E8E3DC' }}
                    />
                  </div>
                  <FieldError message={deliveryForm.formState.errors.street?.message} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Area / District</FieldLabel>
                    <input
                      {...deliveryForm.register('area')}
                      placeholder="e.g. Downtown"
                      className={inputCls}
                      style={{ borderColor: deliveryForm.formState.errors.area ? '#ef4444' : '#E8E3DC' }}
                    />
                    <FieldError message={deliveryForm.formState.errors.area?.message} />
                  </div>
                  <div>
                    <FieldLabel>Emirate</FieldLabel>
                    <select
                      {...deliveryForm.register('emirate')}
                      className={`${inputCls} cursor-pointer`}
                      style={{ borderColor: deliveryForm.formState.errors.emirate ? '#ef4444' : '#E8E3DC' }}
                    >
                      <option value="">Select emirate</option>
                      {EMIRATES.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <FieldError message={deliveryForm.formState.errors.emirate?.message} />
                  </div>
                </div>

                <div>
                  <FieldLabel>
                    Postcode{' '}
                    <span className="normal-case font-normal tracking-normal ml-1" style={{ color: '#B0A898' }}>— optional</span>
                  </FieldLabel>
                  <input
                    {...deliveryForm.register('postcode')}
                    placeholder="Enter postcode if known"
                    className={inputCls}
                    style={{ borderColor: '#E8E3DC' }}
                  />
                </div>

                {isLoggedIn && (
                  <label className="flex items-center gap-2.5 cursor-pointer select-none mt-1">
                    <input
                      type="checkbox"
                      {...deliveryForm.register('isDefault')}
                      className="accent-[#1A0A2E] w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: '#1C1C1C' }}>Save as default address</span>
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-7">
                {isLoggedIn && showNewForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 py-3 text-sm border font-medium transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E8E3DC', color: '#1C1C1C' }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={deliveryForm.formState.isSubmitting}
                  className="flex-1 py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
                >
                  Continue to Payment <ChevronRight size={15} />
                </button>
              </div>
            </form>
          )}

          {/* Use saved address CTA */}
          {isLoggedIn && savedAddresses.length > 0 && !showNewForm && (
            <button
              onClick={handleSavedAddressContinue}
              className="w-full py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2 mt-4"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            >
              Continue to Payment <ChevronRight size={15} />
            </button>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════
          STORE PICKUP
      ════════════════════════════════════════════ */}
      {method === 'pickup' && (
        <div className="space-y-6">

          {/* Store info card */}
          <div className="p-5" style={{ backgroundColor: '#FAF8F5', border: '1px solid #E8E3DC' }}>
            <div className="flex items-start gap-3.5 mb-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                <Store size={20} style={{ color: '#C9A84C' }} />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: '#1A0A2E' }}>{STORE.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
                  Show your Order ID at the counter to collect
                </p>
              </div>
            </div>
            <div
              className="space-y-2.5 text-sm pt-4"
              style={{ borderTop: '1px solid #E8E3DC' }}
            >
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <p style={{ color: '#1C1C1C' }}>{STORE.address}</p>
                  <a href={STORE.mapLink} target="_blank" rel="noreferrer" className="text-[11px] underline underline-offset-2 mt-0.5 block" style={{ color: '#C9A84C' }}>
                    View on Google Maps →
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={14} className="flex-shrink-0" style={{ color: '#C9A84C' }} />
                <p style={{ color: '#1C1C1C' }}>{STORE.hours}</p>
              </div>
            </div>
          </div>

          {/* Guest contact details (ONLY for guest users) */}
          {isGuest && (
            <div>
              <SectionDivider label="Your Contact Details" />
              <p className="text-xs mb-4" style={{ color: '#6B6B6B' }}>
                We&apos;ll email you when your order is ready for pickup.
              </p>
              <div className="space-y-4">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C8C3BB' }} />
                    <input
                      {...pickupGuestForm.register('name')}
                      placeholder="Your full name"
                      className={`${inputCls} pl-9`}
                      style={{ borderColor: pickupGuestForm.formState.errors.name ? '#ef4444' : '#E8E3DC' }}
                    />
                  </div>
                  <FieldError message={pickupGuestForm.formState.errors.name?.message} />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#C8C3BB' }} />
                    <input
                      {...pickupGuestForm.register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className={`${inputCls} pl-9`}
                      style={{ borderColor: pickupGuestForm.formState.errors.email ? '#ef4444' : '#E8E3DC' }}
                    />
                  </div>
                  <FieldError message={pickupGuestForm.formState.errors.email?.message} />
                  <p className="text-[10px] mt-1" style={{ color: '#A89880' }}>
                    Order ready notification will be sent here
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Date picker */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={15} style={{ color: '#1A0A2E' }} />
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1A0A2E' }}>
                Pickup Date
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['today', 'tomorrow'] as const).map((d) => {
                const label    = d === 'today' ? 'Today' : 'Tomorrow';
                const dateStr  = fmtDate(d === 'today' ? today : tomorrow);
                const selected = selectedDate === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setSlotError(false);
                      if (d === 'today' && selectedSlot) {
                        const now = new Date();
                        if (slotStartHour(selectedSlot) < now.getHours() + now.getMinutes() / 60 + 2) {
                          setSelectedSlot('');
                        }
                      }
                    }}
                    className="p-4 border-2 text-left transition-all duration-200"
                    style={{
                      borderColor:     selected ? '#1A0A2E' : '#E8E3DC',
                      backgroundColor: selected ? 'rgba(26,10,46,0.04)' : 'white',
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: selected ? '#1A0A2E' : '#6B6B6B' }}>{label}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#A89880' }}>{dateStr}</p>
                    {d === 'today' && (
                      <p className="text-[10px] mt-1.5 font-bold" style={{ color: '#22c55e' }}>✓ Ready in ~2 hrs</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time slots */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={15} style={{ color: '#1A0A2E' }} />
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#1A0A2E' }}>
                Pickup Time
              </p>
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
                    onClick={() => {
                      if (!isPast) { setSelectedSlot(slot); setSlotError(false); }
                    }}
                    className="relative p-3 text-left border-2 transition-all duration-150"
                    style={{
                      borderColor:     isPast ? '#F0EDE8' : isSelected ? '#1A0A2E' : '#E8E3DC',
                      backgroundColor: isPast ? '#F9F7F5' : isSelected ? 'rgba(26,10,46,0.05)' : 'white',
                      cursor:          isPast ? 'not-allowed' : 'pointer',
                      opacity:         isPast ? 0.4 : 1,
                    }}
                  >
                    <p
                      className="text-xs font-bold leading-snug"
                      style={{ color: isPast ? '#C0BAB2' : isSelected ? '#1A0A2E' : '#1C1C1C' }}
                    >
                      {slot.split('–')[0].trim()}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: isPast ? '#D4CFC8' : '#A89880' }}>
                      – {slot.split('–')[1]?.trim()}
                    </p>
                    {isSelected && !isPast && (
                      <CheckCircle2 size={11} className="absolute bottom-2 right-2" style={{ color: '#C9A84C' }} />
                    )}
                  </button>
                );
              })}
            </div>
            {slotError && (
              <p className="text-xs text-red-500 mt-2">⚠ Please select a pickup time slot to continue.</p>
            )}
          </div>

          {/* Selected slot summary */}
          {selectedSlot && (
            <div
              className="flex items-start gap-3 p-4"
              style={{ backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
              <div>
                <p className="text-sm font-bold" style={{ color: '#1A0A2E' }}>
                  {selectedDate === 'today' ? `Today, ${fmtDate(today)}` : `Tomorrow, ${fmtDate(tomorrow)}`} · {selectedSlot}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
                  You&apos;ll receive a WhatsApp notification when your order is ready.
                </p>
              </div>
            </div>
          )}

          {/* Info note */}
          <div
            className="flex items-start gap-2.5 text-xs p-3.5"
            style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', color: '#6B4A1E' }}
          >
            <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
            <p>Bring a valid ID and your Order ID. Orders are held for 24 hours after your selected slot.</p>
          </div>

          <button
            onClick={handlePickupSubmit}
            className="w-full py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2"
            style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
          >
            Continue to Payment <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
