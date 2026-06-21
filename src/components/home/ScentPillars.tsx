'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HOME_PRODUCTS_PER_ROW, useHomeSlotProducts } from '@/lib/hooks/usePublicCms';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/loading';

export function BrandInspirations() {
  const { data: slotData, isLoading } = useHomeSlotProducts('home-scent-pillars', {
    limit: HOME_PRODUCTS_PER_ROW,
    brandInspiration: true,
  });
  const apiProducts = (slotData?.products ?? []).slice(0, HOME_PRODUCTS_PER_ROW);

  if (!isLoading && apiProducts.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#F2ECE3', paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p
            className="text-lg md:text-xl tracking-[0.22em] uppercase font-semibold mb-4"
            style={{ color: '#C9A84C' }}
          >
            Brand Inspirations
          </p>
          <h2
            className="font-light"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#1A0A2E',
              fontSize: 'clamp(3rem, 5vw, 4rem)',
              letterSpacing: '0.03em',
            }}
          >
            {slotData?.title || 'Scents'}{' '}
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>
              {slotData?.subtitle || "You'll Love"}
            </em>
          </h2>

          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.7" />
              <circle cx="5" cy="5" r="1.5" fill="#C9A84C" fillOpacity="0.6" />
            </svg>
            <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
          </div>
        </motion.div>

        {isLoading ? (
          <ProductCardSkeleton count={HOME_PRODUCTS_PER_ROW} columns={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {apiProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex justify-center mt-12"
          >
            <Link
              href="/products?brandInspiration=true"
              className="inline-flex items-center justify-center px-10 py-3 text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 border border-[#1A0A2E] text-[#1A0A2E] hover:bg-[#1A0A2E] hover:text-white hover:border-[#1A0A2E]"
            >
              View All
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
