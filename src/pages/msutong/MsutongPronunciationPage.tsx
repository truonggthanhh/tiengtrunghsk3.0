import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { getVocabularyByMsutong, type VocabularyWord } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Home, Mic, MicOff } from 'lucide-react';
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

interface CustomSpeechRecognition extends SpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
}

const MsutongPronunciationPage = () => {
  const { showPinyin } = usePinyin();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const practiceVocabulary = useMemo(() => getVocabularyByMsutong(level, lessonIds), [level, lessonIds]);

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'info' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [recognition, setRecognition] = useState<CustomSpeechRecognition | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const currentWord = useMemo(() => vocabulary[currentIndex], [vocabulary, currentIndex]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback('info');
      setFeedbackMessage('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói. Vui lòng thử trên Chrome hoặc Edge.');
      return;
    }
    const rec = new SpeechRecognition() as CustomSpeechRecognition;
    rec.lang = 'zh-CN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setRecognition(rec);
  }, []);

  const goToNextWord = useCallback(() => {
    setFeedback(null);
    setFeedbackMessage('');
    setTranscript('');
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [currentIndex, vocabulary.length]);

  const handleListen = useCallback(() => {
    if (!recognition || isListening) return;

    setIsListening(true);
    setTranscript('');
    setFeedback(null);
    setFeedbackMessage('');

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.replace(/[.,。]/g, '');
      setTranscript(result);
      
      if (result === currentWord.hanzi) {
        setFeedback('correct');
        setFeedbackMessage('Chính xác!');
        setCorrectAnswers(prev => prev + 1);
        setTimeout(() => goToNextWord(), 1500);
      } else {
        setFeedback('incorrect');
        setFeedbackMessage(`Bạn nói: "${result}". Thử lại nhé!`);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setFeedback('info');
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setFeedbackMessage('Bạn cần cấp quyền truy cập micro để sử dụng chức năng này.');
      } else {
        setFeedbackMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [recognition, isListening, currentWord, goToNextWord]);

  const handleStart = (count: number) => {
    setQuestionCount(count);
    const shuffledFullVocab = shuffleArray(practiceVocabulary);
    const slicedVocab = shuffledFullVocab.slice(0, count);
    setVocabulary(slicedVocab);
    
    setCurrentIndex(0);
    setCorrectAnswers(0);
    setShowResult(false);
    setTranscript('');
    setFeedback(null);
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
          <Card className="w-full max-w-md p-6 md:p-8 rounded-xl shadow-lg border">
            <CardHeader>
              <CardTitle className="text-2xl">Chọn số lượng câu hỏi</CardTitle>
              <CardDescription>Bạn muốn luyện phát âm bao nhiêu từ?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[10, 20, 50].map(count => (
                <Button
                  key={count}
                  onClick={() => handleStart(count)}
                  disabled={practiceVocabulary.length < count}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold"
                >
                  {count} từ
                  {practiceVocabulary.length < count && ` (Không đủ từ)`}
                </Button>
              ))}
              <Button onClick={() => handleStart(practiceVocabulary.length)} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Tất cả ({practiceVocabulary.length} từ)</Button>
              <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
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
                <Card className="w-full max-w-md p-6 md:p-8 rounded-xl shadow-lg border">
                    <CardHeader>
                        <CardTitle className="text-2xl">Kết quả</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold mb-4">
                            {correctAnswers} / {vocabulary.length}
                        </p>
                        <p className="text-muted-foreground mb-6">
                            Bạn đã phát âm đúng {correctAnswers} trên tổng số {vocabulary.length} từ.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={resetToLevelSelection} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Làm lại</Button>
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
    )
  }

  const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-card p-6 md:p-8 rounded-xl shadow-lg border">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Luyện Phát Âm (Msutong)</h1>
            <p className="text-muted-foreground">Nhấn nút và phát âm chữ Hán hiển thị bên dưới.</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2 text-muted-foreground">
              <span>Câu: {currentIndex + 1} / {vocabulary.length}</span>
              <span>Đúng: {correctAnswers}</span>
            </div>
            <Progress value={progressValue} className="w-full h-2 bg-primary/20" indicatorClassName="bg-primary" />
          </div>

          <Card className="mb-8 shadow-md bg-gradient-vivid text-white">
            <CardContent className="p-10 flex flex-col items-center justify-center space-y-4">
              <h2 className="text-7xl md:text-8xl font-bold">{currentWord?.hanzi}</h2>
              {(showPinyin || feedback !== null) && (
                <p className="text-3xl md:text-4xl font-medium text-white/90">{currentWord?.pinyin}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col items-center gap-6">
            <Button onClick={handleListen} disabled={isListening || !recognition} size="lg" className={cn("w-48 h-16 rounded-full text-primary-foreground transition-all duration-300 font-bold", isListening ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "bg-primary hover:bg-primary/90 hover:scale-[1.02]")}>
              {isListening ? <MicOff className="mr-2 h-6 w-6" /> : <Mic className="mr-2 h-6 w-6" />}
              {isListening ? 'Đang nghe...' : 'Bắt đầu nói'}
            </Button>

            {feedbackMessage && (
              <div className={cn(
                "mt-4 text-center p-4 rounded-lg w-full border",
                feedback === 'correct' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-500',
                feedback === 'incorrect' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-destructive',
                feedback === 'info' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-500'
              )}>
                <p className="font-medium">{feedbackMessage}</p>
              </div>
            )}

            {feedback === 'incorrect' && (
              <Button onClick={goToNextWord} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
                Từ tiếp theo <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="text-center mt-12">
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

export default MsutongPronunciationPage;