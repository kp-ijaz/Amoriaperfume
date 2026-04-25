'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useProductsByIds } from '@/lib/hooks/useApiProducts';
import { ProductCard } from './ProductCard';

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
      <div className="flex gap-4 overflow-x-auto pb-2 mt-8">
        {recentProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-52">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
