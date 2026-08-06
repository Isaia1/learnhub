import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../context/ProgressContext';
import { colors } from '../theme/colors';
import StreakBadge from '../components/StreakBadge';

const menuItems = [
  { icon: 'notifications-outline', label: 'Notifications', color: colors.primary },
  { icon: 'settings-outline', label: 'Settings', color: colors.textSecondary },
  { icon: 'help-circle-outline', label: 'Help & Support', color: colors.textSecondary },
  { icon: 'document-text-outline', label: 'Terms of Service', color: colors.textSecondary },
  { icon: 'shield-checkmark-outline', label: 'Privacy Policy', color: colors.textSecondary },
] as const;

export default function ProfileScreen() {
  const { progress } = useProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          <StreakBadge streak={progress.streak} />
        </View>

        <View style={styles.xpCard}>
          <Ionicons name="star" size={24} color={colors.accent} />
          <View style={styles.xpInfo}>
            <Text style={styles.xpValue}>{progress.totalXP} XP</Text>
            <Text style={styles.xpLabel}>Level {Math.floor(progress.totalXP / 100) + 1} Learner</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <Ionicons name={item.icon} size={22} color={item.color} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  xpInfo: {
    flex: 1,
  },
  xpValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  xpLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
});
