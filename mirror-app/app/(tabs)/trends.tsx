import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useScoreHistory } from '../../hooks/useHealthData';
import { DIMENSIONS } from '../../constants/dimensions';
import { LineChart } from '../../components/ui/LineChart';
import { Card } from '../../components/ui/Card';
import type { ComputedScores } from '../../types/scores';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export default function TrendsScreen() {
  const [range, setRange] = useState(7);
  const [activeDim, setActiveDim] = useState<string | null>(null);
  const { data: scores = [], isLoading } = useScoreHistory(range);

  const mirrorChartData = scores.map(s => ({
    date: s.date,
    value: s.mirror_score ?? 0,
    label: s.date.slice(5),
  }));

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, s) => a + (s.mirror_score ?? 0), 0) / scores.length)
    : null;

  const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.mirror_score ?? 0)) : null;

  const activeDimData = activeDim ? scores.map(s => ({
    date: s.date,
    value: (s as ComputedScores)[`${activeDim}_score` as keyof ComputedScores] as number ?? 50,
    label: s.date.slice(5),
  })) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
          Trends
        </Text>

        <View style={{ flexDirection: 'row', backgroundColor: Colors.card, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: Colors.border }}>
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

        {/* Summary row */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: Colors.muted, marginBottom: 4 }}>Avg Score</Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.mint, fontFamily: 'Syne_800ExtraBold' }}>
              {isLoading ? '...' : avgScore ?? '--'}
            </Text>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: Colors.muted, marginBottom: 4 }}>Best Day</Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.violet, fontFamily: 'Syne_800ExtraBold' }}>
              {isLoading ? '...' : bestScore ?? '--'}
            </Text>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: Colors.muted, marginBottom: 4 }}>Days Logged</Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.amber, fontFamily: 'Syne_800ExtraBold' }}>
              {isLoading ? '...' : scores.length}
            </Text>
          </Card>
        </View>

        {/* Mirror score chart */}
        <Card>
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold', marginBottom: 12 }}>
            Mirror Score
          </Text>
          {isLoading ? (
            <ActivityIndicator color={Colors.mint} />
          ) : (
            <LineChart data={mirrorChartData} color={Colors.mint} height={120} />
          )}
        </Card>

        {/* Dimension breakdown — tap to expand chart */}
        <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
          Dimension Breakdown
        </Text>

        {DIMENSIONS.map((dim) => {
          const avg = scores.length > 0
            ? Math.round(scores.reduce((a, s) => a + ((s as ComputedScores)[`${dim.key}_score` as keyof ComputedScores] as number ?? 50), 0) / scores.length)
            : null;
          const isActive = activeDim === dim.key;

          return (
            <TouchableOpacity
              key={dim.key}
              onPress={() => setActiveDim(isActive ? null : dim.key)}
              accessibilityLabel={`${dim.label} trend`}
            >
              <Card variant={isActive ? 'elevated' : 'default'} style={{ gap: 10, borderColor: isActive ? `${dim.color}44` : Colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ fontSize: 20 }}>{dim.icon}</Text>
                  <Text style={{ flex: 1, color: Colors.text, fontSize: 14, fontWeight: '600' }}>{dim.label}</Text>
                  <View style={{ width: 60, height: 4, backgroundColor: Colors.border, borderRadius: 2 }}>
                    <View style={{ width: `${avg ?? 0}%`, height: 4, backgroundColor: dim.color, borderRadius: 2 }} />
                  </View>
                  <Text style={{ width: 32, color: dim.color, fontWeight: '700', fontSize: 14, textAlign: 'right' }}>
                    {avg ?? '--'}
                  </Text>
                </View>
                {isActive && activeDimData.length > 0 && (
                  <LineChart data={activeDimData} color={dim.color} height={80} showLabels={false} />
                )}
              </Card>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
