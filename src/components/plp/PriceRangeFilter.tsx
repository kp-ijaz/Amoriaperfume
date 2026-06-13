'use client';

import { useEffect, useState } from 'react';
import type { ApiProductFilters } from '@/lib/hooks/useApiProducts';

type PriceRangeFilterProps = {
  bounds: { min: number; max: number };
  value?: { min: number; max: number };
  onChange: (range: { min: number; max: number } | undefined) => void;
};

export function PriceRangeFilter({ bounds, value, onChange }: PriceRangeFilterProps) {
  const [minVal, setMinVal] = useState(value?.min ?? bounds.min);
  const [maxVal, setMaxVal] = useState(value?.max ?? bounds.max);

  useEffect(() => {
    setMinVal(value?.min ?? bounds.min);
    setMaxVal(value?.max ?? bounds.max);
  }, [value, bounds.min, bounds.max]);

  const rangeMin = bounds.min;
  const rangeMax = Math.max(bounds.max, bounds.min + 1);

  function applyRange() {
    const lo = Math.max(rangeMin, Math.min(minVal, maxVal));
    const hi = Math.min(rangeMax, Math.max(minVal, maxVal));
    if (lo <= rangeMin && hi >= rangeMax) {
      onChange(undefined);
    } else {
      onChange({ min: lo, max: hi });
    }
  }

  function handleMinInput(v: number) {
    setMinVal(v);
  }

  function handleMaxInput(v: number) {
    setMaxVal(v);
  }

  const isActive =
    value != null && (value.min > rangeMin || value.max < rangeMax);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Min
          </span>
          <input
            type="number"
            min={rangeMin}
            max={rangeMax}
            value={minVal}
            onChange={(e) => handleMinInput(Number(e.target.value))}
            onBlur={applyRange}
            className="w-full px-2 py-1.5 text-sm border rounded"
            style={{ borderColor: 'var(--color-amoria-border)' }}
          />
        </label>
        <span className="text-xs mt-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
          –
        </span>
        <label className="flex-1">
          <span className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Max
          </span>
          <input
            type="number"
            min={rangeMin}
            max={rangeMax}
            value={maxVal}
            onChange={(e) => handleMaxInput(Number(e.target.value))}
            onBlur={applyRange}
            className="w-full px-2 py-1.5 text-sm border rounded"
            style={{ borderColor: 'var(--color-amoria-border)' }}
          />
        </label>
      </div>

      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        value={maxVal}
        onChange={(e) => {
          const v = Number(e.target.value);
          setMaxVal(v);
          const lo = Math.max(rangeMin, Math.min(minVal, v));
          const hi = v;
          if (lo <= rangeMin && hi >= rangeMax) {
            onChange(undefined);
          } else {
            onChange({ min: lo, max: hi });
          }
        }}
        className="w-full accent-[var(--color-amoria-primary)]"
      />

      <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
        {isActive
          ? `AED ${value!.min} – ${value!.max}`
          : `AED ${rangeMin} – ${rangeMax}`}
      </p>
    </div>
  );
}

export type { ApiProductFilters };
