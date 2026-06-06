'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiCreateUserAddress,
  apiDeleteUserAddress,
  apiListUserAddresses,
  apiUpdateUserAddress,
} from '@/lib/api/client';
import { Address } from '@/types/user';
import { useAuthToken } from '@/lib/hooks/useAuthToken';

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
  const authToken = useAuthToken();
  return useQuery({
    queryKey: [...addressKeys.all, Boolean(authToken)],
    queryFn: async (): Promise<Address[]> => {
      if (!authToken) return [];
      const res = await apiListUserAddresses(authToken);
      if (!res.success || !Array.isArray(res.data)) return [];
      return (res.data as Array<Address & { _id?: string }>).map(adaptAddress);
    },
    enabled: !!authToken,
    staleTime: 60 * 1000,
  });
}

export function useCreateUserAddress() {
  const authToken = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Address, 'id'>) => {
      const res = await apiCreateUserAddress(payload, authToken);
      if (!res.success) throw new Error(res.message || 'Failed to create address');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useUpdateUserAddress() {
  const authToken = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Omit<Address, 'id'>> }) => {
      const res = await apiUpdateUserAddress(id, payload, authToken);
      if (!res.success) throw new Error(res.message || 'Failed to update address');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

export function useDeleteUserAddress() {
  const authToken = useAuthToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiDeleteUserAddress(id, authToken);
      if (!res.success) throw new Error(res.message || 'Failed to delete address');
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}
