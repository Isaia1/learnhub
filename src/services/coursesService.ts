import { Course } from '../types';
import { courses as mockCourses } from '../data/mockData';
import { getSupabase } from '../lib/supabase';

interface DbCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  icon: string;
  color: string;
}

interface DbLesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  duration: number;
  sort_order: number;
}

interface DbQuiz {
  id: string;
  course_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  sort_order: number;
}

interface DbFlashcard {
  id: string;
  course_id: string;
  front: string;
  back: string;
  sort_order: number;
}

export async function fetchCourses(): Promise<Course[]> {
  const supabase = getSupabase();
  if (!supabase) return mockCourses;

  const { data: courseRows, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .order('sort_order');

  if (courseError || !courseRows?.length) {
    return mockCourses;
  }

  const courseIds = courseRows.map((c: DbCourse) => c.id);

  const [lessonsRes, quizzesRes, flashcardsRes] = await Promise.all([
    supabase.from('lessons').select('*').in('course_id', courseIds).order('sort_order'),
    supabase.from('quiz_questions').select('*').in('course_id', courseIds).order('sort_order'),
    supabase.from('flashcards').select('*').in('course_id', courseIds).order('sort_order'),
  ]);

  const lessons = (lessonsRes.data ?? []) as DbLesson[];
  const quizzes = (quizzesRes.data ?? []) as DbQuiz[];
  const flashcards = (flashcardsRes.data ?? []) as DbFlashcard[];

  return courseRows.map((course: DbCourse) => {
    const courseLessons = lessons.filter((l) => l.course_id === course.id);
    const courseQuizzes = quizzes.filter((q) => q.course_id === course.id);
    const courseFlashcards = flashcards.filter((f) => f.course_id === course.id);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      subject: course.subject,
      icon: course.icon,
      color: course.color,
      totalLessons: courseLessons.length,
      lessons: courseLessons.map((l) => ({
        id: l.id,
        title: l.title,
        content: l.content,
        duration: l.duration,
      })),
      quizzes: courseQuizzes.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctIndex: q.correct_index,
        explanation: q.explanation,
      })),
      flashcards: courseFlashcards.map((f) => ({
        id: f.id,
        front: f.front,
        back: f.back,
      })),
    };
  });
}
