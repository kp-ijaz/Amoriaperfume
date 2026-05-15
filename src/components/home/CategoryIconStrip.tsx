'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    id: 'online-deals',
    slug: 'online-deals',
    name: 'Online Deals',
    image: '/images/products/prod1.jpg',
    badge: 'SALE',
  },
  {
    id: 'attar-oud',
    slug: 'attar-oud',
    name: 'Attar & Oud',
    image: '/images/products/prod3.jpg',
    badge: null,
  },
  {
    id: 'bakhoor',
    slug: 'bakhoor',
    name: 'Bakhoor',
    image: '/images/products/prod5.jpg',
    badge: null,
  },
  {
    id: 'gift-sets',
    slug: 'gift-sets',
    name: 'Gift Sets',
    image: '/images/products/prod7.jpg',
    badge: 'NEW',
  },
  {
    id: 'niche-perfumes',
    slug: 'niche-perfumes',
    name: 'Niche Perfumes',
    image: '/images/products/prod9.jpg',
    badge: null,
  },
  {
    id: 'mens',
    slug: 'mens',
    name: "Men's",
    image: '/images/products/prod11.jpg',
    badge: null,
  },
  {
    id: 'womens',
    slug: 'womens',
    name: "Women's",
    image: '/images/products/prod13.jpg',
    badge: null,
  },
  {
    id: 'mini-perfumes',
    slug: 'mini-perfumes',
    name: 'Mini Perfumes',
    image: '/images/products/prod15.jpg',
    badge: null,
  },
];

export function CategoryIconStrip() {
  return (
    <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '28px 16px 24px',
        }}
      >
        {/* Scrollable strip — centers on desktop, scrolls on mobile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            justifyContent: 'space-between',
          }}
          className="category-strip"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
              style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  padding: '0 14px',
                  minWidth: 80,
                }}
                className="category-icon-link"
              >
                {/* Circle wrapper */}
                <div
                  style={{ position: 'relative', display: 'inline-block' }}
                  className="category-circle-wrap"
                >
                  <div
                    className="category-circle"
                    style={{
                      width: 82,
                      height: 82,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#F5F2EE',
                      border: '2px solid #E8E3DC',
                      position: 'relative',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="82px"
                    />
                  </div>

                  {/* Sale/New badge */}
                  {cat.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: cat.badge === 'SALE' ? '#DC2626' : '#C9A84C',
                        color: '#fff',
                        fontSize: 7,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        padding: '2px 5px',
                        borderRadius: 3,
                        lineHeight: 1,
                        zIndex: 10,
                      }}
                    >
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#3A3A3A',
                    textAlign: 'center',
                    lineHeight: 1.3,
                    maxWidth: 82,
                    display: 'block',
                    letterSpacing: '0.01em',
                  }}
                >
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hover styles + scrollbar hide */}
      <style>{`
        .category-strip::-webkit-scrollbar { display: none; }

        .category-icon-link:hover .category-circle {
          border-color: #C9A84C !important;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }
        .category-icon-link:hover span:last-child {
          color: #C9A84C;
        }

        @media (max-width: 767px) {
          .category-strip {
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
}
