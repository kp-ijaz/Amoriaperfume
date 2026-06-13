'use client';

import { useMemo } from 'react';
import { usePublicBootstrap, usePublicHomeSlots, useHomepageProductPool } from '@/lib/hooks/usePublicCms';
import {
  DEFAULT_HOMEPAGE_LAYOUT,
  normalizeHomepageLayout,
} from '@/lib/homepage/homepageLayoutDefaults';
import { renderHomepageSection } from '@/components/home/homepageSectionRegistry';

export function HomepageDynamicSections() {
  const { data, isLoading } = usePublicBootstrap();
  usePublicHomeSlots();
  useHomepageProductPool();

  const sectionKeys = useMemo(
    () =>
      isLoading
        ? DEFAULT_HOMEPAGE_LAYOUT
        : normalizeHomepageLayout(data?.homepageLayout),
    [data?.homepageLayout, isLoading]
  );

  return (
    <>
      {sectionKeys.map((key) => (
        <div key={key}>{renderHomepageSection(key)}</div>
      ))}
    </>
  );
}
