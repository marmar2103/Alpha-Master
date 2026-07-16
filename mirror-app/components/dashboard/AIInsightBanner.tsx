import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Card } from '../ui/Card';
import type { AIInsight } from '../../types/scores';

interface AIInsightBannerProps {
  insights: AIInsight[];
  onGenerateNew: () => void;
  isGenerating?: boolean;
}

export function AIInsightBanner({ insights, onGenerateNew, isGenerating }: AIInsightBannerProps) {
  const [index, setIndex] = useState(0);
  const opacity = useSharedValue(1);

  const current = insights[index];

  const cycleInsight = () => {
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(setIndex)((index + 1) % Math.max(insights.length, 1));
      opacity.value = withTiming(1, { duration: 300 });
    });
  };

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Card variant="elevated" style={{ borderColor: `${Colors.violet}33`, gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.violet }} />
        <Text style={{ fontSize: 10, color: Colors.violet, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '600' }}>
          AI Mirror Insight
        </Text>
      </View>

      {current ? (
        <Animated.View style={animStyle}>
          <Text style={{ fontSize: 15, color: Colors.text, lineHeight: 22, fontWeight: '500' }}>
            {current.body}
          </Text>
          {current.action_text ? (
            <Text style={{ fontSize: 13, color: Colors.violet, marginTop: 8 }}>→ {current.action_text}</Text>
          ) : null}
        </Animated.View>
      ) : (
        <Text style={{ fontSize: 14, color: Colors.muted }}>No insights yet. Log your day to get started.</Text>
      )}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
        {insights.length > 1 ? (
          <TouchableOpacity onPress={cycleInsight} accessibilityLabel="Next insight">
            <Text style={{ fontSize: 13, color: Colors.muted }}>Next insight ↻</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onGenerateNew} accessibilityLabel="Generate new insight" disabled={isGenerating}>
          {isGenerating ? (
            <ActivityIndicator size="small" color={Colors.violet} />
          ) : (
            <Text style={{ fontSize: 13, color: Colors.violet }}>Deep dive →</Text>
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
}
