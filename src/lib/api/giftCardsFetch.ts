import { ApiResponse } from './types';
import { getApiBase } from './resolveApiBase';

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const apiBase = getApiBase();
  if (!apiBase && typeof window === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set. Add it to your .env.local file.');
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || 'Request failed');
  }
  return json as ApiResponse<T>;
}
