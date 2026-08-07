import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradient } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const DOT_SPACING = 26;
const DOT_SIZE = 2.5;

type DotGridProps = {
  spacing: number;
  dotSize: number;
  baseOpacity: number;
  offsetX?: number;
  offsetY?: number;
};

function DotGrid({ spacing, dotSize, baseOpacity, offsetX = 0, offsetY = 0 }: DotGridProps) {
  const dots = useMemo(() => {
    const items: { key: string; x: number; y: number }[] = [];
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        items.push({
          key: `${row}-${col}-${spacing}`,
          x: col * spacing + offsetX,
          y: row * spacing + offsetY,
        });
      }
    }

    return items;
  }, [spacing, offsetX, offsetY]);

  return (
    <>
      {dots.map((dot) => (
        <View
          key={dot.key}
          style={[
            styles.dot,
            {
              left: dot.x,
              top: dot.y,
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              opacity: baseOpacity,
            },
          ]}
        />
      ))}
    </>
  );
}

export default function BreathingGradientBackground() {
  const breathe = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [breathe, drift]);

  const scale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });

  const glowOpacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.9],
  });

  const dotOpacity = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, 0.38],
  });

  const dotScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  const driftX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-14, 14],
  });

  const driftY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -10],
  });

  const driftXReverse = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -10],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[gradient.orange, gradient.purple, gradient.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.glowLayer,
          {
            opacity: glowOpacity,
            transform: [{ scale }, { translateX: driftX }, { translateY: driftY }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,107,53,0.55)', 'rgba(124,58,237,0.45)', 'rgba(37,99,235,0.55)']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.glowGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.glowLayer,
          {
            opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] }),
            transform: [
              { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1.08, 0.96] }) },
              { translateX: driftXReverse },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(251,146,60,0.35)', 'rgba(91,33,182,0.4)', 'rgba(59,130,246,0.35)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.glowGradient, { width: width * 1.4, height: height * 1.4 }]}
        />
      </Animated.View>

      {/* Primary dot grid — breathes with opacity + scale */}
      <Animated.View
        style={[
          styles.dotLayer,
          {
            opacity: dotOpacity,
            transform: [{ scale: dotScale }, { translateX: driftX }, { translateY: driftY }],
          },
        ]}
      >
        <DotGrid spacing={DOT_SPACING} dotSize={DOT_SIZE} baseOpacity={1} />
      </Animated.View>

      {/* Offset dot layer for subtle depth */}
      <Animated.View
        style={[
          styles.dotLayer,
          {
            opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.22] }),
            transform: [
              { scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1.02, 0.98] }) },
              { translateX: driftXReverse },
              { translateY: driftY },
            ],
          },
        ]}
      >
        <DotGrid
          spacing={DOT_SPACING * 1.6}
          dotSize={DOT_SIZE * 0.7}
          baseOpacity={1}
          offsetX={DOT_SPACING * 0.5}
          offsetY={DOT_SPACING * 0.5}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  glowLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowGradient: {
    width: width * 1.3,
    height: height * 1.3,
    borderRadius: width,
  },
  dotLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});
