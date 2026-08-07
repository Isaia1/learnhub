import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useCourses } from '../context/CoursesContext';
import { useProgress } from '../context/ProgressContext';
import AnimatedScreen from '../components/AnimatedScreen';
import FadeInView from '../components/FadeInView';
import AnimatedPressable from '../components/AnimatedPressable';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Lesson'>;
  route: RouteProp<RootStackParamList, 'Lesson'>;
};

export default function LessonScreen({ navigation, route }: Props) {
  const { courseId, lessonId } = route.params;
  const { getCourseById } = useCourses();
  const course = getCourseById(courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);
  const { completeLesson, isLessonComplete } = useProgress();
  const [completed, setCompleted] = useState(isLessonComplete(lessonId));

  if (!course || !lesson) {
    return (
      <AnimatedScreen>
        <Text style={{ color: colors.text, textAlign: 'center', marginTop: 40 }}>Lesson not found</Text>
      </AnimatedScreen>
    );
  }

  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = course.lessons[lessonIndex + 1];

  const handleComplete = () => {
    completeLesson(lessonId);
    setCompleted(true);
    Alert.alert('Lesson Complete! 🎉', 'You earned 25 XP!', [
      nextLesson
        ? { text: 'Next Lesson', onPress: () => navigation.replace('Lesson', { courseId, lessonId: nextLesson.id }) }
        : { text: 'Take Quiz', onPress: () => navigation.navigate('Quiz', { courseId }) },
      { text: 'Done', style: 'cancel' },
    ]);
  };

  return (
    <AnimatedScreen edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInView>
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: course.color + '30' }]}>
            <Text style={[styles.badgeText, { color: course.color }]}>{course.title}</Text>
          </View>
          <Text style={styles.duration}>{lesson.duration} min read</Text>
        </View>

        <Text style={styles.title}>{lesson.title}</Text>
        </FadeInView>

        <FadeInView delay={150}>
        <Text style={styles.contentText}>{lesson.content}</Text>
        </FadeInView>
      </ScrollView>

      <View style={styles.footer}>
        {completed ? (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.completedText}>Lesson completed</Text>
          </View>
        ) : (
          <AnimatedPressable style={[styles.completeButton, { backgroundColor: course.color }]} onPress={handleComplete}>
            <Text style={styles.completeButtonText}>Mark as Complete</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </AnimatedPressable>
        )}
      </View>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 13,
    color: colors.textLight,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 36,
  },
  videoPlaceholder: {
    height: 180,
    backgroundColor: colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  videoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 28,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
  },
});
