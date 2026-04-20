'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const pillars = [
  {
    numeral: 'I',
    name: 'Oud',
    arabicName: 'العود',
    tagline: 'The Soul of Arabia',
    description:
      'Harvested from centuries-old agarwood forests, oud is the most prized ingredient in Arabian perfumery — rare, smoky, and deeply hypnotic.',
    image: '/images/products/prod1.jpg',
    href: '/products?category=attar-oud',
    accentColor: '#8B5E2A',
  },
  {
    numeral: 'II',
    name: 'Rose',
    arabicName: 'الورد',
    tagline: 'The Queen of Blooms',
    description:
      'Hand-picked at dawn in the valley of Taif, Arabian rose absolute is richer and deeper than any other — the heart of every timeless fragrance.',
    image: '/images/products/prod5.jpg',
    href: '/products?gender=women',
    accentColor: '#7A2040',
  },
  {
    numeral: 'III',
    name: 'Amber',
    arabicName: 'العنبر',
    tagline: 'The Warmth of the Desert',
    description:
      'Ancient fossilized resin that glows warm on skin for hours. Amber anchors every great fragrance with depth, sensuality, and golden warmth.',
    image: '/images/products/prod9.jpg',
    href: '/products?category=niche-perfumes',
    accentColor: '#C9A84C',
  },
];

export function ScentPillars() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#080705' }}>
      {/* Gold top line */}
      <div className="absolute top-0 left-0 w-full h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />

      {/* ── Section header ────────────────────────── */}
      <div className="relative z-10 pt-20 pb-14 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.38em] uppercase font-semibold mb-3" style={{ color: 'rgba(201,168,76,0.6)' }}>
            The Essence
          </p>
          <h2
            className="text-4xl md:text-5xl xl:text-6xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}
          >
            Three Pillars of{' '}
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Perfumery</em>
          </h2>
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polygon points="7,0 14,7 7,14 0,7" fill="none" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.7" />
              <circle cx="7" cy="7" r="2" fill="#C9A84C" fillOpacity="0.6" />
            </svg>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
          </div>
        </motion.div>
      </div>

      {/* ── Pillar cards ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.numeral}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={pillar.href}>
              <div
                className="group relative overflow-hidden cursor-pointer"
                style={{ height: 'clamp(440px, 60vh, 600px)' }}
              >
                {/* Image */}
                <Image
                  src={pillar.image}
                  alt={pillar.name}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  unoptimized
                />

                {/* Permanent dark gradient from bottom */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(8,7,5,0.97) 0%, rgba(8,7,5,0.65) 35%, rgba(8,7,5,0.15) 65%, transparent 85%)' }}
                />

                {/* Hover: extra darkening layer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'rgba(8,7,5,0.25)' }}
                />

                {/* Thin vertical gold border on hover (left side) */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}
                />

                {/* Column dividers between cards (desktop) */}
                {i < pillars.length - 1 && (
                  <div
                    className="absolute top-0 right-0 bottom-0 w-px hidden md:block"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.2), transparent)' }}
                  />
                )}

                {/* Arabic numeral — top left */}
                <div className="absolute top-6 left-6">
                  <span
                    className="text-xs tracking-[0.25em] font-semibold"
                    style={{ color: 'rgba(201,168,76,0.45)' }}
                  >
                    {pillar.numeral}
                  </span>
                </div>

                {/* Corner accent — top right */}
                <div className="absolute top-0 right-0 opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M32 0 L32 32 L0 32" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                  </svg>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                  {/* Arabic name */}
                  <p
                    className="text-xs mb-1.5 font-medium"
                    style={{ color: 'rgba(201,168,76,0.5)', letterSpacing: '0.08em' }}
                  >
                    {pillar.arabicName}
                  </p>

                  {/* English name — large Cormorant */}
                  <h3
                    className="text-5xl md:text-5xl xl:text-6xl font-light text-white leading-none mb-2"
                    style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}
                  >
                    {pillar.name}
                  </h3>

                  {/* Tagline */}
                  <p
                    className="text-xs tracking-[0.16em] uppercase mb-4 font-medium"
                    style={{ color: '#C9A84C' }}
                  >
                    {pillar.tagline}
                  </p>

                  {/* Description — revealed on hover */}
                  <p
                    className="text-xs leading-relaxed mb-5 max-w-[260px] opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {pillar.description}
                  </p>

                  {/* CTA */}
                  <span
                    className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase border-b pb-0.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
                    style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.4)' }}
                  >
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Gold bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
    </section>
  );
}
