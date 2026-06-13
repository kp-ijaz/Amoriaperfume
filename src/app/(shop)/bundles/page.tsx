'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import { BundleCard } from '@/components/bundle/BundleCard';
import { useBundles } from '@/lib/hooks/useBundles';

export default function BundlesPage() {
  const { data: bundles = [], isLoading } = useBundles();

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      <div
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{ backgroundColor: '#1A0A2E' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
            }}
          >
            <Layers size={22} style={{ color: '#C9A84C' }} />
          </div>
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: 'rgba(201,168,76,0.7)' }}
          >
            Curated Combos
          </p>
          <h1
            className="text-4xl md:text-5xl font-light text-white mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Fragrance <em style={{ color: '#C9A84C' }}>Bundles</em>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Save more when you shop our hand-picked fragrance bundles — multiple scents, one special price.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
              >
                <div className="h-56 bg-gray-100" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : bundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle, i) => (
              <BundleCard key={bundle._id} bundle={bundle} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
              Bundles are being curated. Browse our full fragrance range in the meantime.
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
