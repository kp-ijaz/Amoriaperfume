'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useBrands } from '@/lib/hooks/useApiBrands';

// Editorial fallback content keyed by lowercase brand name
const brandEditorial: Record<string, { tagline: string; story: string; image: string }> = {
  'swiss arabian': {
    tagline: 'Where East Meets West',
    story: 'Founded in 1974, Swiss Arabian has been blending the finest Swiss fragrance expertise with the soul of Arabian perfumery for over 50 years. Each bottle carries the legacy of two worlds, united in a single, extraordinary scent.',
    image: 'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-1c3e7a2d6e1f?w=800&q=80',
  },
  ajmal: {
    tagline: 'A Legacy of Natural Perfumery',
    story: 'Established in 1951, Ajmal is one of the oldest and most respected names in Arabian perfumery. Rooted in the tradition of using only natural ingredients, every Ajmal fragrance is a tribute to the timeless art of scent.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  },
  rasasi: {
    tagline: 'Mastering the Art of Distinction',
    story: 'Since 1979, Rasasi has perfected the art of luxurious Arabian fragrance. Known for their bold compositions and outstanding longevity, Rasasi fragrances are worn by connoisseurs who demand only the finest.',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
  },
  lattafa: {
    tagline: 'Modern Arabian Luxury',
    story: 'Lattafa Perfumes brings a fresh, contemporary energy to the world of Arabian fragrance. With bold packaging and innovative compositions, they have captured the hearts of a new generation of fragrance lovers worldwide.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80',
  },
  armaf: {
    tagline: 'Redefining Accessible Luxury',
    story: 'Armaf has built its reputation on one principle: exceptional quality should never come at an unreachable price. Their inspired collection brings the luxury fragrance experience within reach without compromising a single note.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
  },
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-1c3e7a2d6e1f?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
  'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80',
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
];

export default function BrandInspirationPage() {
  const { data: brands = [], isLoading } = useBrands();

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{ backgroundColor: '#0D0A08' }}
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
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.7)' }}>Heritage & Craft</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Brand <em style={{ color: '#C9A84C' }}>Inspiration</em>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Discover the stories, heritage, and philosophy behind the world&apos;s finest Arabian fragrance houses.
          </p>
        </motion.div>
      </div>

      {/* Brand stories */}
      <div className="max-w-5xl mx-auto px-4 py-14 space-y-10">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-0 overflow-hidden" style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}>
              <div className="w-[42%] h-64 bg-gray-100 flex-shrink-0" />
              <div className="flex-1 p-8 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))
        ) : brands.length > 0 ? (
          brands.map((brand, i) => {
            const key = brand.name.toLowerCase();
            const editorial = brandEditorial[key];
            const image = editorial?.image ?? brand.logo ?? fallbackImages[i % fallbackImages.length];
            const tagline = editorial?.tagline ?? 'Crafting Excellence in Every Drop';
            const story = editorial?.story ?? (brand.description || 'A distinguished fragrance house known for exceptional quality and timeless scents that captivate the senses.');

            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 overflow-hidden`}
                style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
              >
                {/* Image */}
                <div className="relative w-full md:w-[42%] h-64 md:h-auto flex-shrink-0">
                  <Image
                    src={image}
                    alt={brand.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-2" style={{ color: '#A89880' }}>
                    Est. Fragrance House
                  </p>
                  <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
                    {brand.name}
                  </h2>
                  <p className="text-sm font-medium mb-4 italic" style={{ color: '#C9A84C' }}>
                    &ldquo;{tagline}&rdquo;
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B6B6B' }}>
                    {story}
                  </p>

                  <Link
                    href={`/brands/${brand.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all hover:gap-3 w-fit"
                    style={{ color: '#1A0A2E' }}
                  >
                    Shop {brand.name} <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>Brand stories coming soon.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
              Browse All Fragrances <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
