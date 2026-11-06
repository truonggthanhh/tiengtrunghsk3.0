import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/cantonese/integrations/supabase/client';

export function useLessonAccess(userId: string | undefined, ready: boolean) {
  return useQuery({
    queryKey: ['cantonese', 'user_lesson_access', userId],
    enabled: ready && Boolean(userId),
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from('user_lesson_access').select('lesson_id').eq('user_id', userId!).abortSignal(signal);
      if (error) throw error;
      return (data ?? []) as { lesson_id: string }[];
    },
  });
}

// This only controls the UI; Supabase RLS remains authoritative.
export function canOpenLesson(
  lesson: { id: string; user_id?: string; course_id: string | null; courses: { is_free: boolean } | null },
  userId: string | undefined, isAdmin: boolean, courseIds: string[] = [], lessonIds: { lesson_id: string }[] = [],
) {
  return Boolean(userId && (isAdmin || lesson.user_id === userId || lessonIds.some(item => item.lesson_id === lesson.id) ||
    !lesson.course_id || !lesson.courses || lesson.courses.is_free || courseIds.includes(lesson.course_id)));
}
