'use client';

import { ProductVariant } from '@/types/product';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

export function ProductVariantSelector({ variants, selectedVariant, onSelect }: ProductVariantSelectorProps) {
  const concentrations = [...new Set(variants.map((v) => v.concentration))];
  const sizes = variants.filter((v) => v.concentration === selectedVariant.concentration);

  return (
    <div className="space-y-4">
      {/* Concentration tabs */}
      {concentrations.length > 1 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Concentration
          </p>
          <div className="flex gap-2 flex-wrap">
            {concentrations.map((conc) => {
              const isActive = selectedVariant.concentration === conc;
              return (
                <button
                  key={conc}
                  onClick={() => {
                    const v = variants.find((va) => va.concentration === conc);
                    if (v) onSelect(v);
                  }}
                  className="px-4 py-2 text-sm border transition-all"
                  style={{
                    borderColor: isActive ? 'var(--color-amoria-primary)' : 'var(--color-amoria-border)',
                    backgroundColor: isActive ? 'var(--color-amoria-primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--color-amoria-text)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {conc}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size buttons */}
      {sizes.length > 0 && sizes[0].sizeMl > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Size
          </p>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((v) => {
              const isActive = selectedVariant.id === v.id;
              const outOfStock = v.stock === 0;
              return (
                <button
                  key={v.id}
                  onClick={() => !outOfStock && onSelect(v)}
                  disabled={outOfStock}
                  className="px-4 py-2 text-sm border transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    borderColor: isActive ? 'var(--color-amoria-accent)' : 'var(--color-amoria-border)',
                    backgroundColor: isActive ? 'var(--color-amoria-accent)' : 'transparent',
                    color: isActive ? 'var(--color-amoria-primary)' : 'var(--color-amoria-text)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {v.sizeMl}ml
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
