import { DIMENSIONS } from '../constants/dimensions';
import type { ComputedScores, CorrelationResult } from '../types/scores';

export function pearsonCorrelation(seriesA: number[], seriesB: number[], lagDays = 0): number {
  const a = seriesA.slice(0, seriesA.length - lagDays || undefined);
  const b = seriesB.slice(lagDays);
  if (a.length < 7) return 0;

  const meanA = a.reduce((s, v) => s + v, 0) / a.length;
  const meanB = b.reduce((s, v) => s + v, 0) / b.length;

  const num = a.reduce((s, v, i) => s + (v - meanA) * (b[i] - meanB), 0);
  const den = Math.sqrt(
    a.reduce((s: number, v: number) => s + (v - meanA) ** 2, 0) *
    b.reduce((s, v) => s + (v - meanB) ** 2, 0)
  );
  return den === 0 ? 0 : num / den;
}

export function discoverCorrelations(history: ComputedScores[]): CorrelationResult[] {
  const keys = DIMENSIONS.map(d => d.key);
  const results: CorrelationResult[] = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const seriesA = history.map(h => (h[keys[i]] as number) ?? 50);
      const seriesB = history.map(h => (h[keys[j]] as number) ?? 50);
      for (const lag of [0, 1, 2]) {
        const r = pearsonCorrelation(seriesA, seriesB, lag);
        if (Math.abs(r) > 0.4) {
          results.push({ dimensionA: keys[i], dimensionB: keys[j], r, lag, n: history.length });
        }
      }
    }
  }
  return results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).slice(0, 5);
}
