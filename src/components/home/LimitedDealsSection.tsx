'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { getSaleProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/product/ProductCard';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-14 h-14 flex items-center justify-center text-2xl font-semibold tabular-nums"
        style={{
          fontFamily: 'var(--font-heading)',
          color: '#1A0A2E',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E3DC',
          letterSpacing: '-0.02em',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[9px] uppercase tracking-[0.18em] mt-1.5 font-medium" style={{ color: '#A89880' }}>
        {label}
      </span>
    </div>
  );
}

export function LimitedDealsSection() {
  const { hours, minutes, seconds } = useCountdown();
  const dealProducts = getSaleProducts().slice(0, 4);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#F5F2EE', borderTop: '1px solid #E8E3DC', borderBottom: '1px solid #E8E3DC' }}
    >

<div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">

        {/* ── Header row ──────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">

          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-2"
              style={{ color: '#C9A84C' }}
            >
              Today Only
            </p>
            <h2
              className="font-light leading-none"
              style={{
                fontFamily: 'var(--font-heading)',
                color: '#1A0A2E',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                letterSpacing: '0.03em',
              }}
            >
              Limited Offers
            </h2>
            {/* Left-aligned gold accent */}
            <div className="flex items-center gap-3 mt-4">
              <div className="h-[2px] w-12" style={{ backgroundColor: 'rgba(201,168,76,0.8)' }} />
              <svg width="6" height="6" viewBox="0 0 6 6">
                <polygon points="3,0 6,3 3,6 0,3" fill="rgba(201,168,76,0.8)" />
              </svg>
              <div className="h-px w-8" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
            </div>
          </motion.div>

          {/* Right — countdown + ends note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-start sm:items-end gap-2"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: '#A89880' }}>
              Ends tonight at midnight
            </p>
            <div className="flex items-end gap-2">
              <TimeUnit value={hours} label="Hrs" />
              <span className="text-xl font-light mb-3.5" style={{ color: '#C9A84C' }}>:</span>
              <TimeUnit value={minutes} label="Min" />
              <span className="text-xl font-light mb-3.5" style={{ color: '#C9A84C' }}>:</span>
              <TimeUnit value={seconds} label="Sec" />
            </div>
          </motion.div>
        </div>

        {/* ── Product grid ─────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {dealProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* ── View all link ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/products?sale=true"
            className="group inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] uppercase border-b pb-0.5 transition-all hover:gap-4 duration-300"
            style={{ color: '#1A0A2E', borderColor: 'rgba(26,10,46,0.25)' }}
          >
            View All Deals
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
