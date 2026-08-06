import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../theme/colors';

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashcardComponent({ front, back, isFlipped, onFlip }: FlashcardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [isFlipped, flipAnim]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={onFlip} activeOpacity={0.9} style={styles.container}>
      <Animated.View style={[styles.card, styles.front, { transform: [{ rotateY: frontInterpolate }] }]}>
        <Text style={styles.label}>Question</Text>
        <Text style={styles.text}>{front}</Text>
        <Text style={styles.hint}>Tap to flip</Text>
      </Animated.View>
      <Animated.View style={[styles.card, styles.back, { transform: [{ rotateY: backInterpolate }] }]}>
        <Text style={styles.label}>Answer</Text>
        <Text style={styles.text}>{back}</Text>
        <Text style={styles.hint}>Tap to flip back</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    marginVertical: 20,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  front: {},
  back: {},
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  hint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 12,
    color: colors.textLight,
  },
});
