import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProgress } from '../types';

interface ProgressContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string) => void;
  saveQuizScore: (courseId: string, score: number) => void;
  masterFlashcard: (flashcardId: string) => void;
  isLessonComplete: (lessonId: string) => boolean;
  getCourseProgress: (lessonIds: string[]) => number;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  quizScores: {},
  masteredFlashcards: [],
  streak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXP: 150,
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const today = new Date().toISOString().split('T')[0];
      const newStreak =
        prev.lastActiveDate === today
          ? prev.streak
          : prev.lastActiveDate === getYesterday()
            ? prev.streak + 1
            : 1;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXP: prev.totalXP + 25,
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  }, []);

  const saveQuizScore = useCallback((courseId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: { ...prev.quizScores, [courseId]: Math.max(prev.quizScores[courseId] ?? 0, score) },
      totalXP: prev.totalXP + score * 10,
    }));
  }, []);

  const masterFlashcard = useCallback((flashcardId: string) => {
    setProgress((prev) => {
      if (prev.masteredFlashcards.includes(flashcardId)) return prev;
      return {
        ...prev,
        masteredFlashcards: [...prev.masteredFlashcards, flashcardId],
        totalXP: prev.totalXP + 5,
      };
    });
  }, []);

  const isLessonComplete = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const getCourseProgress = useCallback(
    (lessonIds: string[]) => {
      if (lessonIds.length === 0) return 0;
      const completed = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
      return Math.round((completed / lessonIds.length) * 100);
    },
    [progress.completedLessons]
  );

  return (
    <ProgressContext.Provider
      value={{ progress, completeLesson, saveQuizScore, masterFlashcard, isLessonComplete, getCourseProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
