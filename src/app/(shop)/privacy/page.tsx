import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('privacy', 'Privacy Policy', '/privacy');
}

export default function PrivacyPage() {
  return <CmsPageByType pageType="privacy" />;
}
