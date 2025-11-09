import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getVocabularyByMsutong, type VocabularyWord } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Home } from 'lucide-react';
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

const MsutongFillInTheBlankPage = () => {
  const { showPinyin } = usePinyin();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const practiceVocabulary = useMemo(() => getVocabularyByMsutong(level, lessonIds), [level, lessonIds]);

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentWord = useMemo(() => vocabulary[currentIndex], [vocabulary, currentIndex]);

  const goToNextWord = useCallback(() => {
    setInputValue('');
    setAnswerStatus(null);
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, vocabulary.length]);

  const handleStart = (count: number) => {
    setQuestionCount(count);
    const shuffledFullVocab = shuffleArray(practiceVocabulary);
    const slicedVocab = shuffledFullVocab.slice(0, count);
    setVocabulary(slicedVocab);
    
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setInputValue('');
    setAnswerStatus(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerStatus || !inputValue.trim()) return;

    const isCorrect = inputValue.trim() === currentWord.hanzi;
    if (isCorrect) {
      setAnswerStatus('correct');
      setCorrectAnswers(prev => prev + 1);
      setTimeout(() => {
        goToNextWord();
      }, 1500);
    } else {
      setAnswerStatus('incorrect');
    }
  };
  
  const resetToLevelSelection = () => {
    setQuestionCount(null);
    setVocabulary([]);
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
  };

  if (practiceVocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
          <p className="text-muted-foreground mb-8">
            Vui lòng quay lại và chọn bài học để bắt đầu.
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
              <CardDescription>Bạn muốn ôn tập bao nhiêu từ?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[10, 20, 50].map(count => (
                <Button 
                  key={count} 
                  onClick={() => handleStart(count)} 
                  disabled={practiceVocabulary.length < count}
                  size="lg"
                  className="font-bold"
                >
                  {count} câu
                  {practiceVocabulary.length < count && ` (Không đủ từ)`}
                </Button>
              ))}
              <Button onClick={() => handleStart(practiceVocabulary.length)} size="lg" className="font-bold">Tất cả ({practiceVocabulary.length} từ)</Button>
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
                            {correctAnswers} / {vocabulary.length}
                        </p>
                        <p className="text-muted-foreground mb-6">
                            Bạn đã trả lời đúng {correctAnswers} trên tổng số {vocabulary.length} câu.
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

  const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Điền Từ (Msutong)</h1>
            <p className="text-muted-foreground">Dựa vào phiên âm và nghĩa, hãy điền chữ Hán tương ứng.</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 text-muted-foreground">
              <span>Câu: {currentIndex + 1} / {vocabulary.length}</span>
              <span>Đúng: {correctAnswers}</span>
            </div>
            <Progress value={progressValue} className="w-full" />
          </div>
          
          <Card className="mb-8 bg-gradient-fire text-white border-0">
            <CardContent className="p-10 flex flex-col items-center justify-center gap-4">
              {(showPinyin || answerStatus) ? (
                <p className="text-4xl font-semibold">{currentWord?.pinyin}</p>
              ) : (
                <p className="text-lg opacity-80 italic">Pinyin sẽ hiển thị sau khi kiểm tra</p>
              )}
              <p className="text-2xl">{currentWord?.meaning}</p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập chữ Hán..."
              className={cn(
                "text-center text-3xl h-16",
                answerStatus === 'correct' && 'border-green-500 focus-visible:ring-green-500',
                answerStatus === 'incorrect' && 'border-destructive focus-visible:ring-destructive'
              )}
              disabled={!!answerStatus}
            />
            
            {answerStatus !== 'correct' && (
              <Button type="submit" className="w-full font-bold" size="lg" disabled={!!answerStatus}>
                Kiểm tra
              </Button>
            )}
          </form>

          {answerStatus === 'incorrect' && (
            <div className="mt-6 text-center p-4 bg-destructive/10 rounded-lg">
              <p className="text-destructive mb-2 font-semibold">Sai rồi!</p>
              <p className="text-lg">Đáp án đúng là: <span className="font-bold text-2xl">{currentWord.hanzi}</span></p>
            </div>
          )}

          {answerStatus && answerStatus !== 'correct' && (
            <div className="mt-8 text-center">
              <Button onClick={goToNextWord} size="lg" className="font-bold">
                {currentIndex === vocabulary.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
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

export default MsutongFillInTheBlankPage;