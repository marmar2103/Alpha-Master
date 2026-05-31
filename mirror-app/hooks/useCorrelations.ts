import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { CorrelationRow } from '../types/scores';

export function useCorrelations() {
  const user = useAuthStore(s => s.user);

  return useQuery<CorrelationRow[]>({
    queryKey: ['correlations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('correlations')
        .select('*')
        .eq('user_id', user.id)
        .order('computed_at', { ascending: false })
        .limit(5);
      return (data ?? []) as CorrelationRow[];
    },
    enabled: !!user,
  });
}
