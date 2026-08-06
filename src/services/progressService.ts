import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '../types';
import { getSupabase } from '../lib/supabase';

const defaultProgress = (): UserProgress => ({
  completedLessons: [],
  quizScores: {},
  masteredFlashcards: [],
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXP: 0,
});

function storageKey(userId: string | null) {
  return userId ? `@learnhub_progress_${userId}` : '@learnhub_progress_guest';
}

export async function loadLocalProgress(userId: string | null): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(storageKey(userId));
    if (raw) return JSON.parse(raw) as UserProgress;
  } catch {
    // ignore parse errors
  }
  return defaultProgress();
}

export async function saveLocalProgress(userId: string | null, progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(progress));
}

export async function loadRemoteProgress(userId: string): Promise<UserProgress | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    completedLessons: data.completed_lessons ?? [],
    quizScores: data.quiz_scores ?? {},
    masteredFlashcards: data.mastered_flashcards ?? [],
    streak: data.streak ?? 0,
    lastActiveDate: data.last_active_date ?? new Date().toISOString().split('T')[0],
    totalXP: data.total_xp ?? 0,
  };
}

export async function saveRemoteProgress(userId: string, progress: UserProgress): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.from('user_progress').upsert({
    user_id: userId,
    completed_lessons: progress.completedLessons,
    quiz_scores: progress.quizScores,
    mastered_flashcards: progress.masteredFlashcards,
    streak: progress.streak,
    last_active_date: progress.lastActiveDate,
    total_xp: progress.totalXP,
    updated_at: new Date().toISOString(),
  });
}

export async function loadProgress(userId: string | null): Promise<UserProgress> {
  const local = await loadLocalProgress(userId);
  if (!userId) return local;

  const remote = await loadRemoteProgress(userId);
  if (!remote) {
    await saveRemoteProgress(userId, local);
    return local;
  }

  const merged: UserProgress = {
    completedLessons: [...new Set([...remote.completedLessons, ...local.completedLessons])],
    quizScores: { ...local.quizScores, ...remote.quizScores },
    masteredFlashcards: [...new Set([...remote.masteredFlashcards, ...local.masteredFlashcards])],
    streak: Math.max(remote.streak, local.streak),
    lastActiveDate: remote.lastActiveDate > local.lastActiveDate ? remote.lastActiveDate : local.lastActiveDate,
    totalXP: Math.max(remote.totalXP, local.totalXP),
  };

  await saveLocalProgress(userId, merged);
  return merged;
}

export async function persistProgress(userId: string | null, progress: UserProgress): Promise<void> {
  await saveLocalProgress(userId, progress);
  if (userId) await saveRemoteProgress(userId, progress);
}
