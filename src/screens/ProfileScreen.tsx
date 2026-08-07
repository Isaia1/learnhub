import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import StreakBadge from '../components/StreakBadge';
import AnimatedScreen from '../components/AnimatedScreen';
import TabScrollView from '../components/TabScrollView';

import FadeInView from '../components/FadeInView';

const glass = {
  backgroundColor: colors.surfaceSolid,
  borderWidth: 1,
  borderColor: colors.glassBorder,
};

const menuItems = [
  { icon: 'notifications-outline', label: 'Notifications', color: colors.primaryLight },
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
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.displayName ?? 'Learner';
  const email = user?.email ?? '';
  const initials = getInitials(profile?.displayName ?? null, user?.email ?? null);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <AnimatedScreen edges={['top']}>
      <TabScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{email}</Text>
            <StreakBadge streak={progress.streak} />
          </View>
        </FadeInView>

        <FadeInView delay={150}>
          <View style={[styles.xpCard, glass]}>
            <Ionicons name="star" size={24} color={colors.accent} />
            <View style={styles.xpInfo}>
              <Text style={styles.xpValue}>{progress.totalXP} XP</Text>
              <Text style={styles.xpLabel}>Level {Math.floor(progress.totalXP / 100) + 1} Learner</Text>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={220}>
          <View style={[styles.menu, glass]}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <Ionicons name={item.icon} size={22} color={item.color} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </FadeInView>

        {user && (
          <FadeInView delay={300}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </FadeInView>
        )}
      </TabScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: colors.text },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: colors.textSecondary, marginBottom: 12, textAlign: 'center' },
  xpCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 20, marginBottom: 24, gap: 16 },
  xpInfo: { flex: 1 },
  xpValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  xpLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  menu: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 14 },
  menuLabel: { flex: 1, fontSize: 16, color: colors.text },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.4)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.error },
});
