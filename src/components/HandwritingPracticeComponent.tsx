import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Home, Play, RotateCcw, Eraser, PenTool, Search } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { VocabularyWord } from '@/data';

interface HandwritingPracticeProps {
  vocabulary: VocabularyWord[];
  fullVocabularyForSuggestions?: VocabularyWord[]; // Used for random suggestions if needed
  title: string;
  description: string;
  homeLink: string;
}

const HandwritingPracticeComponent: React.FC<HandwritingPracticeProps> = ({
  vocabulary,
  fullVocabularyForSuggestions = [],
  title,
  description,
  homeLink,
}) => {
  const writerRef = useRef<HanziWriter | null>(null);
  const hanziWriterContainerRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHanzi, setCurrentHanzi] = useState('');
  const [currentPinyin, setCurrentPinyin] = useState('');
  const [currentMeaning, setCurrentMeaning] = useState('');
  const [userInputHanzi, setUserInputHanzi] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayVocabulary = useMemo(() => {
    // Filter out words without hanzi or pinyin, or if hanzi is not a single character
    return vocabulary.filter(word => word.hanzi && word.pinyin && word.hanzi.length === 1);
  }, [vocabulary]);

  const initializeWriter = useCallback(async (hanzi: string) => {
    if (!hanziWriterContainerRef.current) return;

    setIsLoading(true);
    setError(null);

    // Clear previous writer instance
    if (writerRef.current) {
      writerRef.current.hideCharacter(); // Hide current character
      writerRef.current.cancelQuiz(); // Cancel any active quiz
      writerRef.current = null; // Dereference to allow garbage collection
      hanziWriterContainerRef.current.innerHTML = ''; // Clear the SVG
    }

    try {
      // Load character data explicitly
      const characterData = await HanziWriter.loadCharacterData(hanzi);

      writerRef.current = HanziWriter.create(hanziWriterContainerRef.current, hanzi, {
        width: 250,
        height: 250,
        padding: 5,
        strokeAnimationSpeed: 1, // Slower animation for better visibility
        delayBetweenStrokes: 500,
        delayBetweenLoops: 1000,
        showOutline: true,
        showCharacter: false, // Start hidden, will show with animation or quiz
        charDataLoader: (char, onComplete) => {
          // Use the pre-loaded characterData
          onComplete(characterData);
        },
        highlightOnComplete: true,
        drawingColor: 'hsl(var(--primary))',
        outlineColor: 'hsl(var(--muted-foreground))',
        radicalColor: 'hsl(var(--accent))',
        strokeColor: 'hsl(var(--primary))',
        quizColor: 'hsl(var(--primary))',
        // Colors for quiz feedback
        highlightColor: 'hsl(var(--success))',
        mistakeColor: 'hsl(var(--destructive))',
      });

      // Start animation by default
      writerRef.current.animateCharacter({
        onComplete: () => {
          if (writerRef.current) {
            writerRef.current.quiz({
              onCorrectStroke: () => toast.success('Nét đúng!', { duration: 500 }),
              onMistake: () => toast.error('Nét sai!', { duration: 500 }),
              onComplete: () => toast.success('Hoàn thành chữ!', { duration: 1500 }),
            });
          }
        }
      });

    } catch (err: any) {
      console.error("Error loading HanziWriter:", err);
      setError(`Không thể tải dữ liệu cho chữ "${hanzi}". Vui lòng thử chữ khác.`);
      toast.error(`Lỗi: Không thể tải chữ "${hanzi}"`, { description: err.message || 'Dữ liệu không khả dụng.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (displayVocabulary.length > 0) {
      const word = displayVocabulary[currentIndex];
      setCurrentHanzi(word.hanzi);
      setCurrentPinyin(word.pinyin);
      setCurrentMeaning(word.meaning);
      initializeWriter(word.hanzi);
    } else {
      setIsLoading(false);
      setError("Không có từ vựng nào để luyện tập.");
    }
  }, [currentIndex, displayVocabulary, initializeWriter]);

  const handlePlayAnimation = () => {
    if (writerRef.current) {
      writerRef.current.cancelQuiz();
      writerRef.current.animateCharacter({
        onComplete: () => {
          if (writerRef.current) {
            writerRef.current.quiz({
              onCorrectStroke: () => toast.success('Nét đúng!', { duration: 500 }),
              onMistake: () => toast.error('Nét sai!', { duration: 500 }),
              onComplete: () => toast.success('Hoàn thành chữ!', { duration: 1500 }),
            });
          }
        }
      });
    }
  };

  const handleStartQuiz = () => {
    if (writerRef.current) {
      writerRef.current.cancelQuiz();
      writerRef.current.quiz({
        onCorrectStroke: () => toast.success('Nét đúng!', { duration: 500 }),
        onMistake: () => toast.error('Nét sai!', { duration: 500 }),
        onComplete: () => toast.success('Hoàn thành chữ!', { duration: 1500 }),
      });
    }
  };

  const handleClearCanvas = () => {
    if (writerRef.current) {
      writerRef.current.cancelQuiz();
      writerRef.current.showCharacter(); // Show the character outline
      writerRef.current.quiz({
        onCorrectStroke: () => toast.success('Nét đúng!', { duration: 500 }),
        onMistake: () => toast.error('Nét sai!', { duration: 500 }),
        onComplete: () => toast.success('Hoàn thành chữ!', { duration: 1500 }),
      });
    }
  };

  const goToNextWord = () => {
    if (displayVocabulary.length === 0) return;
    const nextIndex = (currentIndex + 1) % displayVocabulary.length;
    setCurrentIndex(nextIndex);
  };

  const goToPreviousWord = () => {
    if (displayVocabulary.length === 0) return;
    const prevIndex = (currentIndex - 1 + displayVocabulary.length) % displayVocabulary.length;
    setCurrentIndex(prevIndex);
  };

  const handleUserInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hanzi = userInputHanzi.trim();
    if (hanzi.length === 1) {
      // Check if the character exists in the full vocabulary for pinyin/meaning
      const foundWord = [...displayVocabulary, ...fullVocabularyForSuggestions].find(word => word.hanzi === hanzi);
      if (foundWord) {
        setCurrentHanzi(foundWord.hanzi);
        setCurrentPinyin(foundWord.pinyin);
        setCurrentMeaning(foundWord.meaning);
        initializeWriter(foundWord.hanzi);
      } else {
        // If not found in vocabulary, just use the hanzi and try to load
        setCurrentHanzi(hanzi);
        setCurrentPinyin('Không rõ');
        setCurrentMeaning('Không rõ');
        initializeWriter(hanzi);
      }
      setUserInputHanzi('');
    } else {
      toast.error('Vui lòng nhập một chữ Hán duy nhất.');
    }
  };

  const progressValue = displayVocabulary.length > 0 ? ((currentIndex + 1) / displayVocabulary.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-tertiary/10 flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-card p-6 md:p-8 rounded-xl shadow-lg border border-primary/20">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <PenTool className="h-7 w-7 text-primary" /> {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <form onSubmit={handleUserInputSubmit} className="flex w-full items-center space-x-2 mb-6">
            <Input
              value={userInputHanzi}
              onChange={(e) => setUserInputHanzi(e.target.value)}
              placeholder="Nhập chữ Hán để luyện tập..."
              className="h-12 text-base border-2 text-center"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || userInputHanzi.trim().length !== 1} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {displayVocabulary.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2 text-muted-foreground">
                <span>Từ: {currentIndex + 1} / {displayVocabulary.length}</span>
              </div>
              <Progress value={progressValue} className="w-full h-2 bg-primary/20" indicatorClassName="bg-primary" />
            </div>
          )}

          <Card className="mb-8 shadow-md">
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              {isLoading ? (
                <div className="w-[250px] h-[250px] flex items-center justify-center text-muted-foreground">
                  Đang tải...
                </div>
              ) : error ? (
                <div className="w-[250px] h-[250px] flex flex-col items-center justify-center text-destructive text-center">
                  <p>{error}</p>
                  <Button onClick={() => initializeWriter(currentHanzi)} variant="ghost" className="mt-2">Thử lại</Button>
                </div>
              ) : (
                <div id="hanzi-writer-container" ref={hanziWriterContainerRef} className="w-[250px] h-[250px] border rounded-md overflow-hidden"></div>
              )}
              
              <div className="text-center">
                <p className="text-4xl font-semibold">{currentPinyin}</p>
                <p className="text-2xl text-muted-foreground">{currentMeaning}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <Button onClick={handlePlayAnimation} disabled={isLoading || !writerRef.current} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
              <Play className="mr-2 h-4 w-4" /> Xem nét
            </Button>
            <Button onClick={handleStartQuiz} disabled={isLoading || !writerRef.current} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
              <PenTool className="mr-2 h-4 w-4" /> Luyện viết
            </Button>
            <Button onClick={handleClearCanvas} disabled={isLoading || !writerRef.current} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
              <Eraser className="mr-2 h-4 w-4" /> Xóa
            </Button>
            <Button onClick={handlePlayAnimation} disabled={isLoading || !writerRef.current} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
              <RotateCcw className="mr-2 h-4 w-4" /> Phát lại
            </Button>
          </div>

          {displayVocabulary.length > 0 && (
            <div className="flex justify-between items-center mb-8">
              <Button variant="outline" onClick={goToPreviousWord} className="font-bold hover:bg-accent hover:text-accent-foreground transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Từ trước
              </Button>
              <Button variant="outline" onClick={goToNextWord} className="font-bold hover:bg-accent hover:text-accent-foreground transition-colors">
                Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
              <Link to={homeLink}>
                <Home className="mr-2 h-4 w-4" /> Về trang chọn bài
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HandwritingPracticeComponent;