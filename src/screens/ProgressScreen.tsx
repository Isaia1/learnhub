import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/mockData';
import { colors } from '../theme/colors';
import ProgressBar from '../components/ProgressBar';
import StreakBadge from '../components/StreakBadge';

export default function ProgressScreen() {
  const { progress, getCourseProgress } = useProgress();

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallProgress = totalLessons > 0
    ? Math.round((progress.completedLessons.length / totalLessons) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>

        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Overall Progress</Text>
            <StreakBadge streak={progress.streak} />
          </View>
          <Text style={styles.overallPercent}>{overallProgress}%</Text>
          <ProgressBar progress={overallProgress} height={10} />
          <Text style={styles.overviewDetail}>
            {progress.completedLessons.length} of {totalLessons} lessons completed
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="star" size={28} color={colors.accent} />
            <Text style={styles.statValue}>{progress.totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="book" size={28} color={colors.primary} />
            <Text style={styles.statValue}>{progress.completedLessons.length}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="layers" size={28} color={colors.secondary} />
            <Text style={styles.statValue}>{progress.masteredFlashcards.length}</Text>
            <Text style={styles.statLabel}>Flashcards</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="help-circle" size={28} color="#EC4899" />
            <Text style={styles.statValue}>{Object.keys(progress.quizScores).length}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Course Progress</Text>
        {courses.map((course) => {
          const courseProgress = getCourseProgress(course.lessons.map((l) => l.id));
          const quizScore = progress.quizScores[course.id];
          return (
            <View key={course.id} style={styles.courseProgress}>
              <View style={styles.courseHeader}>
                <View style={[styles.courseIcon, { backgroundColor: course.color + '20' }]}>
                  <Ionicons name={course.icon as keyof typeof Ionicons.glyphMap} size={20} color={course.color} />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.title}</Text>
                  <Text style={styles.courseDetail}>
                    {courseProgress}% lessons
                    {quizScore !== undefined ? ` · Quiz: ${quizScore}%` : ''}
                  </Text>
                </View>
                <Text style={[styles.coursePercent, { color: course.color }]}>{courseProgress}%</Text>
              </View>
              <ProgressBar progress={courseProgress} color={course.color} />
            </View>
          );
        })}
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
    marginBottom: 20,
  },
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  overallPercent: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
  },
  overviewDetail: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flexGrow: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  courseProgress: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  courseDetail: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  coursePercent: {
    fontSize: 16,
    fontWeight: '700',
  },
});
