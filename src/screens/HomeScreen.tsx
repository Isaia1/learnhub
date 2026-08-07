import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgress } from '../context/ProgressContext';
import { useCourses } from '../context/CoursesContext';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import StreakBadge from '../components/StreakBadge';
import CourseCard from '../components/CourseCard';
import AnimatedScreen from '../components/AnimatedScreen';
import FadeInView from '../components/FadeInView';
import AnimatedPressable from '../components/AnimatedPressable';
import TabScrollView from '../components/TabScrollView';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function HomeScreen({ navigation }: Props) {
  const { progress, getCourseProgress } = useProgress();
  const { courses } = useCourses();
  const { profile, user } = useAuth();
  const featuredCourses = courses.slice(0, 3);
  const firstName = profile?.displayName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Learner';

  return (
    <AnimatedScreen edges={['top']}>
      <TabScrollView>
        <View style={styles.header}>
          <FadeInView delay={0}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Welcome back, {firstName}! 👋</Text>
                <Text style={styles.subGreeting}>Ready to learn something new?</Text>
              </View>
              <StreakBadge streak={progress.streak} />
            </View>
          </FadeInView>

          <FadeInView delay={100}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{progress.totalXP}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{progress.completedLessons.length}</Text>
                <Text style={styles.statLabel}>Lessons Done</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{Object.keys(progress.quizScores).length}</Text>
                <Text style={styles.statLabel}>Quizzes Taken</Text>
              </View>
            </View>
          </FadeInView>
        </View>

        <View style={styles.section}>
          <FadeInView delay={150}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </FadeInView>
          <View style={styles.actionsRow}>
            <FadeInView delay={200} style={{ flex: 1 }}>
              <AnimatedPressable
                style={styles.actionCard}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Progress' } as never)}
              >
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(52,211,153,0.25)' }]}>
                  <Ionicons name="trophy" size={24} color={colors.secondary} />
                </View>
                <Text style={styles.actionText}>Progress</Text>
              </AnimatedPressable>
            </FadeInView>
            <FadeInView delay={280} style={{ flex: 1 }}>
              <AnimatedPressable
                style={styles.actionCard}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Courses' } as never)}
              >
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(251,146,60,0.25)' }]}>
                  <Ionicons name="library" size={24} color={colors.accent} />
                </View>
                <Text style={styles.actionText}>All Courses</Text>
              </AnimatedPressable>
            </FadeInView>
          </View>
        </View>

        <View style={styles.section}>
          <FadeInView delay={350}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Continue Learning</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Courses' } as never)}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
          {featuredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={getCourseProgress(course.lessons.map((l) => l.id))}
              onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
              index={index + 4}
            />
          ))}
        </View>
      </TabScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 16,
    padding: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primaryLight,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
