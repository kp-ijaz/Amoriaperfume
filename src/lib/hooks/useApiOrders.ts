'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetOrders, apiCreateOrder } from '@/lib/api/client';
import { ApiOrder, CreateOrderRequest } from '@/lib/api/types';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<ApiOrder[]> => {
      const res = await apiGetOrders();
      if (!res.success) return [];
      return Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => apiCreateOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/** Find a single order by its human-readable orderId (e.g. "AMR-123456"). */
export function useOrderById(orderId: string) {
  return useQuery({
    queryKey: ['orders', 'by-id', orderId],
    queryFn: async (): Promise<ApiOrder | null> => {
      if (!orderId.trim()) return null;
      const res = await apiGetOrders();
      if (!res.success) return null;
      const all = Array.isArray(res.data) ? res.data : [];
      return all.find((o) => o.orderId?.toLowerCase() === orderId.trim().toLowerCase()) ?? null;
    },
    enabled: orderId.trim().length >= 3,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

/** Find all orders placed with a given email address (guest order lookup). */
export function useOrdersByEmail(email: string) {
  const trimmed = email.trim().toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return useQuery({
    queryKey: ['orders', 'by-email', trimmed],
    queryFn: async (): Promise<ApiOrder[]> => {
      const res = await apiGetOrders();
      if (!res.success) return [];
      const all: ApiOrder[] = Array.isArray(res.data) ? res.data : [];
      return all.filter(
        (o) => o.customerDetails?.email?.toLowerCase() === trimmed
      );
    },
    enabled: isValid,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}
