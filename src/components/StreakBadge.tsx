import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import FadeInView from './FadeInView';

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <FadeInView delay={200} slide={10}>
      <View style={styles.container}>
        <Ionicons name="flame" size={20} color={colors.streak} />
        <Text style={styles.text}>{streak} day streak</Text>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.streak,
  },
});
