import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import StreakBadge from '../components/StreakBadge';

const menuItems = [
  { icon: 'notifications-outline', label: 'Notifications', color: colors.primary },
  { icon: 'settings-outline', label: 'Settings', color: colors.textSecondary },
  { icon: 'help-circle-outline', label: 'Help & Support', color: colors.textSecondary },
] as const;

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'LH';
}

export default function ProfileScreen() {
  const { progress } = useProgress();
  const { user, profile, signOut, isDemoMode } = useAuth();

  const displayName = profile?.displayName ?? (isDemoMode ? 'Guest Learner' : 'Learner');
  const email = user?.email ?? (isDemoMode ? 'Demo mode — sign in to sync progress' : '');
  const initials = getInitials(profile?.displayName ?? null, user?.email ?? null);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <StreakBadge streak={progress.streak} />
        </View>

        {isDemoMode && (
          <View style={styles.demoBanner}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.demoText}>
              Demo mode — add Supabase keys in .env to enable sign-in and cloud sync.
            </Text>
          </View>
        )}

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

        {!isDemoMode && user && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        )}
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
    textAlign: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  demoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
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
