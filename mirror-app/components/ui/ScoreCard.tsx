import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, DimensionColors } from '../../constants/colors';
import { Card } from './Card';

interface ScoreCardProps {
  dimensionKey: string;
  label: string;
  icon: string;
  score: number | null;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ScoreCard({ dimensionKey, label, icon, score, onPress, style }: ScoreCardProps) {
  const color = DimensionColors[dimensionKey] ?? Colors.mint;
  const displayScore = score ?? '--';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style} accessibilityLabel={`${label} score: ${displayScore}`}>
      <Card style={{ padding: 12, gap: 8 }}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color, fontFamily: 'Syne_800ExtraBold' }}>
          {displayScore}
        </Text>
        <Text style={{ fontSize: 12, color: Colors.muted }}>{label}</Text>
        <View style={{ height: 3, backgroundColor: Colors.border, borderRadius: 2 }}>
          <View
            style={{
              height: 3,
              width: `${score ?? 0}%`,
              backgroundColor: color,
              borderRadius: 2,
            }}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
