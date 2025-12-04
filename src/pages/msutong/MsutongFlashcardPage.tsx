import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Flashcard from '@/components/Flashcard';
import { getVocabularyByMsutong } from '@/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, ChevronsLeft, ChevronsRight, ListOrdered, Grid3X3, BookmarkCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { usePinyin } from '@/contexts/PinyinContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BATCH_SIZE = 10;
const STORAGE_KEY_PREFIX = 'flashcard_progress_msutong_';

const MsutongFlashcardPage = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];

  const fullVocabulary = useMemo(() => getVocabularyByMsutong(level, lessonIds), [level, lessonIds]);
  const { showPinyin } = usePinyin();

  // Build URLs for back navigation
  const exerciseSelectionUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append('level', level);
    if (lessonIds.length > 0) params.append('lessonIds', lessonIds.join(','));
    params.append('step', 'exercise');
    return `/mandarin/msutong?${params.toString()}`;
  }, [level, lessonIds]);

  const lessonSelectionUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append('level', level);
    if (lessonIds.length > 0) params.append('lessonIds', lessonIds.join(','));
    params.append('step', 'lesson');
    return `/mandarin/msutong?${params.toString()}`;
  }, [level, lessonIds]);

  const [batchIndex, setBatchIndex] = useState(0);
  const [currentIndexInBatch, setCurrentIndexInBatch] = useState(0);
  const [savedBatchIndex, setSavedBatchIndex] = useState<number | null>(null);

  const totalBatches = Math.ceil(fullVocabulary.length / BATCH_SIZE);

  // Create a unique storage key based on level and lessons
  const storageKey = useMemo(() => {
    return `${STORAGE_KEY_PREFIX}${level}_${lessonIds.join('_')}`;
  }, [level, lessonIds]);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const savedBatch = parseInt(saved, 10);
      if (!isNaN(savedBatch) && savedBatch >= 0 && savedBatch < totalBatches) {
        setSavedBatchIndex(savedBatch);
      }
    }
  }, [storageKey, totalBatches]);

  // Save progress when batch changes
  useEffect(() => {
    if (batchIndex > 0) {
      localStorage.setItem(storageKey, batchIndex.toString());
    }
  }, [storageKey, batchIndex]);

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
  }, [currentBatchVocabulary]);

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
            Vui lòng quay lại và chọn bài học để bắt đầu.
          </p>
          <Button asChild>
            <Link to="/mandarin/msutong">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chọn bài
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
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Flashcards (Msutong)</h1>
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
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    Tiếp tục học
                  </Button>
                </div>
              </div>
            )}

            {/* Batch selector */}
            <div className="flex justify-between items-center mb-2 gap-4">
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
            <Progress value={progressValue} className="w-full mb-4" />
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={goToPreviousWord} className="font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Từ trước
              </Button>
              <span className="text-lg font-medium text-muted-foreground">
                {currentIndexInBatch + 1} / {currentBatchVocabulary.length}
              </span>
              <Button variant="outline" onClick={goToNextWord} className="font-bold">
                Từ tiếp theo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mb-8">
            <Button variant="secondary" onClick={goToPreviousBatch} disabled={batchIndex === 0} className="font-bold">
                <ChevronsLeft className="mr-2 h-4 w-4" /> Đợt trước
            </Button>
            <Button variant="secondary" onClick={goToNextBatch} disabled={batchIndex >= totalBatches - 1} className="font-bold">
                Đợt tiếp theo <ChevronsRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Button asChild variant="secondary" className="font-bold">
              <Link to={exerciseSelectionUrl}>
                <Grid3X3 className="mr-2 h-4 w-4" /> Chọn bài tập khác
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-bold">
              <Link to={lessonSelectionUrl}>
                <ListOrdered className="mr-2 h-4 w-4" /> Chọn bài khác
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongFlashcardPage;