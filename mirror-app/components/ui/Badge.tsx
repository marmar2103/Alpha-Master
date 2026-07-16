import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface BadgeProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

export function Badge({ label, color = Colors.mint, style }: BadgeProps) {
  return (
    <View
      style={[
        {
          backgroundColor: `${color}22`,
          borderRadius: 100,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderWidth: 1,
          borderColor: `${color}44`,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: 11, color, fontWeight: '500' }}>{label}</Text>
    </View>
  );
}
