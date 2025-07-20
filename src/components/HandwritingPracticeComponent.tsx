import React, { useState, useEffect, useRef, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import hanziData from 'hanzi-writer-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Home, Play, RotateCcw, Eraser, PenTool, Search, Loader2 } from 'lucide-react';
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
  const [isWriterInitialized, setIsWriterInitialized] = useState(false);

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

  // Effect to initialize the writer once on component mount
  useEffect(() => {
    if (hanziWriterContainerRef.current && !writerRef.current) {
      const staticColors = {
        strokeColor: '#3B82F6',
        outlineColor: '#94A3B8',
        radicalColor: '#8B5CF6',
        highlightColor: '#22C55E',
        mistakeColor: '#EF4444',
      };
      
      const writer = HanziWriter.create(hanziWriterContainerRef.current, {
        width: 250,
        height: 250,
        padding: 5,
        showCharacter: false,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 500,
        showOutline: true,
        highlightOnComplete: true,
        strokeColor: staticColors.strokeColor,
        outlineColor: staticColors.outlineColor,
        radicalColor: staticColors.radicalColor,
        drawingColor: staticColors.strokeColor,
        quizColor: staticColors.strokeColor,
        highlightColor: staticColors.highlightColor,
        mistakeColor: staticColors.mistakeColor,
        // Sử dụng dữ liệu cục bộ thay vì tải từ CDN
        charDataLoader: (char, onComplete) => {
          const charData = hanziData[char];
          if (charData) {
            onComplete(charData);
          } else {
            // Xử lý trường hợp không tìm thấy dữ liệu cho ký tự
            const err = new Error(`Không tìm thấy dữ liệu cục bộ cho chữ "${char}".`);
            onComplete(undefined, err);
          }
        },
      });
      writerRef.current = writer;
      setIsWriterInitialized(true);
    }
  }, []);

  // Effect to update the character when a new word is selected
  useEffect(() => {
    if (selectedWord && writerRef.current && isWriterInitialized) {
      setIsLoading(true);
      setError(null);
      writerRef.current.setCharacter(selectedWord.hanzi)
        .then(() => {
          setIsLoading(false);
          writerRef.current?.animateCharacter();
        })
        .catch((err) => {
          console.error("Error setting character:", err);
          const errorMessage = `Không thể tải dữ liệu cho chữ "${selectedWord.hanzi}". Chữ này có thể không được hỗ trợ trong gói dữ liệu.`;
          setError(errorMessage);
          toast.error("Lỗi tải dữ liệu", { description: errorMessage });
          setIsLoading(false);
        });
    }
  }, [selectedWord, isWriterInitialized]);

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
                  <div className="w-[250px] h-[250px] border rounded-md overflow-hidden flex items-center justify-center">
                    {isLoading && (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <span>Đang tải...</span>
                      </div>
                    )}
                    {error && !isLoading && (
                      <div className="text-destructive text-center p-4">
                        <p>{error}</p>
                      </div>
                    )}
                    <div id="hanzi-writer-container" ref={hanziWriterContainerRef}></div>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-semibold">{selectedWord.pinyin}</p>
                    <p className="text-2xl text-muted-foreground">{selectedWord.meaning}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <Button onClick={handlePlayAnimation} disabled={isLoading || !!error} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
                  <Play className="mr-2 h-4 w-4" /> Xem nét
                </Button>
                <Button onClick={handleStartQuiz} disabled={isLoading || !!error} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
                  <PenTool className="mr-2 h-4 w-4" /> Luyện viết
                </Button>
                <Button onClick={handleClearCanvas} disabled={isLoading || !!error} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
                  <Eraser className="mr-2 h-4 w-4" /> Xóa
                </Button>
                <Button onClick={handlePlayAnimation} disabled={isLoading || !!error} variant="outline" className="font-bold hover:bg-primary/10 hover:text-primary">
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