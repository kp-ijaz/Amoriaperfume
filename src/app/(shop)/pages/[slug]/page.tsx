import { redirect, notFound } from 'next/navigation';
import { CONTENT_PAGE_TYPES } from '@/lib/cms/contentPageTypes';

export default async function LegacyCmsPageRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = CONTENT_PAGE_TYPES.find((t) => t.slug === slug);
  if (def) redirect(def.path);
  notFound();
}
