'use client';

import { X } from 'lucide-react';
import { ProductFilters } from '@/lib/hooks/useProducts';
import {
  CHIP_LABELS,
  GENDER_LABELS,
  SEASON_LABELS,
  DAY_NIGHT_LABELS,
  LOCKED_SCOPE_KEYS,
  SIDEBAR_FILTER_KEYS,
  countActiveSidebarFilters,
} from '@/lib/plp/productFilterConfig';

interface ActiveFiltersProps {
  filters: ProductFilters;
  onRemove: (key: keyof ProductFilters, value?: string) => void;
  onClearAll: () => void;
  hideChipKeys?: (keyof ProductFilters)[];
}

function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border"
      style={{
        borderColor: 'var(--color-amoria-border)',
        color: 'var(--color-amoria-text)',
        backgroundColor: 'var(--color-amoria-surface)',
      }}
    >
      {label}
      <button type="button" onClick={onRemove} className="hover:opacity-70" aria-label={`Remove ${label}`}>
        <X size={12} />
      </button>
    </span>
  );
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
  hideChipKeys = [],
}: ActiveFiltersProps) {
  const chips: { key: keyof ProductFilters; label: string; value?: string }[] = [];

  for (const key of SIDEBAR_FILTER_KEYS) {
    if (hideChipKeys.includes(key)) continue;
    const value = filters[key];
    const groupLabel = CHIP_LABELS[key] ?? key;

    if (Array.isArray(value)) {
      for (const v of value) {
        let display = v;
        if (key === 'genders') display = GENDER_LABELS[v] ?? v;
        if (key === 'seasons') display = SEASON_LABELS[v] ?? v;
        if (key === 'dayNight') display = DAY_NIGHT_LABELS[v] ?? v;
        if (key === 'sizes') display = `${v} ml`;
        chips.push({ key, label: `${groupLabel}: ${display}`, value: String(v) });
      }
    } else if (key === 'priceRange' && value && typeof value === 'object' && 'min' in value) {
      chips.push({ key, label: `Price: AED ${value.min} – ${value.max}` });
    } else if (key === 'minRating' && value != null) {
      chips.push({ key, label: `Rating: ${value}+ stars` });
    } else if ((key === 'discountOnly' || key === 'inStockOnly') && value) {
      chips.push({ key, label: CHIP_LABELS[key] ?? key });
    }
  }

  for (const key of LOCKED_SCOPE_KEYS) {
    if (hideChipKeys.includes(key)) continue;
    if (SIDEBAR_FILTER_KEYS.includes(key as (typeof SIDEBAR_FILTER_KEYS)[number])) continue;

    const value = filters[key];
    if (value === undefined || value === false) continue;

    if (key === 'productIds' && Array.isArray(value) && value.length) {
      chips.push({ key, label: CHIP_LABELS.productIds ?? 'Quiz matches' });
    } else if (key === 'searchQuery' && typeof value === 'string' && value.trim()) {
      chips.push({ key, label: `Search: "${value}"` });
    } else if (key === 'availability' && value === 'online') {
      chips.push({ key, label: CHIP_LABELS.availability ?? 'Online only' });
    } else if (typeof value === 'boolean' && value) {
      chips.push({ key, label: CHIP_LABELS[key] ?? key });
    } else if (key === 'serverSort' && value === 'most_viewed') {
      chips.push({ key, label: CHIP_LABELS.serverSort ?? 'Most viewed' });
    }
  }

  if (chips.length === 0) return null;

  const sidebarCount = countActiveSidebarFilters(filters);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip, i) => (
        <Chip
          key={`${String(chip.key)}-${chip.value ?? i}`}
          label={chip.label}
          onRemove={() => onRemove(chip.key, chip.value)}
        />
      ))}
      {sidebarCount > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs underline hover:opacity-70"
          style={{ color: 'var(--color-amoria-primary)' }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
