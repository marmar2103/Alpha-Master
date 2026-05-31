import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { DailyCheckin } from '../types/health';
import type { ComputedScores } from '../types/scores';

export function useTodayCheckin() {
  const user = useAuthStore(s => s.user);
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['checkin', today, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
      return data as DailyCheckin | null;
    },
    enabled: !!user,
  });
}

export function useRecentScores(days = 14) {
  const user = useAuthStore(s => s.user);

  return useQuery<ComputedScores[]>({
    queryKey: ['scores', days, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('computed_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(days);
      return (data ?? []) as ComputedScores[];
    },
    enabled: !!user,
  });
}

export function useSubmitCheckin() {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);

  return useMutation({
    mutationFn: async (checkin: Partial<DailyCheckin>) => {
      if (!user) throw new Error('Not authenticated');
      const today = new Date().toISOString().split('T')[0];
      const payload = { ...checkin, user_id: user.id, date: today } as any;
      const { data, error } = await supabase
        .from('daily_checkins')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['checkin', today] });
      queryClient.invalidateQueries({ queryKey: ['scores'] });
    },
  });
}
