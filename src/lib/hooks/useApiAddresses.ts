'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiCreateUserAddress,
  apiDeleteUserAddress,
  apiListUserAddresses,
  apiUpdateUserAddress,
} from '@/lib/api/client';
import { Address } from '@/types/user';
import { useAuth } from '@/lib/hooks/useAuth';

const addressKeys = {
  all: ['user-addresses'] as const,
};

const adaptAddress = (raw: Address & { _id?: string }): Address => ({
  id: raw.id || raw._id || '',
  fullName: raw.fullName,
  phone: raw.phone,
  street: raw.street,
  area: raw.area,
  emirate: raw.emirate,
  postcode: raw.postcode || '',
  isDefault: Boolean(raw.isDefault),
});

export function useUserAddresses() {
  const { token } = useAuth();
  return useQuery({
    queryKey: [...addressKeys.all, Boolean(token)],
    queryFn: async (): Promise<Address[]> => {
      if (!token) return [];
      const res = await apiListUserAddresses(token);
      if (!res.success || !Array.isArray(res.data)) return [];
      return (res.data as Array<Address & { _id?: string }>).map(adaptAddress);
    },
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}

export function useCreateUserAddress() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Address, 'id'>) => {
      const res = await apiCreateUserAddress(payload, token);
      if (!res.success) throw new Error(res.message || 'Failed to create address');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useUpdateUserAddress() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Omit<Address, 'id'>> }) => {
      const res = await apiUpdateUserAddress(id, payload, token);
      if (!res.success) throw new Error(res.message || 'Failed to update address');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useDeleteUserAddress() {
  const { token } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiDeleteUserAddress(id, token);
      if (!res.success) throw new Error(res.message || 'Failed to delete address');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}
