'use client';

import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useBrandBySlug } from '@/lib/hooks/useApiBrands';
import { ProductListingShell } from '@/components/plp/ProductListingShell';
import type { Brand } from '@/types/product';

export function BrandPageClient({
  slug,
  initialBrand,
}: {
  slug: string;
  initialBrand?: Brand;
}) {
  const { data: fetchedBrand, isLoading: brandLoading } = useBrandBySlug(slug);
  const brand = fetchedBrand ?? initialBrand;

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
            <Link href="/brands" className="hover:opacity-80">
              Brands
            </Link>
            <span>/</span>
            <span className="text-white">{brand?.name ?? slug}</span>
          </nav>
          <h1
            className="text-3xl md:text-5xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {brandLoading && !initialBrand ? (
              <span className="opacity-50">Loading…</span>
            ) : (
              brand?.name
            )}
          </h1>
          {brand?.description && (
            <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto">{brand.description}</p>
          )}
        </div>
      }
    />
  );
}
