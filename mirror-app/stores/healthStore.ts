import { create } from 'zustand';
import type { DailyCheckin, WearableData } from '../types/health';
import type { ComputedScores } from '../types/scores';

interface HealthState {
  todayCheckin: DailyCheckin | null;
  todayWearable: WearableData | null;
  todayScores: ComputedScores | null;
  recentScores: ComputedScores[];
  setTodayCheckin: (checkin: DailyCheckin | null) => void;
  setTodayWearable: (wearable: WearableData | null) => void;
  setTodayScores: (scores: ComputedScores | null) => void;
  setRecentScores: (scores: ComputedScores[]) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  todayCheckin: null,
  todayWearable: null,
  todayScores: null,
  recentScores: [],
  setTodayCheckin: (todayCheckin) => set({ todayCheckin }),
  setTodayWearable: (todayWearable) => set({ todayWearable }),
  setTodayScores: (todayScores) => set({ todayScores }),
  setRecentScores: (recentScores) => set({ recentScores }),
}));
