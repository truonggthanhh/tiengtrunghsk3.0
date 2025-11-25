import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Flashcard from '@/components/Flashcard';
import { getVocabularyByLevel } from '@/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { usePinyin } from '@/contexts/PinyinContext';

const BATCH_SIZE = 10;

const FlashcardPage = () => {
  const { level } = useParams<{ level: string }>();
  const fullVocabulary = useMemo(() => getVocabularyByLevel(level || '1'), [level]);
  const { showPinyin } = usePinyin();

  const [batchIndex, setBatchIndex] = useState(0);
  const [currentIndexInBatch, setCurrentIndexInBatch] = useState(0);

  const totalBatches = Math.ceil(fullVocabulary.length / BATCH_SIZE);

  const currentBatchVocabulary = useMemo(() => {
    const start = batchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    return fullVocabulary.slice(start, end);
  }, [fullVocabulary, batchIndex]);

  const goToNextWord = () => {
    setCurrentIndexInBatch(prev => (prev + 1) % currentBatchVocabulary.length);
  };

  const goToPreviousWord = () => {
    setCurrentIndexInBatch(prev => (prev - 1 + currentBatchVocabulary.length) % currentBatchVocabulary.length);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextWord();
      } else if (event.key === 'ArrowLeft') {
        goToPreviousWord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // goToNextWord and goToPreviousWord use functional setState, so they don't need to be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToNextBatch = () => {
    if (batchIndex < totalBatches - 1) {
      setBatchIndex(prev => prev + 1);
      setCurrentIndexInBatch(0);
    }
  };

  const goToPreviousBatch = () => {
    if (batchIndex > 0) {
      setBatchIndex(prev => prev - 1);
      setCurrentIndexInBatch(0);
    }
  };

  if (!fullVocabulary || fullVocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
          <p className="text-muted-foreground mb-8">
            Chức năng này đang được phát triển cho HSK {level}. Vui lòng quay lại sau.
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

  const currentWord = currentBatchVocabulary[currentIndexInBatch];

  if (!currentWord) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center">
            <p>Đang tải từ vựng...</p>
        </div>
    )
  }

  const progressValue = ((currentIndexInBatch + 1) / currentBatchVocabulary.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-card p-6 md:p-8 rounded-xl shadow-lg border">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Flashcards HSK {level}</h1>
            <p className="text-muted-foreground">Nhấn vào thẻ để xem nghĩa, hoặc dùng phím mũi tên để chuyển từ.</p>
          </div>
          
          <Flashcard
            key={currentWord.id}
            hanzi={currentWord.hanzi}
            pinyin={currentWord.pinyin}
            meaning={currentWord.meaning}
            showPinyin={showPinyin}
          />

          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Tiến độ đợt này</span>
                <span className="text-sm font-semibold">Đợt {batchIndex + 1} / {totalBatches}</span>
            </div>
            <Progress value={progressValue} className="w-full mb-4 h-2 bg-primary/20" indicatorClassName="bg-primary" />
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={goToPreviousWord} className="hover:bg-primary hover:text-primary-foreground transition-colors font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Từ trước
              </Button>
              <span className="text-lg font-medium text-muted-foreground">
                {currentIndexInBatch + 1} / {currentBatchVocabulary.length}
              </span>
              <Button variant="outline" onClick={goToNextWord} className="hover:bg-primary hover:text-primary-foreground transition-colors font-bold">
                Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <Button variant="secondary" onClick={goToPreviousBatch} disabled={batchIndex === 0} className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                <ChevronsLeft className="mr-2 h-4 w-4" /> Đợt trước
            </Button>
            <Button variant="secondary" onClick={goToNextBatch} disabled={batchIndex >= totalBatches - 1} className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                Đợt tiếp theo <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
              <Link to="/mandarin">
                <Home className="mr-2 h-4 w-4" /> Chọn bài tập khác
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FlashcardPage;