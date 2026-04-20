'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
  showSkeleton?: boolean;
  theme?: 'light' | 'dark';
  sectionNumber?: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  showSkeleton = false,
  theme = 'light',
  sectionNumber = '01',
}: ProductSectionProps) {
  const isDark = theme === 'dark';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: isDark ? '#0D0A08' : '#FAFAF8',
        paddingTop: '5rem',
        paddingBottom: '6rem',
      }}
    >
      {/* ── Background treatments ─────────────────── */}
      {isDark ? (
        <>
          {/* Subtle arabesque tile */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.022]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id={`ps-dark-${sectionNumber}`} width="90" height="90" patternUnits="userSpaceOnUse">
                  <polygon points="45,3 87,24 87,66 45,87 3,66 3,24" fill="none" stroke="#C9A84C" strokeWidth="0.6" />
                  <circle cx="45" cy="45" r="8" fill="none" stroke="#C9A84C" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#ps-dark-${sectionNumber})`} />
            </svg>
          </div>
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)' }} />
          <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)' }} />
          {/* Corner orbs */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at top left, rgba(201,168,76,0.04) 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(26,10,46,0.3) 0%, transparent 65%)' }} />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: '#E8E3DC' }} />
          <div className="absolute bottom-0 left-0 w-full h-px" style={{ backgroundColor: '#E8E3DC' }} />
        </>
      )}


<div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">

        {/* ── Section header ─────────────────────── */}
        <div className="flex items-end justify-between mb-14 md:mb-18 gap-6">

          {/* Left — heading block */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1"
          >
            <p
              className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-2"
              style={{ color: isDark ? 'rgba(201,168,76,0.6)' : '#C9A84C' }}
            >
              {subtitle ?? (isDark ? 'Most Loved' : 'Just Landed')}
            </p>

            <h2
              className="font-light leading-none"
              style={{
                fontFamily: 'var(--font-heading)',
                color: isDark ? '#FFFFFF' : '#1A0A2E',
                letterSpacing: '0.03em',
                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              }}
            >
              {title}
            </h2>

            {/* Left-aligned gold accent line */}
            <div className="flex items-center gap-3 mt-4">
              <div className="h-[2px] w-12" style={{ background: isDark ? '#C9A84C' : 'rgba(201,168,76,0.8)' }} />
              <svg width="6" height="6" viewBox="0 0 6 6">
                <polygon points="3,0 6,3 3,6 0,3" fill={isDark ? '#C9A84C' : 'rgba(201,168,76,0.8)'} />
              </svg>
              <div className="h-px w-8 opacity-40" style={{ backgroundColor: isDark ? '#C9A84C' : '#C9A84C' }} />
            </div>
          </motion.div>

          {/* Right — View All */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0 pb-1"
          >
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-2.5 text-[11px] font-bold tracking-[0.22em] uppercase transition-all duration-300 border-b pb-0.5 hover:gap-4"
              style={{
                color: isDark ? 'rgba(201,168,76,0.75)' : '#1A0A2E',
                borderColor: isDark ? 'rgba(201,168,76,0.3)' : 'rgba(26,10,46,0.25)',
              }}
            >
              View All
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* ── Product grid ──────────────────────── */}
        <ProductGrid products={products} showSkeleton={showSkeleton} />
      </div>
    </section>
  );
}
