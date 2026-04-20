import Link from 'next/link';
import { categories } from '@/lib/data/categories';

// Unsplash images mapped per category
const UNSPLASH: Record<string, string> = {
  'online-deals':   'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
  'attar-oud':      'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&q=80',
  'bakhoor':        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80',
  'gift-sets':      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80',
  'niche-perfumes': 'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-7e8b5c3c5b89?w=400&q=80',
  'mens':           'https://images.unsplash.com/photo-1594938298603-c8148c4b4b6e?w=400&q=80',
  'womens':         'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80',
  'mini-perfumes':  'https://images.unsplash.com/photo-1590156546053-96528b81f20f?w=400&q=80',
  'best-sellers':   'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=400&q=80',
  'perfumes':       'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80',
  'perfume-oils':   'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=400&q=80',
  'new-arrivals':   'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&q=80',
};

export default function CategoriesPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="py-10 px-5 text-center" style={{ background: 'linear-gradient(135deg,#1A0A2E 0%,#0D0A08 100%)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>Browse</p>
        <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          All Categories
        </h1>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const img = UNSPLASH[cat.slug] ?? UNSPLASH['perfumes'];
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative overflow-hidden rounded-sm"
                style={{ aspectRatio: '1 / 1', border: '1px solid #E8E3DC' }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${img})` }}
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(13,10,8,0.75) 0%, rgba(13,10,8,0.2) 60%, transparent 100%)' }}
                />
                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-medium text-sm leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {cat.description}
                  </p>
                </div>
                {/* Gold border on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{ border: '1.5px solid rgba(201,168,76,0.6)' }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
