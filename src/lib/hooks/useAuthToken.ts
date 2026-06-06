'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { getStoredToken } from '@/lib/api/client';

/** Resolved bearer token for API calls (Redux token or localStorage fallback after rehydrate). */
export function useAuthToken(): string | null {
  const { token, isLoggedIn } = useAuth();
  if (token) return token;
  if (!isLoggedIn) return null;
  if (typeof window === 'undefined') return null;
  return getStoredToken();
}
