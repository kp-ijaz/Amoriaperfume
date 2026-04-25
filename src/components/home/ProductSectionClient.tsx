'use client';

import { useProductsByLimit } from '@/lib/hooks/useApiProducts';
import { ProductSection } from './ProductSection';

interface ProductSectionClientProps {
  title: string;
  subtitle?: string;
  viewAllHref: string;
  theme?: 'light' | 'dark';
  sectionNumber?: string;
  limit?: number;
  featured?: boolean;
}

export function ProductSectionClient({
  title,
  subtitle,
  viewAllHref,
  theme = 'light',
  sectionNumber = '01',
  limit = 8,
  featured,
}: ProductSectionClientProps) {
  const params = featured != null ? { featured } : {};
  const { data: products = [], isLoading } = useProductsByLimit(limit, params);

  return (
    <ProductSection
      title={title}
      subtitle={subtitle}
      products={products}
      viewAllHref={viewAllHref}
      showSkeleton={isLoading}
      theme={theme}
      sectionNumber={sectionNumber}
    />
  );
}
