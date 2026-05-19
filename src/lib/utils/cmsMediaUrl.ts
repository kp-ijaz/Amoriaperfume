import { API_BASE } from '@/lib/api/client';

/** Turn relative backend media paths into absolute URLs for Next/Image. */
export function resolveCmsMediaUrl(url: string | undefined | null): string {
  if (!url?.trim()) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const base = API_BASE.replace(/\/$/, '');
  if (!base) return trimmed;
  return `${base}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}
