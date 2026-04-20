'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, UserCheck, LogIn, ShoppingBag, Shield, Store, Truck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { GuestInfoStep } from '@/components/checkout/GuestInfoStep';
import { AddressStep, FulfillmentMethod } from '@/components/checkout/AddressStep';
import { PaymentStep } from '@/components/checkout/PaymentStep';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { Address } from '@/types/user';
import { GuestInfo } from '@/lib/store/authSlice';

type CheckoutFlow = 'gate' | 'guest-info' | 1 | 2 | 3;

export default function CheckoutPage() {
  const { isLoggedIn, isGuest, user, guestInfo, continueAsGuest } = useAuth();
  const { items } = useCart();

  // If already authenticated, skip gate
  const [flow,           setFlow]           = useState<CheckoutFlow>(isLoggedIn || isGuest ? 1 : 'gate');
  const [address,        setAddress]        = useState<Address | null>(null);
  const [fulfillment,    setFulfillment]    = useState<FulfillmentMethod>('delivery');
  const [paymentMethod,  setPaymentMethod]  = useState<'card' | 'applepay' | 'cod' | null>(null);

  // Cart empty guard
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <ShoppingBag size={48} style={{ color: '#E8E3DC' }} className="mb-4" />
        <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>Your cart is empty</h2>
        <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>Add items to your cart before checking out.</p>
        <Link href="/products" className="px-8 py-3 text-sm font-bold tracking-wider uppercase" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
          Browse Collection
        </Link>
      </div>
    );
  }

  const displayName = isLoggedIn
    ? `${user!.firstName} ${user!.lastName}`
    : guestInfo?.name ?? 'Guest';

  function handleGuestInfo(info: GuestInfo) {
    continueAsGuest(info);
    setFlow(1);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl font-light mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
        >
          Checkout
        </h1>
        {(isLoggedIn || isGuest) && (
          <p className="text-sm" style={{ color: '#A89880' }}>
            {isLoggedIn ? '👤' : '🛒'} Checking out as <strong style={{ color: '#1A0A2E' }}>{displayName}</strong>
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">

        {/* ── AUTH GATE ── */}
        {flow === 'gate' && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {/* Trust bar */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 px-5 py-3 mb-7 text-[10px] uppercase tracking-wider font-semibold"
              style={{ backgroundColor: '#FAF8F5', border: '1px solid #E8E3DC' }}
            >
              <span className="flex items-center gap-1.5" style={{ color: '#6B6B6B' }}>
                <Shield size={12} style={{ color: '#C9A84C' }} /> Secure Checkout
              </span>
              <span className="flex items-center gap-1.5" style={{ color: '#6B6B6B' }}>
                <Truck size={12} style={{ color: '#C9A84C' }} /> Free Delivery over AED 200
              </span>
              <span className="flex items-center gap-1.5" style={{ color: '#6B6B6B' }}>
                <Store size={12} style={{ color: '#C9A84C' }} /> Store Pickup Available
              </span>
            </div>

            <div className="space-y-3">
              {/* Login option */}
              <Link
                href="/login?redirect=/checkout"
                className="flex items-center gap-4 p-5 border-2 transition-all duration-200 hover:border-[#1A0A2E] group"
                style={{ borderColor: '#E8E3DC', backgroundColor: 'white' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(26,10,46,0.07)' }}
                >
                  <LogIn size={20} style={{ color: '#1A0A2E' }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#1A0A2E' }}>Sign In to Your Account</p>
                  <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>Use saved addresses, track orders, earn loyalty points</p>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" />
              </Link>

              {/* Register option */}
              <Link
                href="/register?redirect=/checkout"
                className="flex items-center gap-4 p-5 border-2 transition-all duration-200 hover:border-[#C9A84C] group"
                style={{ borderColor: '#E8E3DC', backgroundColor: 'white' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}
                >
                  <UserCheck size={20} style={{ color: '#C9A84C' }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#1A0A2E' }}>Create an Account</p>
                  <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>Get 10% off your first order + faster checkout next time</p>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" />
              </Link>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
                <span className="text-xs" style={{ color: '#A89880' }}>or</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
              </div>

              {/* Guest option */}
              <button
                onClick={() => setFlow('guest-info')}
                className="w-full flex items-center gap-4 p-5 border-2 transition-all duration-200 hover:border-[#6B6B6B] group text-left"
                style={{ borderColor: '#E8E3DC', backgroundColor: '#FAFAFA' }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(107,107,107,0.08)' }}
                >
                  <User size={20} style={{ color: '#6B6B6B' }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#1A0A2E' }}>Continue as Guest</p>
                  <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>No account needed — checkout in minutes</p>
                </div>
                <ChevronRight size={16} className="flex-shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" />
              </button>
            </div>

            {/* In-store note */}
            <div
              className="mt-6 p-4 flex items-start gap-3 text-sm"
              style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2px' }}
            >
              <Store size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
              <p style={{ color: '#6B4A1E' }}>
                Prefer to pick up in person? Choose <strong>Store Pickup</strong> during checkout — your order will be ready in 2 hours at our Dubai Mall store.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── GUEST INFO ── */}
        {flow === 'guest-info' && (
          <motion.div
            key="guest-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={() => setFlow('gate')} className="flex items-center gap-1 text-xs mb-6 hover:opacity-70 transition-opacity" style={{ color: '#A89880' }}>
              ← Back
            </button>
            <GuestInfoStep onNext={handleGuestInfo} />
          </motion.div>
        )}

        {/* ── STEPS 1–3 ── */}
        {(flow === 1 || flow === 2 || flow === 3) && (
          <motion.div
            key="steps"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fulfillment badge */}
            {flow !== 1 && (
              <div
                className="flex items-center gap-2 px-4 py-2 mb-5 text-xs font-semibold"
                style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                {fulfillment === 'pickup'
                  ? <><Store size={13} style={{ color: '#C9A84C' }} /> Store Pickup — Dubai Mall</>
                  : <><Truck size={13} style={{ color: '#C9A84C' }} /> Home Delivery</>}
              </div>
            )}

            <CheckoutStepper currentStep={flow as 1 | 2 | 3} />

            {flow === 1 && (
              <AddressStep
                onNext={(addr, method) => {
                  setAddress(addr);
                  setFulfillment(method);
                  setFlow(2);
                }}
              />
            )}
            {flow === 2 && (
              <PaymentStep
                onNext={(method) => { setPaymentMethod(method); setFlow(3); }}
                onBack={() => setFlow(1)}
              />
            )}
            {flow === 3 && (
              <ReviewStep
                address={address}
                paymentMethod={paymentMethod}
                fulfillmentMethod={fulfillment}
                onBack={() => setFlow(2)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
