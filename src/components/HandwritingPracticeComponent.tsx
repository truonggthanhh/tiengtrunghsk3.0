import React, { useState, useRef, useMemo } from 'react';
import HanziWriter from 'hanzi-writer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Home, Play, RotateCcw, Eraser, PenTool, Search, Loader2 } from 'lucide-react';
import type { VocabularyWord } from '@/data';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import HanziWriterWrapper from './HanziWriterWrapper';

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

  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  React.useEffect(() => {
    if (selectedWord) {
      setIsLoading(true);
      setError(null);
    }
  }, [selectedWord]);

  const handlePlayAnimation = () => {
    if (writerRef.current) writerRef.current.animateCharacter();
  };

  const handleStartQuiz = () => {
    if (writerRef.current) writerRef.current.quiz();
  };

  const handleClearCanvas = () => {
    if (writerRef.current) writerRef.current.cancelQuiz();
  };

  if (singleCharVocabulary.length === 0) {
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
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {filteredVocabulary.map(word => (
                    <Button
                      key={word.id}
                      onClick={() => setSelectedWord(word)}
                      variant="outline"
                      className="h-20 flex flex-col justify-center items-center p-1"
                    >
                      <span className="text-3xl font-bold">{word.hanzi}</span>
                      <span className="text-xs text-muted-foreground mt-1">{word.pinyin}</span>
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
                        <span>Đang tải dữ liệu chữ...</span>
                      </div>
                    )}
                    {error && !isLoading && (
                      <div className="text-destructive text-center p-4">
                        <p>{error}</p>
                      </div>
                    )}
                    <HanziWriterWrapper
                      character={selectedWord.hanzi}
                      writerRef={writerRef}
                      onWriterLoaded={() => setIsLoading(false)}
                      onWriterError={(errorMsg) => {
                        setError(errorMsg);
                        setIsLoading(false);
                      }}
                    />
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