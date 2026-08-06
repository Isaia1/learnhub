import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { courses } from '../data/mockData';
import { useProgress } from '../context/ProgressContext';
import { colors } from '../theme/colors';
import ProgressBar from '../components/ProgressBar';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CourseDetail'>;
  route: RouteProp<RootStackParamList, 'CourseDetail'>;
};

export default function CourseDetailScreen({ navigation, route }: Props) {
  const { courseId } = route.params;
  const course = courses.find((c) => c.id === courseId);
  const { isLessonComplete, getCourseProgress, progress } = useProgress();

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Course not found</Text>
      </SafeAreaView>
    );
  }

  const courseProgress = getCourseProgress(course.lessons.map((l) => l.id));
  const quizScore = progress.quizScores[course.id];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: course.color }]}>
          <View style={styles.headerIcon}>
            <Ionicons name={course.icon as keyof typeof Ionicons.glyphMap} size={40} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>{course.title}</Text>
          <Text style={styles.headerDesc}>{course.description}</Text>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Course Progress</Text>
              <Text style={styles.progressPercent}>{courseProgress}%</Text>
            </View>
            <ProgressBar progress={courseProgress} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          {course.lessons.map((lesson, index) => {
            const complete = isLessonComplete(lesson.id);
            return (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() => navigation.navigate('Lesson', { courseId, lessonId: lesson.id })}
              >
                <View style={[styles.lessonNumber, complete && { backgroundColor: colors.success + '20' }]}>
                  {complete ? (
                    <Ionicons name="checkmark" size={18} color={colors.success} />
                  ) : (
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                  )}
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>{lesson.duration} min</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice</Text>
          <TouchableOpacity
            style={styles.practiceCard}
            onPress={() => navigation.navigate('Quiz', { courseId })}
          >
            <View style={[styles.practiceIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="help-circle" size={28} color={colors.primary} />
            </View>
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceTitle}>Take Quiz</Text>
              <Text style={styles.practiceDesc}>
                {course.quizzes.length} questions
                {quizScore !== undefined ? ` · Best: ${quizScore}%` : ''}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.practiceCard}
            onPress={() => navigation.navigate('Flashcards', { courseId })}
          >
            <View style={[styles.practiceIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="layers" size={28} color={colors.accent} />
            </View>
            <View style={styles.practiceInfo}>
              <Text style={styles.practiceTitle}>Flashcards</Text>
              <Text style={styles.practiceDesc}>{course.flashcards.length} cards to review</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressSection: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  lessonNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  lessonDuration: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  practiceIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  practiceInfo: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  practiceDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
