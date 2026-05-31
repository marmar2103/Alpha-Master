import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import { Toggle } from '../ui/Toggle';
import type { WearableSource } from '../../hooks/useWearables';

const DEVICE_META: Record<WearableSource, { label: string; icon: string; description: string }> = {
  apple_health: { label: 'Apple Health', icon: '🍎', description: 'Sleep, HRV, steps, heart rate' },
  google_fit: { label: 'Google Fit', icon: '🤖', description: 'Activity, heart rate, steps' },
  fitbit: { label: 'Fitbit', icon: '⌚', description: 'Sleep stages, SpO2, stress' },
  garmin: { label: 'Garmin', icon: '🏃', description: 'HRV, body battery, VO2 max' },
};

interface DeviceCardProps {
  source: WearableSource;
  connected: boolean;
  lastSync?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isSyncing?: boolean;
}

export function DeviceCard({ source, connected, lastSync, onConnect, onDisconnect, isSyncing }: DeviceCardProps) {
  const meta = DEVICE_META[source];

  return (
    <View style={{
      backgroundColor: Colors.card,
      borderRadius: 14,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: connected ? `${Colors.mint}33` : Colors.border,
    }}>
      <Text style={{ fontSize: 28 }}>{meta.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 15 }}>{meta.label}</Text>
        <Text style={{ color: Colors.muted, fontSize: 12 }}>{meta.description}</Text>
        {connected && lastSync && (
          <Text style={{ color: Colors.mint, fontSize: 11, marginTop: 2 }}>Last sync: {lastSync}</Text>
        )}
        {isSyncing && <ActivityIndicator size="small" color={Colors.mint} style={{ alignSelf: 'flex-start', marginTop: 4 }} />}
      </View>
      <Toggle
        value={connected}
        onToggle={(val) => val ? onConnect() : onDisconnect()}
        color={Colors.mint}
      />
    </View>
  );
}
