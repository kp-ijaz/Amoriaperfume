import { getApiBase } from '@/lib/api/resolveApiBase';

/** Turn relative backend media paths into absolute URLs for Next/Image. */
export function resolveCmsMediaUrl(url: string | undefined | null): string {
  if (!url?.trim()) return '';
  let trimmed = url.trim();
  if (trimmed.startsWith('http://') && process.env.NODE_ENV === 'production') {
    trimmed = `https://${trimmed.slice('http://'.length)}`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = getApiBase().replace(/\/$/, '');
  // Browser: relative /uploads paths are proxied by Next.js to the backend.
  if (!base) return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}
