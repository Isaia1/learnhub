import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export default function Logo({ size = 'lg' }: LogoProps) {
  const isLarge = size === 'lg';
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, isLarge ? styles.iconWrapLg : styles.iconWrapSm]}>
        <Ionicons name="school" size={isLarge ? 36 : 24} color="#FFFFFF" />
      </View>
      <Text style={[styles.title, isLarge ? styles.titleLg : styles.titleSm]}>LearnHub</Text>
      {isLarge && <Text style={styles.tagline}>Learn anywhere, anytime</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconWrap: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconWrapLg: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  iconWrapSm: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  title: {
    fontWeight: '800',
    color: colors.text,
  },
  titleLg: {
    fontSize: 32,
  },
  titleSm: {
    fontSize: 22,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
