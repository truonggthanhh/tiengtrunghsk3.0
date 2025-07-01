import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Home, ChevronsLeft, ChevronsRight, CheckCircle2, XCircle, RefreshCw, Mic, MicOff } from 'lucide-react';
import { getVocabularyByMsutong, getFullMsutongVocabularyByLevel, VocabularyWord } from '@/data';
import Flashcard from '@/components/Flashcard';
import { cn } from '@/lib/utils';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Practice Components ---

const FlashcardPractice: React.FC<{ vocabulary: VocabularyWord[] }> = ({ vocabulary }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

    const goToNextWord = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % vocabulary.length);
    }, [vocabulary.length]);

    const goToPreviousWord = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + vocabulary.length) % vocabulary.length);
    }, [vocabulary.length]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') goToNextWord();
            else if (event.key === 'ArrowLeft') goToPreviousWord();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNextWord, goToPreviousWord]);

    const currentWord = vocabulary[currentIndex];
    if (!currentWord) return null;

    return (
        <div className="w-full max-w-2xl">
            <Flashcard key={currentWord.id} hanzi={currentWord.hanzi} pinyin={currentWord.pinyin} meaning={currentWord.meaning} />
            <div className="mt-8">
                <Progress value={progressValue} className="w-full mb-4" />
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={goToPreviousWord}><ArrowLeft className="mr-2 h-4 w-4" /> Từ trước</Button>
                    <span className="text-lg font-medium text-muted-foreground">{currentIndex + 1} / {vocabulary.length}</span>
                    <Button variant="outline" onClick={goToNextWord}>Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    );
};

const ChoicePractice: React.FC<{ practiceVocabulary: VocabularyWord[], distractorVocabulary: VocabularyWord[], type: 'pinyin' | 'meaning' }> = ({ practiceVocabulary, distractorVocabulary, type }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentWord = useMemo(() => practiceVocabulary[currentIndex], [practiceVocabulary, currentIndex]);

    const generateOptions = useCallback(() => {
        if (!currentWord) return;
        const correctOption = type === 'pinyin' ? currentWord.pinyin : currentWord.meaning;
        const incorrectOptions = distractorVocabulary
            .filter(word => (type === 'pinyin' ? word.pinyin : word.meaning) !== correctOption)
            .map(word => type === 'pinyin' ? word.pinyin : word.meaning);
        const uniqueIncorrectOptions = [...new Set(shuffleArray(incorrectOptions))].slice(0, 3);
        setOptions(shuffleArray([correctOption, ...uniqueIncorrectOptions]));
    }, [currentWord, distractorVocabulary, type]);

    const goToNextWord = useCallback(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        if (currentIndex < practiceVocabulary.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    }, [currentIndex, practiceVocabulary.length]);

    useEffect(() => {
        if (practiceVocabulary.length > 0 && currentIndex < practiceVocabulary.length) {
            generateOptions();
        }
    }, [currentIndex, generateOptions, practiceVocabulary]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        const correct = answer === (type === 'pinyin' ? currentWord.pinyin : currentWord.meaning);
        setIsCorrect(correct);
        if (correct) {
            setCorrectAnswers(prev => prev + 1);
            setTimeout(() => goToNextWord(), 1200);
        }
    };

    if (showResult) {
        return (
            <Card className="w-full max-w-md text-center">
                <CardHeader><CardTitle className="text-2xl">Kết quả</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold mb-4">{correctAnswers} / {practiceVocabulary.length}</p>
                    <p className="text-muted-foreground mb-6">Bạn đã trả lời đúng {correctAnswers} trên tổng số {practiceVocabulary.length} câu.</p>
                    <Button onClick={() => window.location.reload()}>Làm lại</Button>
                </CardContent>
            </Card>
        );
    }

    const progressValue = ((currentIndex + 1) / practiceVocabulary.length) * 100;

    return (
        <div className="w-full max-w-2xl">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2 text-muted-foreground">
                    <span>Câu: {currentIndex + 1} / {practiceVocabulary.length}</span>
                    <span>Đúng: {correctAnswers}</span>
                </div>
                <Progress value={progressValue} className="w-full" />
            </div>
            <Card className="mb-8"><CardContent className="p-10 flex items-center justify-center"><h2 className="text-7xl md:text-8xl font-bold">{currentWord?.hanzi}</h2></CardContent></Card>
            <div className={cn("grid gap-4", type === 'pinyin' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2')}>
                {options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isTheCorrectAnswer = option === (type === 'pinyin' ? currentWord.pinyin : currentWord.meaning);
                    return (
                        <Button key={index} onClick={() => handleAnswer(option)} disabled={!!selectedAnswer} className={cn("h-auto min-h-20 text-lg py-4", isSelected && isCorrect === false && "bg-destructive hover:bg-destructive/90", selectedAnswer && isTheCorrectAnswer && "bg-green-600 hover:bg-green-600/90")} variant="outline">
                            {option}
                            {isSelected && isCorrect === false && <XCircle className="ml-4 h-6 w-6" />}
                            {selectedAnswer && isTheCorrectAnswer && <CheckCircle2 className="ml-4 h-6 w-6" />}
                        </Button>
                    );
                })}
            </div>
            {selectedAnswer && isCorrect === false && (
                <div className="mt-8 text-center"><Button onClick={goToNextWord} size="lg">{currentIndex === practiceVocabulary.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}<ArrowRight className="ml-2 h-5 w-5" /></Button></div>
            )}
        </div>
    );
};

