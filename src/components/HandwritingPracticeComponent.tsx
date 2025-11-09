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
import { usePinyin } from '@/contexts/PinyinContext';
import { pinyin } from 'pinyin-pro';

interface HandwritingPracticeProps {
  vocabulary: VocabularyWord[];
  fullVocabularyForSuggestions?: VocabularyWord[];
  title: string;
  description: string;
  homeLink: string;
}

// Extended character info for handwriting practice
interface CharacterInfo {
  character: string; // Single character
  pinyinChar: string; // Pinyin for this single character
  pinyin: string; // Pinyin for the whole word
  meaning: string; // Meaning of the whole word
  originalWord: string; // Original word this character comes from
  wordId: number; // ID of the original word
}

const HandwritingPracticeComponent: React.FC<HandwritingPracticeProps> = ({
  vocabulary,
  title,
  description,
  homeLink,
}) => {
  const { showPinyin } = usePinyin();
  const writerRef = useRef<HanziWriter | null>(null);

  const [selectedChar, setSelectedChar] = useState<CharacterInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all unique characters from vocabulary
  const allCharacters = useMemo(() => {
    const charMap = new Map<string, CharacterInfo>();

    vocabulary.forEach(word => {
      if (!word.hanzi || !word.pinyin) return;

      // Split word into individual characters
      const chars = word.hanzi.split('');
      chars.forEach((char, index) => {
        // Skip punctuation and whitespace
        if (char.trim() && !/[，。？！、；：""''（）《》【】\s]/.test(char)) {
          // Use character + word ID as key to allow same character from different words
          const key = `${char}-${word.id}`;
          if (!charMap.has(key)) {
            charMap.set(key, {
              character: char,
              pinyinChar: pinyin(char, { toneType: 'symbol' }), // Get pinyin for this specific character
              pinyin: word.pinyin,
              meaning: word.meaning,
              originalWord: word.hanzi,
              wordId: word.id,
            });
          }
        }
      });
    });

    return Array.from(charMap.values());
  }, [vocabulary]);

  const filteredCharacters = useMemo(() => {
    if (!searchTerm) return allCharacters;
    return allCharacters.filter(charInfo =>
      charInfo.character.includes(searchTerm) ||
      charInfo.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charInfo.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charInfo.originalWord.includes(searchTerm)
    );
  }, [allCharacters, searchTerm]);

  React.useEffect(() => {
    if (selectedChar) {
      setIsLoading(true);
      setError(null);
    }
  }, [selectedChar]);

  const handlePlayAnimation = () => {
    if (writerRef.current) writerRef.current.animateCharacter();
  };

  const handleStartQuiz = () => {
    if (writerRef.current) writerRef.current.quiz();
  };

  const handleClearCanvas = () => {
    if (writerRef.current) writerRef.current.cancelQuiz();
  };

  if (allCharacters.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Không có chữ để luyện viết</CardTitle>
              <CardDescription>
                Không tìm thấy chữ Hán trong các bài học bạn đã chọn. Vui lòng chọn các bài khác.
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
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-card p-6 md:p-8 rounded-xl shadow-lg border">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <PenTool className="h-7 w-7 text-primary" /> {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Tổng số chữ: <span className="font-semibold text-primary">{allCharacters.length}</span>
            </p>
          </div>

          {!selectedChar ? (
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
                  {filteredCharacters.map((charInfo, index) => (
                    <Button
                      key={`${charInfo.character}-${charInfo.wordId}-${index}`}
                      onClick={() => setSelectedChar(charInfo)}
                      variant="outline"
                      className="h-24 flex flex-col justify-center items-center p-2 group gap-1"
                      title={`${charInfo.character} - ${charInfo.pinyinChar} (từ "${charInfo.originalWord}" - ${charInfo.meaning})`}
                    >
                      <span className="text-3xl font-bold leading-none">{charInfo.character}</span>
                      <span className="text-sm text-primary font-medium leading-none">{charInfo.pinyinChar}</span>
                      <span className="text-xs text-muted-foreground truncate w-full text-center leading-none">
                        {charInfo.originalWord}
                      </span>
                    </Button>
                  ))}
                </div>
                {filteredCharacters.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    Không tìm thấy chữ nào
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <>
              <div className="flex justify-start mb-4">
                <Button onClick={() => setSelectedChar(null)} variant="outline" className="font-bold">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
              </div>
              <Card className="mb-8 shadow-md bg-gradient-ocean text-white dark:text-white">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                  <div className="w-[250px] h-[250px] border border-white/20 rounded-md overflow-hidden flex items-center justify-center bg-white">
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
                      character={selectedChar.character}
                      writerRef={writerRef}
                      onWriterLoaded={() => setIsLoading(false)}
                      onWriterError={(errorMsg) => {
                        setError(errorMsg);
                        setIsLoading(false);
                      }}
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-bold text-white">{selectedChar.character}</p>
                    {showPinyin && (
                      <p className="text-xl font-semibold text-white/90">{selectedChar.pinyin}</p>
                    )}
                    <p className="text-lg text-white/80">Từ: {selectedChar.originalWord}</p>
                    <p className="text-base text-white/90">{selectedChar.meaning}</p>
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