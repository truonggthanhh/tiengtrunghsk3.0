import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import PronunciationRecognition from '@/components/PronunciationRecognition';
import { getFullMsutongVocabularyByLevel, type MsutongWord } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Home, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSRS } from '@/hooks/useSRS';
import { toast } from 'sonner';
import CantoneseRouteWrapper from '../components/CantoneseRouteWrapper';

/**
 * Enhanced Pronunciation Practice Page for Cantonese
 * Features speech recognition with SRS tracking
 */
const CantoneseEnhancedPronunciationPage: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const [searchParams] = useSearchParams();
  const fullVocabulary = useMemo(() => getFullMsutongVocabularyByLevel(level || 'so-cap'), [level]);

  const { startSession, completeSession, recordAnswer } = useAnalytics();
  const { updateReview, calculateQuality, getMixedVocabulary } = useSRS();

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [vocabulary, setVocabulary] = useState<MsutongWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [lastResult, setLastResult] = useState<{ recognized: string; confidence: number; isCorrect: boolean } | null>(null);

  const currentWord = useMemo(() => vocabulary[currentIndex], [vocabulary, currentIndex]);
  const progress = vocabulary.length > 0 ? ((currentIndex + 1) / vocabulary.length) * 100 : 0;

  const handleStart = async (count: number) => {
    try {
      setQuestionCount(count);

      // Get mixed vocabulary (SRS + new words)
      const mixedVocab = await getMixedVocabulary(
        fullVocabulary,
        'cantonese',
        level || 'so-cap',
        count
      );

      setVocabulary(mixedVocab);
      setCurrentIndex(0);
      setCorrectAnswers(0);
      setShowResult(false);
      setStartTime(Date.now());
      setHasAnswered(false);
      setLastResult(null);

      // Start analytics session
      const sid = await startSession(
        'pronunciation',
        'cantonese',
        level || 'so-cap',
        count,
        { question_count: count }
      );
      setSessionId(sid);
    } catch (error) {
      console.warn('Error starting pronunciation session:', error);
      // Fallback: use shuffled vocabulary if SRS fails
      const shuffled = [...fullVocabulary].sort(() => Math.random() - 0.5);
      setVocabulary(shuffled.slice(0, count));
      setCurrentIndex(0);
      setCorrectAnswers(0);
      setShowResult(false);
      setStartTime(Date.now());
    }
  };

  const handlePronunciationResult = async (result: {
    recognized: string;
    confidence: number;
    isCorrect: boolean;
  }) => {
    // Store result for display
    setLastResult(result);
    setHasAnswered(true);

    try {
      const responseTime = Date.now() - startTime;

      // Update SRS
      const quality = calculateQuality(result.isCorrect, responseTime);
      await updateReview({
        wordId: currentWord.id,
        wordType: 'cantonese',
        level: level || 'so-cap',
        hanzi: currentWord.hanzi,
        pinyin: currentWord.pinyin,
        isCorrect: result.isCorrect,
        quality
      });

      // Record answer for analytics
      if (sessionId) {
        await recordAnswer(
          sessionId,
          {
            word_id: currentWord.id,
            hanzi: currentWord.hanzi,
            pinyin: currentWord.pinyin,
            correct_answer: currentWord.hanzi,
            user_answer: result.recognized,
            is_correct: result.isCorrect,
            response_time_ms: responseTime
          },
          'pronunciation'
        );
      }

      // Update correct count
      if (result.isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
    } catch (error) {
      console.warn('Error recording pronunciation result:', error);
      // Still count correct answers even if tracking fails
      if (result.isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
    }
  };

  const goToNextWord = () => {
    // Reset answer state
    setHasAnswered(false);
    setLastResult(null);

    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStartTime(Date.now());
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    setShowResult(true);

    try {
      // Complete analytics session
      if (sessionId) {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        await completeSession(sessionId, correctAnswers, duration);
      }
    } catch (error) {
      console.warn('Error completing session:', error);
    }

    // Show completion toast
    const accuracy = (correctAnswers / vocabulary.length) * 100;
    if (accuracy >= 80) {
      toast.success('好叻！(Hóu lak! - Xuất sắc!)', {
        description: `Bạn đạt ${accuracy.toFixed(1)}% độ chính xác!`
      });
    } else if (accuracy >= 60) {
      toast.success('幾好！(Géi hóu! - Tốt lắm!)', {
        description: `Tiếp tục cố gắng! Độ chính xác: ${accuracy.toFixed(1)}%`
      });
    } else {
      toast.info('加油！(Gāyáu! - Cố lên!)', {
        description: `Độ chính xác: ${accuracy.toFixed(1)}%. Bạn sẽ tiến bộ!`
      });
    }
  };

  // Initial selection screen
  if (questionCount === null) {
    return (
      <CantoneseRouteWrapper>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-center">
                練發音 (Luyện phát âm)
              </CardTitle>
              <p className="text-center text-muted-foreground mt-2">
                Sử dụng AI nhận dạng giọng nói để cải thiện phát âm tiếng Quảng
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[10, 20, 30, 50].map((count) => (
                  <Button
                    key={count}
                    size="lg"
                    variant="outline"
                    onClick={() => handleStart(count)}
                    className="h-20 text-lg font-semibold hover:scale-105 transition-transform"
                  >
                    {count} từ
                  </Button>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Link to="/cantonese/lessons">
                  <Button variant="ghost" className="gap-2">
                    <Home className="h-4 w-4" />
                    返回 (Quay về)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </CantoneseRouteWrapper>
    );
  }

  // Results screen
  if (showResult) {
    const accuracy = (correctAnswers / vocabulary.length) * 100;

    return (
      <CantoneseRouteWrapper>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="text-center space-y-4">
                <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
                <CardTitle className="text-3xl">完成！(Hoàn thành!)</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-6xl font-bold text-primary">
                  {correctAnswers}/{vocabulary.length}
                </p>
                <p className="text-2xl text-muted-foreground">
                  Độ chính xác: {accuracy.toFixed(1)}%
                </p>
              </div>

              <Progress value={accuracy} className="h-3" />

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setQuestionCount(null);
                    setVocabulary([]);
                    setCurrentIndex(0);
                    setCorrectAnswers(0);
                    setShowResult(false);
                    setSessionId(null);
                  }}
                  className="flex-1"
                  size="lg"
                >
                  再練 (Luyện lại)
                </Button>
                <Link to="/cantonese/analytics" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    統計 (Thống kê)
                  </Button>
                </Link>
                <Link to="/cantonese/lessons" className="flex-1">
                  <Button variant="ghost" className="w-full" size="lg">
                    <Home className="h-4 w-4 mr-2" />
                    返回 (Về)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </CantoneseRouteWrapper>
    );
  }

  // Practice screen - Safety check for currentWord
  if (!currentWord) {
    return (
      <CantoneseRouteWrapper>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-muted-foreground">正在載入詞彙... (Đang tải từ vựng...)</p>
          </div>
        </div>
      </CantoneseRouteWrapper>
    );
  }

  return (
    <CantoneseRouteWrapper>
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">進度 (Tiến độ)</span>
            <span className="font-semibold">{currentIndex + 1} / {vocabulary.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Pronunciation Practice */}
        <div className="max-w-2xl mx-auto">
          <PronunciationRecognition
            text={currentWord.hanzi}
            expectedPronunciation={currentWord.pinyin}
            language="zh-HK"
            onResult={handlePronunciationResult}
            showPronunciation={true}
          />

          {/* Word Meaning */}
          <Card className="mt-6">
            <CardContent className="p-6 text-center">
              <p className="text-lg text-muted-foreground">意思 (Nghĩa):</p>
              <p className="text-2xl font-semibold mt-2">{currentWord.meaning}</p>
            </CardContent>
          </Card>

          {/* Result Display & Action Buttons */}
          {hasAnswered && lastResult ? (
            <div className="mt-6 space-y-4">
              {/* Big Result Card */}
              <Card className={`border-2 ${lastResult.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}`}>
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`text-3xl font-bold ${lastResult.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {lastResult.isCorrect ? '✅ 啱喇！(Chính xác!)' : '❌ 未啱 (Chưa đúng)'}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">你讀咗 (Bạn đã đọc): <span className="font-bold text-foreground">{lastResult.recognized}</span></p>
                    <p className="text-sm text-muted-foreground">可信度 (Độ tin cậy): <span className="font-bold text-foreground">{lastResult.confidence.toFixed(1)}%</span></p>
                  </div>
                  {!lastResult.isCorrect && (
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 正確答案 (Đáp án đúng): <span className="font-bold text-lg text-foreground">{currentWord.hanzi}</span>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Next Word Button */}
              <div className="flex justify-center gap-3">
                <Button
                  size="lg"
                  onClick={goToNextWord}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
                >
                  {currentIndex === vocabulary.length - 1 ? '睇結果 (Xem kết quả)' : '下一個字 (Từ tiếp theo)'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            /* Skip Button - Only show when not answered yet */
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={goToNextWord}
                className="gap-2"
              >
                跳過 (Bỏ qua)
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </CantoneseRouteWrapper>
  );
};

export default CantoneseEnhancedPronunciationPage;
