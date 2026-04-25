'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/lib/hooks/useApiCategories';

// Fallback Unsplash image per category slug keyword
const FALLBACK: Record<string, string> = {
  'online-deals':   'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
  'attar':          'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80',
  'oud':            'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80',
  'bakhoor':        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80',
  'gift':           'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80',
  'niche':          'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-7e8b5c3c5b89?w=400&q=80',
  'men':            'https://images.unsplash.com/photo-1594938298603-c8148c4b4b6e?w=400&q=80',
  'women':          'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80',
  'mini':           'https://images.unsplash.com/photo-1590156546053-96528b81f20f?w=400&q=80',
  'default':        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
};

function getCategoryImage(cat: { image?: string; slug: string; name: string }): string {
  if (cat.image) return cat.image;
  const key = Object.keys(FALLBACK).find((k) =>
    cat.slug.toLowerCase().includes(k) || cat.name.toLowerCase().includes(k)
  );
  return FALLBACK[key ?? 'default'];
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-10 px-5 text-center" style={{ background: 'linear-gradient(135deg,#1A0A2E 0%,#0D0A08 100%)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>Browse</p>
        <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          All Categories
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const img = getCategoryImage(cat);
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden rounded-sm"
                  style={{ aspectRatio: '1 / 1', border: '1px solid #E8E3DC' }}
                >
                  <Image
                    src={img}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(13,10,8,0.75) 0%, rgba(13,10,8,0.2) 60%, transparent 100%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-medium text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
