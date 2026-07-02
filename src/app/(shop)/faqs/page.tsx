import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('faqs', 'FAQs', '/faqs');
}

export default function FaqsPage() {
  return <CmsPageByType pageType="faqs" />;
}
