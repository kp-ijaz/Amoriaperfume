'use client';

import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  showSkeleton?: boolean;
  columns?: 2 | 3 | 4 | 5;
}

const GRID_COLS = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
} as const;

// Slightly tighter gaps for 5-col layout so cards breathe without cramping
const GRID_GAPS = {
  2: 'gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10',
  3: 'gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10',
  4: 'gap-x-5 gap-y-8 md:gap-x-6 md:gap-y-10',
  5: 'gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8',
} as const;

export function ProductGrid({ products, showSkeleton = false, columns = 4 }: ProductGridProps) {
  const skeletonCount = columns === 5 ? 5 : columns === 3 ? 6 : 8;

  if (showSkeleton) {
    return (
      <div className={`grid ${GRID_COLS[columns]} ${GRID_GAPS[columns]}`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-0">
            <Skeleton className="w-full" style={{ aspectRatio: '3/4', borderRadius: 0 }} />
            <div className="pt-3 space-y-1.5">
              <Skeleton className="h-2 w-1/4" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/3 mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4 opacity-30">✦</div>
        <h3
          className="text-xl font-light mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
        >
          No products found
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
          Try different filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${GRID_COLS[columns]} ${GRID_GAPS[columns]}`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
