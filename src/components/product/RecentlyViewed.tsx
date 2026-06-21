'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useProductsByIds } from '@/lib/hooks/useApiProducts';
import { ProductGrid } from './ProductGrid';

export function RecentlyViewed() {
  const recentIds = useSelector((state: RootState) => state.ui.recentlyViewed);
  const { products: recentProducts } = useProductsByIds(recentIds);

  if (!recentProducts.length) return null;

  return (
    <section className="py-10">
      <h2
        className="text-2xl font-light mb-6 gold-underline inline-block"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        Recently Viewed
      </h2>
      {/* Same grid the home page uses — identical card sizing, columns and gaps */}
      <ProductGrid products={recentProducts} columns={4} />
    </section>
  );
}
