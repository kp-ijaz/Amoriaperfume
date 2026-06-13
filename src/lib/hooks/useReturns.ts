'use client';

import { useQuery } from '@tanstack/react-query';
import { getGuestOrdersToken } from '@/lib/api/client';
import { listMyReturns } from '@/lib/api/returns';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthToken } from '@/lib/hooks/useAuthToken';

export function useMyReturns(guestTokenOverride?: string | null) {
  const { isLoggedIn } = useAuth();
  const authToken = useAuthToken();
  const guestToken =
    guestTokenOverride !== undefined
      ? guestTokenOverride
      : typeof window !== 'undefined'
        ? getGuestOrdersToken()
        : null;
  const resolvedToken = authToken || guestToken;
  const isGuest = !isLoggedIn && !!guestToken;

  return useQuery({
    queryKey: ['returns', 'my', isLoggedIn, guestToken, !!authToken],
    queryFn: () => listMyReturns({ isGuest, token: resolvedToken }),
    enabled: !!resolvedToken,
    staleTime: 60_000,
  });
}

export function useReturnAuthToken(): { token: string | null; isGuest: boolean; isAuthenticated: boolean } {
  const { isLoggedIn } = useAuth();
  const authToken = useAuthToken();
  const guestToken = typeof window !== 'undefined' ? getGuestOrdersToken() : null;
  const token = authToken || guestToken;
  return {
    token,
    isGuest: !isLoggedIn && !!guestToken,
    isAuthenticated: !!token,
  };
}
