export const CONTENT_PAGE_TYPES = [
  { type: 'terms', slug: 'terms', path: '/terms', label: 'Terms & Conditions' },
  { type: 'privacy', slug: 'privacy', path: '/privacy', label: 'Privacy Policy' },
  { type: 'about', slug: 'about', path: '/about', label: 'About' },
  { type: 'faqs', slug: 'faqs', path: '/faqs', label: 'FAQs' },
  { type: 'fragrance_guide', slug: 'fragrance-guide', path: '/fragrance-guide', label: 'Fragrance guide' },
  { type: 'shipping', slug: 'shipping', path: '/shipping', label: 'Shipping' },
  { type: 'returns', slug: 'returns', path: '/returns', label: 'Returns' },
] as const;

export type ContentPageType = (typeof CONTENT_PAGE_TYPES)[number]['type'];

export function getContentPageTypeDef(pageType: ContentPageType) {
  return CONTENT_PAGE_TYPES.find((t) => t.type === pageType);
}

export function getSlugForPageType(pageType: ContentPageType): string {
  const def = getContentPageTypeDef(pageType);
  if (!def) throw new Error(`Unknown content page type: ${pageType}`);
  return def.slug;
}
