import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: number;
  color: string;
  delay: number;
  size: number;
}

const COLORS = [Colors.mint, Colors.violet, Colors.amber, Colors.rose, Colors.sky, Colors.emerald];

const PARTICLES: Particle[] = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * width,
  color: COLORS[i % COLORS.length],
  delay: Math.random() * 400,
  size: 6 + Math.random() * 8,
}));

function ParticleView({ particle, onDone }: { particle: Particle; onDone?: () => void }) {
  const y = useSharedValue(-20);
  const opacity = useSharedValue(1);

  useEffect(() => {
    y.value = withDelay(particle.delay, withTiming(height * 0.6, { duration: 1200 }));
    opacity.value = withDelay(particle.delay + 800, withTiming(0, { duration: 400 }, (finished) => {
      if (finished && onDone) runOnJS(onDone)();
    }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
    position: 'absolute',
    left: particle.x,
    top: 0,
    width: particle.size,
    height: particle.size,
    borderRadius: particle.size / 2,
    backgroundColor: particle.color,
  }));

  return <Animated.View style={style} />;
}

interface CelebrationOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export function CelebrationOverlay({ visible, onComplete }: CelebrationOverlayProps) {
  const containerOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      containerOpacity.value = withTiming(1, { duration: 200 });
      checkScale.value = withSpring(1, { damping: 10, stiffness: 200 });
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    } else {
      containerOpacity.value = withTiming(0, { duration: 300 });
      checkScale.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: containerOpacity.value }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        },
        containerStyle,
      ]}
    >
      {PARTICLES.map((p, i) => <ParticleView key={i} particle={p} />)}
      <Animated.View
        style={[
          {
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: Colors.mint,
            alignItems: 'center', justifyContent: 'center',
          },
          checkStyle,
        ]}
      >
        <Text style={{ fontSize: 36 }}>✓</Text>
      </Animated.View>
      <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '700', marginTop: 16 }}>
        Logged!
      </Text>
    </Animated.View>
  );
}
