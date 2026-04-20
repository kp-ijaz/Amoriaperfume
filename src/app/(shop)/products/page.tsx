'use client';

import { useState } from 'react';
import { useProducts, ProductFilters } from '@/lib/hooks/useProducts';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { MobileFilterSheet } from '@/components/plp/MobileFilterSheet';
import { SortDropdown } from '@/components/plp/SortDropdown';
import { ActiveFilters } from '@/components/plp/ActiveFilters';
import { GridListToggle } from '@/components/plp/GridListToggle';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function ProductsPage() {
  const {
    products,
    totalCount,
    hasMore,
    filters,
    sortBy,
    setFilters,
    updateFilter,
    clearFilters,
    setSortBy,
    loadMore,
  } = useProducts();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  function handleRemoveFilter(key: keyof ProductFilters, value?: string) {
    const current = filters[key];
    if (Array.isArray(current) && value) {
      updateFilter(key, current.filter((v) => v !== value) as ProductFilters[typeof key]);
    } else {
      updateFilter(key, undefined);
    }
  }

  return (
    <div>
      {/* Hero banner */}
      <div
        className="py-10 px-4 text-center"
        style={{ backgroundColor: 'var(--color-amoria-primary)' }}
      >
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--color-amoria-accent)' }}>
          Amoria Collection
        </p>
        <h1
          className="text-3xl md:text-4xl font-light text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          All Fragrances
        </h1>
        <p className="text-white/60 text-sm mt-2">
          Discover {totalCount} authentic Arabian perfumes
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Mobile filters */}
            <div className="lg:hidden">
              <MobileFilterSheet
                filters={filters}
                onFilterChange={updateFilter}
                onClearAll={clearFilters}
              />
            </div>
            <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-amoria-text)' }}>{totalCount}</span> Products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown value={sortBy} onChange={setSortBy} />
            <GridListToggle view={view} onChange={setView} />
          </div>
        </div>

        {/* Active filters */}
        <ActiveFilters
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={clearFilters}
        />

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilter}
              onClearAll={clearFilters}
            />
          </aside>

          {/* Products */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              columns={view === 'list' ? 2 : 4}
            />

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMore}
                  className="px-10 py-3 text-sm font-medium border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--color-amoria-primary)', color: 'var(--color-amoria-primary)' }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
