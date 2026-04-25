'use client';

import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useBrandBySlug } from '@/lib/hooks/useApiBrands';
import { useApiProducts } from '@/lib/hooks/useApiProducts';
import { ProductGrid } from '@/components/product/ProductGrid';

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: brand, isLoading: brandLoading } = useBrandBySlug(slug);

  const { products, isLoading: prodsLoading, setFilters } = useApiProducts();

  // Once the brand ID is resolved, apply it as a filter
  useEffect(() => {
    if (brand?.id) {
      setFilters({ brands: [brand.id] });
    }
  }, [brand?.id, setFilters]);

  if (!brandLoading && !brand) return notFound();

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <nav className="flex items-center justify-center gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:opacity-80">Brands</Link>
          <span>/</span>
          <span className="text-white">{brand?.name ?? slug}</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {brandLoading ? <span className="opacity-50">Loading…</span> : brand?.name}
        </h1>
        {brand?.description && (
          <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto">{brand.description}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {brandLoading || prodsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {products.length} fragrances
            </p>
            <ProductGrid products={products} columns={4} />
          </>
        )}
      </div>
    </div>
  );
}
