'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/lib/hooks/useApiCategories';
import { OutlineSkeleton } from '@/components/loading';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  const categoriesWithImages = categories.filter((cat) => cat.image);

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      <div
        className="py-10 px-5 text-center"
        style={{
          background: 'linear-gradient(135deg,#1A0A2E 0%,#0D0A08 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>
          Browse
        </p>
        <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          All Categories
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <OutlineSkeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        ) : categoriesWithImages.length === 0 ? (
          <p className="text-center text-sm py-16" style={{ color: '#A89880' }}>
            No categories available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categoriesWithImages.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative overflow-hidden rounded-sm"
                style={{ aspectRatio: '1 / 1', border: '1px solid #E8E3DC' }}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(13,10,8,0.75) 0%, rgba(13,10,8,0.2) 60%, transparent 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p
                    className="text-white font-medium text-sm leading-tight"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {cat.description}
                    </p>
                  )}
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ border: '1.5px solid rgba(201,168,76,0.6)' }}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
