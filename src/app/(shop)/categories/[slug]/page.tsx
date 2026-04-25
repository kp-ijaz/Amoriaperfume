'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useCategoryBySlug } from '@/lib/hooks/useApiCategories';
import { useApiProducts } from '@/lib/hooks/useApiProducts';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: category, isLoading: catLoading } = useCategoryBySlug(slug);

  const { products, isLoading: prodsLoading, setFilters } = useApiProducts();

  // Once the category ID is resolved, apply it as a filter
  useEffect(() => {
    if (category?.id) {
      setFilters({ categories: [category.id] });
    }
  }, [category?.id, setFilters]);

  if (!catLoading && !category) return notFound();

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <nav className="flex items-center justify-center gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/" className="hover:opacity-80 text-white/50">Home</Link>
          <span>/</span>
          <span className="text-white">{category?.name ?? slug}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {catLoading ? <span className="opacity-50">Loading…</span> : category?.name}
        </h1>
        {category?.description && (
          <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">{category.description}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {catLoading || prodsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {products.length} products
            </p>
            <ProductGrid products={products} columns={4} />
          </>
        )}
      </div>
    </div>
  );
}
