import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Flashcard from '@/components/Flashcard';
import { getVocabularyByMsutong } from '@/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const MsutongFlashcardPage = () => {
  const { book, lesson } = useParams<{ book: string; lesson: string }>();
  const vocabulary = useMemo(() => getVocabularyByMsutong(book || '', lesson || '1'), [book, lesson]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextWord = () => {
    setCurrentIndex(prev => (prev + 1) % vocabulary.length);
  };

  const goToPreviousWord = () => {
    setCurrentIndex(prev => (prev - 1 + vocabulary.length) % vocabulary.length);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goToNextWord();
      else if (event.key === 'ArrowLeft') goToPreviousWord();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vocabulary]);

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
          <p className="text-muted-foreground mb-8">
            Dữ liệu cho Giáo trình {book} - Bài {lesson} đang được cập nhật. Vui lòng quay lại sau.
          </p>
          <Button asChild>
            <Link to="/msutong">
              <Home className="mr-2 h-4 w-4" /> Chọn bài học khác
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const progressValue = ((currentIndex + 1) / vocabulary.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Flashcards: {book} - Bài {lesson}</h1>
            <p className="text-muted-foreground">Nhấn vào thẻ để xem nghĩa, hoặc dùng phím mũi tên để chuyển từ.</p>
          </div>
          
          <Flashcard 
            key={currentWord.id}
            hanzi={currentWord.hanzi}
            pinyin={currentWord.pinyin}
            meaning={currentWord.meaning}
          />

          <div className="mt-8">
            <Progress value={progressValue} className="w-full mb-4" />
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={goToPreviousWord}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Từ trước
              </Button>
              <span className="text-lg font-medium text-muted-foreground">
                {currentIndex + 1} / {vocabulary.length}
              </span>
              <Button variant="outline" onClick={goToNextWord}>
                Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="secondary">
              <Link to="/msutong">
                <Home className="mr-2 h-4 w-4" /> Chọn bài học khác
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongFlashcardPage;