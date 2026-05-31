import { pearsonCorrelation, discoverCorrelations } from '../lib/correlations';
import type { ComputedScores } from '../types/scores';

describe('pearsonCorrelation', () => {
  it('returns 1 for perfectly correlated series', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    expect(pearsonCorrelation(a, b)).toBeCloseTo(1, 5);
  });

  it('returns -1 for perfectly inverse series', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    expect(pearsonCorrelation(a, b)).toBeCloseTo(-1, 5);
  });

  it('returns 0 for fewer than 7 data points', () => {
    expect(pearsonCorrelation([1, 2, 3], [1, 2, 3])).toBe(0);
  });

  it('returns 0 for constant series (no variance)', () => {
    const a = [5, 5, 5, 5, 5, 5, 5, 5];
    const b = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(pearsonCorrelation(a, b)).toBe(0);
  });

  it('supports lag parameter', () => {
    const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // b is a lagged by 1
    const laggedR = pearsonCorrelation(a, b, 1);
    expect(laggedR).toBeCloseTo(1, 5);
  });
});

describe('discoverCorrelations', () => {
  const makeHistory = (n: number): ComputedScores[] =>
    Array.from({ length: n }, (_, i) => ({
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      mirror_score: 50 + i,
      sleep: 40 + i * 2,
      stress: 80 - i * 2,
      energy: 45 + i,
      focus: 50 + i,
      mood: 55 + i,
      digestion: 50,
      habit: 60,
      hrv: 50 + i,
    }));

  it('returns empty array for fewer than 7 data points', () => {
    expect(discoverCorrelations(makeHistory(5))).toHaveLength(0);
  });

  it('finds strong correlations in patterned data', () => {
    const results = discoverCorrelations(makeHistory(20));
    expect(results.length).toBeGreaterThan(0);
    results.forEach(r => expect(Math.abs(r.r)).toBeGreaterThan(0.4));
  });

  it('returns at most 5 results', () => {
    const results = discoverCorrelations(makeHistory(30));
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('sorts by absolute correlation descending', () => {
    const results = discoverCorrelations(makeHistory(20));
    for (let i = 1; i < results.length; i++) {
      expect(Math.abs(results[i - 1].r)).toBeGreaterThanOrEqual(Math.abs(results[i].r));
    }
  });
});
