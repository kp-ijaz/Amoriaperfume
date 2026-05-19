'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetAuthMe, apiUpdateAuthMe } from '@/lib/api/public';
import { useAuth } from '@/lib/hooks/useAuth';

export function useProfile() {
  const { token, isAuthenticated } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!token) throw new Error('Not signed in');
      const res = await apiGetAuthMe(token);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Failed to load profile');
      return res.data;
    },
    enabled: isAuthenticated && !!token,
  });

  const update = useMutation({
    mutationFn: async (data: {
      name?: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      if (!token) throw new Error('Not signed in');
      const res = await apiUpdateAuthMe(token, data);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Update failed');
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });

  return { ...query, updateProfile: update };
}
