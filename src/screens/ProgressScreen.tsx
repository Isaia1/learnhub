import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '../context/CoursesContext';
import { useProgress } from '../context/ProgressContext';
import { colors } from '../theme/colors';
import ProgressBar from '../components/ProgressBar';
import StreakBadge from '../components/StreakBadge';
import AnimatedScreen from '../components/AnimatedScreen';
import TabScrollView from '../components/TabScrollView';

import FadeInView from '../components/FadeInView';

const glass = {
  backgroundColor: colors.surfaceSolid,
  borderWidth: 1,
  borderColor: colors.glassBorder,
};

export default function ProgressScreen() {
  const { progress, getCourseProgress } = useProgress();
  const { courses } = useCourses();

  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);
  const overallProgress = totalLessons > 0
    ? Math.round((progress.completedLessons.length / totalLessons) * 100)
    : 0;

  return (
    <AnimatedScreen edges={['top']}>
      <TabScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <Text style={styles.title}>Your Progress</Text>
        </FadeInView>

        <FadeInView delay={100}>
          <View style={[styles.overviewCard, glass]}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Overall Progress</Text>
              <StreakBadge streak={progress.streak} />
            </View>
            <Text style={styles.overallPercent}>{overallProgress}%</Text>
            <ProgressBar progress={overallProgress} height={10} animated />
            <Text style={styles.overviewDetail}>
              {progress.completedLessons.length} of {totalLessons} lessons completed
            </Text>
          </View>
        </FadeInView>

        <View style={styles.statsGrid}>
          {[
            { icon: 'star', color: colors.accent, value: progress.totalXP, label: 'Total XP' },
            { icon: 'book', color: colors.primary, value: progress.completedLessons.length, label: 'Lessons' },
            { icon: 'layers', color: colors.secondary, value: progress.masteredFlashcards.length, label: 'Flashcards' },
            { icon: 'help-circle', color: '#F9A8D4', value: Object.keys(progress.quizScores).length, label: 'Quizzes' },
          ].map((stat, i) => (
            <FadeInView key={stat.label} delay={150 + i * 60} style={styles.statCardWrap}>
              <View style={[styles.statCard, glass]}>
                <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={28} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </FadeInView>
          ))}
        </View>

        <FadeInView delay={400}>
          <Text style={styles.sectionTitle}>Course Progress</Text>
        </FadeInView>
        {courses.map((course, index) => {
          const courseProgress = getCourseProgress(course.lessons.map((l) => l.id));
          const quizScore = progress.quizScores[course.id];
          return (
            <FadeInView key={course.id} delay={450 + index * 70}>
              <View style={[styles.courseProgress, glass]}>
                <View style={styles.courseHeader}>
                  <View style={[styles.courseIcon, { backgroundColor: course.color + '30' }]}>
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
                <ProgressBar progress={courseProgress} color={course.color} animated />
              </View>
            </FadeInView>
          );
        })}
      </TabScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 20 },
  overviewCard: { borderRadius: 20, padding: 24, marginBottom: 20 },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  overviewTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  overallPercent: { fontSize: 48, fontWeight: '800', color: colors.primaryLight, marginBottom: 12 },
  overviewDetail: { fontSize: 13, color: colors.textLight, marginTop: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  statCardWrap: { width: '47%', flexGrow: 1 },
  statCard: { borderRadius: 16, padding: 18, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14 },
  courseProgress: { borderRadius: 14, padding: 16, marginBottom: 10 },
  courseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  courseIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 15, fontWeight: '600', color: colors.text },
  courseDetail: { fontSize: 12, color: colors.textLight, marginTop: 2 },
  coursePercent: { fontSize: 16, fontWeight: '700' },
});
