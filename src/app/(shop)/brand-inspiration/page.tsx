'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const brands = [
  {
    name: 'Swiss Arabian',
    tagline: 'Where East Meets West',
    story: 'Founded in 1974, Swiss Arabian has been blending the finest Swiss fragrance expertise with the soul of Arabian perfumery for over 50 years. Each bottle carries the legacy of two worlds, united in a single, extraordinary scent.',
    href: '/products?brand=swiss-arabian',
    image: 'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-1c3e7a2d6e1f?w=800&q=80',
    accent: '#C9A84C',
    products: ['Shaghaf Oud Aswad', 'Shumukh', 'Dehn El Oud'],
  },
  {
    name: 'Ajmal',
    tagline: 'A Legacy of Natural Perfumery',
    story: 'Established in 1951, Ajmal is one of the oldest and most respected names in Arabian perfumery. Rooted in the tradition of using only natural ingredients, every Ajmal fragrance is a tribute to the timeless art of scent.',
    href: '/products?brand=ajmal',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
    accent: '#8B7355',
    products: ['Rose Oud', 'Haneen', 'Oud Bouquet'],
  },
  {
    name: 'Rasasi',
    tagline: 'Mastering the Art of Distinction',
    story: 'Since 1979, Rasasi has perfected the art of luxurious Arabian fragrance. Known for their bold compositions and outstanding longevity, Rasasi fragrances are worn by connoisseurs who demand only the finest.',
    href: '/products?brand=rasasi',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
    accent: '#7C6B8A',
    products: ['Amber Woods Intense', 'Majd Al Sultan', 'Riwayat El Oud'],
  },
  {
    name: 'Lattafa',
    tagline: 'Modern Arabian Luxury',
    story: 'Lattafa Perfumes brings a fresh, contemporary energy to the world of Arabian fragrance. With bold packaging and innovative compositions, they have captured the hearts of a new generation of fragrance lovers worldwide.',
    href: '/products?brand=lattafa',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80',
    accent: '#B8860B',
    products: ['Oud Mood', 'Ana Abiyedh Rouge', 'Khaltat Night'],
  },
  {
    name: 'Armaf',
    tagline: 'Redefining Accessible Luxury',
    story: 'Armaf has built its reputation on one principle: exceptional quality should never come at an unreachable price. Their inspired collection brings the luxury fragrance experience within reach without compromising a single note.',
    href: '/products?brand=armaf',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    accent: '#2C5F8A',
    products: ['Club de Nuit Intense', 'Tres Nuit', 'Velvet Rose'],
  },
];

export default function BrandInspirationPage() {
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
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
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
                src={brand.image}
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
              <p className="text-sm font-medium mb-4 italic" style={{ color: brand.accent }}>
                &ldquo;{brand.tagline}&rdquo;
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B6B6B' }}>
                {brand.story}
              </p>

              {/* Featured products */}
              <div className="flex flex-wrap gap-2 mb-5">
                {brand.products.map((p) => (
                  <span
                    key={p}
                    className="text-[11px] px-2.5 py-1 font-medium"
                    style={{ backgroundColor: '#F5F2EE', color: '#6B6B6B', border: '1px solid #E8E3DC' }}
                  >
                    {p}
                  </span>
                ))}
              </div>

              <Link
                href={brand.href}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors hover:gap-3 w-fit"
                style={{ color: '#1A0A2E' }}
              >
                Shop {brand.name} <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
