'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useCategories } from '@/lib/hooks/useApiCategories';
import { usePublicCoverImages } from '@/lib/hooks/usePublicCms';
import { CategoryStripSkeleton } from '@/components/loading';

export function CategoryIconStrip() {
  const { data: apiCategories = [], isLoading: categoriesLoading } = useCategories();
  const { data: coverCats = [], isLoading: coversLoading } = usePublicCoverImages('category_cover');

  const isLoading = categoriesLoading || coversLoading;

  const categories = useMemo(() => {
    if (coverCats.length > 0) {
      return coverCats.map((c) => {
        const col = c.collection;
        const collectionHref = col?.slug
          ? `/products?collection=${encodeURIComponent(col.slug)}`
          : null;
        return {
          id: c._id,
          slug: col?.slug || c.redirectUrl?.replace(/^\//, '') || 'products',
          name: c.title || col?.name || 'Collection',
          image: c.imageUrl,
          badge: c.content?.trim() || null,
          href: c.redirectUrl || collectionHref || '/products',
        };
      });
    }
    if (apiCategories.length > 0) {
      return apiCategories
        .slice(0, 8)
        .filter((c) => c.image)
        .map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          image: c.image,
          badge: null as string | null,
          href: `/categories/${c.slug}`,
        }));
    }
    return [];
  }, [coverCats, apiCategories]);

  if (isLoading) return <CategoryStripSkeleton />;

  if (categories.length === 0) return null;

  return (
    <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '28px 16px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 3,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            justifyContent: 'center',
          }}
          className="category-strip"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
              style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <Link
                href={cat.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  padding: '0 14px',
                  minWidth: 110,
                }}
                className="category-icon-link"
              >
                <div className="relative inline-block shrink-0">
                  <div
                    className="category-circle relative size-[110px] rounded-full overflow-hidden"
                    style={{
                      backgroundColor: '#F5F2EE',
                      border: '2px solid #E8E3DC',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="110px"
                      priority={i === 0}
                    />
                  </div>

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

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#3A3A3A',
                    textAlign: 'center',
                    lineHeight: 1.3,
                    maxWidth: 110,
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
