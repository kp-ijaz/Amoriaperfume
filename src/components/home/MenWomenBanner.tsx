'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useProductsByLimit } from '@/lib/hooks/useApiProducts';
import { usePublicCoverImages } from '@/lib/hooks/usePublicCms';
import { Product } from '@/types/product';

function MiniProductThumb({ product }: { product: Product }) {
  const variant = product.variants[0];
  const price = variant?.salePrice ?? variant?.price ?? 0;
  const primaryImage = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? '';

  return (
    <Link
      href={`/products/${product.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        textDecoration: 'none',
        flex: 1,
      }}
      className="mw-thumb"
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover mw-thumb-img"
          sizes="80px"
        />
      </div>
      <p
        style={{
          fontSize: 9,
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          lineHeight: 1.3,
          margin: 0,
          letterSpacing: '0.01em',
        }}
        className="line-clamp-2"
      >
        {product.name}
      </p>
      <p style={{ fontSize: 9, color: '#C9A84C', fontWeight: 600, margin: 0 }}>
        {formatCurrency(price)}
      </p>
    </Link>
  );
}

function GenderPanel({
  gender,
  headline,
  sub,
  ctaLabel,
  href,
  bgImage,
  products,
  delay = 0,
}: {
  gender: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  href: string;
  bgImage: string;
  products: Product[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', overflow: 'hidden', flex: 1, minHeight: 480 }}
      className="mw-panel"
    >
      {/* Background image */}
      <Image
        src={bgImage}
        alt={headline}
        fill
        className="object-cover mw-panel-bg"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Gradient overlay — heavier at bottom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,10,8,0.55) 0%, rgba(13,10,8,0.82) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 28px',
        }}
      >
        {/* Top: Gender tag */}
        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: 9,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#C9A84C',
              borderBottom: '1px solid rgba(201,168,76,0.4)',
              paddingBottom: 3,
              marginBottom: 14,
            }}
          >
            {gender}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: 'clamp(26px, 3vw, 38px)',
              fontWeight: 300,
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '0 0 10px',
            }}
          >
            {headline}
          </h3>
          <p
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              margin: '0 0 22px',
              maxWidth: 260,
            }}
          >
            {sub}
          </p>
          <Link
            href={href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#C9A84C',
              color: '#1A0A2E',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '9px 20px',
              textDecoration: 'none',
              transition: 'background-color 0.2s, gap 0.2s',
            }}
            className="mw-cta"
          >
            {ctaLabel} →
          </Link>
        </div>

        {/* Bottom: Mini product thumbnails */}
        <div>
          <p
            style={{
              fontSize: 9,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Featured Picks
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {products.map((p) => (
              <MiniProductThumb key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function MenWomenBanner() {
  const { data: menProducts = [] } = useProductsByLimit(4, { featured: true, gender: 'men' });
  const { data: womenProducts = [] } = useProductsByLimit(4, { featured: true, gender: 'women' });
  const { data: panels = [] } = usePublicCoverImages('men_women_banner');
  const menPanel = panels[0];
  const womenPanel = panels[1];

  return (
    <section style={{ backgroundColor: '#0D0A08', paddingBottom: 0 }}>
      {/* Section header */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 16px 40px' }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: 'center' }}
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
            For Everyone
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              fontWeight: 300,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              margin: '0 0 10px',
              lineHeight: 1.1,
            }}
          >
            Perfumes For{' '}
            <em style={{ fontStyle: 'italic', color: '#C9A84C' }}>Men &amp; Women</em>
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            Shop perfumes for men and women in UAE
          </p>

          {/* Gold divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 16,
            }}
          >
            <div
              style={{
                height: 1,
                width: 40,
                background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))',
              }}
            />
            <svg width="6" height="6" viewBox="0 0 6 6">
              <polygon points="3,0 6,3 3,6 0,3" fill="rgba(201,168,76,0.6)" />
            </svg>
            <div
              style={{
                height: 1,
                width: 40,
                background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Two-column gender panels — full width, no padding */}
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
        className="mw-panels"
      >
        <GenderPanel
          gender="For Him"
          headline={menPanel?.title || "Men's Collection"}
          sub={menPanel?.subtitle || "Bold, sophisticated fragrances for him."}
          ctaLabel="Shop Men's"
          href={menPanel?.redirectUrl || '/categories/mens'}
          bgImage={menPanel?.imageUrl || menProducts[0]?.images[0]?.url || '/images/products/prod10.jpg'}
          products={menProducts}
          delay={0}
        />

        <GenderPanel
          gender="For Her"
          headline={womenPanel?.title || "Women's Collection"}
          sub={womenPanel?.subtitle || "Feminine, captivating fragrances for her."}
          ctaLabel="Shop Women's"
          href={womenPanel?.redirectUrl || '/categories/womens'}
          bgImage={womenPanel?.imageUrl || womenProducts[0]?.images[0]?.url || '/images/products/prod11.jpg'}
          products={womenProducts}
          delay={0.1}
        />
      </div>

      <style>{`
        @media (min-width: 640px) {
          .mw-panels {
            flex-direction: row !important;
          }
        }
        .mw-panel-bg {
          transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .mw-panel:hover .mw-panel-bg {
          transform: scale(1.04);
        }
        .mw-cta:hover {
          background-color: #E8C97A !important;
          gap: 12px !important;
        }
        .mw-thumb-img {
          transition: transform 0.4s ease;
        }
        .mw-thumb:hover .mw-thumb-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
