import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('about', 'About Amoria', '/about');
}

export default function AboutPage() {
  return <CmsPageByType pageType="about" />;
}
