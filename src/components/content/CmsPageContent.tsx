'use client';

import { usePublicContentPage } from '@/lib/hooks/usePublicCms';

export function CmsPageContent({ slug, fallbackTitle }: { slug: string; fallbackTitle?: string }) {
  const { data, isLoading, isError } = usePublicContentPage(slug);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E] rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {fallbackTitle || 'Page not found'}
        </h1>
        <p className="text-sm text-stone-500">This page is not published yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1
        className="text-3xl md:text-4xl font-light mb-8"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        {data.title}
      </h1>
      <div
        className="prose prose-stone max-w-none text-[15px] leading-relaxed cms-html"
        dangerouslySetInnerHTML={{ __html: data.body }}
      />
    </article>
  );
}
