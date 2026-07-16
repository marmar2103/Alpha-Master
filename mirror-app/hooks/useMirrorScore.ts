import { useMemo } from 'react';
import { useRecentScores } from './useHealthData';
import type { ComputedScores } from '../types/scores';

export function useMirrorScore() {
  const { data: scores, isLoading } = useRecentScores(1);

  const todayScore = useMemo(() => {
    if (!scores || scores.length === 0) return null;
    return scores[0] as ComputedScores;
  }, [scores]);

  return { score: todayScore?.mirror_score ?? null, scores: todayScore, isLoading };
}
