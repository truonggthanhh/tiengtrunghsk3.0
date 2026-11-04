import { rawExerciseSchema, hanziSchema, type RawExercisePayload, type ExerciseHooks } from '@/cantonese/lib/exercisePayload';
import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import useHotkeys from '@/cantonese/hooks/useHotkeys';
import HotkeyHelp from '@/cantonese/components/HotkeyHelp';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Home, ArrowLeft } from 'lucide-react'; // Import icons for results and navigation
import JyutpingToggle from '@/cantonese/components/ui/JyutpingToggle'; // Import JyutpingToggle
import { useAnalytics } from '@/hooks/useAnalytics'; // Import Analytics hook

// Lazy load components
const Flashcard = lazy(() => import('@/cantonese/components/practice/Flashcard'));
const FillBlank = lazy(() => import('@/cantonese/components/practice/FillBlank'));
const MultipleChoice = lazy(() => import('@/cantonese/components/practice/MultipleChoice'));
const TrueFalse = lazy(() => import('@/cantonese/components/practice/TrueFalse'));
const Reorder = lazy(() => import('@/cantonese/components/practice/Reorder'));
const HanziPracticeWrapper = lazy(() => import('@/cantonese/components/practice/HanziPracticeWrapper'));

const PracticePage = () => {
  const { lessonId, type } = useParams<{ lessonId: string, type: string }>();
  const { session, isLoading: isSessionLoading } = useSession();
  const queryClient = useQueryClient();

  // Analytics hooks
  const { startSession, completeSession } = useAnalytics('cantonese');
  const [analyticsSessionId, setAnalyticsSessionId] = useState<string | null>(null);

  const [fullData, setFullData] = useState<RawExercisePayload | null>(null);
  const [displayData, setDisplayData] = useState<RawExercisePayload | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string>('10');
  const [exerciseHooks, setExerciseHooks] = useState<{ getScore: () => { score: number, total: number }, getAnswers: () => unknown } | null>(null);
  const [flip, setFlip] = useState<() => void>(() => () => { });
  const [prev, setPrev] = useState<() => void>(() => () => { });
  const [next, setNext] = useState<() => void>(() => () => { });
  const [pick, setPick] = useState<(i: number) => void>(() => () => { });
  const [startTime, setStartTime] = useState<number | null>(null); // Track start time
  const [showResults, setShowResults] = useState(false); // State to show results component
  const [lastSavedScore, setLastSavedScore] = useState<{ score: number, total: number } | null>(null);

  // Fetch exercise data from Supabase
  // NOTE: Removed user_id filter because exercises are public
  const { data: exercisePayload, isLoading: isLoadingExercise, error: errorExercise } = useQuery({
    queryKey: ['cantonese', 'exercise', lessonId, type],
    queryFn: async () => {
      if (!lessonId || !type) return null;
      const { data, error } = await supabase
        .from('exercises')
        .select('payload')
        .eq('lesson_id', lessonId)
        .eq('type', type?.toUpperCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.payload ? rawExerciseSchema.parse(data.payload) : null;
    },
    enabled: !!lessonId && !!type,
    staleTime: Infinity, // Data never becomes stale
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch when component mounts
  });

  useEffect(() => {
    if (exercisePayload !== undefined) { // Only update if payload is explicitly fetched (can be null)
      setFullData(exercisePayload);
      if (exercisePayload) { // Only set quantity and start time if payload is not null
        const defaultQty = Math.min(10, exercisePayload.items?.length || 10);
        setSelectedQuantity(String(defaultQty));
        setStartTime(Date.now()); // Set start time when exercise data is loaded
        setShowResults(false); // Hide results when new exercise loads
        setLastSavedScore(null);

        // Start analytics session
        const initAnalyticsSession = async () => {
          const sessionTypeMap: { [key: string]: string } = {
            'FLASHCARD': 'flashcard',
            'FILL_BLANK': 'fill_blank',
            'MULTICHOICE': 'multiple_choice',
            'TRUE_FALSE': 'true_false',
            'REORDER': 'sentence_reorder',
            'HANZI_WRITE': 'hanzi_writing'
          };

          const sessionType = sessionTypeMap[type?.toUpperCase() || ''] || 'practice';
          const sid = await startSession(
            sessionType,
            'cantonese',
            lessonId || 'unknown',
            exercisePayload.items?.length || 0,
            { lesson_id: lessonId, exercise_type: type }
          );
          setAnalyticsSessionId(sid);
        };

        initAnalyticsSession();
      }
    }
  }, [exercisePayload, type, lessonId, startSession]); // Dependencies

  useEffect(() => {
    if (fullData?.items) {
      const quantity = parseInt(selectedQuantity);
      if (type?.toUpperCase() === 'FLASHCARD' || type?.toUpperCase() === 'HANZI_WRITE') {
        setDisplayData({ ...fullData, items: fullData.items });
      } else {
        setDisplayData({ ...fullData, items: fullData.items.slice(0, quantity) });
      }
    } else {
      setDisplayData(null);
    }
  }, [fullData, selectedQuantity, type]);

  useHotkeys({ onPrev: prev, onNext: next, onFlip: flip, onPick: pick });

  // Fallback: Keep old exercise_sessions saving for backward compatibility
  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: { lesson_id: string; user_id: string; type: string; count: number; score: number; total: number; answers: unknown; duration_seconds?: number }) => {
      const { data, error } = await supabase.from('exercise_sessions').insert([sessionData]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cantonese', 'exercise_sessions', lessonId] });
    },
    onError: (err) => {
      console.warn('Exercise session save failed (non-critical):', err.message);
    },
  });

  async function handleCompleteExercise() {
    if (!exerciseHooks || !lessonId || !type || startTime === null) {
      toast.error('Không thể hoàn thành bài tập. Dữ liệu không đầy đủ.');
      return;
    }

    const { score, total } = exerciseHooks.getScore();
    const answers = exerciseHooks.getAnswers();
    const currentType = type.toUpperCase();
    const duration_seconds = Math.floor((Date.now() - startTime) / 1000);

    // Flashcard and HanziWrite do not have a traditional score to save
    if (currentType === 'FLASHCARD' || currentType === 'HANZI_WRITE') {
      toast.info('Flashcard và Luyện viết Hán tự không lưu điểm.');
      setLastSavedScore({ score: 0, total: displayData?.items?.length || 0 });
      setShowResults(true);
      return;
    }

    // Complete analytics session (new system)
    if (analyticsSessionId) {
      const success = await completeSession(analyticsSessionId, score, duration_seconds);
      if (success) {
        toast.success('Đã lưu kết quả làm bài!');
      }
    }

    // Also save to old exercise_sessions table for backward compatibility
    if (session?.user?.id) {
      saveSessionMutation.mutate({
        lesson_id: lessonId,
        user_id: session.user.id,
        type: currentType,
        count: displayData?.items?.length || 0,
        score,
        total,
        answers,
        duration_seconds,
      });
    }

    // Show results
    setLastSavedScore({ score, total });
    setShowResults(true);

    if (!session?.user?.id) {
      toast.info('Đăng nhập để lưu kết quả của bạn!');
    }
  }

  const attachHooks = useCallback((h: ExerciseHooks) => setExerciseHooks(h), []);
  const controls = useMemo(() => ({ setFlip, setPrev, setNext, setPick }), []);

  if (isSessionLoading || isLoadingExercise) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-lg font-medium text-purple-600 dark:text-purple-400">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (errorExercise) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-red-600 dark:text-red-400">Lỗi tải bài tập: {errorExercise?.message}</p>
        </div>
      </div>
    );
  }

  if (!fullData) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Không tìm thấy bài tập cho loại này. Vui lòng generate từ Dashboard.</p>
        </div>
      </div>
    );
  }

  const renderExercise = () => {
    if (!displayData || displayData.items.length === 0) {
      return <div className="p-6 text-ink/70 dark:text-cream/70">Không có bài tập nào để hiển thị với số lượng đã chọn.</div>;
    }

    switch (type?.toUpperCase()) {
      case 'FLASHCARD': return <Flashcard data={displayData} hotkeyControls={controls} onAttach={attachHooks} />;
      case 'FILL_BLANK': return <FillBlank data={displayData} onAttach={attachHooks} />;
      case 'MULTICHOICE': return <MultipleChoice data={displayData} hotkeyControls={controls} onAttach={attachHooks} />;
      case 'TRUE_FALSE': return <TrueFalse data={displayData} onAttach={attachHooks} />;
      case 'REORDER': return <Reorder data={displayData} onAttach={attachHooks} />;
      case 'HANZI_WRITE': return <HanziPracticeWrapper data={{ ...hanziSchema.parse(displayData), items: hanziSchema.parse(displayData).items ?? [] }} hotkeyControls={controls} onAttach={attachHooks} />;
      default: return <div className="p-6 text-verm">Không hỗ trợ loại bài tập này.</div>;
    }
  };

  const totalItems = fullData?.items?.length || 0;
  // Start with base quantities and filter out any that are larger than or equal to the total
  const quantityOptions = [10, 15, 20].filter(q => q < totalItems);
  
  // Always add an option for the total number of items, which acts as "All"
  if (totalItems > 0) {
    quantityOptions.push(totalItems);
  }

  // Use a Set to remove any potential duplicates and then sort the final list
  const uniqueSortedOptions = [...new Set(quantityOptions)].sort((a, b) => a - b);

  const canSaveProgress = !!session?.user?.id; // Kiểm tra xem người dùng đã đăng nhập chưa

  return (
    <Suspense fallback={<div className="p-6">Đang tải component...</div>}>
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
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.15)_0%,_rgba(0,0,0,1)_50%)]" />

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <Link to="/cantonese" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-300 dark:border-purple-600 bg-white/90 dark:bg-black/70 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all shadow-md text-sm font-medium">
                <Home className="h-4 w-4" /> Trang chủ
              </Link>
              <Link to={`/cantonese/lessons/${lessonId}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-pink-300 dark:border-pink-600 bg-white/90 dark:bg-black/70 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all shadow-md text-sm font-medium">
                <ArrowLeft className="h-4 w-4" /> Chọn bài tập khác
              </Link>
            </div>
            <JyutpingToggle />
          </div>

          {(type?.toUpperCase() !== 'FLASHCARD' && type?.toUpperCase() !== 'HANZI_WRITE') && totalItems > 0 && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-white/95 dark:bg-black/70 rounded-xl border-2 border-purple-300 dark:border-purple-600 shadow-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Số câu:</span>
              <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-black/50 border-2 border-pink-300 dark:border-pink-600 text-gray-900 dark:text-white font-medium">
                  <SelectValue placeholder="Số câu" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black/90 border-2 border-purple-300 dark:border-purple-600">
                  {uniqueSortedOptions.map(q => (
                    <SelectItem key={q} value={String(q)} className="hover:bg-purple-100 dark:hover:bg-purple-900/30">
                      {q === totalItems ? `Tất cả (${q})` : q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {showResults && lastSavedScore ? (
            <PracticeResults score={lastSavedScore.score} total={lastSavedScore.total} lessonId={lessonId} type={type} />
          ) : (
            renderExercise()
          )}
        </div>
        {!showResults && (
          <div className="relative z-10 max-w-2xl mx-auto p-6 flex items-center justify-between">
            <button
              onClick={handleCompleteExercise}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white border-2 border-pink-400 dark:border-purple-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canSaveProgress}
            >
              Hoàn thành bài tập
            </button>
            <HotkeyHelp />
          </div>
        )}
      </main>
    </Suspense>
  );
};

// New component to display practice results
const PracticeResults = ({ score, total, lessonId, type }: { score: number; total: number; lessonId?: string; type?: string }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isPerfect = score === total && total > 0;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white/95 dark:bg-black/70 rounded-2xl border-2 border-purple-300 dark:border-purple-600 shadow-2xl text-center">
      <h2 className="text-3xl font-black mb-6 text-pink-600 dark:text-pink-400">
        <span style={{ textShadow: '0 0 10px rgba(255,16,240,0.3)' }}>
          Kết quả làm bài
        </span>
      </h2>

      <div className="flex items-center justify-center gap-6 mb-6">
        {isPerfect ? (
          <div className="p-4 rounded-full bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-900/50 dark:to-emerald-900/50">
            <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        ) : (
          <div className="p-4 rounded-full bg-gradient-to-br from-red-200 to-pink-200 dark:from-red-900/50 dark:to-pink-900/50">
            <XCircle className="h-16 w-16 text-red-600 dark:text-red-400" />
          </div>
        )}
        <div className="text-6xl font-black text-gray-900 dark:text-white">
          <span style={{ textShadow: '0 0 15px rgba(147,51,234,0.3)' }}>
            {score} / {total}
          </span>
        </div>
      </div>

      <div className="text-2xl font-bold mb-8 text-purple-600 dark:text-purple-400">
        {isPerfect ? '🎉 Hoàn hảo!' : `Đạt ${percentage}%`}
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          to={`/cantonese/lessons/${lessonId}`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-pink-300 dark:border-pink-600 bg-white/90 dark:bg-black/70 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all shadow-md font-medium"
        >
          Quay lại bài học
        </Link>
        <Link
          to={`/cantonese/practice/${lessonId}/${type}?retry=${Date.now()}`}
          reloadDocument
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-gradient-to-br from-purple-500 to-pink-600 text-white border-2 border-purple-400 dark:border-pink-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Làm lại
        </Link>
      </div>
    </div>
  );
};

export default PracticePage;