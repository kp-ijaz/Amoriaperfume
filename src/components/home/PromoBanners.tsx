'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const BANNERS = [
  {
    id: 'banner-1',
    badge: 'LIMITED OFFER',
    badgeBg: '#DC2626',
    headline: 'Eid Gift',
    headlineAccent: 'Collections',
    sub: 'Exclusive gift sets for every celebration. Beautifully wrapped, exquisitely scented.',
    codeLabel: 'Use Code',
    code: 'EID25',
    codeSub: '25% Off All Gift Sets',
    cta: 'Shop Gift Sets',
    href: '/categories/gift-sets',
    image: '/images/products/prod16.jpg',
  },
  {
    id: 'banner-2',
    badge: 'FREE DELIVERY',
    badgeBg: '#C9A84C',
    headline: 'New Arabian',
    headlineAccent: 'Arrivals',
    sub: 'Discover the latest oud & attar fragrances added to our collection this season.',
    codeLabel: null,
    code: null,
    codeSub: 'Over AED 200',
    cta: 'Explore Now',
    href: '/products?sort=newest',
    image: '/images/products/prod19.jpg',
  },
];

export function PromoBanners() {
  return (
    <section
      style={{
        backgroundColor: '#FAF8F5',
        padding: '0 0 56px',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 16px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 12,
        }}
        className="promo-banners-grid"
      >
        {BANNERS.map((banner, i) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={banner.href}
              style={{
                position: 'relative',
                display: 'block',
                height: 260,
                overflow: 'hidden',
                textDecoration: 'none',
              }}
              className="promo-banner-link"
            >
              {/* Background image */}
              <Image
                src={banner.image}
                alt={banner.headline}
                fill
                className="object-cover promo-banner-img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Gradient overlay — dark left side for text legibility */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(100deg, rgba(13,10,8,0.88) 0%, rgba(13,10,8,0.65) 45%, rgba(13,10,8,0.2) 100%)',
                }}
              />

              {/* Gold side accent bar */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '15%',
                  bottom: '15%',
                  width: 3,
                  backgroundColor: '#C9A84C',
                  borderRadius: '0 2px 2px 0',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                {/* Badge */}
                <span
                  style={{
                    display: 'inline-block',
                    width: 'fit-content',
                    backgroundColor: banner.badgeBg,
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    padding: '3px 8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {banner.badge}
                </span>

                {/* Headline */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
                      fontSize: 'clamp(24px, 3vw, 34px)',
                      fontWeight: 300,
                      color: '#FFFFFF',
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
                    {banner.headline}{' '}
                    <em
                      style={{
                        fontStyle: 'italic',
                        color: '#C9A84C',
                        fontWeight: 400,
                      }}
                    >
                      {banner.headlineAccent}
                    </em>
                  </h3>
                </div>

                {/* Sub text */}
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.62)',
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 280,
                  }}
                >
                  {banner.sub}
                </p>

                {/* Code or offer note */}
                {banner.code ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
                      {banner.codeLabel}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(201,168,76,0.15)',
                        border: '1px solid rgba(201,168,76,0.4)',
                        color: '#C9A84C',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        padding: '2px 9px',
                      }}
                    >
                      {banner.code}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
                      —&nbsp;{banner.codeSub}
                    </span>
                  </div>
                ) : (
                  <p style={{ fontSize: 10, color: '#C9A84C', letterSpacing: '0.15em', margin: 0 }}>
                    ✓&nbsp;Free Delivery&nbsp;{banner.codeSub}
                  </p>
                )}

                {/* CTA */}
                <div style={{ marginTop: 4 }}>
                  <span
                    className="promo-banner-cta"
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
                      padding: '8px 18px',
                      transition: 'background-color 0.2s, gap 0.25s',
                    }}
                  >
                    {banner.cta} <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .promo-banners-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        .promo-banner-img {
          transition: transform 0.65s cubic-bezier(0.22,1,0.36,1);
        }
        .promo-banner-link:hover .promo-banner-img {
          transform: scale(1.05);
        }
        .promo-banner-link:hover .promo-banner-cta {
          background-color: #E8C97A !important;
          gap: 12px !important;
        }
      `}</style>
    </section>
  );
}
