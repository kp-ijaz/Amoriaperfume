'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FilterSidebar } from './FilterSidebar';
import { ProductFilters } from '@/lib/hooks/useProducts';

interface MobileFilterSheetProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: ProductFilters[typeof key]) => void;
  onClearAll: () => void;
}

export function MobileFilterSheet({ filters, onFilterChange, onClearAll }: MobileFilterSheetProps) {
  const activeCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== false
  ).length;

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
            onFilterChange={onFilterChange}
            onClearAll={onClearAll}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
