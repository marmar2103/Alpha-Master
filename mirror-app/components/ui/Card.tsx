import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: variant === 'elevated' ? Colors.card2 : Colors.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
