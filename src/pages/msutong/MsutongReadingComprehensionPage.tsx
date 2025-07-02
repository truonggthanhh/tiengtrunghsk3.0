import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getReadingComprehensionByMsutong, type ReadingComprehensionPassage, type ReadingComprehensionQuestion } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, CheckCircle2, XCircle, BookText } from 'lucide-react';
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

const MsutongReadingComprehensionPage = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const allPassages = useMemo(() => getReadingComprehensionByMsutong(level, lessonIds), [level, lessonIds]);

  const [currentPassage, setCurrentPassage] = useState<ReadingComprehensionPassage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hasStartedQuestions, setHasStartedQuestions] = useState(false);

  useEffect(() => {
    if (allPassages.length > 0) {
      const shuffledPassages = shuffleArray(allPassages);
      setCurrentPassage(shuffledPassages[0]);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setHasStartedQuestions(false);
      setSelectedOptionIndex(null);
      setIsCorrect(null);
    }
  }, [allPassages]);

  const handleAnswer = (optionIndex: number) => {
    if (selectedOptionIndex !== null) return; // Prevent re-answering

    setSelectedOptionIndex(optionIndex);
    const correct = optionIndex === currentPassage?.questions[currentQuestionIndex].correctAnswerIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      setTimeout(() => {
        goToNextQuestion();
      }, 1200);
    }
  };

  const goToNextQuestion = useCallback(() => {
    setSelectedOptionIndex(null);
    setIsCorrect(null);
    if (currentPassage && currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentPassage, currentQuestionIndex]);

  const resetExercise = useCallback(() => {
    if (allPassages.length > 0) {
      const shuffledPassages = shuffleArray(allPassages);
      setCurrentPassage(shuffledPassages[0]);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setHasStartedQuestions(false);
      setSelectedOptionIndex(null);
      setIsCorrect(null);
    }
  }, [allPassages]);

  if (allPassages.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài đọc hiểu</h2>
          <p className="text-muted-foreground mb-8">
            Dạng bài tập đọc hiểu chưa có sẵn cho các bài học bạn đã chọn. Vui lòng chọn các bài học khác hoặc quay lại sau.
          </p>
          <Button asChild variant="secondary" className="font-bold">
            <Link to="/msutong">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chọn bài
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  if (!currentPassage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p>Đang tải bài đọc...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-tertiary/10 flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md p-6 md:p-8 rounded-xl shadow-lg border border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Kết quả</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold mb-4">
                {score} / {currentPassage.questions.length}
              </p>
              <p className="text-muted-foreground mb-6">
                Bạn đã trả lời đúng {score} trên tổng số {currentPassage.questions.length} câu hỏi.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetExercise} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Làm lại</Button>
                <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                  <Link to="/msutong">
                    <Home className="mr-2 h-4 w-4" /> Về trang chọn bài
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = currentPassage.questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / currentPassage.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-tertiary/10 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-card p-6 md:p-8 rounded-xl shadow-lg border border-primary/20">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <BookText className="h-7 w-7 text-primary" /> Đọc hiểu (Msutong)
            </h1>
            <p className="text-muted-foreground">
              {currentPassage.title} (Bài {currentPassage.lesson}, Quyển {currentPassage.bookSlug.replace('quyen-', '')})
            </p>
          </div>

          {!hasStartedQuestions ? (
            <>
              <Card className="mb-8 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">{currentPassage.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">Đọc kỹ đoạn văn sau:</CardDescription>
                </CardHeader>
                <CardContent className="text-lg leading-relaxed whitespace-pre-wrap">
                  {currentPassage.passage}
                </CardContent>
              </Card>
              <div className="text-center">
                <Button onClick={() => setHasStartedQuestions(true)} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
                  Bắt đầu làm bài <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2 text-muted-foreground">
                  <span>Câu: {currentQuestionIndex + 1} / {currentPassage.questions.length}</span>
                  <span>Đúng: {score}</span>
                </div>
                <Progress value={progressValue} className="w-full h-2 bg-primary/20" indicatorClassName="bg-primary" />
              </div>

              <Card className="mb-8 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl">{currentQuestion.questionText}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOptionIndex === index;
                    const isTheCorrectAnswer = index === currentQuestion.correctAnswerIndex;

                    return (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedOptionIndex !== null}
                        className={cn(
                          "h-auto min-h-16 text-lg py-3 text-left justify-start whitespace-normal break-words transition-all duration-300 font-bold",
                          isSelected && isCorrect === false && "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                          selectedOptionIndex !== null && isTheCorrectAnswer && "bg-green-600 hover:bg-green-600/90 text-white",
                          selectedOptionIndex === null && "hover:bg-primary/10 hover:text-primary"
                        )}
                        variant="outline"
                      >
                        {option}
                        {isSelected && isCorrect === false && <XCircle className="ml-auto h-5 w-5" />}
                        {selectedOptionIndex !== null && isTheCorrectAnswer && <CheckCircle2 className="ml-auto h-5 w-5" />}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {selectedOptionIndex !== null && isCorrect === false && (
                <div className="mt-6 text-center p-4 bg-destructive/10 rounded-lg border border-destructive">
                  <p className="text-destructive mb-2 font-semibold">Sai rồi!</p>
                  <p className="text-lg">
                    Đáp án đúng là: <span className="font-bold text-primary">
                      {currentQuestion.options[currentQuestion.correctAnswerIndex]}
                    </span>
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-sm text-muted-foreground mt-2">Giải thích: {currentQuestion.explanation}</p>
                  )}
                </div>
              )}

              {selectedOptionIndex !== null && isCorrect === false && (
                <div className="mt-8 text-center">
                  <Button onClick={goToNextQuestion} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
                    {currentQuestionIndex === currentPassage.questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
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

export default MsutongReadingComprehensionPage;