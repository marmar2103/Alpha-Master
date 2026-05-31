import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { AIInsight } from '../types/scores';

export function useAIInsights() {
  const user = useAuthStore(s => s.user);

  return useQuery<AIInsight[]>({
    queryKey: ['insights', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      return (data ?? []) as AIInsight[];
    },
    enabled: !!user,
  });
}

export function useGenerateInsight() {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);

  return useMutation({
    mutationFn: async (insightType: string = 'daily') => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.functions.invoke('generate-insight', {
        body: { userId: user.id, insightType },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['insights'] }),
  });
}
