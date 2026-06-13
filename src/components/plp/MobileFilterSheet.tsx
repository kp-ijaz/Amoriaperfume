'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterSidebar } from './FilterSidebar';
import { AvailableProductFilters, ProductFilters } from '@/lib/hooks/useProducts';
import { countActiveSidebarFilters, type SidebarFilterKey } from '@/lib/plp/productFilterConfig';

interface MobileFilterSheetProps {
  filters: ProductFilters;
  availableFilters: AvailableProductFilters;
  onFilterChange: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  onClearAll: () => void;
  hideFilterKeys?: SidebarFilterKey[];
}

export function MobileFilterSheet({
  filters,
  availableFilters,
  onFilterChange,
  onClearAll,
  hideFilterKeys = [],
}: MobileFilterSheetProps) {
  const activeCount = countActiveSidebarFilters(filters);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            className="flex items-center gap-2 px-4 py-2 border text-sm font-medium"
            style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
          />
        }
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeCount > 0 && (
          <span
            className="w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
            style={{ backgroundColor: 'var(--color-amoria-accent)' }}
          >
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <FilterSidebar
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
            hideFilterKeys={hideFilterKeys}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
