import { ApiResponse } from './types';
import { getApiBase } from './resolveApiBase';

async function paymentFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const apiBase = getApiBase();
  if (!apiBase && typeof window === 'undefined') {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set.');
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  let json: ApiResponse<T> & { message?: string };
  try {
    json = await res.json();
  } catch {
    throw new Error(res.ok ? 'Invalid payment response' : `Payment request failed (${res.status})`);
  }
  if (!res.ok || json.success === false) {
    throw new Error(json?.message || 'Request failed');
  }
  return json as ApiResponse<T>;
}

export { paymentFetch };
