'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useBrands } from '@/lib/hooks/useApiBrands';
import { brandDisplayImage } from '@/lib/api/adapters';

export default function BrandsIndexPage() {
  const { data: brands = [], isLoading } = useBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h1
        className="text-3xl md:text-4xl font-light mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        Shop by Brand
      </h1>
      <p className="text-stone-500 mb-10">Discover fragrances from the world&apos;s finest houses.</p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <span className="w-8 h-8 border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group border p-4 flex flex-col items-center text-center hover:border-[var(--color-amoria-primary)] transition-colors"
              style={{ borderColor: 'var(--color-amoria-border)' }}
            >
              <div className="relative w-20 h-20 mb-3 bg-stone-50 overflow-hidden">
                {brandDisplayImage(brand) ? (
                  <Image
                    src={brandDisplayImage(brand)}
                    alt={brand.name}
                    fill
                    className={brand.productCoverImage ? 'object-cover' : 'object-contain p-2'}
                    unoptimized
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-light text-stone-400">
                    {brand.name[0]}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold group-hover:text-[var(--color-amoria-accent)]">{brand.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
