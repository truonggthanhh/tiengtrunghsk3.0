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

// Define neon color themes for each exercise type
const neonColorThemes: { [key: string]: { accentColor: string } } = {
  FLASHCARD: { accentColor: 'jade' },
  FILL_BLANK: { accentColor: 'verm' },
  MULTICHOICE: { accentColor: 'neonCyan' },
  TRUE_FALSE: { accentColor: 'neonPink' },
  REORDER: { accentColor: 'neonBlue' },
  HANZI_WRITE: { accentColor: 'neonPurple' },
  REVIEW: { accentColor: 'yellow-400' }, // Special color for review
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
    return <div className="max-w-5xl mx-auto p-6">Đang tải...</div>;
  }

  if (errorLesson || errorExercises || errorSessions) {
    return <div className="max-w-5xl mx-auto p-6 text-verm">Lỗi tải dữ liệu.</div>;
  }

  if (!lesson) {
    return <div className="max-w-5xl mx-auto p-6">Không tìm thấy bài học.</div>;
  }

  const generatedExerciseTypes = new Set(exercises?.map((e: any) => e.type));
  const areReviewTestsAvailable = (reviewTests ?? 0) > 0;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex gap-3 mb-4">
        <Link to="/cantonese" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <Home className="h-4 w-4" /> Trang chủ
        </Link>
        <Link to="/cantonese/lessons" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
          <ArrowLeft className="h-4 w-4" /> Quay về bài học
        </Link>
      </div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">{lesson.title}</h1>
          <p className="text-ink/80 max-w-prose">{lesson.description}</p>
        </div>
        <button onClick={exportSessionsToCsv} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm disabled:opacity-50 flex-shrink-0" disabled={!exerciseSessions || exerciseSessions.length === 0}>
          <FileText className="h-4 w-4" /> Export CSV
        </button>
      </div>
      
      <div className="space-y-6">
        <ExerciseNeonCard
          key="REVIEW"
          label="Ôn tập toàn bài"
          type="review"
          icon={Star}
          lessonId={lessonId!}
          isAvailable={areReviewTestsAvailable}
          colors={neonColorThemes['REVIEW']}
        />
        <hr className="border-ink/10" />
        {availableExerciseTypes.map(exerciseType => (
          <ExerciseNeonCard
            key={exerciseType.type}
            label={exerciseType.label}
            type={exerciseType.type}
            icon={exerciseType.icon}
            lessonId={lessonId!}
            isAvailable={generatedExerciseTypes.has(exerciseType.type)}
            colors={neonColorThemes[exerciseType.type] || { accentColor: 'jade' }}
          />
        ))}
      </div>

      <div className="mt-12">
        <Leaderboard lessonId={lessonId!} />
      </div>
    </div>
  );
};

export default LessonDetail;