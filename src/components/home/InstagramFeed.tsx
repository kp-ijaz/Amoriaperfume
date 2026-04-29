'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

function IGIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

// NOTE: Replace these with real post image URLs from the Instagram Basic Display API
// using your @amoriaperfumeofficial access token for live feed.
const instagramImages = [
  { src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80', alt: 'Amoria oud collection' },
  { src: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80',                alt: 'Luxury perfume bottles' },
  { src: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',             alt: 'Arabian fragrance' },
  { src: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',             alt: 'Perfume close-up' },
  { src: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80',             alt: 'Gift set collection' },
  { src: 'https://images.unsplash.com/photo-1616096142563-ce4f6a1a7c79?w=600&q=80',             alt: 'Premium fragrance' },
];

const hasNonEmptySrc = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export function InstagramFeed() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Top border */}
      <div className="absolute top-0 left-0 w-full h-px" style={{ backgroundColor: '#E8E3DC' }} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <span style={{ color: '#C9A84C' }}><IGIcon size={16} /></span>
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: '#C9A84C' }}>
              @amoriaperfumeofficial
            </p>
          </div>
          <h2
            className="text-3xl md:text-4xl font-light"
            style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E', letterSpacing: '0.05em' }}
          >
            Follow Our <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Journey</em>
          </h2>
          {/* Gold divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
            <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill="rgba(201,168,76,0.6)" /></svg>
            <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {instagramImages.map((img, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/amoriaperfumeofficial?igsh=MWk4dWhianVlaGhsbA=="
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden group block"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              {hasNonEmptySrc(img.src) ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  unoptimized
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-wider"
                  style={{ backgroundColor: '#F5F2EE', color: '#A89880' }}
                >
                  {img.alt}
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 text-center text-white">
                  <span className="flex justify-center mb-1.5"><IGIcon size={20} /></span>
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase">View Post</p>
                </div>
              </div>

              {/* Gold corner accent on hover */}
              <div className="absolute top-0 left-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg viewBox="0 0 24 24" fill="none"><path d="M0 0 L24 0 L0 24" fill="rgba(201,168,76,0.3)" /></svg>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <a
            href="https://www.instagram.com/amoriaperfumeofficial?igsh=MWk4dWhianVlaGhsbA=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.15em] uppercase transition-all hover:gap-4 duration-300 border-b pb-0.5"
            style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.4)' }}
          >
            <IGIcon size={14} />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
