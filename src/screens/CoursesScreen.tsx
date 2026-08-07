import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgress } from '../context/ProgressContext';
import { useCourses } from '../context/CoursesContext';
import { colors } from '../theme/colors';
import CourseCard from '../components/CourseCard';
import AnimatedScreen from '../components/AnimatedScreen';
import FadeInView from '../components/FadeInView';
import TabScrollView from '../components/TabScrollView';
import { RootStackParamList } from '../navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function CoursesScreen({ navigation }: Props) {
  const { getCourseProgress } = useProgress();
  const { courses } = useCourses();

  return (
    <AnimatedScreen edges={['top']}>
      <TabScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <Text style={styles.title}>All Courses</Text>
          <Text style={styles.subtitle}>Pick a subject and start learning</Text>
        </FadeInView>
        {courses.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={getCourseProgress(course.lessons.map((l) => l.id))}
            onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
            index={index + 1}
          />
        ))}
      </TabScrollView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
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
