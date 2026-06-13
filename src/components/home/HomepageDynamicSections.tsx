'use client';

import { useMemo } from 'react';
import { usePublicBootstrap } from '@/lib/hooks/usePublicCms';
import { normalizeHomepageLayout } from '@/lib/homepage/homepageLayoutDefaults';
import { renderHomepageSection } from '@/components/home/homepageSectionRegistry';

export function HomepageDynamicSections() {
  const { data, isLoading } = usePublicBootstrap();

  const sectionKeys = useMemo(
    () => normalizeHomepageLayout(data?.homepageLayout),
    [data?.homepageLayout]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[120px] items-center justify-center bg-[var(--color-amoria-bg)]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E]" />
      </div>
    );
  }

  return (
    <>
      {sectionKeys.map((key) => (
        <div key={key}>{renderHomepageSection(key)}</div>
      ))}
    </>
  );
}
