import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getVocabularyByLevel } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, RefreshCw, Lightbulb } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { usePinyin } from '@/contexts/PinyinContext';
import { pinyin } from 'pinyin-pro';

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Type for character with unique id and pinyin
interface CharObject {
  char: string;
  pinyin: string;
  id: number;
}

const SentenceScramblePage = () => {
  const { showPinyin } = usePinyin();
  const { level } = useParams<{ level: string }>();
  const fullVocabulary = useMemo(() => getVocabularyByLevel(level || '1'), [level]);
  
  const allAvailableQuestions = useMemo(() => {
    return fullVocabulary.flatMap(word => 
      word.examples ? word.examples.map(ex => ({ 
          sentence: ex.hanzi, 
          translation: ex.translation 
      })) : []
    );
  }, [fullVocabulary]);

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ sentence: string; translation: string; }[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<CharObject[]>([]);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  // State for characters available to pick
  const [shuffledChars, setShuffledChars] = useState<CharObject[]>([]);

  // Reset state variables and generate shuffledChars when currentQuestion changes
  useEffect(() => {
    if (currentQuestion) {
      const chars = currentQuestion.sentence.replace(/[，。？！]/g, '').split('');
      const charsWithPinyin = chars.map((char, index) => ({
        char,
        pinyin: pinyin(char, { toneType: 'symbol' }),
        id: index
      }));
      setShuffledChars(shuffleArray(charsWithPinyin));
      setUserAnswer([]);
      setAnswerStatus(null);
      setShowHint(false);
    }
  }, [currentQuestion]);

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
    setShuffledChars(shuffleArray([...shuffledChars, charObj])); // Re-shuffle available chars
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
            Dạng bài tập này đang được phát triển cho HSK {level}. Vui lòng quay lại sau.
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
                <CardDescription>Bạn muốn ôn tập bao nhiêu câu cho HSK {level}?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {[10, 20, 50].map(count => (
                  <Button 
                    key={count} 
                    onClick={() => handleStart(count)} 
                    disabled={allAvailableQuestions.length < count}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold"
                  >
                    {count} câu
                    {allAvailableQuestions.length < count && ` (Không đủ câu)`}
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
                            {correctAnswers} / {questions.length}
                        </p>
                        <p className="text-muted-foreground mb-6">
                            Bạn đã trả lời đúng {correctAnswers} trên tổng số {questions.length} câu.
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

  const progressValue = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-card p-6 md:p-8 rounded-xl shadow-lg border">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Sắp Xếp Câu HSK {level}</h1>
            <p className="text-muted-foreground">Sắp xếp các từ sau thành một câu hoàn chỉnh.</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 text-muted-foreground">
              <span>Câu: {currentIndex + 1} / {questions.length}</span>
              <span>Đúng: {correctAnswers}</span>
            </div>
            <Progress value={progressValue} className="w-full h-2 bg-primary/20" indicatorClassName="bg-primary" />
          </div>
          
          <Card className="mb-8 shadow-md bg-gradient-spring text-white">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-lg text-white/90 font-medium">Sắp xếp các từ thành câu hoàn chỉnh</p>
              {(showHint || answerStatus) && (
                <div className="pt-4 border-t border-white/20">
                  <p className="text-sm text-white/70 mb-2">Nghĩa:</p>
                  <p className="text-xl text-white font-semibold">"{currentQuestion?.translation}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={cn(
            "mb-4 min-h-24 p-4 flex flex-wrap items-center justify-center gap-3 border-dashed border-2",
            answerStatus === 'correct' && 'border-green-500',
            answerStatus === 'incorrect' && 'border-destructive'
          )}>
            {userAnswer.map((charObj) => (
              <Button
                key={charObj.id}
                variant="secondary"
                className="flex flex-col h-auto py-2 px-3 hover:bg-secondary/80 transition-colors font-bold gap-1"
                onClick={() => handleAnswerCharClick(charObj)}
              >
                <span className="text-2xl">{charObj.char}</span>
                {showPinyin && <span className="text-xs text-muted-foreground">{charObj.pinyin}</span>}
              </Button>
            ))}
            {userAnswer.length === 0 && <span className="text-muted-foreground">Câu trả lời của bạn sẽ xuất hiện ở đây</span>}
          </Card>

          <div className="mb-8 min-h-24 p-4 flex flex-wrap items-center justify-center gap-3">
            {shuffledChars.map((charObj) => (
              <Button
                key={charObj.id}
                variant="outline"
                className="flex flex-col h-auto py-2 px-3 hover:bg-primary/10 hover:text-primary transition-colors font-bold gap-1"
                onClick={() => handleCharSelect(charObj)}
              >
                <span className="text-2xl">{charObj.char}</span>
                {showPinyin && <span className="text-xs text-muted-foreground">{charObj.pinyin}</span>}
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-4 flex-wrap">
            {answerStatus !== 'correct' && (
              <Button onClick={handleSubmit} size="lg" disabled={!!answerStatus || userAnswer.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
                Kiểm tra
              </Button>
            )}
            {answerStatus === 'incorrect' && (
                <Button onClick={goToNextWord} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
                    Câu tiếp theo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            )}
            {!answerStatus && (
              <Button
                onClick={() => setShowHint(true)}
                variant="secondary"
                size="lg"
                disabled={showHint}
                className="hover:bg-secondary/80 transition-colors font-bold"
              >
                <Lightbulb className="mr-2 h-5 w-5" /> Gợi ý đáp án
              </Button>
            )}
            <Button onClick={() => {
                if (currentQuestion) {
                    const chars = currentQuestion.sentence.replace(/[，。？！]/g, '').split('');
                    const charsWithPinyin = chars.map((char, index) => ({
                      char,
                      pinyin: pinyin(char, { toneType: 'symbol' }),
                      id: index
                    }));
                    setShuffledChars(shuffleArray(charsWithPinyin));
                    setUserAnswer([]);
                    setAnswerStatus(null);
                    setShowHint(false);
                }
            }} variant="outline" size="lg" disabled={!!answerStatus} className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                <RefreshCw className="mr-2 h-5 w-5" /> Thử lại
            </Button>
          </div>

          {answerStatus === 'incorrect' && (
            <Card className="mt-6 shadow-md bg-gradient-tropical text-white">
              <CardContent className="p-6 text-center space-y-2">
                <p className="text-white font-semibold text-lg">Sai rồi!</p>
                <p className="text-2xl md:text-3xl font-bold">{currentQuestion.sentence}</p>
                {showPinyin && currentQuestion.pinyin && (
                  <p className="text-xl font-medium text-white/90">{currentQuestion.pinyin}</p>
                )}
                <p className="text-lg text-white/90">Nghĩa: {currentQuestion.translation}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
              <Link to="/mandarin">
                <Home className="mr-2 h-4 w-4" /> Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SentenceScramblePage;