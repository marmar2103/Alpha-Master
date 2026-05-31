import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

const HABITS = [
  { key: 'habit_exercise', label: 'Exercise', icon: '🏃' },
  { key: 'habit_meditation', label: 'Meditation', icon: '🧘' },
  { key: 'habit_no_alcohol', label: 'No Alcohol', icon: '🚫🍷' },
  { key: 'habit_healthy_eating', label: 'Healthy Eating', icon: '🥗' },
  { key: 'habit_early_sleep', label: 'Early Sleep', icon: '😴' },
] as const;

type HabitKey = typeof HABITS[number]['key'];

interface HabitChecklistProps {
  values: Partial<Record<HabitKey, boolean>>;
  onChange: (key: HabitKey, value: boolean) => void;
}

export function HabitChecklist({ values, onChange }: HabitChecklistProps) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 14, color: Colors.text, fontWeight: '600' }}>Habits</Text>
      {HABITS.map((habit) => {
        const checked = values[habit.key] ?? false;
        return (
          <TouchableOpacity
            key={habit.key}
            onPress={() => onChange(habit.key, !checked)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 12,
              backgroundColor: checked ? `${Colors.mint}11` : Colors.card,
              borderWidth: 1,
              borderColor: checked ? `${Colors.mint}44` : Colors.border,
            }}
          >
            <Text style={{ fontSize: 20 }}>{habit.icon}</Text>
            <Text style={{ flex: 1, fontSize: 14, color: Colors.text }}>{habit.label}</Text>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: checked ? Colors.mint : 'transparent',
                borderWidth: 2,
                borderColor: checked ? Colors.mint : Colors.border2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {checked ? <Text style={{ fontSize: 12, color: Colors.bg }}>✓</Text> : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
