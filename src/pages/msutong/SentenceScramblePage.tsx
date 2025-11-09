import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getVocabularyByMsutong } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, RefreshCw } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { usePinyin } from '@/contexts/PinyinContext';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface CharObject {
  char: string;
  id: number;
}

const MsutongSentenceScramblePage = () => {
  const { showPinyin } = usePinyin();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const vocabulary = useMemo(() => getVocabularyByMsutong(level, lessonIds), [level, lessonIds]);
  
  const allAvailableQuestions = useMemo(() => {
    return vocabulary.flatMap(word => 
      word.examples ? word.examples.map(ex => ({ 
          sentence: ex.hanzi, 
          translation: ex.translation 
      })) : []
    ).filter(q => q.sentence);
  }, [vocabulary]);

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ sentence: string; translation: string; }[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<CharObject[]>([]);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const [shuffledChars, setShuffledChars] = useState<CharObject[]>([]);

  const resetCurrentQuestion = useCallback(() => {
    if (currentQuestion) {
        const chars = currentQuestion.sentence.replace(/[，。？！]/g, '').split('');
        setShuffledChars(shuffleArray(chars.map((char, index) => ({ char, id: index }))));
        setUserAnswer([]);
        setAnswerStatus(null);
    }
  }, [currentQuestion]);

  useEffect(() => {
    resetCurrentQuestion();
  }, [currentQuestion, resetCurrentQuestion]);

  const handleStart = (count: number) => {
    setQuestionCount(count);
    const shuffledQuestions = shuffleArray(allAvailableQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, count);
    setQuestions(selectedQuestions);
    
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
  };

  const handleCharSelect = (charObj: CharObject) => {
    if (answerStatus) return;
    setUserAnswer([...userAnswer, charObj]);
    setShuffledChars(shuffledChars.filter(c => c.id !== charObj.id));
  };

  const handleAnswerCharClick = (charObj: CharObject) => {
    if (answerStatus) return;
    setUserAnswer(userAnswer.filter(c => c.id !== charObj.id));
    setShuffledChars(shuffleArray([...shuffledChars, charObj]));
  };

  const handleSubmit = () => {
    if (answerStatus) return;
    const userAnswerString = userAnswer.map(c => c.char).join('');
    const correctAnswerString = currentQuestion.sentence.replace(/[，。？！]/g, '');
    
    if (userAnswerString === correctAnswerString) {
      setAnswerStatus('correct');
      setCorrectAnswers(prev => prev + 1);
      setTimeout(() => {
        goToNextWord();
      }, 1500);
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const goToNextWord = useCallback(() => {
    setUserAnswer([]);
    setAnswerStatus(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, questions.length]);

  const resetToLevelSelection = () => {
    setQuestionCount(null);
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
  };

  if (allAvailableQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy câu ví dụ</h2>
          <p className="text-muted-foreground mb-8">
            Dạng bài tập này đang được phát triển hoặc các bài bạn chọn không có câu ví dụ. Vui lòng quay lại sau.
          </p>
          <Button asChild>
            <Link to="/msutong">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chọn bài
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
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl">Chọn số lượng câu hỏi</CardTitle>
                <CardDescription>Bạn muốn ôn tập bao nhiêu câu?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {[10, 20, 50].map(count => (
                  <Button 
                    key={count} 
                    onClick={() => handleStart(count)} 
                    disabled={allAvailableQuestions.length < count}
                    size="lg"
                    className="font-bold"
                  >
                    {count} câu
                    {allAvailableQuestions.length < count && ` (Không đủ câu)`}
                  </Button>
                ))}
                <Button onClick={() => handleStart(allAvailableQuestions.length)} size="lg" className="font-bold">Tất cả ({allAvailableQuestions.length} câu)</Button>
                <Button asChild variant="outline" className="font-bold">
                  <Link to="/msutong">
                    <Home className="mr-2 h-4 w-4" /> Quay về trang chọn bài
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
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Kết quả</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold mb-4">
                            {correctAnswers} / {questions.length}
                        </p>
                        <p className="text-muted-foreground mb-6">
                            Bạn đã trả lời đúng {correctAnswers} trên tổng số {questions.length} câu.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={resetToLevelSelection} className="font-bold">Làm lại</Button>
                            <Button asChild variant="secondary" className="font-bold">
                                <Link to="/msutong">
                                    <Home className="mr-2 h-4 w-4" /> Về trang chọn bài
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
  }

  const progressValue = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Sắp Xếp Câu (Msutong)</h1>
            <p className="text-muted-foreground">Sắp xếp các từ sau thành một câu hoàn chỉnh.</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 text-muted-foreground">
              <span>Câu: {currentIndex + 1} / {questions.length}</span>
              <span>Đúng: {correctAnswers}</span>
            </div>
            <Progress value={progressValue} className="w-full" />
          </div>
          
          <Card className="mb-8 shadow-md bg-gradient-spring text-white">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-white/90">Nghĩa: "{currentQuestion?.translation}"</p>
            </CardContent>
          </Card>

          <Card className={cn(
            "mb-4 min-h-24 p-4 flex flex-wrap items-center justify-center gap-3 border-dashed",
            answerStatus === 'correct' && 'border-green-500',
            answerStatus === 'incorrect' && 'border-destructive'
          )}>
            {userAnswer.map((charObj) => (
              <Button key={charObj.id} variant="secondary" className="text-2xl h-14 px-4 font-bold" onClick={() => handleAnswerCharClick(charObj)}>
                {charObj.char}
              </Button>
            ))}
            {userAnswer.length === 0 && <span className="text-muted-foreground">Câu trả lời của bạn sẽ xuất hiện ở đây</span>}
          </Card>

          <div className="mb-8 min-h-24 p-4 flex flex-wrap items-center justify-center gap-3">
            {shuffledChars.map((charObj) => (
              <Button key={charObj.id} variant="outline" className="text-2xl h-14 px-4 font-bold" onClick={() => handleCharSelect(charObj)}>
                {charObj.char}
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            {answerStatus !== 'correct' && (
              <Button onClick={handleSubmit} size="lg" disabled={!!answerStatus || userAnswer.length === 0} className="font-bold">
                Kiểm tra
              </Button>
            )}
            {answerStatus === 'incorrect' && (
                <Button onClick={goToNextWord} size="lg" className="font-bold">
                    Câu tiếp theo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            )}
            <Button onClick={resetCurrentQuestion} variant="outline" size="lg" disabled={!!answerStatus} className="font-bold">
                <RefreshCw className="mr-2 h-5 w-5" /> Thử lại
            </Button>
          </div>

          {answerStatus === 'incorrect' && (
            <Card className="mt-6 shadow-md bg-gradient-tropical text-white">
              <CardContent className="p-6 text-center space-y-2">
                <p className="text-white font-semibold text-lg">Sai rồi!</p>
                <p className="text-2xl md:text-3xl font-bold">{currentQuestion.sentence}</p>
                {showPinyin && (currentQuestion as any).pinyin && (
                  <p className="text-xl font-medium text-white/90">{(currentQuestion as any).pinyin}</p>
                )}
                <p className="text-lg text-white/90">Nghĩa: {currentQuestion.translation}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="secondary" className="font-bold">
              <Link to="/msutong">
                <Home className="mr-2 h-4 w-4" /> Về trang chọn bài
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongSentenceScramblePage;