'use client';

import { CmsPageContent } from '@/components/content/CmsPageContent';
import { ContentPageType, getContentPageTypeDef } from '@/lib/cms/contentPageTypes';

export function CmsPageByType({ pageType }: { pageType: ContentPageType }) {
  const def = getContentPageTypeDef(pageType);
  if (!def) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      </div>
    );
  }
  return <CmsPageContent slug={def.slug} fallbackTitle={def.label} />;
}
