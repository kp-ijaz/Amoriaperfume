'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGetProducts } from '@/lib/api/client';
import { adaptProducts } from '@/lib/api/adapters';
import { ProductSection } from './ProductSection';

export function MostViewedSection() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'most-viewed', 5],
    queryFn: async () => {
      const viewed = await apiGetProducts({ sort: 'most_viewed', limit: 20 });
      const raw =
        viewed.success && viewed.data?.items?.length
          ? viewed.data.items.filter((p) => (p.viewCount ?? 0) > 0)
          : [];
      let items = raw.length ? adaptProducts(raw) : [];

      if (items.length === 0) {
        const fallback = await apiGetProducts({ trending: true, limit: 20 });
        if (fallback.success && fallback.data?.items?.length) {
          items = adaptProducts(fallback.data.items);
        }
      }

      return items.slice(0, 5);
    },
    staleTime: 2 * 60 * 1000,
  });

  if (!isLoading && products.length === 0) return null;

  return (
    <ProductSection
      title="Most Viewed"
      subtitle="What's Hot Right Now"
      products={products}
      viewAllHref="/products?sort=most_viewed"
      showSkeleton={isLoading}
      theme="light"
      sectionNumber="03"
      columns={5}
    />
  );
}
