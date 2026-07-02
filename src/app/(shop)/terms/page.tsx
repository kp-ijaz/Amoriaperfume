import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('terms', 'Terms & Conditions', '/terms');
}

export default function TermsPage() {
  return <CmsPageByType pageType="terms" />;
}
