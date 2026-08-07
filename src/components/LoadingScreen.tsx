import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Logo from './Logo';
import AnimatedScreen from './AnimatedScreen';
import FadeInView from './FadeInView';

export default function LoadingScreen() {
  return (
    <AnimatedScreen edges={[]}>
      <FadeInView style={styles.center}>
        <Logo />
        <ActivityIndicator size="large" color={colors.primaryLight} style={styles.spinner} />
      </FadeInView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  spinner: {
    marginTop: 8,
  },
});
