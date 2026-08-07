import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import BreathingGradientBackground from './BreathingGradientBackground';

interface AnimatedScreenProps {
  children: ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function AnimatedScreen({
  children,
  edges = ['top'],
  style,
  contentStyle,
}: AnimatedScreenProps) {
  return (
    <View style={[styles.root, style]}>
      <BreathingGradientBackground />
      <SafeAreaView style={[styles.content, contentStyle]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#5B21B6',
  },
  content: {
    flex: 1,
  },
});
