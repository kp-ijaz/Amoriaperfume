'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useCategories } from '@/lib/hooks/useApiCategories';
import { usePublicCoverImages } from '@/lib/hooks/usePublicCms';
import { useIsDesktop } from '@/lib/hooks/useIsDesktop';
import { filterCoverImagesForDevice } from '@/lib/utils/coverImageDevice';
import { CategoryStripSkeleton } from '@/components/loading';

export function CategoryIconStrip() {
  const { data: apiCategories = [], isLoading: categoriesLoading } = useCategories();
  const { data: coverCats = [], isLoading: coversLoading } = usePublicCoverImages('category_cover');
  const isDesktop = useIsDesktop();

  const isLoading = categoriesLoading || coversLoading;

  const categories = useMemo(() => {
    const visibleCovers = filterCoverImagesForDevice(coverCats, isDesktop);
    if (visibleCovers.length > 0) {
      return visibleCovers.map((c) => {
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
  }, [coverCats, apiCategories, isDesktop]);

  if (isLoading) return <CategoryStripSkeleton />;

  if (categories.length === 0) return null;

  return (
    <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E3DC' }}>
      <div className="max-w-[1280px] mx-auto px-4 pt-7 pb-6">
        {/* Scroll port — snaps on touch, hides scrollbar */}
        <div
          className="category-strip overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          {/* w-max + mx-auto = centered when it fits, scrolls from the start
              (no clipped half-circles) when it overflows */}
          <div className="flex items-start gap-0.5 sm:gap-1 w-max mx-auto">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link
                  href={cat.href}
                  className="category-icon-link flex flex-col items-center gap-2.5 no-underline px-2 sm:px-2.5 md:px-3 min-w-[82px] sm:min-w-[102px] md:min-w-[108px]"
                >
                  <div className="relative inline-block shrink-0">
                    <div
                      className="category-circle relative size-[72px] sm:size-[92px] md:size-[110px] rounded-full overflow-hidden"
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
                        sizes="(max-width: 640px) 72px, (max-width: 768px) 92px, 110px"
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

                  <span className="text-[11px] sm:text-xs font-medium text-[#3A3A3A] text-center leading-tight tracking-[0.01em] max-w-[80px] sm:max-w-[100px] md:max-w-[110px]">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
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
      `}</style>
    </section>
  );
}
