import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Colors } from '../../constants/colors';

const PERSONAS = [
  { key: 'professional', label: 'Professional', icon: '💼', sub: 'Optimize work performance' },
  { key: 'student', label: 'Student', icon: '📚', sub: 'Balance study and wellbeing' },
  { key: 'biohacker', label: 'Biohacker', icon: '🔬', sub: 'Push limits with data' },
  { key: 'wellness', label: 'Wellness', icon: '🌿', sub: 'Live in natural balance' },
];

const STRUGGLES = [
  { key: 'poor_sleep', label: 'Poor Sleep', icon: '😴', sub: 'Hard to fall or stay asleep' },
  { key: 'burnout', label: 'Burnout', icon: '🔥', sub: 'Exhausted and overwhelmed' },
  { key: 'brain_fog', label: 'Brain Fog', icon: '🧠', sub: 'Low focus and clarity' },
  { key: 'digestion', label: 'Digestion', icon: '🫄', sub: 'Gut health issues' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState('');
  const [struggle, setStruggle] = useState('');

  const handleComplete = async () => {
    if (!user) return;
    await supabase.from('profiles').upsert({
      id: user.id,
      persona,
      primary_struggle: struggle,
      onboarding_complete: true,
    } as any);
    router.replace('/(tabs)');
  };

  const steps = [
    {
      title: "What's your lifestyle?",
      sub: 'Mirror will personalize your insights',
      options: PERSONAS,
      value: persona,
      setValue: setPersona,
    },
    {
      title: 'Your primary struggle?',
      sub: "We'll focus on what matters most",
      options: STRUGGLES,
      value: struggle,
      setValue: setStruggle,
    },
  ];

  const currentStep = steps[step];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, padding: 24 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 60, marginBottom: 40 }}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={{
              height: 4,
              flex: i === step ? 2 : 1,
              borderRadius: 2,
              backgroundColor: i <= step ? Colors.mint : Colors.border,
            }}
          />
        ))}
      </View>

      <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text, fontFamily: 'Syne_800ExtraBold', marginBottom: 8 }}>
        {currentStep.title}
      </Text>
      <Text style={{ fontSize: 15, color: Colors.muted, marginBottom: 32 }}>{currentStep.sub}</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ gap: 12 }}>
          {currentStep.options.map((opt) => {
            const selected = currentStep.value === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => currentStep.setValue(opt.key)}
                accessibilityLabel={opt.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: selected ? `${Colors.mint}11` : Colors.card,
                  borderWidth: 2,
                  borderColor: selected ? Colors.mint : Colors.border,
                }}
              >
                <Text style={{ fontSize: 32 }}>{opt.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text }}>{opt.label}</Text>
                  <Text style={{ fontSize: 13, color: Colors.muted }}>{opt.sub}</Text>
                </View>
                {selected ? <Text style={{ color: Colors.mint, fontSize: 18 }}>✓</Text> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ paddingTop: 20, gap: 12 }}>
        <TouchableOpacity
          onPress={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else handleComplete();
          }}
          disabled={!currentStep.value}
          accessibilityLabel="Continue"
          style={{
            backgroundColor: Colors.mint,
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            opacity: currentStep.value ? 1 : 0.4,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg }}>
            {step < steps.length - 1 ? 'Continue →' : 'Start my mirror →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
