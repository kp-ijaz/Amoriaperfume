'use client';

import { useState, type ReactNode } from 'react';
import {
  useProducts,
  ProductFilters,
} from '@/lib/hooks/useProducts';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { MobileFilterSheet } from '@/components/plp/MobileFilterSheet';
import { SortDropdown } from '@/components/plp/SortDropdown';
import { ActiveFilters } from '@/components/plp/ActiveFilters';
import { GridListToggle } from '@/components/plp/GridListToggle';
import { ProductGrid } from '@/components/product/ProductGrid';
import type { SidebarFilterKey } from '@/lib/plp/productFilterConfig';

export type ProductListingShellProps = {
  hero: ReactNode | null;
  initialFilters?: ProductFilters;
  lockedFilters?: ProductFilters;
  hideFilterKeys?: SidebarFilterKey[];
  hideChipKeys?: (keyof ProductFilters)[];
  countLabel?: (count: number) => string;
  onRemoveFilter?: (key: keyof ProductFilters, value?: string) => void;
  onClearAll?: () => void;
  children?: ReactNode;
  contentClassName?: string;
};

export function ProductListingShell({
  hero,
  initialFilters = {},
  lockedFilters = {},
  hideFilterKeys = [],
  hideChipKeys = [],
  countLabel,
  onRemoveFilter: onRemoveFilterProp,
  onClearAll: onClearAllProp,
  children,
  contentClassName = 'py-8',
}: ProductListingShellProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const {
    products,
    totalCount,
    hasMore,
    isLoading,
    filters,
    availableFilters,
    sortBy,
    updateFilter,
    clearFilters,
    setSortBy,
    loadMore,
  } = useProducts(initialFilters, { lockedFilters });

  function handleRemoveFilter(key: keyof ProductFilters, value?: string) {
    if (key === 'productIds') {
      updateFilter('productIds', undefined);
      onRemoveFilterProp?.(key, value);
      return;
    }
    const current = filters[key];
    if (Array.isArray(current) && value) {
      updateFilter(key, current.filter((v) => String(v) !== value) as ProductFilters[typeof key]);
    } else {
      updateFilter(key, undefined);
    }
    onRemoveFilterProp?.(key, value);
  }

  function handleClearAll() {
    clearFilters();
    onClearAllProp?.();
  }

  const displayCountText = countLabel
    ? countLabel(totalCount)
    : `${totalCount} ${totalCount === 1 ? 'Product' : 'Products'}`;

  return (
    <div>
      {hero}

      <div className={`max-w-7xl mx-auto px-4 ${contentClassName}`}>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <MobileFilterSheet
                filters={filters}
                availableFilters={availableFilters}
                onFilterChange={updateFilter}
                onClearAll={handleClearAll}
                hideFilterKeys={hideFilterKeys}
              />
            </div>
            <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-amoria-text)' }}>
                {displayCountText}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown value={sortBy} onChange={setSortBy} />
            <GridListToggle view={view} onChange={setView} />
          </div>
        </div>

        <ActiveFilters
          filters={filters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
          hideChipKeys={hideChipKeys}
        />

        <div className="flex gap-8">
          <aside className="hidden lg:block w-60 shrink-0">
            <FilterSidebar
              filters={filters}
              availableFilters={availableFilters}
              onFilterChange={updateFilter}
              onClearAll={handleClearAll}
              hideFilterKeys={hideFilterKeys}
            />
          </aside>

          <div className="flex-1">
            <ProductGrid
              products={products}
              columns={view === 'list' ? 2 : 4}
              showSkeleton={isLoading}
            />

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="px-10 py-3 text-sm font-medium border hover:bg-gray-50 transition-colors"
                  style={{
                    borderColor: 'var(--color-amoria-primary)',
                    color: 'var(--color-amoria-primary)',
                  }}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
