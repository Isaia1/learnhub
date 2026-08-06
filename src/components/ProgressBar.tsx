import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({ progress, color = colors.primary, height = 8 }: ProgressBarProps) {
  return (
    <View style={[styles.track, { height }]}>
      <View
        style={[
          styles.fill,
          { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 4,
  },
});
