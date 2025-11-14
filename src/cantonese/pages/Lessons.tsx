import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Home, Sparkles } from 'lucide-react';
import LessonCard from '@/cantonese/components/LessonCard';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

const LessonsPage = () => {
  const { session } = useSession();

  // Fetch lessons with course info
  const { data: lessonsWithCourses, isLoading, error } = useQuery({
    queryKey: ['lessons-with-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, courses(id, name, is_free)')
        .order('position', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's course access if logged in
  const { data: userCourseAccess } = useQuery({
    queryKey: ['user-course-access', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('user_course_access')
        .select('course_id')
        .eq('user_id', session.user.id);
      if (error) throw error;
      return data.map(item => item.course_id);
    },
    enabled: !!session?.user?.id,
  });

  // Filter lessons based on authentication
  const lessons = useMemo(() => {
    if (!lessonsWithCourses) return [];

    // REQUIRE LOGIN: If user is not logged in, hide all lessons
    if (!session?.user?.id) return [];

    return lessonsWithCourses.filter(lesson => {
      // If lesson has no course, accessible to all logged-in users
      if (!lesson.course_id || !lesson.courses) return true;

      // If course is free, accessible to all logged-in users
      if (lesson.courses.is_free) return true;

      // If course is paid, check if user has access
      return userCourseAccess?.includes(lesson.course_id);
    });
  }, [lessonsWithCourses, userCourseAccess, session]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-pink-600 dark:text-pink-400">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Lỗi: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Film grain effect - ONLY in dark mode */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
      }} />

      {/* Scanlines - ONLY in dark mode */}
      <div className="hidden dark:block fixed inset-0 pointer-events-none z-50 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        backgroundSize: '100% 2px'
      }} />

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-orange-50 dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,16,240,0.15)_0%,_rgba(0,0,0,1)_50%)]" />

      {/* Chinese pattern overlay */}
      <div className="fixed inset-0 opacity-10 dark:opacity-5" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '60px 60px'
      }} />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-12">
        {/* Back button */}
        <Link
          to="/cantonese"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-pink-300 dark:border-pink-600 bg-white/90 dark:bg-black/70 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all shadow-md hover:shadow-lg text-sm font-medium mb-8"
        >
          <Home className="h-4 w-4" />
          Quay về trang chủ
        </Link>

        {/* Header with Hong Kong retro style */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-pink-600 dark:text-pink-500 transition-colors">
              <span className="inline-block" style={{
                textShadow: '0 0 5px rgba(255,16,240,0.3), 0 0 10px rgba(255,16,240,0.2)',
                filter: 'brightness(1.1)'
              }}>
                粵語課程
              </span>
            </h1>

            {/* Glow effect - ONLY in dark mode */}
            <div className="hidden dark:block absolute inset-0 blur-3xl opacity-40 -z-10" style={{
              background: 'radial-gradient(ellipse, rgba(255,16,240,0.4) 0%, transparent 70%)'
            }} />
          </div>

          <p className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            <span style={{ textShadow: '0 0 8px rgba(255,107,53,0.3)' }}>
              DANH SÁCH BÀI HỌC
            </span>
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base flex items-center justify-center gap-2">
            {lessons?.length || 0} bài học
            <Sparkles className="h-4 w-4 text-yellow-500 dark:text-yellow-400 animate-pulse" />
          </p>
        </div>

        {/* Lessons grid */}
        <div className="space-y-4 md:space-y-6">
          {!session?.user?.id ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto bg-white/90 dark:bg-black/70 backdrop-blur-md p-8 rounded-2xl border-2 border-pink-300 dark:border-pink-600 shadow-xl">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Yêu cầu đăng nhập
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Vui lòng đăng nhập để xem danh sách bài học
                </p>
                <Link
                  to="/cantonese/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold hover:from-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          ) : lessons && lessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">Chưa có bài học nào</p>
            </div>
          ) : (
            lessons?.map((l: any) => (
              <LessonCard key={l.id} lesson={l} />
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default LessonsPage;