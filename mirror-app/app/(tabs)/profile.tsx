import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Badge } from '../../components/ui/Badge';
import { DeviceCard } from '../../components/wearables/DeviceCard';
import { LiveMetricsCard } from '../../components/wearables/LiveMetricsCard';
import { useWearables } from '../../hooks/useWearables';
import { useWearableData, useProfile } from '../../hooks/useHealthData';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuthStore();
  const { connections, connect, disconnect, syncData, isSyncing } = useWearables();
  const { data: wearableData } = useWearableData();
  useProfile(); // loads profile into store

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>Profile</Text>

        {/* Avatar */}
        <View style={{ backgroundColor: Colors.card, borderRadius: 20, padding: 20, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.border }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: `${Colors.mint}22`, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.mint }}>
            <Text style={{ fontSize: 32 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text, fontFamily: 'Syne_700Bold' }}>
            {profile?.display_name ?? user?.email ?? 'Mirror User'}
          </Text>
          {profile?.persona ? <Badge label={profile.persona} color={Colors.mint} /> : null}
          <Text style={{ fontSize: 13, color: Colors.muted }}>{user?.email}</Text>
        </View>

        {/* Live biometrics */}
        <LiveMetricsCard data={wearableData ?? null} />

        {/* Wearables */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Connected Devices</Text>
            <TouchableOpacity onPress={syncData} disabled={isSyncing} accessibilityLabel="Sync wearable data">
              <Text style={{ fontSize: 13, color: isSyncing ? Colors.muted : Colors.mint }}>
                {isSyncing ? 'Syncing...' : '↻ Sync'}
              </Text>
            </TouchableOpacity>
          </View>
          {connections.map((c) => (
            <DeviceCard
              key={c.source}
              source={c.source}
              connected={c.connected}
              lastSync={c.lastSync}
              onConnect={() => connect(c.source)}
              onDisconnect={() => disconnect(c.source)}
              isSyncing={isSyncing && c.connected}
            />
          ))}
        </View>

        {/* Account */}
        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 14, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Account</Text>
          <TouchableOpacity
            onPress={handleSignOut}
            accessibilityLabel="Sign out"
            style={{ backgroundColor: Colors.card, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.border }}
          >
            <Text style={{ fontSize: 20 }}>🚪</Text>
            <Text style={{ color: Colors.rose, fontWeight: '600' }}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
