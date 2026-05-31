import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Badge } from '../../components/ui/Badge';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
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
        <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
          Profile
        </Text>

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

        <View style={{ gap: 12 }}>
          <Text style={{ fontSize: 14, color: Colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Health Data</Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.card, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.border }}
            accessibilityLabel="Connect Apple Health"
          >
            <Text style={{ fontSize: 24 }}>🍎</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.text, fontWeight: '600' }}>Apple Health</Text>
              <Text style={{ color: Colors.muted, fontSize: 12 }}>Connect to sync sleep, HRV, steps</Text>
            </View>
            <Text style={{ color: Colors.muted, fontSize: 13 }}>Connect →</Text>
          </TouchableOpacity>
        </View>

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
