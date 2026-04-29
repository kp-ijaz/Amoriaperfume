'use client';

import { AvailableProductFilters, ProductFilters } from '@/lib/hooks/useProducts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterSidebarProps {
  filters: ProductFilters;
  availableFilters: AvailableProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: ProductFilters[typeof key]) => void;
  onClearAll: () => void;
}

function CheckboxGroup<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string; count: number }[];
  selected?: T[];
  onChange: (vals: T[]) => void;
}) {
  function toggle(val: T) {
    const current = selected ?? [];
    if (current.includes(val)) {
      onChange(current.filter((v) => v !== val));
    } else {
      onChange([...current, val]);
    }
  }

  return (
    <div className="space-y-2 pt-1">
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2">
          <Checkbox
            id={opt.value}
            checked={(selected ?? []).includes(opt.value)}
            disabled={opt.count === 0}
            onCheckedChange={() => toggle(opt.value)}
          />
          <Label
            htmlFor={opt.value}
            className={`text-sm font-normal ${opt.count === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            {opt.label} <span className="ml-1 text-xs text-gray-400">({opt.count})</span>
          </Label>
        </div>
      ))}
    </div>
  );
}

export function FilterSidebar({ filters, availableFilters, onFilterChange, onClearAll }: FilterSidebarProps) {
  const activeCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== false
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--color-amoria-primary)' }}>
          Filters {activeCount > 0 && <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--color-amoria-accent)' }}>{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs hover:opacity-80"
            style={{ color: 'var(--color-amoria-accent)' }}
          >
            Clear All
          </button>
        )}
      </div>

      <Accordion multiple defaultValue={['category', 'brand', 'gender']}>
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm py-3">Category</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup
              options={availableFilters.categories}
              selected={filters.categories as string[]}
              onChange={(v) => onFilterChange('categories', v)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm py-3">Brand</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup
              options={availableFilters.brands}
              selected={filters.brands as string[]}
              onChange={(v) => onFilterChange('brands', v)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger className="text-sm py-3">Gender</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup
              options={availableFilters.genders}
              selected={filters.genders as string[]}
              onChange={(v) => onFilterChange('genders', v as ('men' | 'women' | 'unisex')[])}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fragrance">
          <AccordionTrigger className="text-sm py-3">Fragrance Family</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup
              options={availableFilters.fragranceFamilies}
              selected={filters.fragranceFamilies as string[]}
              onChange={(v) => onFilterChange('fragranceFamilies', v)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="concentration">
          <AccordionTrigger className="text-sm py-3">Concentration</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup
              options={availableFilters.concentrations}
              selected={filters.concentrations as string[]}
              onChange={(v) => onFilterChange('concentrations', v)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="discount">
          <AccordionTrigger className="text-sm py-3">Offers</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="discount-only"
                checked={filters.discountOnly ?? false}
                onCheckedChange={(v) => onFilterChange('discountOnly', !!v)}
              />
              <Label htmlFor="discount-only" className="text-sm cursor-pointer font-normal">
                On Sale Only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm py-3">Minimum Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {[4, 3, 2].map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <Checkbox
                    id={`rating-${r}`}
                    checked={filters.minRating === r}
                    onCheckedChange={(v) => onFilterChange('minRating', v ? r : undefined)}
                  />
                  <Label htmlFor={`rating-${r}`} className="text-sm cursor-pointer font-normal">
                    {r}+ Stars
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
