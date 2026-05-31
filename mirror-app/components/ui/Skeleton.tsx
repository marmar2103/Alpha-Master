import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: width as number, height, borderRadius, backgroundColor: Colors.card2 },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ backgroundColor: Colors.card, borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: Colors.border }, style]}>
      <Skeleton height={12} width="60%" />
      <Skeleton height={32} width="40%" />
      <Skeleton height={4} />
    </View>
  );
}

export function SkeletonInsightCard() {
  return (
    <View style={{ backgroundColor: Colors.card2, borderRadius: 16, padding: 16, gap: 10, borderWidth: 1, borderColor: Colors.border }}>
      <Skeleton height={10} width="30%" />
      <Skeleton height={18} width="80%" />
      <Skeleton height={14} />
      <Skeleton height={14} width="70%" />
      <Skeleton height={36} borderRadius={8} />
    </View>
  );
}
