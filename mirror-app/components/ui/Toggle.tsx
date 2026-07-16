import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

interface ToggleProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  color?: string;
}

export function Toggle({ value, onToggle, color = Colors.mint }: ToggleProps) {
  const translateX = useSharedValue(value ? 20 : 2);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    const next = !value;
    translateX.value = withSpring(next ? 20 : 2, { damping: 20, stiffness: 200 });
    onToggle(next);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: value ? color : Colors.border2,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: Colors.text,
            position: 'absolute',
          },
          thumbStyle,
        ]}
      />
    </TouchableOpacity>
  );
}
