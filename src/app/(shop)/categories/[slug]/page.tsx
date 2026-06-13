'use client';

import { use, useMemo } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useCategoryBySlug } from '@/lib/hooks/useApiCategories';
import { ProductListingShell } from '@/components/plp/ProductListingShell';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: category, isLoading: catLoading } = useCategoryBySlug(slug);

  const lockedFilters = useMemo(() => ({ categorySlug: slug }), [slug]);
  const initialFilters = useMemo(() => ({ categorySlug: slug }), [slug]);

  if (!catLoading && !category) return notFound();

  return (
    <ProductListingShell
      initialFilters={initialFilters}
      lockedFilters={lockedFilters}
      hideFilterKeys={['categories']}
      hideChipKeys={['categorySlug']}
      hero={
        <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
          <nav
            className="flex items-center justify-center gap-2 text-xs mb-3"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <Link href="/" className="hover:opacity-80 text-white/50">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">{category?.name ?? slug}</span>
          </nav>
          <h1
            className="text-3xl md:text-4xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {catLoading ? <span className="opacity-50">Loading…</span> : category?.name}
          </h1>
          {category?.description && (
            <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">{category.description}</p>
          )}
        </div>
      }
    />
  );
}
