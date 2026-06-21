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
          {/* Scroll port — snaps on touch, hides scrollbar */}
          <div
            className="category-strip flex items-start justify-start gap-2 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] md:flex-wrap md:justify-center md:gap-x-2 md:gap-y-4 md:overflow-visible md:snap-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: i * 0.055, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 snap-start md:w-[calc((100%-5*0.5rem)/6)] md:max-w-[calc((100%-5*0.5rem)/6)] md:flex-[0_0_calc((100%-5*0.5rem)/6)] md:snap-none"
              >
                <Link
                  href={cat.href}
                  className="category-icon-link flex min-w-[120px] flex-col items-center gap-2.5 px-3 no-underline md:min-w-0 md:w-full md:px-1"
                >
                  <div className="relative inline-block shrink-0">
                    <div
                      className="category-circle relative size-[120px] rounded-full overflow-hidden"
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
                        sizes="(max-width: 640px) 72px, (max-width: 768px) 92px, 120px"
                        priority={i === 0}
                      />
                    </div>

                    {cat.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          backgroundColor: cat.badge === 'SALE' ? '#DC2626' : '#C9A84C',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          padding: '4px 6px',
                          borderRadius: 4,
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
                      maxWidth: 120,
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
                      fill
