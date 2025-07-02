import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getVocabularyByMsutong, getFullMsutongVocabularyByLevel, type VocabularyWord } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, CheckCircle2, XCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const MsutongSentenceChoicePage = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const practiceVocabulary = useMemo(() => getVocabularyByMsutong(level, lessonIds), [level, lessonIds]);
  const distractorVocabulary = useMemo(() => getFullMsutongVocabularyByLevel(level), [level]);
  
  const allAvailableQuestions = useMemo(() => {
    return practiceVocabulary.flatMap(word => 
      word.examples ? word.examples.map(ex => ({ 
          word: word, 
          sentence: ex.hanzi, 
          translation: ex.translation 
      })) : []
    ).filter(q => q.sentence && q.word);
  }, [practiceVocabulary]);

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ word: VocabularyWord; sentence: string; translation: string; }[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const generateOptions = useCallback(() => {
    if (!currentQuestion) return;

    const correctOption = currentQuestion.word.hanzi;
    const incorrectOptions = distractorVocabulary
      .filter(word => word.hanzi !== correctOption)
      .map(word => word.hanzi);
    
    const shuffledIncorrect = shuffleArray([...new Set(incorrectOptions)]).slice(0, 3);
    
    const finalOptions = shuffleArray([correctOption, ...shuffledIncorrect]);
    setOptions(finalOptions);
  }, [currentQuestion, distractorVocabulary]);

  const goToNextWord = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, questions.length]);

  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      generateOptions();
    }
  }, [currentIndex, generateOptions, questions]);

  const handleStart = (count: number) => {
    setQuestionCount(count);
    const shuffledQuestions = shuffleArray(allAvailableQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, count);
    setQuestions(selectedQuestions);
    
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };
  
  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.word.hanzi;
    setIsCorrect(correct);
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      setTimeout(() => {
        goToNextWord();
      }, 1200);
    }
  };
  
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
  const questionSentence = currentQuestion?.sentence.replace(currentQuestion.word.hanzi, '___');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Điền Từ Vào Câu (Msutong)</h1>
            <p className="text-muted-foreground">Chọn từ đúng để hoàn thành câu sau.</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 text-muted-foreground">
              <span>Câu: {currentIndex + 1} / {questions.length}</span>
              <span>Đúng: {correctAnswers}</span>
            </div>
            <Progress value={progressValue} className="w-full" />
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider">{questionSentence}</h2>
              <p className="text-lg text-muted-foreground">{currentQuestion?.translation}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isTheCorrectAnswer = option === currentQuestion.word.hanzi;
              
              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={cn(
                    "h-20 text-2xl font-bold",
                    isSelected && isCorrect === false && "bg-destructive hover:bg-destructive/90",
                    selectedAnswer && isTheCorrectAnswer && "bg-green-600 hover:bg-green-600/90"
                  )}
                  variant="outline"
                >
                  {option}
                  {isSelected && isCorrect === false && <XCircle className="ml-4 h-6 w-6" />}
                  {selectedAnswer && isTheCorrectAnswer && <CheckCircle2 className="ml-4 h-6 w-6" />}
                </Button>
              )
            })}
          </div>

          {selectedAnswer && isCorrect === false && (
            <div className="mt-8 text-center">
              <Button onClick={goToNextWord} size="lg" className="font-bold">
                {currentIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          <div className="text-center mt-8">
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

export default MsutongSentenceChoicePage;