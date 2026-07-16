import { Colors } from './colors';

export interface Dimension {
  key: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  scoreSource: 'wearable' | 'checkin' | 'computed';
  weight: number;
}

export const DIMENSIONS: Dimension[] = [
  { key: 'sleep', label: 'Sleep', icon: '😴', color: Colors.sky, description: 'Duration, efficiency, and timing', scoreSource: 'wearable', weight: 0.20 },
  { key: 'stress', label: 'Stress', icon: '🔥', color: Colors.rose, description: 'HRV-derived + self-reported', scoreSource: 'computed', weight: 0.18 },
  { key: 'energy', label: 'Energy', icon: '⚡', color: Colors.amber, description: 'Subjective energy levels', scoreSource: 'checkin', weight: 0.15 },
  { key: 'focus', label: 'Focus', icon: '🧠', color: Colors.violet, description: 'Cognitive performance', scoreSource: 'checkin', weight: 0.14 },
  { key: 'mood', label: 'Mood', icon: '😊', color: Colors.mint, description: 'Emotional state', scoreSource: 'checkin', weight: 0.13 },
  { key: 'digestion', label: 'Gut', icon: '🫄', color: Colors.emerald, description: 'Digestive comfort', scoreSource: 'checkin', weight: 0.08 },
  { key: 'habit', label: 'Habits', icon: '✅', color: Colors.mint, description: 'Daily habit consistency', scoreSource: 'computed', weight: 0.07 },
  { key: 'hrv', label: 'HRV', icon: '💓', color: Colors.sky, description: 'Heart rate variability', scoreSource: 'wearable', weight: 0.05 },
];
