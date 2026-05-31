export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          persona: string | null;
          primary_struggle: string | null;
          timezone: string | null;
          onboarding_complete: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mood_score: number | null;
          energy_score: number | null;
          stress_score: number | null;
          focus_score: number | null;
          digestion_score: number | null;
          habit_exercise: boolean | null;
          habit_meditation: boolean | null;
          habit_no_alcohol: boolean | null;
          habit_healthy_eating: boolean | null;
          habit_early_sleep: boolean | null;
          notes: string | null;
          created_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['daily_checkins']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['daily_checkins']['Insert']>;
      };
      computed_scores: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          mirror_score: number | null;
          sleep_score: number | null;
          stress_score: number | null;
          energy_score: number | null;
          focus_score: number | null;
          mood_score: number | null;
          digestion_score: number | null;
          habit_score: number | null;
          hrv_score: number | null;
          computed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['computed_scores']['Row'], 'id' | 'computed_at'>;
        Update: Partial<Database['public']['Tables']['computed_scores']['Insert']>;
      };
      ai_insights: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          insight_type: string | null;
          dimension: string | null;
          title: string;
          body: string;
          action_text: string | null;
          priority: number | null;
          is_read: boolean | null;
          created_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['ai_insights']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ai_insights']['Insert']>;
      };
      correlations: {
        Row: {
          id: string;
          user_id: string;
          computed_at: string | null;
          dimension_a: string;
          dimension_b: string;
          correlation_coefficient: number | null;
          lag_days: number | null;
          confidence: number | null;
          data_points: number | null;
          description: string | null;
        };
        Insert: Omit<Database['public']['Tables']['correlations']['Row'], 'id' | 'computed_at'>;
        Update: Partial<Database['public']['Tables']['correlations']['Insert']>;
      };
    };
  };
}
