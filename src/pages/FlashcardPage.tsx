import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Flashcard from '@/components/Flashcard';
import { getVocabularyByLevel } from '@/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronsLeft, ChevronsRight, BookmarkCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { usePinyin } from '@/contexts/PinyinContext.shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BATCH_SIZE = 10;

const STORAGE_KEY_PREFIX = 'flashcard_progress_hsk_';

const FlashcardLesson = () => {
  const { level } = useParams<{ level: string }>();
  const fullVocabulary = useMemo(() => getVocabularyByLevel(level || '1'), [level]);
  const { showPinyin } = usePinyin();

  const [batchIndex, setBatchIndex] = useState(0);
  const [currentIndexInBatch, setCurrentIndexInBatch] = useState(0);
  const [savedBatchIndex, setSavedBatchIndex] = useState<number | null>(null);

  const totalBatches = Math.ceil(fullVocabulary.length / BATCH_SIZE);

  // Load saved progress on mount
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${level}`); } catch { /* Learning remains available without storage. */ }
    if (saved) {
      const savedBatch = parseInt(saved, 10);
      if (!isNaN(savedBatch) && savedBatch >= 0 && savedBatch < totalBatches) {
        setSavedBatchIndex(savedBatch);
      }
    }
  }, [level, totalBatches]);

  // Save progress when batch changes
  useEffect(() => {
    if (level && batchIndex > 0) {
      try { localStorage.setItem(`${STORAGE_KEY_PREFIX}${level}`, batchIndex.toString()); } catch { /* Session-only progress still works. */ }
    }
  }, [level, batchIndex]);

  // Function to resume from saved batch
  const resumeFromSaved = () => {
    if (savedBatchIndex !== null) {
      setBatchIndex(savedBatchIndex);
      setCurrentIndexInBatch(0);
      setSavedBatchIndex(null);
    }
  };

  // Function to jump to specific batch
  const jumpToBatch = (batch: number) => {
    setBatchIndex(batch);
    setCurrentIndexInBatch(0);
  };

  const currentBatchVocabulary = useMemo(() => {
    const start = batchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    return fullVocabulary.slice(start, end);
  }, [fullVocabulary, batchIndex]);

  const goToNextWord = useCallback(() => {
    if (currentBatchVocabulary.length) setCurrentIndexInBatch(prev => (prev + 1) % currentBatchVocabulary.length);
  }, [currentBatchVocabulary.length]);

  const goToPreviousWord = useCallback(() => {
    if (currentBatchVocabulary.length) setCurrentIndexInBatch(prev => (prev - 1 + currentBatchVocabulary.length) % currentBatchVocabulary.length);
  }, [currentBatchVocabulary.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, button, a, [contenteditable="true"], [role="dialog"], [role="combobox"]')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') event.preventDefault();
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
  }, [goToNextWord, goToPreviousWord]);

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
              <Home className="h-4 w-4" /> Quay lại trang chủ
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
            <h1 className="text-2xl font-bold tracking-tight">Flashcards HSK {level}</h1>
            <p className="text-muted-foreground">Chạm để lật thẻ. Dùng ← → để chuyển từ khi đang xem thẻ.</p>
          </div>
          
          <Flashcard
            key={currentWord.id}
            hanzi={currentWord.hanzi}
            pinyin={currentWord.pinyin}
            meaning={currentWord.meaning}
            showPinyin={showPinyin}
          />

          <div className="mt-8">
            {/* Resume button if there's saved progress */}
            {savedBatchIndex !== null && savedBatchIndex !== batchIndex && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    📍 Bạn đã học đến đợt {savedBatchIndex + 1}
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={resumeFromSaved}
                    className="font-bold"
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    Tiếp tục học
                  </Button>
                </div>
              </div>
            )}

            {/* Batch selector */}
            <div className="flex flex-wrap justify-between items-center mb-2 gap-3">
              <span className="text-sm text-muted-foreground">Tiến độ đợt này</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Đợt:</span>
                <Select
                  value={batchIndex.toString()}
                  onValueChange={(value) => jumpToBatch(parseInt(value, 10))}
                >
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Chọn đợt" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Array.from({ length: totalBatches }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        Đợt {i + 1} / {totalBatches}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Progress value={progressValue} className="w-full mb-4 h-2 bg-primary/20" indicatorClassName="bg-primary" />
            <div className="flex justify-between items-center mb-6 gap-2">
              <Button variant="outline" aria-label="Từ trước" onClick={goToPreviousWord} className="rounded-xl px-3 text-xs hover:bg-primary hover:text-primary-foreground sm:text-sm">
                <ArrowLeft className="h-4 w-4" /><span>Trước</span>
              </Button>
              <span className="text-lg font-medium text-muted-foreground">
                {currentIndexInBatch + 1} / {currentBatchVocabulary.length}
              </span>
              <Button variant="outline" aria-label="Từ tiếp theo" onClick={goToNextWord} className="rounded-xl px-3 text-xs hover:bg-primary hover:text-primary-foreground sm:text-sm">
                <span>Sau</span><ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <Button variant="secondary" onClick={goToPreviousBatch} disabled={batchIndex === 0} className="min-w-0 rounded-xl px-2 text-xs hover:bg-accent hover:text-accent-foreground sm:text-sm">
                <ChevronsLeft className="h-4 w-4" /> Đợt trước
            </Button>
            <Button variant="secondary" onClick={goToNextBatch} disabled={batchIndex >= totalBatches - 1} className="min-w-0 rounded-xl px-2 text-xs hover:bg-accent hover:text-accent-foreground sm:text-sm">
                Đợt tiếp theo <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="secondary" className="min-w-0 rounded-xl px-2 text-xs hover:bg-accent hover:text-accent-foreground sm:text-sm">
              <Link to="/mandarin">
                <Home className="h-4 w-4" /> Chọn bài tập khác
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function FlashcardPage() {
  const { level } = useParams<{ level: string }>();
  return <FlashcardLesson key={level} />;
}