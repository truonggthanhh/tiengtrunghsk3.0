import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Home, Play, RotateCcw, Eraser, PenTool, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { VocabularyWord } from '@/data';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HandwritingPracticeProps {
  vocabulary: VocabularyWord[];
  fullVocabularyForSuggestions?: VocabularyWord[];
  title: string;
  description: string;
  homeLink: string;
}

const HandwritingPracticeComponent: React.FC<HandwritingPracticeProps> = ({
  vocabulary,
  title,
  description,
  homeLink,
}) => {
  const writerRef = useRef<HanziWriter | null>(null);
  const hanziWriterContainerRef = useRef<HTMLDivElement>(null);

  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const singleCharVocabulary = useMemo(() => {
    return vocabulary.filter(word => word.hanzi && word.pinyin && word.hanzi.length === 1);
  }, [vocabulary]);

  const filteredVocabulary = useMemo(() => {
    if (!searchTerm) return singleCharVocabulary;
    return singleCharVocabulary.filter(word => 
      word.hanzi.includes(searchTerm) || 
      word.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [singleCharVocabulary, searchTerm]);

  const initializeWriter = useCallback((word: VocabularyWord) => {
    if (!hanziWriterContainerRef.current) return;

    setIsLoading(true);
    setError(null);

    if (writerRef.current) {
      writerRef.current = null;
    }
    hanziWriterContainerRef.current.innerHTML = '';

    writerRef.current = HanziWriter.create(hanziWriterContainerRef.current, word.hanzi, {
      width: 250,
      height: 250,
      padding: 5,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 500,
      showOutline: true,
      showCharacter: false,
      highlightOnComplete: true,
      drawingColor: 'hsl(var(--primary))',
      outlineColor: 'hsl(var(--muted-foreground))',
      radicalColor: 'hsl(var(--accent))',
      strokeColor: 'hsl(var(--primary))',
      quizColor: 'hsl(var(--primary))',
      highlightColor: 'hsl(var(--success))',
      mistakeColor: 'hsl(var(--destructive))',
      charDataLoader: (char, onComplete, onError) => {
        fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(charData => {
            setIsLoading(false);
            onComplete(charData);
          })
          .catch(err => {
            console.error(`Failed to load character data for "${char}":`, err);
            setError(`Không thể tải dữ liệu cho chữ "${char}". Vui lòng thử lại.`);
            toast.error("Lỗi tải dữ liệu chữ Hán", { description: `Không tìm thấy dữ liệu cho chữ "${char}".` });
            setIsLoading(false);
            onError(err);
          });
      },
    });

    if (writerRef.current) {
        writerRef.current.animateCharacter();
    }
  }, []);

  useEffect(() => {
    if (selectedWord) {
      initializeWriter(selectedWord);
    }
  }, [selectedWord, initializeWriter]);

  const handlePlayAnimation = () => {
    if (writerRef.current) writerRef.current.animateCharacter();
  };

  const handleStartQuiz = () => {
    if (writerRef.current) writerRef.current.quiz();
  };

  const handleClearCanvas = () => {
    if (writerRef.current) writerRef.current.cancelQuiz();
  };

  if (singleCharVocabulary.length === 0 && !selectedWord) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Không có từ để luyện viết</CardTitle>
              <CardDescription>
                Không tìm thấy từ vựng có một ký tự trong các bài học bạn đã chọn. Vui lòng chọn các bài khác.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={homeLink}>
                  <Home className="mr-2 h-4 w-4" /> Quay lại
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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

          {!selectedWord ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm chữ Hán, pinyin, hoặc nghĩa..."
                  className="h-12 text-base pl-10"
                />
              </div>
              <ScrollArea className="h-80 border rounded-md p-4">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredVocabulary.map(word => (
                    <Button
                      key={word.id}
                      onClick={() => setSelectedWord(word)}
                      variant="outline"
                      className="text-2xl h-14 w-14"
                    >
                      {word.hanzi}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              <div className="flex justify-start mb-4">
                <Button onClick={() => setSelectedWord(null)} variant="outline" className="font-bold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
              </div>
              <Card className="mb-8 shadow-md">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                  {isLoading ? (
                    <div className="w-[250px] h-[250px] flex items-center justify-center text-muted-foreground">Đang tải...</div>
                  ) : error ? (
                    <div className="w-[250px] h-[250px] flex flex-col items-center justify-center text-destructive text-center">
                      <p>{error}</p>
                      <Button onClick={() => initializeWriter(selectedWord)} variant="ghost" className="mt-2">Thử lại</Button>
                    </div>
                  ) : (
                    <div id="hanzi-writer-container" ref={hanziWriterContainerRef} className="w-[250px] h-[250px] border rounded-md overflow-hidden"></div>
                  )}
                  <div className="text-center">
                    <p className="text-4xl font-semibold">{selectedWord.pinyin}</p>
                    <p className="text-2xl text-muted-foreground">{selectedWord.meaning}</p>
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
            </>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
              <Link to={homeLink}>
                <Home className="mr-2 h-4 w-4" /> Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HandwritingPracticeComponent;