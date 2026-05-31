import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { DIMENSIONS } from '../../constants/dimensions';
import { ScoreCard } from '../ui/ScoreCard';
import type { ComputedScores } from '../../types/scores';

interface ScoresGridProps {
  scores: ComputedScores | null;
}

export function ScoresGrid({ scores }: ScoresGridProps) {
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {DIMENSIONS.map((dim) => (
        <ScoreCard
          key={dim.key}
          dimensionKey={dim.key}
          label={dim.label}
          icon={dim.icon}
          score={scores ? (scores[`${dim.key}_score` as keyof ComputedScores] as number ?? scores[dim.key as keyof ComputedScores] as number ?? null) : null}
          onPress={() => router.push(`/score/${dim.key}`)}
          style={{ width: '47%' }}
        />
      ))}
    </View>
  );
}
