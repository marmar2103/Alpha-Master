-- Users profile (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  persona TEXT CHECK (persona IN ('professional','student','biohacker','wellness')),
  primary_struggle TEXT,
  timezone TEXT DEFAULT 'UTC',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily health check-ins
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_score INTEGER CHECK (mood_score BETWEEN 0 AND 100),
  energy_score INTEGER CHECK (energy_score BETWEEN 0 AND 100),
  stress_score INTEGER CHECK (stress_score BETWEEN 0 AND 100),
  focus_score INTEGER CHECK (focus_score BETWEEN 0 AND 100),
  digestion_score INTEGER CHECK (digestion_score BETWEEN 0 AND 100),
  habit_exercise BOOLEAN DEFAULT FALSE,
  habit_meditation BOOLEAN DEFAULT FALSE,
  habit_no_alcohol BOOLEAN DEFAULT FALSE,
  habit_healthy_eating BOOLEAN DEFAULT FALSE,
  habit_early_sleep BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Wearable data
CREATE TABLE wearable_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  source TEXT,
  sleep_duration_minutes INTEGER,
  sleep_efficiency_pct INTEGER,
  sleep_deep_minutes INTEGER,
  sleep_rem_minutes INTEGER,
  sleep_bedtime TIME,
  sleep_wake_time TIME,
  steps INTEGER,
  active_calories INTEGER,
  exercise_minutes INTEGER,
  resting_hr INTEGER,
  hrv_ms INTEGER,
  spo2_pct INTEGER,
  skin_temp_celsius DECIMAL(4,2),
  stress_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, source)
);

-- Computed scores
CREATE TABLE computed_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mirror_score INTEGER,
  sleep_score INTEGER,
  stress_score INTEGER,
  energy_score INTEGER,
  focus_score INTEGER,
  mood_score INTEGER,
  digestion_score INTEGER,
  habit_score INTEGER,
  hrv_score INTEGER,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- AI insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  insight_type TEXT,
  dimension TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_text TEXT,
  priority INTEGER DEFAULT 5,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Correlations
CREATE TABLE correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  dimension_a TEXT NOT NULL,
  dimension_b TEXT NOT NULL,
  correlation_coefficient DECIMAL(5,4),
  lag_days INTEGER DEFAULT 0,
  confidence DECIMAL(5,4),
  data_points INTEGER,
  description TEXT
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE computed_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE correlations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "own_data" ON daily_checkins FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON wearable_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON computed_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON ai_insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_data" ON correlations FOR ALL USING (auth.uid() = user_id);
