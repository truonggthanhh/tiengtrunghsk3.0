import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import { toast } from 'sonner';
import { Home, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JyutpingToggle from '@/cantonese/components/ui/JyutpingToggle'; // Thêm import

// Lazy load components
const FillBlank = lazy(() => import('@/cantonese/components/practice/FillBlank'));
const MultipleChoice = lazy(() => import('@/cantonese/components/practice/MultipleChoice'));
const TrueFalse = lazy(() => import('@/cantonese/components/practice/TrueFalse'));
const Reorder = lazy(() => import('@/cantonese/components/practice/Reorder'));

const ReviewPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { session } = useSession();
  const [testData, setTestData] = useState<any>(null);
  const [hooks, setHooks] = useState<Record<string, any>>({});
  const [results, setResults] = useState<{ score: number; total: number } | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  // 1. Fetch lesson details first
  const { data: lesson, isLoading: isLoadingLesson, error: errorLessonData } = useQuery({
    queryKey: ['lesson_for_review', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from('lessons').select('user_id').eq('id', lessonId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId,
  });

  // 2. Derive queryUserId once lesson is loaded
  // ALWAYS use lesson.user_id because review tests belong to the lesson creator
  const queryUserId = !isLoadingLesson && lesson ? lesson.user_id : null;

  // 3. Fetch a random review test
  const { isLoading, error } = useQuery({
    queryKey: ['review_test', lessonId, queryUserId], // Use derived queryUserId
    queryFn: async () => {
      if (!lessonId || !queryUserId) return null; // Ensure queryUserId is available

      const randomIndex = Math.floor(Math.random() * 5);
      const { data, error } = await supabase
        .from('review_tests')
        .select('payload')
        .eq('lesson_id', lessonId)
        .eq('user_id', queryUserId)
        .eq('test_index', randomIndex)
        .single();
      if (error) throw error;
      setTestData(data.payload);
      setStartTime(Date.now());
      return data.payload;
    },
    enabled: !!lessonId && !!queryUserId, // Enable only when queryUserId is ready
    refetchOnWindowFocus: false,
  });

  const saveSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const { error } = await supabase.from('exercise_sessions').insert([sessionData]);
      if (error) throw error;
    },
    onSuccess: () => toast.success('Đã lưu kết quả ôn tập!'),
    onError: (err: any) => toast.error(`Lỗi khi lưu kết quả: ${err.message}`),
  });

  const attachHooks = (type: string, h: any) => {
    setHooks(prev => ({ ...prev, [type]: h }));
  };

  const handleSubmit = () => {
    if (Object.keys(hooks).length < 4) {
      toast.error("Vui lòng hoàn thành tất cả các phần trước khi nộp bài.");
      return;
    }

    let totalScore = 0;
    let totalQuestions = 0;
    const allAnswers: Record<string, any> = {};

    for (const type in hooks) {
      const { score, total } = hooks[type].getScore();
      totalScore += score;
      totalQuestions += total;
      allAnswers[type] = hooks[type].getAnswers();
    }

    setResults({ score: totalScore, total: totalQuestions });

    if (session?.user?.id && lessonId && startTime) {
      const duration_seconds = Math.floor((Date.now() - startTime) / 1000);
      saveSessionMutation.mutate({
        lesson_id: lessonId,
        user_id: session.user.id,
        type: 'REVIEW',
        count: totalQuestions,
        score: totalScore,
        total: totalQuestions,
        answers: allAnswers,
        duration_seconds,
      });
    } else {
      toast.info('Đăng nhập để lưu kết quả của bạn!');
    }
  };

  if (isLoading || isLoadingLesson) return <div className="p-6">Đang chuẩn bị đề ôn tập...</div>;
  if (error || errorLessonData) return <div className="p-6 text-verm">Lỗi tải đề ôn tập: {error?.message || errorLessonData?.message}</div>;
  if (!testData) return <div className="p-6">Không tìm thấy đề ôn tập.</div>;

  const showAnswers = !!results;
  const canSubmit = !!session?.user?.id; // Kiểm tra xem người dùng đã đăng nhập chưa

  return (
    <Suspense fallback={<div className="p-6">Đang tải bài tập...</div>}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black">Ôn tập toàn bài</h1>
            <p className="text-ink/70">Hoàn thành 20 câu hỏi tổng hợp để củng cố kiến thức.</p>
          </div>
          <div className="flex items-center gap-3">
            <JyutpingToggle />
            <Link to={`/lessons/${lessonId}`} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </Link>
          </div>
        </div>

        {showAnswers ? (
          <PracticeResults score={results.score} total={results.total} lessonId={lessonId} />
        ) : (
          <div className="space-y-8">
            {testData.fill_blank && (
              <section>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-verm pb-2">Phần 1: Điền vào chỗ trống</h2>
                <FillBlank data={{ items: testData.fill_blank }} onAttach={(h: any) => attachHooks('fill_blank', h)} showAnswers={showAnswers} />
              </section>
            )}
            {testData.multichoice && (
              <section>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-neonCyan pb-2">Phần 2: Trắc nghiệm</h2>
                <MultipleChoice data={{ items: testData.multichoice }} onAttach={(h: any) => attachHooks('multichoice', h)} showAnswers={showAnswers} />
              </section>
            )}
            {testData.true_false && (
              <section>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-neonPink pb-2">Phần 3: Đúng / Sai</h2>
                <TrueFalse data={{ items: testData.true_false }} onAttach={(h: any) => attachHooks('true_false', h)} showAnswers={showAnswers} />
              </section>
            )}
            {testData.reorder && (
              <section>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-neonBlue pb-2">Phần 4: Sắp xếp câu</h2>
                <Reorder data={{ items: testData.reorder }} onAttach={(h: any) => attachHooks('reorder', h)} showAnswers={showAnswers} />
              </section>
            )}
            <div className="text-center pt-8">
              <Button onClick={handleSubmit} size="lg" className="rounded-2xl bg-verm px-8 py-4 font-semibold text-ink shadow-[0_8px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform" disabled={!canSubmit}>
                Nộp bài và xem kết quả
              </Button>
              {!canSubmit && <p className="mt-2 text-sm text-verm">Vui lòng đăng nhập để nộp bài.</p>}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

const PracticeResults = ({ score, total, lessonId }: { score: number; total: number; lessonId?: string; }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const isPerfect = score === total && total > 0;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6] text-center">
      <h2 className="text-2xl font-bold mb-4 text-ink dark:text-cream">Kết quả ôn tập</h2>
      <div className="flex items-center justify-center gap-4 mb-4">
        {isPerfect ? <CheckCircle2 className="h-12 w-12 text-jade" /> : <XCircle className="h-12 w-12 text-verm" />}
        <div className="text-5xl font-black text-ink dark:text-cream">{score} / {total}</div>
      </div>
      <div className="text-xl font-semibold mb-4 text-ink dark:text-cream">
        {isPerfect ? 'Xuất sắc!' : `Bạn đã trả lời đúng ${percentage}%`}
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to={`/lessons/${lessonId}`} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition">
          Quay lại bài học
        </Link>
        <Link to={`/review/${lessonId}`} className="inline-flex items-center gap-2 rounded-2xl bg-verm px-4 py-2 font-semibold text-ink shadow-[0_4px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform">
          Làm lại đề khác
        </Link>
      </div>
    </div>
  );
};

export default ReviewPage;