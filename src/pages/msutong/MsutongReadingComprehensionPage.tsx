import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getReadingComprehensionByMsutong, type ReadingComprehensionPassage, type ReadingComprehensionQuestion } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, CheckCircle2, XCircle, BookText, Grid3X3, ListOrdered } from 'lucide-react';
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

const MsutongReadingComprehensionPage = () => {
  const { showPinyin } = usePinyin();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const allPassages = useMemo(() => getReadingComprehensionByMsutong(level, lessonIds), [level, lessonIds]);

  // Build URLs for back navigation
  const exerciseSelectionUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append('level', level);
    if (lessonIds.length > 0) params.append('lessonIds', lessonIds.join(','));
    params.append('step', 'exercise');
    return `/mandarin/msutong?${params.toString()}`;
  }, [level, lessonIds]);

  const lessonSelectionUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append('level', level);
    if (lessonIds.length > 0) params.append('lessonIds', lessonIds.join(','));
    params.append('step', 'lesson');
    return `/mandarin/msutong?${params.toString()}`;
  }, [level, lessonIds]);

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
            <Link to="/mandarin/msutong">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
          <Card className="w-full max-w-md p-6 md:p-8 rounded-xl shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
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
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={resetExercise} className="bg-gradient-spring text-white hover:bg-gradient-spring/90 hover:scale-[1.02] transition-all font-bold border-0 shadow-cyan">Làm lại</Button>
                <Button asChild className="bg-gradient-sunset text-white hover:bg-gradient-sunset/90 hover:scale-[1.02] transition-all font-bold border-0 shadow-pink">
                  <Link to={exerciseSelectionUrl}>
                    <Grid3X3 className="mr-2 h-4 w-4" /> Chọn bài tập khác
                  </Link>
                </Button>
                <Button asChild variant="outline" className="font-bold">
                  <Link to={lessonSelectionUrl}>
                    <ListOrdered className="mr-2 h-4 w-4" /> Chọn bài khác
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-white/90 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-2xl border-0">
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
              <Card className="mb-8 shadow-md bg-gradient-ocean text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{currentPassage.title}</CardTitle>
                  <CardDescription className="text-white/90">Đọc kỹ đoạn văn sau:</CardDescription>
                  {showPinyin && (
                    <p className="text-sm text-white/70 italic mt-2">
                      💡 Bài đọc hiểu tập trung vào kỹ năng đọc - Pinyin không được cung cấp
                    </p>
                  )}
                </CardHeader>
                <CardContent className="text-lg leading-relaxed whitespace-pre-wrap text-white">
                  {currentPassage.passage}
                </CardContent>
              </Card>
              <div className="text-center">
                <Button onClick={() => setHasStartedQuestions(true)} size="lg" className="bg-gradient-vivid text-white hover:bg-gradient-vivid/90 hover:scale-[1.02] transition-all font-bold border-0 shadow-purple">
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

              <Card className="mb-8 shadow-md bg-gradient-fire text-white border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{currentQuestion.questionText}</CardTitle>
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
                          isSelected && isCorrect === false && "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-0",
                          selectedOptionIndex !== null && isTheCorrectAnswer && "bg-green-600 hover:bg-green-600/90 text-white border-0",
                          selectedOptionIndex === null && "bg-white text-gray-800 hover:bg-gradient-vivid hover:text-white border-2 border-white"
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
                <div className="mt-6 text-center p-4 bg-gradient-tropical text-white rounded-lg border-0 shadow-orange">
                  <p className="text-white mb-2 font-semibold">Sai rồi!</p>
                  <p className="text-lg text-white">
                    Đáp án đúng là: <span className="font-bold text-yellow-200">
                      {currentQuestion.options[currentQuestion.correctAnswerIndex]}
                    </span>
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-sm text-white/90 mt-2">Giải thích: {currentQuestion.explanation}</p>
                  )}
                </div>
              )}

              {selectedOptionIndex !== null && isCorrect === false && (
                <div className="mt-8 text-center">
                  <Button onClick={goToNextQuestion} size="lg" className="bg-gradient-colorful text-white hover:bg-gradient-colorful/90 hover:scale-[1.02] transition-all font-bold border-0 shadow-purple">
                    {currentQuestionIndex === currentPassage.questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Button asChild className="bg-gradient-spring text-white hover:bg-gradient-spring/90 hover:scale-[1.02] transition-all font-bold border-0 shadow-cyan">
              <Link to={exerciseSelectionUrl}>
                <Grid3X3 className="mr-2 h-4 w-4" /> Chọn bài tập khác
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-bold">
              <Link to={lessonSelectionUrl}>
                <ListOrdered className="mr-2 h-4 w-4" /> Chọn bài khác
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongReadingComprehensionPage;