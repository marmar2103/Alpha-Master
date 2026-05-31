import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { InsightCard } from '../../components/ui/InsightCard';
import { useAIInsights, useGenerateInsight } from '../../hooks/useAIInsights';

export default function InsightsScreen() {
  const { data: insights = [], isLoading } = useAIInsights();
  const { mutate: generateInsight, isPending } = useGenerateInsight();

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
              Insights
            </Text>
            <Text style={{ fontSize: 13, color: Colors.muted }}>
              {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => generateInsight('weekly')}
            disabled={isPending}
            accessibilityLabel="Generate new insights"
            style={{ backgroundColor: `${Colors.violet}22`, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: `${Colors.violet}44` }}
          >
            {isPending ? <ActivityIndicator size="small" color={Colors.violet} /> : <Text style={{ color: Colors.violet, fontSize: 13 }}>Generate ✨</Text>}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color={Colors.violet} style={{ marginTop: 40 }} />
        ) : insights.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
            <Text style={{ fontSize: 40 }}>🧠</Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.text }}>No insights yet</Text>
            <Text style={{ fontSize: 14, color: Colors.muted, textAlign: 'center' }}>Log 3+ days to unlock your first AI insight.</Text>
          </View>
        ) : (
          insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
