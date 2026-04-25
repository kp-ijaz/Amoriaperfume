'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Calendar, Clock, MessageCircle, Bell, X, Truck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const searchParams  = useSearchParams();
  const isPickup      = searchParams.get('type') === 'pickup';
  const pickupDate    = searchParams.get('date') ?? '';
  const pickupTime    = searchParams.get('time') ?? '';

  // Read real orderId from ReviewStep redirect; fall back to a placeholder
  const rawOrderId  = searchParams.get('orderId') ?? '';
  const orderNumber = rawOrderId || `AMR-${Math.floor(100000 + Math.random() * 900000)}`;

  // Pickup-ready notification state (simulated after 6 seconds for demo)
  const [showPickupReady, setShowPickupReady] = useState(false);
  const [notifDismissed, setNotifDismissed]   = useState(false);

  useEffect(() => {
    if (!isPickup) return;
    const t = setTimeout(() => setShowPickupReady(true), 6000);
    return () => clearTimeout(t);
  }, [isPickup]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">

      {/* ── Animated checkmark ── */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e' }}
      >
        <motion.svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <motion.path
            d="M8 20L16 28L32 12"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1
          className="text-3xl font-light mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
        >
          Order Placed Successfully!
        </h1>
        <p className="text-base mb-1" style={{ color: '#6B6B6B' }}>
          Order #{orderNumber}
        </p>

        {/* ── Fulfillment summary ── */}
        {isPickup ? (
          <div
            className="mt-5 mb-5 p-4 text-left"
            style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '4px' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Store size={16} style={{ color: '#C9A84C' }} />
              <p className="text-sm font-bold" style={{ color: '#1A0A2E' }}>Store Pickup — Dubai Mall</p>
            </div>

            {(pickupDate || pickupTime) && (
              <div className="flex flex-wrap gap-4 mb-3">
                {pickupDate && (
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6B4A1E' }}>
                    <Calendar size={13} style={{ color: '#C9A84C' }} />
                    <span className="font-semibold">{pickupDate}</span>
                  </div>
                )}
                {pickupTime && (
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: '#6B4A1E' }}>
                    <Clock size={13} style={{ color: '#C9A84C' }} />
                    <span className="font-semibold">{pickupTime}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5 text-xs" style={{ color: '#6B6B6B' }}>
              <p>📍 Dubai Mall, Ground Floor, Perfume Wing — Unit G-47</p>
              <p>🕐 Hours: 10:00 AM – 10:00 PM daily</p>
              <p>📋 Please bring your order number and a valid Emirates ID</p>
            </div>

            {/* WhatsApp notification note */}
            <div
              className="mt-3 flex items-start gap-2 px-3 py-2 text-xs"
              style={{ backgroundColor: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '3px' }}
            >
              <MessageCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#25D366' }} />
              <p style={{ color: '#166534' }}>
                We&apos;ll send a <strong>WhatsApp notification</strong> when your order is ready for pickup.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
            <Truck size={14} className="inline mr-1.5" style={{ color: '#C9A84C' }} />
            Home Delivery
          </p>
        )}

        {/* Standard confirmation note */}
        <div
          className="p-4 mb-6 border text-sm"
          style={{ borderColor: '#E8E3DC', backgroundColor: '#F5F2EE' }}
        >
          <p style={{ color: '#1C1C1C' }}>
            ✓ You&apos;ll receive a WhatsApp &amp; email confirmation shortly
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={isPickup ? '/account/orders' : `/track-order?orderId=${encodeURIComponent(orderNumber)}`}
            className="px-6 py-3 text-sm font-semibold border"
            style={{ borderColor: '#1A0A2E', color: '#1A0A2E' }}
          >
            {isPickup ? 'View Order Details' : 'Track Your Order'}
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 text-sm font-semibold"
            style={{ backgroundColor: '#1A0A2E', color: 'white' }}
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>

      {/* ── Pickup-Ready Notification (simulated after 6s) ── */}
      <AnimatePresence>
        {isPickup && showPickupReady && !notifDismissed && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[199] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotifDismissed(true)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.88, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
              exit={{   opacity: 0, scale: 0.88,  x: '-50%', y: '-50%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[200]"
              style={{
                top: '50%',
                left: '50%',
                width: 'min(400px, calc(100vw - 32px))',
              }}
            >
            <div
              className="relative flex items-start gap-3 p-4 shadow-2xl"
              style={{
                backgroundColor: '#0D0A08',
                border: '1px solid rgba(201,168,76,0.35)',
                borderLeft: '3px solid #C9A84C',
                borderRadius: '6px',
              }}
            >
              {/* Bell pulse icon */}
              <div className="flex-shrink-0 mt-0.5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: 3, duration: 0.4, ease: 'easeInOut' }}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(201,168,76,0.15)' }}
                >
                  <Bell size={18} style={{ color: '#C9A84C' }} />
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-black tracking-[0.15em] uppercase mb-1" style={{ color: '#C9A84C' }}>
                  Order Ready for Pickup!
                </p>
                <p className="text-sm font-medium text-white leading-snug">
                  Your order #{orderNumber} is ready at Dubai Mall.
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Ground Floor, Perfume Wing — Unit G-47
                </p>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/971500000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 text-xs font-bold rounded-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <MessageCircle size={12} />
                  Open WhatsApp Chat
                </a>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => setNotifDismissed(true)}
                className="flex-shrink-0 p-1 rounded-full transition-colors"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>

              {/* Gold shimmer bottom bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px]"
                style={{ backgroundColor: '#C9A84C', borderRadius: '0 0 6px 6px' }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 12, ease: 'linear' }}
              />
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
