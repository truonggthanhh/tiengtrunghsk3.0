import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';

export type CourseType =
  | 'hsk_1' | 'hsk_2' | 'hsk_3' | 'hsk_4' | 'hsk_5' | 'hsk_6'
  | 'msutong_1' | 'msutong_2' | 'msutong_3' | 'msutong_4'
  | `cantonese_lesson_${number}`;

export interface CourseAccess {
  course_type: string;
  is_unlocked: boolean;
  unlocked_at: string | null;
  unlocked_by_admin_name: string | null;
  notes: string | null;
}

/**
 * Hook để check xem user có access vào 1 course cụ thể không
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
 * Hook để lấy tất cả course access của user
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

      return (data as CourseAccess[]) || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

/**
 * Hook để lấy danh sách tất cả courses với access status
 * Tiện cho admin dashboard
 */
export const useAllCoursesWithAccess = (targetUserId?: string) => {
  const { session } = useSession();
  const userId = targetUserId || session?.user?.id;

  // Define all available courses
  const allCourses: CourseType[] = [
    'hsk_1', 'hsk_2', 'hsk_3', 'hsk_4', 'hsk_5', 'hsk_6',
    'msutong_1', 'msutong_2', 'msutong_3', 'msutong_4',
    ...Array.from({ length: 20 }, (_, i) => `cantonese_lesson_${i + 1}` as CourseType),
  ];

  const { data: accessList = [] } = useAllCourseAccess();

  // Merge với danh sách tất cả courses
  const coursesWithAccess = allCourses.map(course => {
    const access = accessList.find(a => a.course_type === course);
    return {
      courseType: course,
      isUnlocked: access?.is_unlocked || false,
      unlockedAt: access?.unlocked_at || null,
      unlockedByAdminName: access?.unlocked_by_admin_name || null,
      notes: access?.notes || null,
    };
  });

  return coursesWithAccess;
};

/**
 * Helper function để format course name
 */
export const formatCourseName = (courseType: CourseType): string => {
  if (courseType.startsWith('hsk_')) {
    const level = courseType.split('_')[1];
    return `HSK ${level}`;
  }
  if (courseType.startsWith('msutong_')) {
    const level = courseType.split('_')[1];
    return `Msutong Sơ Cấp ${level}`;
  }
  if (courseType.startsWith('cantonese_lesson_')) {
    const lessonNum = courseType.split('_')[2];
    return `Cantonese Bài ${lessonNum}`;
  }
  return courseType;
};

/**
 * Helper function để get course category
 */
export const getCourseCategory = (courseType: CourseType): 'mandarin_hsk' | 'mandarin_msutong' | 'cantonese' => {
  if (courseType.startsWith('hsk_')) return 'mandarin_hsk';
  if (courseType.startsWith('msutong_')) return 'mandarin_msutong';
  return 'cantonese';
};
