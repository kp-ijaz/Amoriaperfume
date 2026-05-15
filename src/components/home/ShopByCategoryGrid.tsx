'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const TILES = [
  {
    id: 'attar-oud',
    slug: 'attar-oud',
    name: 'Attar & Oud',
    sub: 'Arabian Treasures',
    image: '/images/products/prod2.jpg',
    span: 'large',
  },
  {
    id: 'bakhoor',
    slug: 'bakhoor',
    name: 'Bakhoor',
    sub: 'Home Fragrance',
    image: '/images/products/prod4.jpg',
    span: 'small',
  },
  {
    id: 'gift-sets',
    slug: 'gift-sets',
    name: 'Gift Sets',
    sub: 'For Every Occasion',
    image: '/images/products/prod6.jpg',
    span: 'small',
  },
  {
    id: 'niche-perfumes',
    slug: 'niche-perfumes',
    name: 'Niche Perfumes',
    sub: 'Exclusive & Artisan',
    image: '/images/products/prod8.jpg',
    span: 'small',
  },
  {
    id: 'mens',
    slug: 'mens',
    name: "Men's",
    sub: 'Bold Signatures',
    image: '/images/products/prod10.jpg',
    span: 'small',
  },
  {
    id: 'womens',
    slug: 'womens',
    name: "Women's",
    sub: 'Feminine Elegance',
    image: '/images/products/prod12.jpg',
    span: 'large',
  },
  {
    id: 'mini-perfumes',
    slug: 'mini-perfumes',
    name: 'Mini Perfumes',
    sub: 'Travel-Ready Luxury',
    image: '/images/products/prod14.jpg',
    span: 'small',
  },
  {
    id: 'online-deals',
    slug: 'online-deals',
    name: 'Online Deals',
    sub: 'Limited Time Offers',
    image: '/images/products/prod16.jpg',
    span: 'small',
  },
];

function CategoryTile({
  tile,
  index,
  height = 260,
}: {
  tile: (typeof TILES)[0];
  index: number;
  height?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/categories/${tile.slug}`}
        style={{
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          height,
          textDecoration: 'none',
        }}
        className="category-grid-tile"
      >
        {/* Background image */}
        <Image
          src={tile.image}
          alt={tile.name}
          fill
          className="object-cover category-grid-img"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,10,8,0.82) 0%, rgba(13,10,8,0.25) 55%, transparent 100%)',
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Gold hover overlay */}
        <div
          className="category-grid-hover-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(201,168,76,0.3), transparent)',
            opacity: 0,
            transition: 'opacity 0.35s ease',
          }}
        />

        {/* Top-right arrow (appears on hover) */}
        <div
          className="category-grid-arrow"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: 'rgba(201,168,76,0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transform: 'scale(0.8)',
            transition: 'all 0.25s ease',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2v6" stroke="#1A0A2E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Text content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: '16px 18px',
          }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.85)',
              marginBottom: 4,
              fontWeight: 500,
            }}
          >
            {tile.sub}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: 19,
              fontWeight: 500,
              color: '#FFFFFF',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
            }}
          >
            {tile.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopByCategoryGrid() {
  return (
    <section style={{ backgroundColor: '#FAF8F5', padding: '64px 0' }}>
      {/* Top border */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E8E3DC, transparent)', marginBottom: 64 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 40 }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: '#C9A84C',
              marginBottom: 8,
            }}
          >
            Explore Our Range
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 300,
              color: '#1A0A2E',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Shop by{' '}
            <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Category</em>
          </h2>

          {/* Gold accent line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 }}>
            <div style={{ height: 1.5, width: 40, background: 'linear-gradient(to right, transparent, #C9A84C)' }} />
            <svg width="6" height="6" viewBox="0 0 6 6">
              <polygon points="3,0 6,3 3,6 0,3" fill="#C9A84C" />
            </svg>
            <div style={{ height: 1.5, width: 40, background: 'linear-gradient(to left, transparent, #C9A84C)' }} />
          </div>
        </motion.div>

        {/*
          Layout (desktop):
            Row 1: large (40%) | small | small  →  3 cols, first is 2 rows tall
            Row 2: small | small | large (40%)  →  3 cols, last is 2 rows tall

          Simpler approach: uniform 4-col grid for all 8 tiles
        */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
          className="category-grid-container"
        >
          {TILES.map((tile, i) => (
            <CategoryTile key={tile.id} tile={tile} index={i} height={220} />
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 32 }}
        >
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#1A0A2E',
              textDecoration: 'none',
              borderBottom: '1.5px solid rgba(26,10,46,0.3)',
              paddingBottom: 2,
              transition: 'gap 0.3s ease',
            }}
            className="category-view-all"
          >
            Explore All Products
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Bottom border */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E8E3DC, transparent)', marginTop: 64 }} />

      <style>{`
        @media (min-width: 640px) {
          .category-grid-container {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }

        .category-grid-tile:hover .category-grid-img {
          transform: scale(1.06);
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .category-grid-img {
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .category-grid-tile:hover .category-grid-hover-overlay {
          opacity: 1 !important;
        }
        .category-grid-tile:hover .category-grid-arrow {
          opacity: 1 !important;
          transform: scale(1) !important;
          background-color: rgba(201,168,76,0.9) !important;
        }
        .category-view-all:hover {
          gap: 14px !important;
          color: #C9A84C !important;
          border-color: rgba(201,168,76,0.5) !important;
        }
      `}</style>
    </section>
  );
}
