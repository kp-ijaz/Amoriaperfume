'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseQuizMatchIds } from '@/lib/fragrance-finder/matchProducts';
import { ProductFilters } from '@/lib/hooks/useProducts';
import { ProductListingShell } from '@/components/plp/ProductListingShell';

export function ProductsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizProductIds = useMemo(
    () => parseQuizMatchIds(searchParams.get('quizMatch')),
    [searchParams]
  );

  const initialFilters = useMemo(
    (): ProductFilters => ({
      productIds: quizProductIds,
      searchQuery: searchParams.get('q') ?? searchParams.get('search') ?? undefined,
      collection: searchParams.get('collection') ?? undefined,
      categorySlug: searchParams.get('category') ?? undefined,
      brandSlug: searchParams.get('brand') ?? undefined,
      newArrival: searchParams.get('newArrival') === 'true' ? true : undefined,
      bestSeller: searchParams.get('bestSeller') === 'true' ? true : undefined,
      availability: (() => {
        const v = searchParams.get('availability');
        return v === 'online' || v === 'offline' || v === 'both'
          ? (v as 'online' | 'offline' | 'both')
          : undefined;
      })(),
      trending: searchParams.get('trending') === 'true' ? true : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      limitedOffer: searchParams.get('limitedOffer') === 'true' ? true : undefined,
      brandInspiration: searchParams.get('brandInspiration') === 'true' ? true : undefined,
      discountOnly: searchParams.get('sale') === 'true' ? true : undefined,
      serverSort: searchParams.get('sort') === 'most_viewed' ? ('most_viewed' as const) : undefined,
    }),
    [searchParams, quizProductIds]
  );

  const isQuizResults = Boolean(quizProductIds?.length);
  const searchQuery = initialFilters.searchQuery;

  function handleRemoveFilter(key: keyof ProductFilters, value?: string) {
    if (key === 'productIds') {
      if (searchParams.get('quizMatch')) router.replace('/products');
    }
  }

  function handleClearAll() {
    if (searchParams.get('quizMatch')) router.replace('/products');
  }

  return (
    <ProductListingShell
      initialFilters={initialFilters}
      onRemoveFilter={handleRemoveFilter}
      onClearAll={handleClearAll}
      countLabel={(count) =>
        isQuizResults
          ? `${count} fragrance${count === 1 ? '' : 's'} matched your quiz`
          : `${count} Products`
      }
      hero={
        <div
          className="py-10 px-4 text-center"
          style={{ backgroundColor: 'var(--color-amoria-primary)' }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: 'var(--color-amoria-accent)' }}
          >
            Amoria Collection
          </p>
          <h1
            className="text-3xl md:text-4xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {searchQuery
              ? `Results for "${searchQuery}"`
              : isQuizResults
                ? 'Your Scent Matches'
                : 'All Fragrances'}
          </h1>
          <p className="text-white/60 text-sm mt-2">
            {isQuizResults
              ? 'Fragrances matched to your quiz preferences'
              : 'Discover authentic Arabian perfumes'}
          </p>
        </div>
      }
    />
  );
}
