import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { liveClasses } from '../data/mockData';
import { colors, subjectColors } from '../theme/colors';

export default function LiveClassesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Live Classes</Text>
        <Text style={styles.subtitle}>Join live sessions with expert instructors</Text>

        {liveClasses.map((liveClass) => (
          <TouchableOpacity key={liveClass.id} style={styles.card} activeOpacity={0.7}>
            {liveClass.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE NOW</Text>
              </View>
            )}

            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.subjectDot,
                  { backgroundColor: subjectColors[liveClass.subject] ?? colors.primary },
                ]}
              />
              <Text style={styles.subject}>{liveClass.subject}</Text>
            </View>

            <Text style={styles.classTitle}>{liveClass.title}</Text>
            <Text style={styles.instructor}>{liveClass.instructor}</Text>

            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={colors.textLight} />
                <Text style={styles.metaText}>{liveClass.scheduledAt}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="hourglass-outline" size={16} color={colors.textLight} />
                <Text style={styles.metaText}>{liveClass.duration} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={16} color={colors.textLight} />
                <Text style={styles.metaText}>{liveClass.participants} joined</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.joinButton, liveClass.isLive && styles.joinButtonLive]}
            >
              <Ionicons name="videocam" size={18} color="#FFFFFF" />
              <Text style={styles.joinText}>{liveClass.isLive ? 'Join Now' : 'Set Reminder'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EF444415',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subject: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textLight,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
  },
  joinButtonLive: {
    backgroundColor: '#EF4444',
  },
  joinText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
