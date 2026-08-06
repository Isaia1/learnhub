import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Logo from './Logo';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Logo />
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 32,
  },
  spinner: {
    marginTop: 8,
  },
});
