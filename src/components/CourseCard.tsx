import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../types';
import { colors } from '../theme/colors';
import ProgressBar from './ProgressBar';
import FadeInView from './FadeInView';
import AnimatedPressable from './AnimatedPressable';

interface CourseCardProps {
  course: Course;
  progress: number;
  onPress: () => void;
  index?: number;
}

export default function CourseCard({ course, progress, onPress, index = 0 }: CourseCardProps) {
  return (
    <FadeInView delay={index * 80} slide={20}>
      <AnimatedPressable style={styles.card} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: course.color + '30' }]}>
          <Ionicons name={course.icon as keyof typeof Ionicons.glyphMap} size={28} color={course.color} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {course.description}
          </Text>
          <View style={styles.meta}>
            <Text style={styles.lessonCount}>{course.lessons.length} lessons</Text>
            <Text style={styles.progressText}>{progress}% complete</Text>
          </View>
          <ProgressBar progress={progress} color={course.color} animated />
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </AnimatedPressable>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSolid,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  lessonCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
