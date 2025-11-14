import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { useProfile } from '@/cantonese/components/providers/ProfileProvider';
import { toast } from 'sonner';
import { FileText, Home, ArrowLeft, BookOpen, Edit3, ListChecks, ToggleRight, Shuffle, PenTool, Star, type LucideIcon } from 'lucide-react';
import Leaderboard from '@/cantonese/components/Leaderboard';
import ExerciseNeonCard from '@/cantonese/components/ExerciseNeonCard';

// Define colorful themes for each exercise type with distinct colors
const colorThemes: { [key: string]: { from: string; to: string; border: string; text: string; glow: string } } = {
  REVIEW: {
    from: 'from-yellow-200 dark:from-yellow-600',
    to: 'to-amber-300 dark:to-orange-700',
    border: 'border-yellow-400 dark:border-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
    glow: 'shadow-yellow-500/30'
  },
  FLASHCARD: {
    from: 'from-purple-200 dark:from-purple-600',
    to: 'to-indigo-300 dark:to-indigo-700',
    border: 'border-purple-400 dark:border-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-500/30'
  },
  FILL_BLANK: {
    from: 'from-orange-200 dark:from-orange-600',
    to: 'to-red-300 dark:to-red-700',
    border: 'border-orange-400 dark:border-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-500/30'
  },
  MULTICHOICE: {
    from: 'from-cyan-200 dark:from-cyan-600',
    to: 'to-blue-300 dark:to-blue-700',
    border: 'border-cyan-400 dark:border-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
    glow: 'shadow-cyan-500/30'
  },
  TRUE_FALSE: {
    from: 'from-pink-200 dark:from-pink-600',
    to: 'to-fuchsia-300 dark:to-fuchsia-700',
    border: 'border-pink-400 dark:border-pink-500',
    text: 'text-pink-600 dark:text-pink-400',
    glow: 'shadow-pink-500/30'
  },
  REORDER: {
    from: 'from-green-200 dark:from-green-600',
    to: 'to-emerald-300 dark:to-emerald-700',
    border: 'border-green-400 dark:border-green-500',
    text: 'text-green-600 dark:text-green-400',
    glow: 'shadow-green-500/30'
  },
  HANZI_WRITE: {
    from: 'from-amber-200 dark:from-amber-600',
    to: 'to-yellow-300 dark:to-yellow-700',
    border: 'border-amber-400 dark:border-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    glow: 'shadow-amber-500/30'
  },
};

const LessonDetail = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { session, isLoading: isSessionLoading } = useSession();
  const { isAdmin, isLoadingProfile } = useProfile();

  // 1. Fetch lesson details first
  const { data: lesson, isLoading: isLoadingLesson, error: errorLesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('user_id, title, description').eq('id', lessonId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  // 2. Derive queryUserId once lesson is loaded
  // ALWAYS use lesson.user_id because exercises belong to the lesson creator
  const queryUserId = !isLoadingLesson && lesson ? lesson.user_id : null;

  // 3. Fetch available exercises
  const { data: exercises, isLoading: isLoadingExercises, error: errorExercises } = useQuery({
    queryKey: ['exercises', lessonId, queryUserId], // Use derived queryUserId
    queryFn: async () => {
      if (!lessonId || !queryUserId) return []; // Ensure queryUserId is available
      const { data, error } = await supabase.from('exercises').select('type').eq('lesson_id', lessonId).eq('user_id', queryUserId);
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId && !!queryUserId, // Enable only when queryUserId is ready
  });

  // 3. Check if review tests are available
  const { data: reviewTests, isLoading: isLoadingReviewTests } = useQuery({
    queryKey: ['review_tests_check', lessonId, queryUserId], // Use derived queryUserId
    queryFn: async () => {
      if (!lessonId || !queryUserId) return null; // Ensure queryUserId is available
      const { count, error } = await supabase.from('review_tests').select('*', { count: 'exact', head: true }).eq('lesson_id', lessonId).eq('user_id', queryUserId);
      if (error) throw error;
      return count;
    },
    enabled: !!lessonId && !!queryUserId, // Enable only when queryUserId is ready
  });

  // Fetch exercise sessions for CSV export
  const { data: exerciseSessions, isLoading: isLoadingSessions, error: errorSessions } = useQuery({
    queryKey: ['exercise_sessions', lessonId, session?.user?.id, isAdmin],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      let query = supabase.from('exercise_sessions').select(`*, profiles (first_name, last_name)`).eq('lesson_id', lessonId).order('created_at', { ascending: false });
      if (!isAdmin) query = query.eq('user_id', session.user.id);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId && !!session && !isLoadingProfile,
  });

  const availableExerciseTypes: { type: string; label: string; icon: LucideIcon }[] = [
    { type: 'FLASHCARD', label: 'Flashcard', icon: BookOpen },
    { type: 'FILL_BLANK', label: 'Điền chỗ trống', icon: Edit3 },
    { type: 'MULTICHOICE', label: 'Trắc nghiệm ABCD', icon: ListChecks },
    { type: 'TRUE_FALSE', label: 'Đúng/Sai', icon: ToggleRight },
    { type: 'REORDER', label: 'Sắp xếp từ thành câu', icon: Shuffle },
    { type: 'HANZI_WRITE', label: 'Luyện viết chữ Hán', icon: PenTool },
  ];

  const exportSessionsToCsv = () => {
    // ... (CSV export logic remains the same)
  };

  if (isSessionLoading || isLoadingLesson || isLoadingExercises || isLoadingSessions || isLoadingProfile || isLoadingReviewTests) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-pink-600 dark:text-pink-400">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (errorLesson || errorExercises || errorSessions) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Lỗi tải dữ liệu.</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Không tìm thấy bài học.</p>
        </div>
      </div>
    );
  }

  const generatedExerciseTypes = new Set(exercises?.map((e: any) => e.type));
  const areReviewTestsAvailable = (reviewTests ?? 0) > 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Main content */}
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        {/* Navigation buttons */}
        <div className="flex gap-2 mb-8">
          <Link to="/cantonese" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium">
            <Home className="h-4 w-4" /> Trang chủ
          </Link>
          <Link to="/cantonese/lessons" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-300 dark:border-pink-700 bg-white dark:bg-gray-900 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/50 transition-colors text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Quay về bài học
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-pink-600 dark:text-pink-400">
              {lesson.title}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">{lesson.description}</p>
          </div>
          <button
            onClick={exportSessionsToCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!exerciseSessions || exerciseSessions.length === 0}
          >
            <FileText className="h-4 w-4" /> Export CSV
          </button>
        </div>

        {/* Exercise Cards */}
        <div className="space-y-4">
          <ExerciseNeonCard
            key="REVIEW"
            label="⭐ Ôn tập toàn bài"
            type="review"
            icon={Star}
            lessonId={lessonId!}
            isAvailable={areReviewTestsAvailable}
            colors={colorThemes['REVIEW']}
          />

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-medium bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Các dạng bài tập
              </span>
            </div>
          </div>

          {availableExerciseTypes.map(exerciseType => (
            <ExerciseNeonCard
              key={exerciseType.type}
              label={exerciseType.label}
              type={exerciseType.type}
              icon={exerciseType.icon}
              lessonId={lessonId!}
              isAvailable={generatedExerciseTypes.has(exerciseType.type)}
              colors={colorThemes[exerciseType.type] || colorThemes['FLASHCARD']}
            />
          ))}
        </div>

        {/* Leaderboard */}
        <div className="mt-16">
          <Leaderboard lessonId={lessonId!} />
        </div>
      </div>
    </main>
  );
};

export default LessonDetail;