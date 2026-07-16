import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/colors';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Required', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      Alert.alert('Sign up failed', error.message);
      return;
    }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, display_name: name } as any);
    }
    setLoading(false);
    router.replace('/(auth)/onboarding');
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
          Create account
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={Colors.faint}
          style={{ backgroundColor: Colors.card, borderRadius: 12, padding: 16, color: Colors.text, borderWidth: 1, borderColor: Colors.border }}
          accessibilityLabel="Name input"
        />
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
          placeholder="Password (min 8 chars)"
          placeholderTextColor={Colors.faint}
          secureTextEntry
          style={{ backgroundColor: Colors.card, borderRadius: 12, padding: 16, color: Colors.text, borderWidth: 1, borderColor: Colors.border }}
          accessibilityLabel="Password input"
        />

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          accessibilityLabel="Create account button"
          style={{ backgroundColor: Colors.mint, borderRadius: 14, padding: 16, alignItems: 'center', opacity: loading ? 0.6 : 1 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg }}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
