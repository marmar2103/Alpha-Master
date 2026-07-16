import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
      <Text style={{ fontSize: 36 }}>⚠️</Text>
      <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, textAlign: 'center' }}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          accessibilityLabel="Retry"
          style={{ backgroundColor: Colors.card2, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Colors.border2 }}
        >
          <Text style={{ color: Colors.mint, fontWeight: '600' }}>Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
