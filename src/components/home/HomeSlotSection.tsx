'use client';

import { useHomeSlotProducts } from '@/lib/hooks/usePublicCms';
import { ProductSection } from './ProductSection';

interface HomeSlotSectionProps {
  slotKey: string;
  title: string;
  subtitle?: string;
  viewAllHref: string;
  theme?: 'light' | 'dark';
  sectionNumber?: string;
  limit?: number;
  columns?: 2 | 3 | 4 | 5;
  fallbackFeatured?: boolean;
}

export function HomeSlotSection({
  slotKey,
  title,
  subtitle,
  viewAllHref,
  theme = 'light',
  sectionNumber = '01',
  limit = 5,
  columns = 5,
  fallbackFeatured,
}: HomeSlotSectionProps) {
  const { data, isLoading } = useHomeSlotProducts(slotKey, {
    limit,
    featured: fallbackFeatured,
    sort: fallbackFeatured ? undefined : 'newest',
  });

  const displayTitle = data?.title?.trim() || title;
  const displaySubtitle = data?.subtitle?.trim() || subtitle;
  const products = data?.products ?? [];

  if (!isLoading && products.length === 0) return null;

  return (
    <ProductSection
      title={displayTitle}
      subtitle={displaySubtitle}
      products={products}
      viewAllHref={viewAllHref}
      showSkeleton={isLoading}
      theme={theme}
      sectionNumber={sectionNumber}
      columns={columns}
    />
  );
}
