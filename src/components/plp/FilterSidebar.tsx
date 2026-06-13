'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  ProductFilters,
  AvailableProductFilters,
  FilterOption,
} from '@/lib/hooks/useProducts';
import {
  FILTER_SECTIONS,
  GENDER_LABELS,
  SEASON_LABELS,
  DAY_NIGHT_LABELS,
  countActiveSidebarFilters,
  type SidebarFilterKey,
} from '@/lib/plp/productFilterConfig';
import { PriceRangeFilter } from '@/components/plp/PriceRangeFilter';

interface FilterSidebarProps {
  filters: ProductFilters;
  availableFilters: AvailableProductFilters;
  onFilterChange: <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => void;
  onClearAll: () => void;
  hideFilterKeys?: SidebarFilterKey[];
}

function getOptionsForKey(
  key: SidebarFilterKey,
  available: AvailableProductFilters
): FilterOption[] {
  switch (key) {
    case 'categories':
      return available.categories;
    case 'brands':
      return available.brands;
    case 'genders':
      return available.genders;
    case 'concentrations':
      return available.concentrations;
    case 'sizes':
      return available.sizes;
    case 'seasons':
      return available.seasons;
    case 'dayNight':
      return available.dayNight;
    default:
      return [];
  }
}

function getOptionLabel(key: SidebarFilterKey, value: string): string {
  if (key === 'genders') return GENDER_LABELS[value] ?? value;
  if (key === 'seasons') return SEASON_LABELS[value] ?? value;
  if (key === 'dayNight') return DAY_NIGHT_LABELS[value] ?? value;
  if (key === 'sizes') return `${value} ml`;
  return value;
}

export function FilterSidebar({
  filters,
  availableFilters,
  onFilterChange,
  onClearAll,
  hideFilterKeys = [],
}: FilterSidebarProps) {
  const visibleSections = FILTER_SECTIONS.filter(
    (s) => !hideFilterKeys.includes(s.filterKey)
  );
  const defaultOpen = new Set(
    visibleSections.filter((s) => s.defaultOpen).map((s) => s.id)
  );
  const [openSections, setOpenSections] = useState<Set<string>>(defaultOpen);

  const activeCount = countActiveSidebarFilters(filters);

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleArrayFilter(key: SidebarFilterKey, value: string) {
    const current = (filters[key] as string[] | undefined) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange(key, next.length ? next : undefined);
  }

  function toggleSizeFilter(sizeMl: number) {
    const current = filters.sizes ?? [];
    const next = current.includes(sizeMl)
      ? current.filter((s: number) => s !== sizeMl)
      : [...current, sizeMl];
    onFilterChange('sizes', next.length ? next : undefined);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--color-amoria-text)' }}>
          Filters
        </h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-amoria-primary)' }}
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-1">
        {visibleSections.map((section) => {
          if (section.type === 'toggle') {
            const checked = Boolean(filters[section.filterKey]);
            return (
              <label
                key={section.id}
                className="flex items-center justify-between py-3 border-b cursor-pointer"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              >
                <span className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>
                  {section.label}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    onFilterChange(section.filterKey, e.target.checked ? true : undefined)
                  }
                  className="accent-[var(--color-amoria-primary)]"
                />
              </label>
            );
          }

          if (section.type === 'range') {
            const isOpen = openSections.has(section.id);
            return (
              <div key={section.id} className="border-b" style={{ borderColor: 'var(--color-amoria-border)' }}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-3 text-sm font-medium"
                  style={{ color: 'var(--color-amoria-text)' }}
                >
                  {section.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--color-amoria-text-muted)' }}
                  />
                </button>
                {isOpen && (
                  <div className="pb-3">
                    <PriceRangeFilter
                      bounds={availableFilters.priceBounds}
                      value={filters.priceRange}
                      onChange={(range) => onFilterChange('priceRange', range)}
                    />
                  </div>
                )}
              </div>
            );
          }

          if (section.type === 'radio' && section.filterKey === 'minRating') {
            const isOpen = openSections.has(section.id);
            const ratings = [4, 3, 2, 1];
            return (
              <div key={section.id} className="border-b" style={{ borderColor: 'var(--color-amoria-border)' }}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-3 text-sm font-medium"
                  style={{ color: 'var(--color-amoria-text)' }}
                >
                  {section.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--color-amoria-text-muted)' }}
                  />
                </button>
                {isOpen && (
                  <div className="pb-3 space-y-2">
                    {ratings.map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="minRating"
                          checked={filters.minRating === r}
                          onChange={() => onFilterChange('minRating', r)}
                          className="accent-[var(--color-amoria-primary)]"
                        />
                        <span className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>
                          {r}+ stars
                        </span>
                      </label>
                    ))}
                    {filters.minRating != null && (
                      <button
                        type="button"
                        onClick={() => onFilterChange('minRating', undefined)}
                        className="text-xs"
                        style={{ color: 'var(--color-amoria-primary)' }}
                      >
                        Any rating
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          }

          const options = getOptionsForKey(section.filterKey, availableFilters);
          if (options.length === 0 && section.type === 'checkbox') return null;

          const isOpen = openSections.has(section.id);
          const selected =
            section.filterKey === 'sizes'
              ? (filters.sizes ?? []).map(String)
              : ((filters[section.filterKey] as string[] | undefined) ?? []);

          return (
            <div key={section.id} className="border-b" style={{ borderColor: 'var(--color-amoria-border)' }}>
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between py-3 text-sm font-medium"
                style={{ color: 'var(--color-amoria-text)' }}
              >
                {section.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--color-amoria-text-muted)' }}
                />
              </button>
              {isOpen && (
                <div className="pb-3 space-y-2 max-h-48 overflow-y-auto">
                  {options.map((opt) => {
                    const isChecked = selected.includes(opt.value);
                    const disabled = opt.count === 0 && !isChecked;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center justify-between gap-2 cursor-pointer ${disabled ? 'opacity-40' : ''}`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={disabled}
                            onChange={() => {
                              if (section.filterKey === 'sizes') {
                                toggleSizeFilter(Number(opt.value));
                              } else {
                                toggleArrayFilter(section.filterKey, opt.value);
                              }
                            }}
                            className="accent-[var(--color-amoria-primary)] shrink-0"
                          />
                          <span className="text-sm truncate" style={{ color: 'var(--color-amoria-text)' }}>
                            {opt.label}
                          </span>
                        </span>
                        <span className="text-xs shrink-0" style={{ color: 'var(--color-amoria-text-muted)' }}>
                          {opt.count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
