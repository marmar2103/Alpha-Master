import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Colors } from '../../constants/colors';
import { HabitChecklist } from './HabitChecklist';
import { useSubmitCheckin } from '../../hooks/useHealthData';
import type { RefObject } from 'react';

interface CheckInSheetProps {
  sheetRef: RefObject<BottomSheet | null>;
  onSuccess?: () => void;
}

type HabitKey = 'habit_exercise' | 'habit_meditation' | 'habit_no_alcohol' | 'habit_healthy_eating' | 'habit_early_sleep';

const SLIDERS = [
  { key: 'mood_score', label: 'Mood', leftLabel: '😫', rightLabel: '🤩' },
  { key: 'energy_score', label: 'Energy', leftLabel: 'Low', rightLabel: 'High' },
  { key: 'stress_score', label: 'Stress', leftLabel: 'Relaxed', rightLabel: 'Wired' },
  { key: 'focus_score', label: 'Focus', leftLabel: 'Scattered', rightLabel: 'Sharp' },
  { key: 'digestion_score', label: 'Digestion', leftLabel: 'Poor', rightLabel: 'Great' },
] as const;

type SliderKey = typeof SLIDERS[number]['key'];

export function CheckInSheet({ sheetRef, onSuccess }: CheckInSheetProps) {
  const [scores, setScores] = useState<Partial<Record<SliderKey, number>>>({});
  const [habits, setHabits] = useState<Partial<Record<HabitKey, boolean>>>({});
  const [notes, setNotes] = useState('');
  const { mutate: submitCheckin, isPending } = useSubmitCheckin();

  const snapPoints = ['80%', '95%'];

  const handleSubmit = () => {
    submitCheckin(
      { ...scores, ...habits, notes },
      {
        onSuccess: () => {
          sheetRef.current?.close();
          onSuccess?.();
        },
        onError: (err) => Alert.alert('Error', err.message),
      }
    );
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: Colors.bg3 }}
      handleIndicatorStyle={{ backgroundColor: Colors.border2 }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
          Daily Check-In
        </Text>

        {SLIDERS.map((slider) => (
          <View key={slider.key} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: Colors.text, fontWeight: '600' }}>{slider.label}</Text>
              <Text style={{ fontSize: 14, color: Colors.mint }}>{scores[slider.key] ?? 5}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 11, color: Colors.muted }}>{slider.leftLabel}</Text>
              <Text style={{ fontSize: 11, color: Colors.muted }}>{slider.rightLabel}</Text>
            </View>
            <View style={{ height: 4, backgroundColor: Colors.border, borderRadius: 2 }}>
              <View
                style={{
                  height: 4,
                  width: `${((scores[slider.key] ?? 5) - 1) / 9 * 100}%`,
                  backgroundColor: Colors.mint,
                  borderRadius: 2,
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(v => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setScores(s => ({ ...s, [slider.key]: v * 10 }))}
                  accessibilityLabel={`${slider.label} ${v}`}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: (scores[slider.key] ?? 50) >= v * 10 ? Colors.mint : Colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 9, color: Colors.bg, fontWeight: '700' }}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <HabitChecklist values={habits} onChange={(key, val) => setHabits(h => ({ ...h, [key]: val }))} />

        <View>
          <Text style={{ fontSize: 14, color: Colors.text, fontWeight: '600', marginBottom: 8 }}>Notes (optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="How are you feeling today?"
            placeholderTextColor={Colors.faint}
            multiline
            style={{
              backgroundColor: Colors.card,
              borderRadius: 12,
              padding: 12,
              color: Colors.text,
              minHeight: 80,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
            accessibilityLabel="Notes input"
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isPending}
          accessibilityLabel="Submit check-in"
          style={{
            backgroundColor: Colors.mint,
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg }}>
            {isPending ? 'Saving...' : 'Save Check-In'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
