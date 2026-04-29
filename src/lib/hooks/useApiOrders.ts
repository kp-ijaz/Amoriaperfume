'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCreateOrder, apiGetGuestOrders, apiGetOrders, apiTrackGuestOrder } from '@/lib/api/client';
import { ApiOrder, CreateOrderRequest } from '@/lib/api/types';
import { useAuth } from '@/lib/hooks/useAuth';

export function useOrders() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ['orders', 'me', !!token],
    queryFn: async (): Promise<ApiOrder[]> => {
      if (!token) return [];
      const res = await apiGetOrders(token);
      if (!res.success) return [];
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const { token } = useAuth();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => apiCreateOrder(data, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/** Find a single order by its human-readable orderId (e.g. "AMR-123456"). */
export function useOrderById(orderId: string, email: string) {
  const trimmedOrderId = orderId.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  return useQuery({
    queryKey: ['orders', 'guest-track', trimmedOrderId, trimmedEmail],
    queryFn: async (): Promise<ApiOrder | null> => {
      if (!trimmedOrderId || !isEmailValid) return null;
      const res = await apiTrackGuestOrder({ orderId: trimmedOrderId, email: trimmedEmail });
      if (!res.success) return null;
      return res.data ?? null;
    },
    enabled: trimmedOrderId.length >= 3 && isEmailValid,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

/** Find all guest orders placed with a given email + phone combination. */
export function useOrdersByEmail(email: string, phone: string) {
  const trimmed = email.trim().toLowerCase();
  const trimmedPhone = phone.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const hasPhone = trimmedPhone.length >= 10;
  return useQuery({
    queryKey: ['orders', 'guest-by-email', trimmed, trimmedPhone],
    queryFn: async (): Promise<ApiOrder[]> => {
      const res = await apiGetGuestOrders({ email: trimmed, phone: trimmedPhone });
      if (!res.success) return [];
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: isValid && hasPhone,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
