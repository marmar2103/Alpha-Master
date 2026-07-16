import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';

interface CorrelationBarProps {
  dimensionA: string;
  dimensionB: string;
  coefficient: number;
}

export function CorrelationBar({ dimensionA, dimensionB, coefficient }: CorrelationBarProps) {
  const pct = Math.abs(coefficient) * 100;
  const color = coefficient > 0 ? Colors.mint : Colors.rose;
  const label = `${dimensionA} → ${dimensionB}`;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 }}>
      <Text style={{ width: 100, fontSize: 11, color: Colors.muted }} numberOfLines={1}>{label}</Text>
      <View style={{ flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2 }}>
        <View style={{ width: `${pct}%`, height: 4, backgroundColor: color, borderRadius: 2 }} />
      </View>
      <Text style={{ width: 36, fontSize: 11, color, textAlign: 'right' }}>{Math.round(pct)}%</Text>
    </View>
  );
}
