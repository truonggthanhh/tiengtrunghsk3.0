import { hsk1Vocabulary, type VocabularyWord } from './hsk1';
import { hsk2Vocabulary } from './hsk2';
import { hsk3Vocabulary } from './hsk3';
import { hsk4Vocabulary } from './hsk4';
import { hsk5Vocabulary } from './hsk5';
import { hsk6Vocabulary } from './hsk6';
import { msutong_so_cap_1_vocab, type MsutongWord } from './msutong/so-cap-1-vocab';
import { msutong_so_cap_2_vocab } from './msutong/so-cap-2-vocab';
import { msutong_so_cap_3_vocab } from './msutong/so-cap-3-vocab';
import { msutong_so_cap_4_vocab } from './msutong/so-cap-4-vocab';

const vocabularyData: { [key: string]: VocabularyWord[] } = {
  '1': hsk1Vocabulary,
  '2': hsk2Vocabulary,
  '3': hsk3Vocabulary,
  '4': hsk4Vocabulary,
  '5': hsk5Vocabulary,
  '6': hsk6Vocabulary,
};

export const getVocabularyByLevel = (level: string): VocabularyWord[] => {
  const levelNum = parseInt(level, 10);
  if (isNaN(levelNum)) {
    return [];
  }

  let combinedVocabulary: VocabularyWord[] = [];
  for (let i = 1; i <= levelNum; i++) {
    const levelKey = i.toString();
    if (vocabularyData[levelKey]) {
      combinedVocabulary = [...combinedVocabulary, ...vocabularyData[levelKey]];
    }
  }
  return combinedVocabulary;
};

// Cấu trúc dữ liệu cho giáo trình Msutong
const msutongVocabularyData: { [level: string]: { [book: string]: MsutongWord[] } } = {
  'so-cap': {
    'quyen-1': msutong_so_cap_1_vocab,
    'quyen-2': msutong_so_cap_2_vocab,
    'quyen-3': msutong_so_cap_3_vocab,
    'quyen-4': msutong_so_cap_4_vocab,
  },
  // Dữ liệu cho các cấp độ khác sẽ được thêm vào đây
};

export const getVocabularyByMsutong = (level: string, books: string[], lessons: number[]): VocabularyWord[] => {
  let combinedVocabulary: MsutongWord[] = [];
  const levelData = msutongVocabularyData[level];
  if (!levelData) return [];

  books.forEach(bookSlug => {
    const bookData = levelData[bookSlug];
    if (bookData) {
      const filteredByLesson = bookData.filter(word => lessons.includes(word.lesson));
      combinedVocabulary.push(...filteredByLesson);
    }
  });

  // Loại bỏ các từ trùng lặp nếu có
  const uniqueIds = new Set();
  return combinedVocabulary.filter(word => {
    if (uniqueIds.has(word.id)) {
      return false;
    } else {
      uniqueIds.add(word.id);
      return true;
    }
  });
};


export type { VocabularyWord, MsutongWord };