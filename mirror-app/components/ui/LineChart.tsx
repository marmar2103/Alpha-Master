import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
  showLabels?: boolean;
}

export function LineChart({ data, color = Colors.mint, height = 120, showLabels = true }: LineChartProps) {
  if (data.length === 0) {
    return (
      <View style={{ height, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: Colors.muted, fontSize: 13 }}>No data yet</Text>
      </View>
    );
  }

  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  return (
    <View style={{ height: height + (showLabels ? 24 : 0) }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 4, paddingHorizontal: 4 }}>
          {data.map((point, i) => {
            const barHeight = Math.max(4, ((point.value - min) / range) * (height - 16));
            const isLast = i === data.length - 1;
            return (
              <View key={point.date} style={{ alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 10, color: isLast ? color : Colors.faint }}>{point.value}</Text>
                <View
                  style={{
                    width: 20,
                    height: barHeight,
                    backgroundColor: isLast ? color : `${color}55`,
                    borderRadius: 4,
                  }}
                />
                {showLabels && (
                  <Text style={{ fontSize: 8, color: Colors.faint, width: 24, textAlign: 'center' }}>
                    {point.label ?? point.date.slice(5)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
