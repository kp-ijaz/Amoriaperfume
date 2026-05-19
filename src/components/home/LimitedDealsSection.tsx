'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCountdown } from '@/lib/hooks/useCountdown';
import { ProductCard } from '@/components/product/ProductCard';
import { useHomeSlotProducts, usePublicCoverImages } from '@/lib/hooks/usePublicCms';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="w-14 h-14 flex items-center justify-center text-2xl font-semibold tabular-nums"
        style={{
          fontFamily: 'var(--font-heading)',
          color: '#1A0A2E',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E3DC',
          letterSpacing: '-0.02em',
        }}
        key={value}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="text-[9px] uppercase tracking-[0.18em] mt-1.5 font-medium" style={{ color: '#A89880' }}>
        {label}
      </span>
    </motion.div>
  );
}

export function LimitedDealsSection() {
  const { hours, minutes, seconds } = useCountdown();
  const { data, isLoading } = useHomeSlotProducts('home-limited-offers', {
    limit: 5,
    limitedOffer: true,
  });
  const dealProducts = data?.products ?? [];
  const sectionTitle = data?.title?.trim() || 'Limited Offers';
  const sectionSubtitle = data?.subtitle?.trim() || 'Today Only';
  const { data: flashHeaders = [] } = usePublicCoverImages('flash_banner');
  const flashHeader = flashHeaders[0];

  if (!isLoading && dealProducts.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#F5F2EE', borderTop: '1px solid #E8E3DC', borderBottom: '1px solid #E8E3DC' }}
    >
      {flashHeader?.imageUrl ? (
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${flashHeader.imageUrl})` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.07 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      ) : null}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p
              className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-2"
              style={{ color: '#C9A84C' }}
            >
              {sectionSubtitle}
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
              {flashHeader?.title?.trim() || sectionTitle}
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <motion.div
                className="h-[2px] w-12"
                style={{ backgroundColor: 'rgba(201,168,76,0.8)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <svg width="6" height="6" viewBox="0 0 6 6">
                <polygon points="3,0 6,3 3,6 0,3" fill="rgba(201,168,76,0.8)" />
              </svg>
              <div className="h-px w-8" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />
            </motion.div>
          </motion.div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <p className="text-[10px] uppercase tracking-[0.18em] font-medium" style={{ color: '#A89880' }}>
              Ends tonight at midnight
            </p>
            <div className="flex items-end gap-2">
              <TimeUnit value={hours} label="Hrs" />
              <span className="text-xl font-light mb-3.5" style={{ color: '#C9A84C' }}>:</span>
              <TimeUnit value={minutes} label="Min" />
              <span className="text-xl font-light mb-3.5" style={{ color: '#C9A84C' }}>:</span>
              <TimeUnit value={seconds} label="Sec" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-sm"
                  style={{ backgroundColor: 'rgba(26,10,46,0.06)' }}
                />
              ))
            : dealProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/products?limitedOffer=true"
            className="group inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] uppercase border-b pb-0.5 transition-all hover:gap-4 duration-300"
            style={{ color: '#1A0A2E', borderColor: 'rgba(26,10,46,0.25)' }}
          >
            View All Deals
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path
                d="M0 5h14M10 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
