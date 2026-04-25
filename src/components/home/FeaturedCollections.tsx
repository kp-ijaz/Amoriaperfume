'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCollections } from '@/lib/hooks/useApiCollections';

const FALLBACK_LABELS = ["Editor's Pick", 'Gift Ready', 'Exclusive'];

export function FeaturedCollections() {
  const { data: collections = [] } = useCollections();

  // Map API collections to display items
  const featuredItems = collections.slice(0, 3).map((col, i) => ({
    id: col._id,
    label: FALLBACK_LABELS[i] ?? 'Collection',
    title: col.name,
    description: col.description,
    image: col.heroImage,
    href: `/collections/${col.slug}`,
  }));

  // If no collections yet, render nothing (avoid layout shift)
  if (featuredItems.length === 0) return null;

  const [mainItem, ...sideItems] = featuredItems;

  return (
    <section className="py-0 overflow-hidden" style={{ backgroundColor: 'var(--color-amoria-dark)' }}>
      {/* Top gold line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C40, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p
            className="text-[11px] tracking-[0.3em] uppercase font-semibold mb-3"
            style={{ color: 'var(--color-amoria-accent)' }}
          >
            Curated Collections
          </p>
          <h2
            className="text-3xl md:text-5xl font-light text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Explore Our{' '}
            <em style={{ color: 'var(--color-amoria-accent)', fontStyle: 'italic' }}>
              World of Scent
            </em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          {/* Large left panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 relative overflow-hidden group cursor-pointer"
            style={{ minHeight: '520px' }}
          >
            <Image
              src={mainItem.image}
              alt={mainItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
              unoptimized
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            {/* Side gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-10">
              <p
                className="text-[10px] tracking-[0.25em] uppercase font-semibold mb-2"
                style={{ color: 'var(--color-amoria-accent)' }}
              >
                {mainItem.label}
              </p>
              <h3
                className="text-2xl md:text-4xl font-light text-white mb-3 leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {mainItem.title}
              </h3>
              <p className="text-white/65 text-sm mb-7 max-w-[280px] leading-relaxed">
                {mainItem.description}
              </p>
              <Link
                href={mainItem.href}
                className="inline-flex items-center gap-3 text-sm font-semibold border-b pb-1 transition-all hover:gap-5 duration-300"
                style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-accent)' }}
              >
                Explore Collection <span>→</span>
              </Link>
            </div>
          </motion.div>

          {/* Right stacked panels */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {sideItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden group cursor-pointer flex-1"
                style={{ minHeight: '250px' }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6">
                  <p
                    className="text-[9px] tracking-[0.2em] uppercase font-semibold mb-1"
                    style={{ color: 'var(--color-amoria-accent)' }}
                  >
                    {item.label}
                  </p>
                  <h3
                    className="text-xl md:text-2xl font-light text-white mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs mb-4 leading-relaxed">{item.description}</p>
                  <Link
                    href={item.href}
                    className="text-xs font-semibold tracking-wider transition-opacity hover:opacity-70"
                    style={{ color: 'var(--color-amoria-accent)' }}
                  >
                    Shop Now →
                  </Link>
                </div>

                {/* Corner accent */}
                <div
                  className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M0 0 L32 0 L32 32" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C40, transparent)' }}
      />
    </section>
  );
}
