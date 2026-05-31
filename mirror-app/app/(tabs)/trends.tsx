import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useRecentScores } from '../../hooks/useHealthData';
import { DIMENSIONS } from '../../constants/dimensions';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export default function TrendsScreen() {
  const [range, setRange] = useState(7);
  const { data: scores = [] } = useRecentScores(range);

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, s) => a + (s.mirror_score ?? 0), 0) / scores.length)
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
          Trends
        </Text>

        <View style={{ flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, padding: 4 }}>
          {RANGES.map((r) => (
            <TouchableOpacity
              key={r.days}
              onPress={() => setRange(r.days)}
              accessibilityLabel={`Show ${r.label} range`}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: range === r.days ? Colors.bg3 : 'transparent',
              }}
            >
              <Text style={{ color: range === r.days ? Colors.mint : Colors.muted, fontWeight: '600', fontSize: 14 }}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {avgScore !== null && (
          <View style={{ backgroundColor: Colors.card, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.border }}>
            <Text style={{ fontSize: 13, color: Colors.muted, marginBottom: 4 }}>Avg Mirror Score ({range}d)</Text>
            <Text style={{ fontSize: 52, fontWeight: '800', color: Colors.mint, fontFamily: 'Syne_800ExtraBold' }}>
              {avgScore}
            </Text>
          </View>
        )}

        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
            Dimension Breakdown
          </Text>
          {DIMENSIONS.map((dim) => {
            const avg = scores.length > 0
              ? Math.round(scores.reduce((a, s) => {
                  const val = (s as Record<string, unknown>)[`${dim.key}_score`] as number ?? (s as Record<string, unknown>)[dim.key] as number ?? 50;
                  return a + val;
                }, 0) / scores.length)
              : null;

            return (
              <View key={dim.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border }}>
                <Text style={{ fontSize: 20 }}>{dim.icon}</Text>
                <Text style={{ flex: 1, color: Colors.text, fontSize: 14 }}>{dim.label}</Text>
                <View style={{ width: 80, height: 4, backgroundColor: Colors.border, borderRadius: 2 }}>
                  <View style={{ width: `${avg ?? 0}%`, height: 4, backgroundColor: dim.color, borderRadius: 2 }} />
                </View>
                <Text style={{ width: 32, color: dim.color, fontWeight: '700', fontSize: 14, textAlign: 'right' }}>
                  {avg ?? '--'}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
