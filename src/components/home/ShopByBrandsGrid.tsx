'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const BRANDS = [
  {
    id: 'swiss-arabian',
    slug: 'swiss-arabian',
    name: 'Swiss Arabian',
    tagline: 'Since 1974',
    count: '48 products',
    image: '/images/products/prod1.jpg',
    accent: '#C9A84C',
  },
  {
    id: 'ajmal',
    slug: 'ajmal',
    name: 'Ajmal',
    tagline: 'Since 1951',
    count: '62 products',
    image: '/images/products/prod2.jpg',
    accent: '#B8A898',
  },
  {
    id: 'rasasi',
    slug: 'rasasi',
    name: 'Rasasi',
    tagline: 'Since 1979',
    count: '55 products',
    image: '/images/products/prod3.jpg',
    accent: '#C9A84C',
  },
  {
    id: 'lattafa',
    slug: 'lattafa',
    name: 'Lattafa',
    tagline: 'Modern Arabian',
    count: '70 products',
    image: '/images/products/prod4.jpg',
    accent: '#B8A898',
  },
  {
    id: 'armaf',
    slug: 'armaf',
    name: 'Armaf',
    tagline: 'Inspired Luxury',
    count: '44 products',
    image: '/images/products/prod5.jpg',
    accent: '#C9A84C',
  },
];

function BrandTile({ brand, index }: { brand: (typeof BRANDS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/brands/${brand.slug}`}
        style={{
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          textDecoration: 'none',
        }}
        className="brand-tile"
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 200 }}>
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            className="object-cover brand-tile-img"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(13,10,8,0.90) 0%, rgba(13,10,8,0.45) 60%, rgba(13,10,8,0.15) 100%)',
            }}
          />
          {/* Hover gold overlay */}
          <div
            className="brand-tile-hover-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(201,168,76,0.28), transparent 60%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Brand content overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '18px 16px',
              textAlign: 'center',
            }}
          >
            {/* Tagline */}
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.28em',
                color: brand.accent,
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: 5,
              }}
            >
              {brand.tagline}
            </p>

            {/* Brand name */}
            <h3
              style={{
                fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
                fontSize: 22,
                fontWeight: 500,
                color: '#FFFFFF',
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {brand.name}
            </h3>
          </div>
        </div>

        {/* Bottom info bar */}
        <div
          className="brand-tile-bar"
          style={{
            backgroundColor: '#1A0A2E',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background-color 0.2s ease',
          }}
        >
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
            {brand.count}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#C9A84C',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
            className="brand-tile-cta"
          >
            Shop All →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function ShopByBrandsGrid() {
  return (
    <section style={{ backgroundColor: '#0D0A08', padding: '64px 0' }}>
      {/* Gold top border */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
          marginBottom: 0,
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center', marginBottom: 40, paddingTop: 64 }}
        >
          <p
            style={{
              fontSize: 10,
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'rgba(201,168,76,0.7)',
              marginBottom: 8,
            }}
          >
            Trusted Heritage
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 300,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Shop by{' '}
            <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Brands</em>
          </h2>

          {/* Gold divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 14,
            }}
          >
            <div
              style={{
                height: 1,
                width: 40,
                background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.6))',
              }}
            />
            <svg width="6" height="6" viewBox="0 0 6 6">
              <polygon points="3,0 6,3 3,6 0,3" fill="rgba(201,168,76,0.7)" />
            </svg>
            <div
              style={{
                height: 1,
                width: 40,
                background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.6))',
              }}
            />
          </div>
        </motion.div>

        {/* Brands grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
          className="brands-grid"
        >
          {BRANDS.map((brand, i) => (
            <BrandTile key={brand.id} brand={brand} index={i} />
          ))}
        </div>

        {/* View all brands */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 36 }}
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
              color: 'rgba(201,168,76,0.8)',
              textDecoration: 'none',
              borderBottom: '1.5px solid rgba(201,168,76,0.3)',
              paddingBottom: 2,
              transition: 'color 0.2s, gap 0.3s',
            }}
            className="brands-view-all"
          >
            View All Brands
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Gold bottom border */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
          marginTop: 64,
        }}
      />

      <style>{`
        @media (min-width: 480px) {
          .brands-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 768px) {
          .brands-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
        .brand-tile-img {
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .brand-tile:hover .brand-tile-img {
          transform: scale(1.07);
        }
        .brand-tile:hover .brand-tile-hover-overlay {
          opacity: 1 !important;
        }
        .brand-tile:hover .brand-tile-bar {
          background-color: #2D1554 !important;
        }
        .brands-view-all:hover {
          color: #C9A84C !important;
          gap: 14px !important;
        }
      `}</style>
    </section>
  );
}
