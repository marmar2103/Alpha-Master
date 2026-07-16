import { DIMENSIONS } from '../constants/dimensions';
import type { WearableData, DailyCheckin } from '../types/health';
import type { DimensionScores } from '../types/scores';

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function scoreDuration(minutes: number | undefined): number {
  if (!minutes) return 50;
  if (minutes < 300) return clamp(minutes / 300 * 50);
  if (minutes <= 540) return clamp(50 + ((minutes - 300) / 240) * 50);
  if (minutes <= 600) return 100;
  return clamp(100 - ((minutes - 600) / 60) * 20);
}

function scoreDeepSleep(deep: number | undefined, total: number | undefined): number {
  if (!deep || !total) return 50;
  const ratio = deep / total;
  return clamp(ratio / 0.20 * 100);
}

function normalizeHRV(hrv: number | undefined): number {
  if (!hrv) return 50;
  return clamp(((hrv - 20) / 60) * 100);
}

export function computeSleepScore(wearable: WearableData): number {
  const durationScore = scoreDuration(wearable.sleep_duration_minutes);
  const efficiencyScore = wearable.sleep_efficiency_pct ?? 75;
  const deepScore = scoreDeepSleep(wearable.sleep_deep_minutes, wearable.sleep_duration_minutes);
  return clamp(Math.round(durationScore * 0.5 + efficiencyScore * 0.3 + deepScore * 0.2));
}

export function computeStressScore(wearable: WearableData, checkin: DailyCheckin, sleepDebt = 0): number {
  const hrvScore = normalizeHRV(wearable.hrv_ms);
  const selfReport = checkin.stress_score ? (100 - checkin.stress_score) : 50;
  const debtPenalty = Math.min(sleepDebt * 3, 30);
  return clamp(Math.round(Math.max(0, hrvScore * 0.6 + selfReport * 0.4 - debtPenalty)));
}

export function computeHabitScore(checkin: DailyCheckin): number {
  const weights = { exercise: 0.30, meditation: 0.25, no_alcohol: 0.20, healthy_eating: 0.15, early_sleep: 0.10 };
  let score = 0;
  if (checkin.habit_exercise) score += weights.exercise * 100;
  if (checkin.habit_meditation) score += weights.meditation * 100;
  if (checkin.habit_no_alcohol) score += weights.no_alcohol * 100;
  if (checkin.habit_healthy_eating) score += weights.healthy_eating * 100;
  if (checkin.habit_early_sleep) score += weights.early_sleep * 100;
  return clamp(Math.round(score));
}

export function computeHRVScore(wearable: WearableData): number {
  return clamp(normalizeHRV(wearable.hrv_ms));
}

export function computeMirrorScore(scores: DimensionScores): number {
  return clamp(Math.round(
    DIMENSIONS.reduce((acc, dim) => acc + ((scores[dim.key] as number | undefined) ?? 50) * dim.weight, 0)
  ));
}
