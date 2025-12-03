import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: 'mandarin' | 'cantonese';
  is_free: boolean;
  display_order: number;
  is_active: boolean;
  thumbnail_url: string | null;
  color: string | null;
  course_type_legacy: string | null; // For backward compatibility
}

export interface CourseWithAccess extends Course {
  is_unlocked: boolean;
  unlocked_at: string | null;
}

/**
 * Hook để fetch tất cả courses từ database
 */
export const useCourses = (language?: 'mandarin' | 'cantonese') => {
  return useQuery({
    queryKey: ['courses', language],
    queryFn: async () => {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Course[];
    },
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });
};

/**
 * Hook để fetch courses kèm access status cho user hiện tại
 */
export const useCoursesWithAccess = (language?: 'mandarin' | 'cantonese') => {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['coursesWithAccess', userId, language],
    queryFn: async () => {
      if (!userId) {
        // Nếu chưa login, chỉ trả về free courses
        let query = supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .eq('is_free', true)
          .order('display_order', { ascending: true });

        if (language) {
          query = query.eq('language', language);
        }

        const { data, error } = await query;
        if (error) throw error;

        return (data || []).map(course => ({
          ...course,
          is_unlocked: course.is_free,
          unlocked_at: null,
        })) as CourseWithAccess[];
      }

      // Sử dụng RPC function để lấy courses kèm access status
      const { data, error } = await supabase.rpc('get_user_course_access', {
        p_user_id: userId,
      });

      if (error) throw error;

      // Map RPC result to CourseWithAccess
      const coursesRaw = data || [];

      // Filter by language nếu có
      let filteredCourses = coursesRaw;
      if (language) {
        // Need to fetch full course data to filter by language
        const courseIds = coursesRaw.map((c: any) => c.course_id);
        const { data: fullCourses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds)
          .eq('language', language);

        if (coursesError) throw coursesError;

        const courseMap = new Map(fullCourses?.map(c => [c.id, c]));
        filteredCourses = coursesRaw
          .filter((c: any) => courseMap.has(c.course_id))
          .map((c: any) => ({
            ...courseMap.get(c.course_id),
            is_unlocked: c.is_unlocked,
            unlocked_at: c.unlocked_at,
          }));
      } else {
        // Fetch all course data
        const courseIds = coursesRaw.map((c: any) => c.course_id);
        const { data: fullCourses, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);

        if (coursesError) throw coursesError;

        const courseMap = new Map(fullCourses?.map(c => [c.id, c]));
        filteredCourses = coursesRaw.map((c: any) => ({
          ...courseMap.get(c.course_id),
          is_unlocked: c.is_unlocked,
          unlocked_at: c.unlocked_at,
        }));
      }

      return filteredCourses as CourseWithAccess[];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để check access vào 1 course cụ thể (by ID)
 */
export const useCheckCourseAccess = (courseId: string | undefined) => {
  const { session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['checkCourseAccess', userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) {
        return { hasAccess: false, isAdmin: false };
      }

      // Check via RPC
      const { data, error } = await supabase.rpc('check_course_access', {
        p_user_id: userId,
        p_course_id: courseId,
      });

      if (error) throw error;

      // Check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      return {
        hasAccess: data as boolean,
        isAdmin: profile?.role === 'admin',
      };
    },
    enabled: !!userId && !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Helper: Tìm course by legacy course_type
 */
export const useCourseByLegacyType = (courseType: string) => {
  return useQuery({
    queryKey: ['courseByLegacyType', courseType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('course_type_legacy', courseType)
        .single();

      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseType,
    staleTime: 10 * 60 * 1000, // Cache 10 phút (mapping won't change)
  });
};
