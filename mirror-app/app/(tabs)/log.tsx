import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../constants/colors';
import { CheckInSheet } from '../../components/log/CheckInSheet';

export default function LogScreen() {
  const sheetRef = useRef<BottomSheet | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
      <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold', marginBottom: 8 }}>
        Daily Check-In
      </Text>
      <Text style={{ fontSize: 15, color: Colors.muted, marginBottom: 32, textAlign: 'center', paddingHorizontal: 32 }}>
        How are you feeling today? Log your day for personalized AI insights.
      </Text>
      <TouchableOpacity
        onPress={() => sheetRef.current?.expand()}
        accessibilityLabel="Open daily check-in"
        style={{ backgroundColor: Colors.mint, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 16 }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg }}>Start Check-In →</Text>
      </TouchableOpacity>

      <CheckInSheet sheetRef={sheetRef} />
    </SafeAreaView>
  );
}
