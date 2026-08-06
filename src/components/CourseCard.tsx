import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '../types';
import { colors } from '../theme/colors';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  progress: number;
  onPress: () => void;
}

export default function CourseCard({ course, progress, onPress }: CourseCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: course.color + '20' }]}>
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
        <ProgressBar progress={progress} color={course.color} />
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
