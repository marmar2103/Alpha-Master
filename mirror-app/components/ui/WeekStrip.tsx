import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';

interface DayScore {
  date: string;
  score: number | null;
}

interface WeekStripProps {
  days: DayScore[];
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeekStrip({ days }: WeekStripProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {days.map((day) => {
          const isToday = day.date === today;
          const d = new Date(day.date);
          const dayName = DAY_NAMES[d.getDay()];

          return (
            <View
              key={day.date}
              style={{
                width: 44,
                alignItems: 'center',
                padding: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isToday ? Colors.mint : Colors.border,
                backgroundColor: isToday ? `${Colors.mint}11` : 'transparent',
              }}
            >
              <Text style={{ fontSize: 10, color: Colors.muted, marginBottom: 4 }}>{dayName}</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: day.score ? Colors.text : Colors.faint }}>
                {day.score ?? '--'}
              </Text>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: day.score ? Colors.mint : Colors.faint, marginTop: 4 }} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
