import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import {
  computeSleepScore,
  computeStressScore,
  computeHabitScore,
  computeHRVScore,
  computeMirrorScore,
} from '../lib/scoring';
import type { WearableData, DailyCheckin } from '../types/health';
import type { DimensionScores } from '../types/scores';

export function useComputeScores() {
  const queryClient = useQueryClient();
  const user = useAuthStore(s => s.user);

  return useMutation({
    mutationFn: async ({ wearable, checkin }: { wearable?: WearableData; checkin: DailyCheckin }) => {
      if (!user) throw new Error('Not authenticated');
      const today = new Date().toISOString().split('T')[0];

      const scores: DimensionScores = {
        sleep: wearable ? computeSleepScore(wearable) : (checkin.energy_score ?? 50),
        stress: wearable ? computeStressScore(wearable, checkin, 0) : (checkin.stress_score ? 100 - checkin.stress_score : 50),
        energy: checkin.energy_score ?? 50,
        focus: checkin.focus_score ?? 50,
        mood: checkin.mood_score ?? 50,
        digestion: checkin.digestion_score ?? 50,
        habit: computeHabitScore(checkin),
        hrv: wearable ? computeHRVScore(wearable) : 50,
      };

      const mirrorScore = computeMirrorScore(scores);

      const upsertPayload = {
          user_id: user.id,
          date: today,
          mirror_score: mirrorScore,
          sleep_score: scores.sleep,
          stress_score: scores.stress,
          energy_score: scores.energy,
          focus_score: scores.focus,
          mood_score: scores.mood,
          digestion_score: scores.digestion,
          habit_score: scores.habit,
          hrv_score: scores.hrv,
      };
      const { data, error } = await supabase
        .from('computed_scores')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert(upsertPayload as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scores'] });
      queryClient.invalidateQueries({ queryKey: ['score_history'] });
    },
  });
}
