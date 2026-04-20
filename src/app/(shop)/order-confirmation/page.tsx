'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function generateOrderNumber() {
  return `AMR-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function OrderConfirmationPage() {
  const orderNumber = generateOrderNumber();

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e' }}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        >
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
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
        >
          Order Placed Successfully!
        </h1>
        <p className="text-base mb-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Order #{orderNumber}
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Estimated Delivery: 3–5 business days
        </p>

        <div
          className="p-4 mb-6 border text-sm"
          style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: 'var(--color-amoria-surface-2, #F5F2EE)' }}
        >
          <p style={{ color: 'var(--color-amoria-text)' }}>
            ✓ You&apos;ll receive a WhatsApp &amp; email confirmation shortly
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="px-6 py-3 text-sm font-semibold border"
            style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}
          >
            Track Your Order
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
