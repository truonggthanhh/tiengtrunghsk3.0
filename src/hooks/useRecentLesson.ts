import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLearningSession } from './useLearningSession';
import { describeRecentLesson, recentLessonKey, type RecentLesson } from '@/lib/learningNavigation';
import type { LearningLanguage } from '@/lib/auth/navigation';

export function useRecentLesson(language: LearningLanguage) {
  const { session, isLoading } = useLearningSession(language);
  const { pathname } = useLocation();
  const key = recentLessonKey(language, session?.user.id);
  const [saved, setSaved] = useState<{ key: string; lesson: RecentLesson | null }>({ key: '', lesson: null });
  useEffect(() => {
    if (isLoading) return;
    const current = describeRecentLesson(pathname, language);
    let lesson = current;
    try {
      if (current) localStorage.setItem(key, current.href);
      else lesson = describeRecentLesson(localStorage.getItem(key) ?? '', language);
    } catch { /* Continue learning even when local storage is unavailable. */ }
    setSaved({ key, lesson });
  }, [key, pathname, language, isLoading]);
  return !isLoading && saved.key === key ? saved.lesson : null;
}
