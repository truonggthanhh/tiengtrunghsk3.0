import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import useHotkeys from '@/cantonese/hooks/useHotkeys';
import HotkeyHelp from '@/cantonese/components/HotkeyHelp';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Home, ArrowLeft } from 'lucide-react'; // Import icons for results and navigation
import JyutpingToggle from '@/cantonese/components/ui/JyutpingToggle'; // Import JyutpingToggle

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
  const [fullData, setFullData] = useState<any>(null);
  const [displayData, setDisplayData] = useState<any>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<string>('10');
  const [exerciseHooks, setExerciseHooks] = useState<{ getScore: () => { score: number, total: number }, getAnswers: () => any } | null>(null);
  const [flip, setFlip] = useState<() => void>(() => () => { });
  const [prev, setPrev] = useState<() => void>(() => () => { });
  const [next, setNext] = useState<() => void>(() => () => { });
  const [pick, setPick] = useState<(i: number) => void>(() => () => { });
  const [startTime, setStartTime] = useState<number | null>(null); // Track start time
  const [showResults, setShowResults] = useState(false); // State to show results component
  const [lastSavedScore, setLastSavedScore] = useState<{ score: number, total: number } | null>(null);

  // 1. Fetch lesson details first
  const { data: lesson, isLoading: isLoadingLesson, error: errorLessonData } = useQuery({
    queryKey: ['lesson_for_practice', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('user_id').eq('id', lessonId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  // 2. Derive queryUserId once lesson is loaded
  // ALWAYS use lesson.user_id because exercises belong to the lesson creator
  const queryUserId = !isLoadingLesson && lesson ? lesson.user_id : null;

  // 3. Fetch exercise data from Supabase
  const { data: exercisePayload, isLoading: isLoadingExercise, error: errorExercise } = useQuery({
    queryKey: ['exercise', lessonId, type, queryUserId], // Use derived queryUserId
    queryFn: async () => {
      if (!lessonId || !type || !queryUserId) return null; // Ensure queryUserId is available
      const { data, error } = await supabase
        .from('exercises')
        .select('payload')
        .eq('lesson_id', lessonId)
        .eq('type', type?.toUpperCase())
        .eq('user_id', queryUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data?.payload;
    },
    enabled: !!lessonId && !!type && !!queryUserId, // Enable only when queryUserId is ready
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
      }
    }
  }, [exercisePayload]); // Chỉ phụ thuộc vào exercisePayload

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

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: { lesson_id: string; user_id: string; type: string; count: number; score: number; total: number; answers: any; duration_seconds?: number }) => {
      const { data, error } = await supabase.from('exercise_sessions').insert([sessionData]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercise_sessions', lessonId] });
      toast.success('Đã lưu kết quả làm bài!');
      setLastSavedScore({ score: variables.score, total: variables.total });
      setShowResults(true); // Show results after successful save
    },
    onError: (err) => {
      toast.error(`Lỗi khi lưu kết quả: ${err.message}`);
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

    // If user is logged in, save the session
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
    } else {
      // If not logged in, just show results locally
      setLastSavedScore({ score, total });
      setShowResults(true);
      toast.info('Đăng nhập để lưu kết quả của bạn!');
    }
  }

  const attachHooks = (h: any) => setExerciseHooks(h);
  const controls = { setFlip, setPrev, setNext, setPick };

  if (isSessionLoading || isLoadingLesson || isLoadingExercise) { // Thêm isLoadingLesson
    return <div className="p-6">Đang tải bài tập...</div>;
  }

  if (errorExercise || errorLessonData) { // Thêm errorLessonData
    return <div className="p-6 text-verm">Lỗi tải bài tập: {errorExercise?.message || errorLessonData?.message}</div>;
  }

  if (!fullData) {
    return <div className="p-6">Không tìm thấy bài tập cho loại này. Vui lòng generate từ Dashboard.</div>;
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
      case 'HANZI_WRITE': return <HanziPracticeWrapper data={displayData} hotkeyControls={controls} onAttach={attachHooks} />;
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
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <Link to="/cantonese" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
              <Home className="h-4 w-4" /> Trang chủ
            </Link>
            <Link to={`/lessons/${lessonId}`} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
              <ArrowLeft className="h-4 w-4" /> Chọn bài tập khác
            </Link>
          </div>
          <JyutpingToggle /> {/* Add JyutpingToggle here */}
        </div>
        
        {(type?.toUpperCase() !== 'FLASHCARD' && type?.toUpperCase() !== 'HANZI_WRITE') && totalItems > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-white dark:bg-black/20 rounded-xl border border-ink/10 shadow-sm">
            <span className="text-sm text-ink/70">Số câu:</span>
            <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
              <SelectTrigger className="w-[120px] bg-cream dark:bg-black/10 border-ink/15 text-ink">
                <SelectValue placeholder="Số câu" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-black/20 border-ink/10">
                {uniqueSortedOptions.map(q => (
                  <SelectItem key={q} value={String(q)} className="hover:bg-black/5 dark:hover:bg-white/5">
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
        <div className="max-w-2xl mx-auto p-6 flex items-center justify-between">
          <button onClick={handleCompleteExercise} className="inline-flex items-center gap-2 rounded-2xl bg-verm px-5 py-3 font-semibold text-ink shadow-[0_8px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform" disabled={!canSaveProgress}>
            Hoàn thành bài tập
          </button>
          <HotkeyHelp />
        </div>
      )}
    </Suspense>
  );
};

// New component to display practice results
const PracticeResults = ({ score, total, lessonId, type }: { score: number; total: number; lessonId?: string; type?: string }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isPerfect = score === total && total > 0;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6] text-center">
      <h2 className="text-2xl font-bold mb-4 text-ink dark:text-cream">Kết quả làm bài</h2>
      <div className="flex items-center justify-center gap-4 mb-4">
        {isPerfect ? (
          <CheckCircle2 className="h-12 w-12 text-jade" />
        ) : (
          <XCircle className="h-12 w-12 text-verm" />
        )}
        <div className="text-5xl font-black text-ink dark:text-cream">
          {score} / {total}
        </div>
      </div>
      <div className="text-xl font-semibold mb-4 text-ink dark:text-cream">
        {isPerfect ? 'Hoàn hảo!' : `Đạt ${percentage}%`}
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to={`/lessons/${lessonId}`} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition">
          Quay lại bài học
        </Link>
        <Link to={`/practice/${lessonId}/${type}`} className="inline-flex items-center gap-2 rounded-2xl bg-verm px-4 py-2 font-semibold text-ink shadow-[0_4px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform">
          Làm lại
        </Link>
      </div>
    </div>
  );
};

export default PracticePage;