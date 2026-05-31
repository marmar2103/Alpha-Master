export interface WearableData {
  id?: string;
  user_id?: string;
  date: string;
  source?: string;
  sleep_duration_minutes?: number;
  sleep_efficiency_pct?: number;
  sleep_deep_minutes?: number;
  sleep_rem_minutes?: number;
  sleep_bedtime?: string;
  sleep_wake_time?: string;
  steps?: number;
  active_calories?: number;
  exercise_minutes?: number;
  resting_hr?: number;
  hrv_ms?: number;
  spo2_pct?: number;
  skin_temp_celsius?: number;
  stress_level?: number;
  created_at?: string;
}

export interface DailyCheckin {
  id?: string;
  user_id?: string;
  date: string;
  mood_score?: number;
  energy_score?: number;
  stress_score?: number;
  focus_score?: number;
  digestion_score?: number;
  habit_exercise?: boolean;
  habit_meditation?: boolean;
  habit_no_alcohol?: boolean;
  habit_healthy_eating?: boolean;
  habit_early_sleep?: boolean;
  notes?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  display_name?: string;
  persona?: 'professional' | 'student' | 'biohacker' | 'wellness';
  primary_struggle?: string;
  timezone?: string;
  onboarding_complete?: boolean;
  created_at?: string;
  updated_at?: string;
}
