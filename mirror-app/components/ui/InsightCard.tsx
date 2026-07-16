import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, DimensionColors } from '../../constants/colors';
import { Card } from './Card';
import type { AIInsight } from '../../types/scores';

interface InsightCardProps {
  insight: AIInsight;
  onPress?: () => void;
}

export function InsightCard({ insight, onPress }: InsightCardProps) {
  const color = insight.dimension ? DimensionColors[insight.dimension] : Colors.violet;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} accessibilityLabel={`Insight: ${insight.title}`}>
      <Card variant="elevated" style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
          <Text style={{ fontSize: 10, color: Colors.muted, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {insight.insight_type ?? 'INSIGHT'}
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
          {insight.title}
        </Text>
        <Text style={{ fontSize: 14, color: Colors.muted, lineHeight: 20 }}>{insight.body}</Text>
        {insight.action_text ? (
          <View style={{ backgroundColor: `${color}22`, borderRadius: 8, padding: 10, marginTop: 4 }}>
            <Text style={{ fontSize: 13, color }}>→ {insight.action_text}</Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}
