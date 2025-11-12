import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

export type CourseType = `cantonese_lesson_${number}`;

export interface CourseAccess {
  course_type: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  unlocked_by_admin_name: string | null;
  notes: string | null;
}

/**
 * Hook để check xem user có access vào 1 lesson cụ thể không
 */
export const useCourseAccess = (courseType: CourseType) => {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['courseAccess', userId, courseType],
    queryFn: async () => {
      if (!userId) {
        return { hasAccess: false, isAdmin: false };
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const isAdmin = profile?.role === 'admin';

      // Admins always have access
      if (isAdmin) {
        return { hasAccess: true, isAdmin: true };
      }

      // Check via RPC function
      const { data, error } = await supabase.rpc('check_course_access', {
        p_user_id: userId,
        p_course_type: courseType,
      });

      if (error) {
        console.error('Error checking course access:', error);
        return { hasAccess: false, isAdmin: false };
      }

      return { hasAccess: data as boolean, isAdmin: false };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

/**
 * Hook để lấy tất cả lesson access của user
 */
export const useAllCourseAccess = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['allCourseAccess', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      // Get all access via RPC
      const { data, error } = await supabase.rpc('get_user_course_access', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error getting all course access:', error);
        return [];
      }

      // Filter only Cantonese lessons
      const allData = (data as CourseAccess[]) || [];
      return allData.filter(item => item.course_type.startsWith('cantonese_lesson_'));
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

/**
 * Hook để lấy danh sách tất cả lessons với access status
 */
export const useAllLessonsWithAccess = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  // Define all 20 Cantonese lessons
  const allLessons: CourseType[] = Array.from(
    { length: 20 },
    (_, i) => `cantonese_lesson_${i + 1}` as CourseType
  );

  const { data: accessList = [] } = useAllCourseAccess();

  // Merge với danh sách tất cả lessons
  const lessonsWithAccess = allLessons.map(lesson => {
    const access = accessList.find(a => a.course_type === lesson);
    return {
      lessonNumber: parseInt(lesson.split('_')[2]),
      courseType: lesson,
      isUnlocked: access?.is_unlocked || false,
      unlockedAt: access?.unlocked_at || null,
      unlockedByAdminName: access?.unlocked_by_admin_name || null,
      notes: access?.notes || null,
    };
  });

  return lessonsWithAccess;
};

/**
 * Helper function để format lesson name
 */
export const formatLessonName = (courseType: CourseType): string => {
  const lessonNum = courseType.split('_')[2];
  return `Bài ${lessonNum}`;
};
