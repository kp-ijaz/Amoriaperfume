'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  HOME_BRANDS_ROW_LIMIT,
  useHomeBrandsRow,
  type HomeBrandTile,
} from '@/lib/hooks/useApiBrands';
import { BrandTileSkeleton } from '@/components/loading';
import { OutlineSkeleton } from '@/components/loading/OutlineSkeleton';

function BrandTile({ brand, index }: { brand: HomeBrandTile; index: number }) {
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
        {/* Image — clipped so hover scale does not cover the bottom bar */}
        <div className="brand-tile-media relative h-[200px] overflow-hidden isolate">
          {brand.image ? (
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-cover brand-tile-img"
              sizes="(max-width: 640px) 50vw, 20vw"
            />
          ) : (
            <OutlineSkeleton className="absolute inset-0 rounded-none border-0" />
          )}
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
  const { brands, isLoading } = useHomeBrandsRow();

  if (!isLoading && brands.length === 0) return null;

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

        {/* Single row of brands (max 5) */}
        <motion.div className="brands-grid" aria-busy={isLoading}>
          {isLoading
            ? <BrandTileSkeleton count={HOME_BRANDS_ROW_LIMIT} />
            : brands.map((brand, i) => (
                <BrandTile key={brand.id} brand={brand} index={i} />
              ))}
        </motion.div>

        {/* View all brands */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 36 }}
        >
          <Link
            href="/brands"
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
        .brands-grid {
          display: flex;
          flex-wrap: nowrap;
          gap: 8px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .brands-grid::-webkit-scrollbar {
          display: none;
        }
        .brands-grid > * {
          flex: 0 0 calc(50% - 4px);
          scroll-snap-align: start;
          min-width: 0;
        }
        @media (min-width: 640px) {
          .brands-grid > * {
            flex: 0 0 calc(33.333% - 6px);
          }
        }
        @media (min-width: 768px) {
          .brands-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            overflow: visible;
          }
          .brands-grid > * {
            flex: unset;
          }
        }
        .brand-tile-media {
          position: relative;
          height: 200px;
          overflow: hidden;
          isolation: isolate;
        }
        .brand-tile-bar {
          position: relative;
          z-index: 2;
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
