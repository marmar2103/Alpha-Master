import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Sign in failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, padding: 32, justifyContent: 'center', gap: 20 }}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <Text style={{ color: Colors.muted, fontSize: 14 }}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold' }}>
          Welcome back
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={Colors.faint}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ backgroundColor: Colors.card, borderRadius: 12, padding: 16, color: Colors.text, borderWidth: 1, borderColor: Colors.border }}
          accessibilityLabel="Email input"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={Colors.faint}
          secureTextEntry
          style={{ backgroundColor: Colors.card, borderRadius: 12, padding: 16, color: Colors.text, borderWidth: 1, borderColor: Colors.border }}
          accessibilityLabel="Password input"
        />

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          accessibilityLabel="Sign in button"
          style={{ backgroundColor: Colors.mint, borderRadius: 14, padding: 16, alignItems: 'center', opacity: loading ? 0.6 : 1 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg }}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')} accessibilityLabel="Create account">
          <Text style={{ textAlign: 'center', color: Colors.muted, fontSize: 14 }}>
            No account? <Text style={{ color: Colors.mint }}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
