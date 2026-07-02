import type { Metadata } from 'next';
import { CmsPageByType } from '@/components/content/CmsPageByType';
import { buildCmsPageMetadata } from '@/lib/seo/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildCmsPageMetadata('shipping', 'Shipping Information', '/shipping');
}

export default function ShippingPage() {
  return <CmsPageByType pageType="shipping" />;
}
