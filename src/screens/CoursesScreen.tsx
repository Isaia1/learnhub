import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgress } from '../context/ProgressContext';
import { courses } from '../data/mockData';
import { colors } from '../theme/colors';
import CourseCard from '../components/CourseCard';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function CoursesScreen({ navigation }: Props) {
  const { getCourseProgress } = useProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All Courses</Text>
        <Text style={styles.subtitle}>Pick a subject and start learning</Text>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={getCourseProgress(course.lessons.map((l) => l.id))}
            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
          />
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
});
