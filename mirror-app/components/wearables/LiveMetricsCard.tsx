import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { Card } from '../ui/Card';
import type { WearableData } from '../../types/health';

interface LiveMetricsCardProps {
  data: WearableData | null;
}

type MetricConfig = {
  key: keyof WearableData;
  label: string;
  unit: string;
  icon: string;
  color: string;
  transform?: (v: number) => string;
};

const METRICS: MetricConfig[] = [
  { key: 'hrv_ms', label: 'HRV', unit: 'ms', icon: '💓', color: Colors.sky },
  { key: 'resting_hr', label: 'Resting HR', unit: 'bpm', icon: '❤️', color: Colors.rose },
  { key: 'steps', label: 'Steps', unit: '', icon: '👟', color: Colors.amber },
  { key: 'sleep_duration_minutes', label: 'Sleep', unit: 'h', icon: '😴', color: Colors.violet, transform: (v: number) => (v / 60).toFixed(1) },
  { key: 'spo2_pct', label: 'SpO2', unit: '%', icon: '🫁', color: Colors.emerald },
  { key: 'sleep_efficiency_pct', label: 'Sleep Eff.', unit: '%', icon: '🌙', color: Colors.sky },
];

export function LiveMetricsCard({ data }: LiveMetricsCardProps) {
  return (
    <Card>
      <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold', marginBottom: 12 }}>
        Live Biometrics
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {METRICS.map((metric) => {
          const raw = data ? (data[metric.key] as number | undefined | null) : null;
          const display = raw !== null && raw !== undefined
            ? (metric.transform ? metric.transform(raw) : String(raw))
            : '--';

          return (
            <View
              key={metric.key}
              style={{
                width: '30%',
                backgroundColor: Colors.bg3,
                borderRadius: 10,
                padding: 10,
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 18 }}>{metric.icon}</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: metric.color }}>
                {display}{raw !== null && raw !== undefined ? metric.unit : ''}
              </Text>
              <Text style={{ fontSize: 9, color: Colors.muted, textAlign: 'center' }}>{metric.label}</Text>
            </View>
          );
        })}
      </View>
      {!data && (
        <Text style={{ fontSize: 13, color: Colors.muted, textAlign: 'center', marginTop: 8 }}>
          Connect a wearable to see live data
        </Text>
      )}
    </Card>
  );
}
