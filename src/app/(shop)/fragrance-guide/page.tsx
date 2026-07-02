import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('fragrance-guide', 'Fragrance Guide', '/fragrance-guide');
}

export default function FragranceGuidePage() {
  return <CmsPageByType pageType="fragrance_guide" />;
}
