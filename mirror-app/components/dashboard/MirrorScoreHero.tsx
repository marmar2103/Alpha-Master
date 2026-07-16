import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { ScoreRing } from '../ui/ScoreRing';
import { Badge } from '../ui/Badge';

interface MirrorScoreHeroProps {
  score: number | null;
  userName?: string;
  badges?: Array<{ label: string; color?: string }>;
}

export function MirrorScoreHero({ score, userName, badges = [] }: MirrorScoreHeroProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const displayScore = score ?? 0;

  return (
    <View style={{ alignItems: 'center', paddingVertical: 32 }}>
      <Text style={{ fontSize: 13, color: Colors.muted, letterSpacing: 0.5, marginBottom: 8 }}>{today}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <ScoreRing score={displayScore} size={140} strokeWidth={10} color={Colors.mint} />
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={{ fontSize: 42, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
            {score ?? '--'}
          </Text>
          <Text style={{ fontSize: 12, color: Colors.muted, letterSpacing: 2, textTransform: 'uppercase' }}>mirror</Text>
        </View>
      </View>
      {userName ? (
        <Text style={{ fontSize: 20, color: Colors.text, fontWeight: '700', fontFamily: 'Syne_700Bold', marginBottom: 12 }}>
          Good morning, {userName}
        </Text>
      ) : null}
      {badges.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {badges.map((b, i) => <Badge key={i} label={b.label} color={b.color} />)}
        </View>
      ) : null}
    </View>
  );
}
