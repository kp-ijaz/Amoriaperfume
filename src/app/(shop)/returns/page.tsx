import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('returns', 'Returns & Exchanges', '/returns');
}

export default function ReturnsPage() {
  return <CmsPageByType pageType="returns" />;
}
