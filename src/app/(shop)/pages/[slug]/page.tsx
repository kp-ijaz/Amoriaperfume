import { CmsPageContent } from '@/components/content/CmsPageContent';

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CmsPageContent slug={slug} />;
}
