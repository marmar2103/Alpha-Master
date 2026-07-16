import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { CorrelationBar } from '../ui/CorrelationBar';
import { Card } from '../ui/Card';

interface CorrelationMapProps {
  correlations: Array<{
    dimension_a: string;
    dimension_b: string;
    correlation_coefficient: number | null;
  }>;
}

export function CorrelationMap({ correlations }: CorrelationMapProps) {
  return (
    <Card>
      <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold', marginBottom: 12 }}>
        Correlation Map
      </Text>
      {correlations.length === 0 ? (
        <Text style={{ fontSize: 14, color: Colors.muted }}>Log 7+ days to unlock correlations.</Text>
      ) : (
        correlations.map((c, i) => (
          <CorrelationBar
            key={i}
            dimensionA={c.dimension_a}
            dimensionB={c.dimension_b}
            coefficient={c.correlation_coefficient ?? 0}
          />
        ))
      )}
    </Card>
  );
}