const FillInTheBlankPractice: React.FC<{ vocabulary: VocabularyWord[] }> = ({ vocabulary }) => {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (answerStatus || !inputValue.trim()) return;
        const isCorrect = inputValue.trim() === currentWord.hanzi;
        if (isCorrect) {
            setAnswerStatus('correct');
            setCorrectAnswers(prev => prev + 1);
            setTimeout(() => goToNextWord(), 1500);
        } else {
            setAnswerStatus('incorrect');
        }
    };

    if (showResult) {
        return (
            <Card className="w-full max-w-md text-center">
                <CardHeader><CardTitle className="text-2xl">Kết quả</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold mb-4">{correctAnswers} / {vocabulary.length}</p>
                    <p className="text-muted-foreground mb-6">Bạn đã trả lời đúng {correctAnswers} trên tổng số {vocabulary.length} câu.</p>
                    <Button onClick={() => window.location.reload()}>Làm lại</Button>
                </CardContent>
            </Card>
        );
    }
    
    const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

    return (
        <div className="w-full max-w-2xl">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2 text-muted-foreground">
                    <span>Câu: {currentIndex + 1} / {vocabulary.length}</span>
                    <span>Đúng: {correctAnswers}</span>
                </div>
                <Progress value={progressValue} className="w-full" />
            </div>
            <Card className="mb-8"><CardContent className="p-10 flex flex-col items-center justify-center gap-4"><p className="text-4xl font-semibold">{currentWord?.pinyin}</p><p className="text-2xl text-muted-foreground">{currentWord?.meaning}</p></CardContent></Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Nhập chữ Hán..." className={cn("text-center text-3xl h-16", answerStatus === 'correct' && 'border-green-500 focus-visible:ring-green-500', answerStatus === 'incorrect' && 'border-destructive focus-visible:ring-destructive')} disabled={!!answerStatus} />
                {answerStatus !== 'correct' && (<Button type="submit" className="w-full" size="lg" disabled={!!answerStatus}>Kiểm tra</Button>)}
            </form>
            {answerStatus === 'incorrect' && (<div className="mt-6 text-center p-4 bg-destructive/10 rounded-lg"><p className="text-destructive mb-2">Sai rồi!</p><p className="text-lg">Đáp án đúng là: <span className="font-bold text-2xl">{currentWord.hanzi}</span></p></div>)}
            {answerStatus && answerStatus !== 'correct' && (<div className="mt-8 text-center"><Button onClick={goToNextWord} size="lg">{currentIndex === vocabulary.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}<ArrowRight className="ml-2 h-5 w-5" /></Button></div>)}
        </div>
    );
};

