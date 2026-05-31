import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { WeekStrip } from '../ui/WeekStrip';
import type { ComputedScores } from '../../types/scores';

interface WeeklyCalendarProps {
  scores: ComputedScores[];
}

export function WeeklyCalendar({ scores }: WeeklyCalendarProps) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const score = scores.find(s => s.date === dateStr);
    return { date: dateStr, score: score?.mirror_score ?? null };
  });

  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold', marginBottom: 12 }}>
        This Week
      </Text>
      <WeekStrip days={days} />
    </View>
  );
}
