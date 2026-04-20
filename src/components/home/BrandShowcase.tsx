'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { brands } from '@/lib/data/brands';

export function BrandShowcase() {
  const doubled = [...brands, ...brands];

  return (
    <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#F5E8D0' }}>
      {/* Subtle pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="brand-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="#C9A84C" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brand-dots)" />
        </svg>
      </div>

      {/* Gold borders */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          <p
            className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-2"
            style={{ color: 'rgba(201,168,76,0.65)' }}
          >
            Trusted Names
          </p>
          <h2
            className="text-4xl md:text-5xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}
          >
            Our <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Brands</em>
          </h2>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
            <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 10,5 5,10 0,5" fill="rgba(201,168,76,0.7)" /></svg>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
          </div>
        </motion.div>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #F5E8D0, transparent)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #F5E8D0, transparent)' }}
        />

        <motion.div
          className="flex items-center gap-0"
          animate={{ x: [0, -50 * brands.length * 8] }}
          transition={{ x: { duration: 22, repeat: Infinity, ease: 'linear' } }}
        >
          {doubled.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              href={`/brands/${brand.slug}`}
              className="group flex-shrink-0 px-10 py-4 relative"
            >
              {/* Vertical gold divider */}
              <span
                className="absolute right-0 top-1/4 bottom-1/4 w-px"
                style={{ background: 'rgba(201,168,76,0.15)' }}
              />
              <span
                className="text-2xl md:text-3xl font-light tracking-wider whitespace-nowrap block transition-all duration-400"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '1A0A2E',
                }}
              >
                <span className="group-hover:text-[#C9A84C] transition-colors duration-300">
                  {brand.name}
                </span>
              </span>
            </Link>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-10 text-center mt-12"
      >
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase border-b pb-0.5 transition-all hover:gap-4 duration-300"
          style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.4)' }}
        >
          View All Brands →
        </Link>
      </motion.div>
    </section>
  );
}