const PronunciationPractice: React.FC<{ vocabulary: VocabularyWord[] }> = ({ vocabulary }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'info' | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [recognition, setRecognition] = useState<any>(null);
    const [showResult, setShowResult] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const currentWord = useMemo(() => vocabulary[currentIndex], [vocabulary, currentIndex]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setFeedback('info');
            setFeedbackMessage('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói.');
            return;
        }
        const rec = new SpeechRecognition();
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
        recognition.onresult = (event: any) => {
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
        recognition.onerror = (event: any) => {
            setFeedback('info');
            setFeedbackMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
            setIsListening(false);
        };
        recognition.onend = () => setIsListening(false);
        recognition.start();
    }, [recognition, isListening, currentWord, goToNextWord]);

    if (showResult) {
        return (
            <Card className="w-full max-w-md text-center">
                <CardHeader><CardTitle className="text-2xl">Kết quả</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold mb-4">{correctAnswers} / {vocabulary.length}</p>
                    <p className="text-muted-foreground mb-6">Bạn đã phát âm đúng {correctAnswers} trên tổng số {vocabulary.length} từ.</p>
                    <Button onClick={() => window.location.reload()}>Làm lại</Button>
                </CardContent>
            </Card>
        );
    }

    const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

    return (
        <div className="w-full max-w-2xl">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2 text-muted-foreground">
                    <span>Từ: {currentIndex + 1} / {vocabulary.length}</span>
                    <span>Đúng: {correctAnswers}</span>
                </div>
                <Progress value={progressValue} className="w-full" />
            </div>
            <Card className="mb-8"><CardContent className="p-10 flex flex-col items-center justify-center gap-4"><h2 className="text-7xl md:text-8xl font-bold">{currentWord?.hanzi}</h2><p className="text-3xl md:text-4xl text-muted-foreground">{currentWord?.pinyin}</p></CardContent></Card>
            <div className="flex flex-col items-center gap-6">
                <Button onClick={handleListen} disabled={isListening || !recognition} size="lg" className={cn("w-48 h-16", isListening && "animate-pulse")}>{isListening ? <MicOff className="mr-2 h-6 w-6" /> : <Mic className="mr-2 h-6 w-6" />}{isListening ? 'Đang nghe...' : 'Bắt đầu nói'}</Button>
                {feedbackMessage && (<div className={cn("mt-4 text-center p-4 rounded-lg w-full", feedback === 'correct' && 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', feedback === 'incorrect' && 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300', feedback === 'info' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300')}><p className="font-medium">{feedbackMessage}</p></div>)}
                {feedback === 'incorrect' && (<Button onClick={goToNextWord} className="mt-4">Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" /></Button>)}
            </div>
        </div>
    );
};


// --- Main Page Component ---

const MsutongPracticePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const level = searchParams.get('level') || '';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];
  const type = searchParams.get('type');

  const [practiceVocabulary, setPracticeVocabulary] = useState<VocabularyWord[]>([]);
  const [distractorVocabulary, setDistractorVocabulary] = useState<VocabularyWord[]>([]);
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    const vocab = getVocabularyByMsutong(level, lessonIds);
    const fullVocab = getFullMsutongVocabularyByLevel(level);
    console.log("Loaded practice vocabulary:", vocab); // Debug log
    console.log("Loaded full vocabulary for distractors:", fullVocab); // Debug log
    setPracticeVocabulary(vocab);
    setDistractorVocabulary(fullVocab);
  }, [level, lessonIds]);

  const handleStart = (count: number) => {
    setPracticeVocabulary(prev => shuffleArray(prev).slice(0, count));
    setQuestionCount(count);
  };

  const renderExercise = () => {
    if (practiceVocabulary.length === 0) return null;
    
    switch (type) {
      case 'flashcard':
        return <FlashcardPractice vocabulary={practiceVocabulary} />;
      case 'pinyin-choice':
        return <ChoicePractice practiceVocabulary={practiceVocabulary} distractorVocabulary={distractorVocabulary} type="pinyin" />;
      case 'meaning-choice':
        return <ChoicePractice practiceVocabulary={practiceVocabulary} distractorVocabulary={distractorVocabulary} type="meaning" />;
      case 'fill-in-the-blank':
        return <FillInTheBlankPractice vocabulary={practiceVocabulary} />;
      case 'pronunciation':
        return <PronunciationPractice vocabulary={practiceVocabulary} />;
      default:
        return <p>Dạng bài tập "{type}" chưa được hỗ trợ.</p>;
    }
  };

  const titleMap: { [key: string]: string } = {
    'flashcard': 'Flashcard',
    'pinyin-choice': 'Chọn Phiên Âm',
    'meaning-choice': 'Chọn Nghĩa',
    'fill-in-the-blank': 'Điền Từ',
    'pronunciation': 'Luyện Phát Âm',
  };

  const descriptionMap: { [key: string]: string } = {
    'flashcard': 'Nhấn vào thẻ để xem nghĩa, hoặc dùng phím mũi tên để chuyển từ.',
    'pinyin-choice': 'Chọn pinyin đúng cho chữ Hán sau.',
    'meaning-choice': 'Chọn nghĩa đúng cho từ vựng sau.',
    'fill-in-the-blank': 'Dựa vào phiên âm và nghĩa, hãy điền chữ Hán tương ứng.',
    'pronunciation': 'Nhấn nút và phát âm chữ Hán hiển thị bên dưới.',
  };

  if (practiceVocabulary.length > 0 && questionCount === null && type !== 'flashcard') {
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
                        {[10, 20, 50, 100].map(count => (
                            <Button key={count} onClick={() => handleStart(count)} disabled={practiceVocabulary.length < count} size="lg">
                                {count} câu {practiceVocabulary.length < count && `(Không đủ từ)`}
                            </Button>
                        ))}
                        <Button onClick={() => handleStart(practiceVocabulary.length)} size="lg">Tất cả ({practiceVocabulary.length} câu)</Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold">{titleMap[type || ''] || 'Luyện tập'}</h1>
                <p className="text-muted-foreground">{descriptionMap[type || '']}</p>
            </div>
            <div className="flex items-center justify-center">
                {practiceVocabulary.length > 0 ? renderExercise() : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
                        <p className="text-muted-foreground mb-8">Dữ liệu cho lựa chọn của bạn đang được cập nhật. Vui lòng quay lại sau.</p>
                    </div>
                )}
            </div>
            <div className="text-center mt-12">
                <Button asChild variant="secondary" onClick={() => navigate('/msutong')}>
                    <Link to="/msutong"><Home className="mr-2 h-4 w-4" /> Chọn lại bài học</Link>
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongPracticePage;