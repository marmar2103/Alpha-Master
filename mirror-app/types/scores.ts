export interface DimensionScores {
  sleep?: number;
  stress?: number;
  energy?: number;
  focus?: number;
  mood?: number;
  digestion?: number;
  habit?: number;
  hrv?: number;
  [key: string]: number | string | undefined;
}

export interface ComputedScores {
  id?: string;
  user_id?: string;
  date: string;
  mirror_score?: number;
  sleep_score?: number;
  stress_score?: number;
  energy_score?: number;
  focus_score?: number;
  mood_score?: number;
  digestion_score?: number;
  habit_score?: number;
  hrv_score?: number;
  computed_at?: string;
  [key: string]: number | string | undefined;
}

export interface CorrelationResult {
  dimensionA: string;
  dimensionB: string;
  r: number;
  lag: number;
  n: number;
  description?: string;
}

export interface AIInsight {
  id?: string;
  user_id?: string;
  week_start?: string;
  insight_type?: string;
  dimension?: string;
  title: string;
  body: string;
  action_text?: string;
  priority?: number;
  is_read?: boolean;
  created_at?: string;
}

export interface CorrelationRow {
  id?: string;
  user_id?: string;
  computed_at?: string;
  dimension_a: string;
  dimension_b: string;
  correlation_coefficient?: number | null;
  lag_days?: number | null;
  confidence?: number | null;
  data_points?: number | null;
  description?: string | null;
}
