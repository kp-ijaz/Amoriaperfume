'use client';

import { X } from 'lucide-react';
import { ProductFilters } from '@/lib/hooks/useProducts';

interface ActiveFiltersProps {
  filters: ProductFilters;
  onRemove: (key: keyof ProductFilters, value?: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const chips: { key: keyof ProductFilters; value: string; label: string }[] = [];

  if (filters.categories?.length) {
    filters.categories.forEach((v) => chips.push({ key: 'categories', value: v, label: v }));
  }
  if (filters.brands?.length) {
    filters.brands.forEach((v) => chips.push({ key: 'brands', value: v, label: v }));
  }
  if (filters.genders?.length) {
    filters.genders.forEach((v) => chips.push({ key: 'genders', value: v, label: v }));
  }
  if (filters.concentrations?.length) {
    filters.concentrations.forEach((v) => chips.push({ key: 'concentrations', value: v, label: v }));
  }
  if (filters.fragranceFamilies?.length) {
    filters.fragranceFamilies.forEach((v) => chips.push({ key: 'fragranceFamilies', value: v, label: v }));
  }
  if (filters.discountOnly) {
    chips.push({ key: 'discountOnly', value: 'true', label: 'On Sale' });
  }
  if (filters.limitedOffer) {
    chips.push({ key: 'limitedOffer', value: 'true', label: 'Limited offers' });
  }
  if (filters.featured) {
    chips.push({ key: 'featured', value: 'true', label: 'Featured' });
  }
  if (filters.bestSeller) {
    chips.push({ key: 'bestSeller', value: 'true', label: 'Best sellers' });
  }
  if (filters.trending) {
    chips.push({ key: 'trending', value: 'true', label: 'Trending' });
  }
  if (filters.newArrival) {
    chips.push({ key: 'newArrival', value: 'true', label: 'New arrivals' });
  }
  if (filters.serverSort === 'most_viewed') {
    chips.push({ key: 'serverSort', value: 'most_viewed', label: 'Most viewed' });
  }
  if (filters.minRating) {
    chips.push({ key: 'minRating', value: String(filters.minRating), label: `${filters.minRating}+ Stars` });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      {chips.map((chip) => (
        <span
          key={`${chip.key}-${chip.value}`}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-full"
          style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)', backgroundColor: 'rgba(201,168,76,0.1)' }}
        >
          {chip.label}
          <button
            onClick={() => onRemove(chip.key, chip.value)}
            className="hover:opacity-70"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs font-medium hover:opacity-80"
        style={{ color: 'var(--color-amoria-text-muted)' }}
      >
        Clear All
      </button>
    </div>
  );
}
