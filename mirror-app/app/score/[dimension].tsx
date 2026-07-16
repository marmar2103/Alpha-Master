import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, DimensionColors } from '../../constants/colors';
import { DIMENSIONS } from '../../constants/dimensions';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { useMirrorScore } from '../../hooks/useMirrorScore';
import { useCorrelations } from '../../hooks/useCorrelations';

export default function DimensionDeepDive() {
  const { dimension } = useLocalSearchParams<{ dimension: string }>();
  const router = useRouter();
  const { scores } = useMirrorScore();
  const { data: correlations = [] } = useCorrelations();

  const dim = DIMENSIONS.find(d => d.key === dimension);
  const color = DimensionColors[dimension ?? ''] ?? Colors.mint;
  const scoreKey = `${dimension}_score` as keyof typeof scores;
  const score = scores ? (scores[scoreKey] as number | undefined ?? null) : null;
  const relatedCorrelations = correlations.filter(
    c => c.dimension_a === dimension || c.dimension_b === dimension
  );

  if (!dim) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <Text style={{ color: Colors.muted, fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', gap: 16 }}>
          <ScoreRing score={score ?? 0} size={140} strokeWidth={10} color={color} />
          <Text style={{ fontSize: 48, fontWeight: '800', color, fontFamily: 'Syne_800ExtraBold' }}>
            {score ?? '--'}
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
            {dim.icon} {dim.label}
          </Text>
          <Text style={{ fontSize: 14, color: Colors.muted, textAlign: 'center' }}>{dim.description}</Text>
        </View>

        {relatedCorrelations.length > 0 && (
          <View style={{ backgroundColor: Colors.card, borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: Colors.border }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
              What affects {dim.label}
            </Text>
            {relatedCorrelations.slice(0, 3).map((c, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: (c.correlation_coefficient ?? 0) > 0 ? Colors.mint : Colors.rose, fontSize: 16 }}>
                  {(c.correlation_coefficient ?? 0) > 0 ? '↑' : '↓'}
                </Text>
                <Text style={{ color: Colors.text, fontSize: 14 }}>
                  {c.dimension_a === dimension ? c.dimension_b : c.dimension_a}
                </Text>
                <Text style={{ color: Colors.muted, fontSize: 12, marginLeft: 'auto' }}>
                  {Math.round(Math.abs(c.correlation_coefficient ?? 0) * 100)}% corr.
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ backgroundColor: Colors.card, borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: Colors.border }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
            Score Source
          </Text>
          <Text style={{ fontSize: 14, color: Colors.muted }}>
            {dim.scoreSource === 'wearable' ? '⌚ Synced from connected wearable device' :
             dim.scoreSource === 'checkin' ? '📝 Based on your daily check-in responses' :
             '🧮 Computed from wearable + check-in data'}
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
