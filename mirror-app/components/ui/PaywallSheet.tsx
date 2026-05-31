import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Colors } from '../../constants/colors';
import { PLANS } from '../../constants/monetization';

interface PaywallSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  featureName?: string;
}

export function PaywallSheet({ sheetRef, featureName }: PaywallSheetProps) {
  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['60%', '90%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: Colors.bg3 }}
      handleIndicatorStyle={{ backgroundColor: Colors.border2 }}
    >
      <BottomSheetScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 32 }}>✨</Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold', textAlign: 'center' }}>
            Unlock Mirror Pro
          </Text>
          {featureName && (
            <Text style={{ fontSize: 14, color: Colors.muted, textAlign: 'center' }}>
              {featureName} is a Pro feature
            </Text>
          )}
        </View>

        {/* Feature comparison */}
        {(['pro', 'elite'] as const).map((planKey) => {
          const plan = PLANS[planKey];
          const isElite = planKey === 'elite';

          return (
            <View
              key={planKey}
              style={{
                borderRadius: 16,
                borderWidth: 2,
                borderColor: isElite ? Colors.violet : Colors.mint,
                padding: 16,
                gap: 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
                  {plan.name}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: isElite ? Colors.violet : Colors.mint }}>
                  {plan.price}
                </Text>
              </View>
              {plan.features.map((feature, i) => (
                <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                  <Text style={{ color: isElite ? Colors.violet : Colors.mint }}>✓</Text>
                  <Text style={{ color: Colors.text, fontSize: 14, flex: 1 }}>{feature}</Text>
                </View>
              ))}
              <TouchableOpacity
                accessibilityLabel={`Subscribe to ${plan.name}`}
                style={{
                  backgroundColor: isElite ? Colors.violet : Colors.mint,
                  borderRadius: 12,
                  padding: 14,
                  alignItems: 'center',
                  marginTop: 4,
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.bg }}>
                  Start {plan.name} →
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <Text style={{ fontSize: 12, color: Colors.faint, textAlign: 'center' }}>
          Cancel anytime. No commitments.
        </Text>
        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
