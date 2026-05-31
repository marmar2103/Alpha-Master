import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (session) router.replace('/(tabs)');
  }, [session]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', width: 400, height: 400 }, orbStyle]}>
        <Svg width={400} height={400}>
          <Defs>
            <RadialGradient id="orb" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={Colors.mint} stopOpacity="0.3" />
              <Stop offset="50%" stopColor={Colors.violet} stopOpacity="0.15" />
              <Stop offset="100%" stopColor={Colors.bg} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx={200} cy={200} rx={200} ry={180} fill="url(#orb)" />
        </Svg>
      </Animated.View>

      <View style={{ alignItems: 'center', gap: 16, paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 11, color: Colors.muted, letterSpacing: 3, textTransform: 'uppercase' }}>
          AI × Biometrics × Insight
        </Text>
        <Text style={{ fontSize: 42, fontWeight: '800', color: Colors.text, textAlign: 'center', fontFamily: 'Syne_800ExtraBold', lineHeight: 50 }}>
          Your Health{'\n'}
          <Text style={{ color: Colors.mint }}>Mirror</Text>
        </Text>
        <Text style={{ fontSize: 16, color: Colors.muted, textAlign: 'center', lineHeight: 24 }}>
          Stop tracking data.{'\n'}Start understanding yourself.
        </Text>
      </View>

      <View style={{ position: 'absolute', bottom: 60, width: '100%', paddingHorizontal: 32, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/onboarding')}
          accessibilityLabel="Begin your mirror"
          style={{
            backgroundColor: Colors.mint,
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg }}>Begin your mirror →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/sign-in')}
          accessibilityLabel="Sign in"
          style={{
            borderRadius: 14,
            padding: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.border2,
          }}
        >
          <Text style={{ fontSize: 16, color: Colors.muted }}>Already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
