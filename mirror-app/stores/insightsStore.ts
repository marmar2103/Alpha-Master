import { create } from 'zustand';
import type { AIInsight } from '../types/scores';

interface InsightsState {
  insights: AIInsight[];
  currentInsightIndex: number;
  setInsights: (insights: AIInsight[]) => void;
  addInsight: (insight: AIInsight) => void;
  nextInsight: () => void;
  markRead: (id: string) => void;
}

export const useInsightsStore = create<InsightsState>((set, get) => ({
  insights: [],
  currentInsightIndex: 0,
  setInsights: (insights) => set({ insights }),
  addInsight: (insight) => set((s) => ({ insights: [insight, ...s.insights] })),
  nextInsight: () => set((s) => ({ currentInsightIndex: (s.currentInsightIndex + 1) % Math.max(s.insights.length, 1) })),
  markRead: (id) => set((s) => ({ insights: s.insights.map(i => i.id === id ? { ...i, is_read: true } : i) })),
}));
