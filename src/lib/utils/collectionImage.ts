import { ApiCollection } from '@/lib/api/types';
import { resolveCmsMediaUrl } from '@/lib/utils/cmsMediaUrl';

/** Resolved display URL for a collection card (matches backend coverImage logic). */
export function getCollectionCoverImage(col: ApiCollection): string {
  const primary =
    col.coverImage?.trim() ||
    col.heroImage?.trim() ||
    col.image?.trim() ||
    '';

  if (primary) return resolveCmsMediaUrl(primary);

  const firstThumb = col.productIds
    ?.flatMap((p) => (Array.isArray(p.thumbnail) ? p.thumbnail : []))
    .find((url) => typeof url === 'string' && url.trim().length > 0);

  return resolveCmsMediaUrl(firstThumb);
}
