'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    title: 'Oud & Amber',
    subtitle: 'The soul of the Arabian desert',
    description: 'Rich, resinous, and deeply captivating. Our oud and amber collection tells the story of centuries-old perfumery traditions.',
    href: '/products?category=attar-oud',
    image: 'https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-1c3e7a2d6e1f?w=800&q=80',
    tag: 'Signature',
    count: '12 fragrances',
  },
  {
    title: 'Floral & Rose',
    subtitle: 'Timeless elegance in bloom',
    description: 'Delicate petals and intoxicating florals, capturing the essence of a garden in full bloom. Made for the modern woman.',
    href: '/products?category=floral',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80',
    tag: 'Feminine',
    count: '8 fragrances',
  },
  {
    title: 'Niche Collection',
    subtitle: 'Rare. Exclusive. Unforgettable.',
    description: 'Our most exclusive offerings — limited edition fragrances crafted with the rarest ingredients from around the world.',
    href: '/products?category=niche',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80',
    tag: 'Exclusive',
    count: '6 fragrances',
  },
  {
    title: 'Premium Signatures',
    subtitle: 'Bold statements, lasting impressions',
    description: 'Powerful, long-lasting compositions designed for those who command attention. Wear your confidence.',
    href: '/products?category=premium',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80',
    tag: 'Bold',
    count: '10 fragrances',
  },
  {
    title: 'Inspired Collections',
    subtitle: 'Luxury within reach',
    description: 'Inspired by the world\'s most beloved fragrances, reimagined with a distinctly Arabian soul.',
    href: '/products?category=inspired',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80',
    tag: 'Value',
    count: '14 fragrances',
  },
  {
    title: 'Limited Editions',
    subtitle: 'Before they are gone',
    description: 'Seasonal and special releases available for a short time only. Each bottle a collector\'s piece.',
    href: '/products?sale=true',
    image: 'https://images.unsplash.com/photo-1616096142563-ce4f6a1a7c79?w=800&q=80',
    tag: 'Limited',
    count: '5 fragrances',
  },
];

export default function CollectionsPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <Link
                href={col.href}
                className="group block overflow-hidden"
                style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={col.image}
                    alt={col.title}
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
                    {col.tag}
                  </span>
                  <p className="absolute bottom-3 left-4 text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {col.count}
                  </p>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-lg font-semibold mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
                    {col.title}
                  </h2>
                  <p className="text-xs mb-2 font-medium" style={{ color: '#C9A84C' }}>{col.subtitle}</p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B6B' }}>{col.description}</p>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors group-hover:gap-2.5"
                    style={{ color: '#1A0A2E' }}>
                    Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
