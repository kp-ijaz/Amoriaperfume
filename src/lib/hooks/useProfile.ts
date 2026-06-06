'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGetAuthMe, apiUpdateAuthMe } from '@/lib/api/public';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthToken } from '@/lib/hooks/useAuthToken';

export function useProfile() {
  const { isAuthenticated } = useAuth();
  const authToken = useAuthToken();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!authToken) throw new Error('Not signed in');
      const res = await apiGetAuthMe(authToken);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Failed to load profile');
      return res.data;
    },
    enabled: isAuthenticated && !!authToken,
  });

  const update = useMutation({
    mutationFn: async (data: {
      name?: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    }) => {
      if (!authToken) throw new Error('Not signed in');
      const res = await apiUpdateAuthMe(authToken, data);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Update failed');
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });

  return { ...query, updateProfile: update };
}
