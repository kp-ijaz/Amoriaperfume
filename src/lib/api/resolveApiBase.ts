/**
 * API base URL for fetch calls.
 * - Browser: same origin (empty string) — Next.js rewrites /api and /uploads to the backend.
 * - SSR / server: direct backend URL (localhost or API_PROXY_TARGET).
 */
export function getApiBase(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
  const serverBase =
    process.env.API_PROXY_TARGET ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://127.0.0.1:7001';
  return serverBase.replace(/\/$/, '');
}

/** @deprecated Prefer getApiBase() for runtime-correct LAN/mobile dev */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
