import {
  computeSleepScore,
  computeStressScore,
  computeHabitScore,
  computeHRVScore,
  computeMirrorScore,
} from '../lib/scoring';
import type { WearableData, DailyCheckin } from '../types/health';

const baseWearable: WearableData = {
  date: '2024-01-01',
  sleep_duration_minutes: 480,
  sleep_efficiency_pct: 88,
  sleep_deep_minutes: 90,
  hrv_ms: 55,
  resting_hr: 58,
  steps: 8000,
};

const baseCheckin: DailyCheckin = {
  date: '2024-01-01',
  mood_score: 70,
  energy_score: 65,
  stress_score: 40,
  focus_score: 75,
  digestion_score: 80,
  habit_exercise: true,
  habit_meditation: true,
  habit_no_alcohol: true,
  habit_healthy_eating: false,
  habit_early_sleep: false,
};

describe('computeSleepScore', () => {
  it('returns high score for optimal sleep (8h, high efficiency)', () => {
    const score = computeSleepScore(baseWearable);
    expect(score).toBeGreaterThanOrEqual(75);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('returns low score for very short sleep (3h)', () => {
    const score = computeSleepScore({ ...baseWearable, sleep_duration_minutes: 180 });
    expect(score).toBeLessThan(50);
  });

  it('returns 50 for missing data', () => {
    const score = computeSleepScore({ date: '2024-01-01' });
    expect(score).toBe(50);
  });

  it('penalizes oversleeping past 10h', () => {
    const normalScore = computeSleepScore(baseWearable);
    const oversleepScore = computeSleepScore({ ...baseWearable, sleep_duration_minutes: 660 });
    expect(oversleepScore).toBeLessThan(normalScore);
  });
});

describe('computeStressScore', () => {
  it('returns high score for high HRV and low self-reported stress', () => {
    const score = computeStressScore(
      { ...baseWearable, hrv_ms: 70 },
      { ...baseCheckin, stress_score: 20 },
      0
    );
    expect(score).toBeGreaterThan(70);
  });

  it('returns low score for low HRV and high stress', () => {
    const score = computeStressScore(
      { ...baseWearable, hrv_ms: 20 },
      { ...baseCheckin, stress_score: 90 },
      0
    );
    expect(score).toBeLessThan(40);
  });

  it('applies sleep debt penalty', () => {
    const noDebt = computeStressScore(baseWearable, baseCheckin, 0);
    const withDebt = computeStressScore(baseWearable, baseCheckin, 5);
    expect(withDebt).toBeLessThan(noDebt);
  });

  it('clamps to 0-100', () => {
    const score = computeStressScore({ date: '2024-01-01', hrv_ms: 0 }, { ...baseCheckin, stress_score: 100 }, 20);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('computeHabitScore', () => {
  it('returns 100 for all habits completed', () => {
    const score = computeHabitScore({
      date: '2024-01-01',
      habit_exercise: true,
      habit_meditation: true,
      habit_no_alcohol: true,
      habit_healthy_eating: true,
      habit_early_sleep: true,
    });
    expect(score).toBe(100);
  });

  it('returns 0 for no habits', () => {
    const score = computeHabitScore({ date: '2024-01-01' });
    expect(score).toBe(0);
  });

  it('weights exercise highest (30)', () => {
    const exerciseOnly = computeHabitScore({ date: '2024-01-01', habit_exercise: true });
    const sleepOnly = computeHabitScore({ date: '2024-01-01', habit_early_sleep: true });
    expect(exerciseOnly).toBeGreaterThan(sleepOnly);
  });

  it('returns partial score for some habits', () => {
    const score = computeHabitScore(baseCheckin); // exercise + meditation + no_alcohol = 75
    expect(score).toBe(75);
  });
});

describe('computeHRVScore', () => {
  it('normalizes HRV to 0-100', () => {
    expect(computeHRVScore({ date: '2024-01-01', hrv_ms: 20 })).toBe(0);
    expect(computeHRVScore({ date: '2024-01-01', hrv_ms: 80 })).toBe(100);
    expect(computeHRVScore({ date: '2024-01-01', hrv_ms: 50 })).toBe(50);
  });

  it('returns 50 for missing HRV', () => {
    expect(computeHRVScore({ date: '2024-01-01' })).toBe(50);
  });
});

describe('computeMirrorScore', () => {
  it('returns weighted average', () => {
    const allFifty = { sleep: 50, stress: 50, energy: 50, focus: 50, mood: 50, digestion: 50, habit: 50, hrv: 50 };
    expect(computeMirrorScore(allFifty)).toBe(50);
  });

  it('returns 100 for all perfect scores', () => {
    const perfect = { sleep: 100, stress: 100, energy: 100, focus: 100, mood: 100, digestion: 100, habit: 100, hrv: 100 };
    expect(computeMirrorScore(perfect)).toBe(100);
  });

  it('uses defaults of 50 for missing dimensions', () => {
    const partial = { sleep: 100 };
    const score = computeMirrorScore(partial);
    expect(score).toBeGreaterThan(50); // sleep at 100 with weight 0.20 pulls it above 50
    expect(score).toBeLessThan(70);
  });

  it('clamps result to 0-100', () => {
    const score = computeMirrorScore({ sleep: 0, stress: 0, energy: 0, focus: 0, mood: 0, digestion: 0, habit: 0, hrv: 0 });
    expect(score).toBe(0);
  });
});
