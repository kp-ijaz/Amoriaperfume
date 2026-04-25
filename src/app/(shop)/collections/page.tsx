'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCollections } from '@/lib/hooks/useApiCollections';

export default function CollectionsPage() {
  const { data: collections = [], isLoading } = useCollections();

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* Hero banner */}
      <div
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{ backgroundColor: '#1A0A2E' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.7)' }}>Amoria</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Our <em style={{ color: '#C9A84C' }}>Collections</em>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Curated worlds of scent — each collection a journey into a different facet of Arabian perfumery.
          </p>
        </motion.div>
      </div>

      {/* Collections grid */}
      <div className="max-w-6xl mx-auto px-4 py-14">

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}>
                <div className="h-52 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col, i) => {
              const productCount = col.productIds?.length ?? 0;
              const imageUrl = col.heroImage || 'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-1c3e7a2d6e1f?w=800&q=80';

              return (
                <motion.div
                  key={col._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                >
                  <Link
                    href={`/products?collection=${col.slug}`}
                    className="group block overflow-hidden"
                    style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={col.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Tag */}
                      <span
                        className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1"
                        style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
                      >
                        Collection
                      </span>
                      {productCount > 0 && (
                        <p className="absolute bottom-3 left-4 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                          {productCount} {productCount === 1 ? 'fragrance' : 'fragrances'}
                        </p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2 className="text-lg font-semibold mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
                        {col.name}
                      </h2>
                      {col.description && (
                        <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#6B6B6B' }}>
                          {col.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all group-hover:gap-2.5"
                        style={{ color: '#1A0A2E' }}>
                        Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
              Collections are being curated. Browse our full fragrance range in the meantime.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            >
              Browse All Fragrances <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
