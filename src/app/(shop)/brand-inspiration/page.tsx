'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProductFilters } from '@/lib/hooks/useProducts';
import { ProductListingShell } from '@/components/plp/ProductListingShell';

const LOCKED_FILTERS: ProductFilters = { brandInspiration: true };

export default function BrandInspirationPage() {
  const searchParams = useSearchParams();

  const initialFilters = useMemo(
    (): ProductFilters => ({
      ...LOCKED_FILTERS,
      brandSlug: searchParams.get('brand') ?? undefined,
      categorySlug: searchParams.get('category') ?? undefined,
      genders: searchParams.get('gender') ? [searchParams.get('gender')!] : undefined,
      discountOnly: searchParams.get('sale') === 'true' ? true : undefined,
    }),
    [searchParams]
  );

  return (
    <ProductListingShell
      initialFilters={initialFilters}
      lockedFilters={LOCKED_FILTERS}
      hideChipKeys={['brandInspiration']}
      hero={
        <div style={{ backgroundColor: '#FAF8F5' }}>
          <div
            className="relative py-16 px-4 text-center overflow-hidden"
            style={{ backgroundColor: '#0D0A08' }}
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <p
                className="text-xs tracking-[0.35em] uppercase mb-3"
                style={{ color: 'rgba(201,168,76,0.7)' }}
              >
                Heritage & Craft
              </p>
              <h1
                className="text-4xl md:text-5xl font-light text-white mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Brand <em style={{ color: '#C9A84C' }}>Inspiration</em>
              </h1>
              <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Curated fragrances inspired by iconic scent profiles.
              </p>
            </motion.div>
          </div>
        </div>
      }
    />
  );
}
