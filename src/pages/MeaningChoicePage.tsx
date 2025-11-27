import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getVocabularyByLevel, type VocabularyWord } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { usePinyin } from '@/contexts/PinyinContext';
import { GamificationWrapper, useGamificationTracking } from '@/components/gamification/GamificationWrapper';
import { useSRS } from '@/hooks/useSRS';
import { useAnalytics } from '@/hooks/useAnalytics';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MeaningChoicePage = () => {
  const { level } = useParams<{ level: string }>();
  const fullVocabulary = useMemo(() => getVocabularyByLevel(level || '1'), [level]);
  const { showPinyin } = usePinyin();
  const { trackQuizCompletion } = useGamificationTracking();

  // SRS and Analytics hooks
  const { updateReview, calculateQuality, getMixedVocabulary } = useSRS();
  const { startSession, completeSession, recordAnswer } = useAnalytics();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Ref to store timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentWord = useMemo(() => vocabulary[currentIndex], [vocabulary, currentIndex]);

  const generateOptions = useCallback(() => {
    if (!currentWord) return;

    const correctOption = currentWord.meaning;
    const incorrectOptions = fullVocabulary
      .filter(word => word.meaning !== correctOption)
      .map(word => word.meaning);
    
    const shuffledIncorrect = shuffleArray(incorrectOptions);
    
    const uniqueIncorrectOptions = [...new Set(shuffledIncorrect)].slice(0, 3);

    const finalOptions = shuffleArray([correctOption, ...uniqueIncorrectOptions]);
    setOptions(finalOptions);
  }, [currentWord, fullVocabulary]);

  const goToNextWord = useCallback(() => {
    setSelectedMeaning(null);
    setIsCorrect(null);
    setQuestionStartTime(Date.now()); // Reset timer for next question
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, vocabulary.length]);

  useEffect(() => {
    if (vocabulary.length > 0 && currentIndex < vocabulary.length) {
      generateOptions();
    }
  }, [currentIndex, generateOptions, vocabulary]);

  useEffect(() => {
    if (showResult && vocabulary.length > 0) {
      trackQuizCompletion(correctAnswers, vocabulary.length, {
        quiz_type: 'meaning_choice',
        level: level,
        question_count: questionCount,
      });
    }
  }, [showResult, correctAnswers, vocabulary.length, questionCount, level, trackQuizCompletion]);

  // Complete analytics session when quiz finishes
  useEffect(() => {
    if (showResult && sessionId) {
      const duration = Math.floor((Date.now() - questionStartTime) / 1000);
      completeSession(sessionId, correctAnswers, duration);
    }
  }, [showResult, sessionId, questionStartTime, correctAnswers, completeSession]);

  const handleStart = async (count: number) => {
    setQuestionCount(count);

    // Use SRS to get mixed vocabulary (due reviews + new words)
    const mixedVocab = await getMixedVocabulary(
      fullVocabulary,
      'mandarin',
      `hsk${level}`,
      count
    );
    setVocabulary(mixedVocab);

    // Start analytics session
    const sid = await startSession('meaning_choice', 'mandarin', `hsk${level}`, count);
    setSessionId(sid);

    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setSelectedMeaning(null);
    setIsCorrect(null);
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = async (meaning: string) => {
    if (selectedMeaning) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSelectedMeaning(meaning);
    const correct = meaning === currentWord.meaning;
    setIsCorrect(correct);

    // Calculate response time and quality
    const responseTime = Date.now() - questionStartTime;
    const quality = calculateQuality(correct, responseTime);

    // Update SRS review
    await updateReview({
      wordId: currentWord.id,
      wordType: 'mandarin',
      level: `hsk${level}`,
      hanzi: currentWord.hanzi,
      pinyin: currentWord.pinyin,
      isCorrect: correct,
      quality
    });

    // Record answer for analytics
    if (sessionId) {
      await recordAnswer(
        sessionId,
        {
          word_id: currentWord.id,
          word: currentWord.hanzi,
          pinyin: currentWord.pinyin,
          meaning: currentWord.meaning,
          user_answer: meaning,
          correct_answer: currentWord.meaning,
          is_correct: correct,
          response_time_ms: responseTime
        },
        'meaning_choice'
      );
    }

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      timeoutRef.current = setTimeout(() => {
        goToNextWord();
        setQuestionStartTime(Date.now()); // Reset timer for next question
        timeoutRef.current = null;
      }, 2500);
    }
  };

  const handleNextQuestion = () => {
    // Clear timeout when user manually clicks next
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    goToNextWord();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const resetToLevelSelection = () => {
    setQuestionCount(null);
    setVocabulary([]);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
  };

  if (fullVocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
          <p className="text-muted-foreground mb-8">
            Chức năng này đang được phát triển cho HSK {level}. Vui lòng quay lại sau.
          </p>
          <Button asChild>
            <Link to="/mandarin">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  if (!questionCount) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md p-6 md:p-8 rounded-xl shadow-lg border">
            <CardHeader>
              <CardTitle className="text-2xl">Chọn số lượng câu hỏi</CardTitle>
              <CardDescription>Bạn muốn ôn tập bao nhiêu từ cho HSK {level}?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[50, 100, 150, 200].map(count => (
                <Button 
                  key={count} 
                  onClick={() => handleStart(count)} 
                  disabled={fullVocabulary.length < count}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold"
                >
                  {count} câu
                  {fullVocabulary.length < count && ` (Không đủ từ)`}
                </Button>
              ))}
              <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                <Link to="/mandarin">
                  <Home className="mr-2 h-4 w-4" /> Quay về trang chủ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (showResult) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
                <Card className="w-full max-w-md p-6 md:p-8 rounded-xl shadow-lg border">
                    <CardHeader>
                        <CardTitle className="text-2xl">Kết quả</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold mb-4">
                            {correctAnswers} / {vocabulary.length}
                        </p>
                        <p className="text-muted-foreground mb-6">
                            Bạn đã trả lời đúng {correctAnswers} trên tổng số {vocabulary.length} câu.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={resetToLevelSelection} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Làm lại</Button>
                            <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                                <Link to="/mandarin">
                                    <Home className="mr-2 h-4 w-4" /> Về trang chủ
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
  }

  const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

  return (
    <GamificationWrapper>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl bg-card p-6 md:p-8 rounded-xl shadow-lg border">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold">Chọn Nghĩa HSK {level}</h1>
              <p className="text-muted-foreground">Chọn nghĩa đúng cho từ vựng sau.</p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2 text-muted-foreground">
                <span>Câu: {currentIndex + 1} / {vocabulary.length}</span>
                <span>Đúng: {correctAnswers}</span>
              </div>
              <Progress value={progressValue} className="w-full h-2 bg-primary/20" indicatorClassName="bg-primary" />
            </div>

            <Card className="mb-8 shadow-md bg-gradient-sunset text-white">
              <CardContent className="p-10 flex flex-col items-center justify-center space-y-4">
                <h2 className="text-7xl md:text-8xl font-bold">{currentWord?.hanzi}</h2>
                {showPinyin && (
                  <p className="text-2xl md:text-3xl font-medium text-white/90">{currentWord?.pinyin}</p>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((meaning, index) => {
                const isSelected = selectedMeaning === meaning;
                const isTheCorrectAnswer = meaning === currentWord.meaning;

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(meaning)}
                    disabled={!!selectedMeaning}
                    className={cn(
                      "h-auto min-h-20 text-lg py-4 transition-all duration-300 font-bold",
                      isSelected && isCorrect === false && "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                      selectedMeaning && isTheCorrectAnswer && "bg-green-600 hover:bg-green-600/90 text-white",
                      !isSelected && !selectedMeaning && "hover:bg-primary/10 hover:text-primary"
                    )}
                    variant="outline"
                  >
                    {meaning}
                    {isSelected && isCorrect === false && <XCircle className="ml-4 h-6 w-6" />}
                    {selectedMeaning && isTheCorrectAnswer && <CheckCircle2 className="ml-4 h-6 w-6" />}
                  </Button>
                )
              })}
            </div>

            {selectedMeaning && (
              <div className="mt-8 text-center">
                <Button onClick={handleNextQuestion} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
                  {currentIndex === vocabulary.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            <div className="text-center mt-8">
              <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                <Link to="/mandarin">
                  <Home className="mr-2 h-4 w-4" /> Về trang chủ
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </GamificationWrapper>
  );
};

export default MeaningChoicePage;
