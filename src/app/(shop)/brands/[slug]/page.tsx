'use client';

import { use, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useBrandBySlug } from '@/lib/hooks/useApiBrands';
import { ProductListingShell } from '@/components/plp/ProductListingShell';

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: brand, isLoading: brandLoading } = useBrandBySlug(slug);

  const lockedFilters = useMemo(() => ({ brandSlug: slug }), [slug]);
  const initialFilters = useMemo(() => ({ brandSlug: slug }), [slug]);

  if (!brandLoading && !brand) return notFound();

  return (
    <ProductListingShell
      initialFilters={initialFilters}
      lockedFilters={lockedFilters}
      hideFilterKeys={['brands']}
      hideChipKeys={['brandSlug']}
      hero={
        <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
          <nav
            className="flex items-center justify-center gap-2 text-xs mb-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <Link href="/" className="hover:opacity-80">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:opacity-80">
              Brands
            </Link>
            <span>/</span>
            <span className="text-white">{brand?.name ?? slug}</span>
          </nav>
          <h1
            className="text-3xl md:text-5xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {brandLoading ? <span className="opacity-50">Loading…</span> : brand?.name}
          </h1>
          {brand?.description && (
            <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto">{brand.description}</p>
          )}
        </div>
      }
    />
  );
}
