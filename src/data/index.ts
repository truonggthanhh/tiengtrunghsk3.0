import { parseMsutongLessonId } from '../lib/msutongSelection';
import { hsk1Vocabulary, type VocabularyWord } from './hsk1';
import { hsk2Vocabulary } from './hsk2';
import { hsk3Vocabulary } from './hsk3';
import { hsk4Vocabulary } from './hsk4';
import { hsk5Vocabulary } from './hsk5';
import { hsk6Vocabulary } from './hsk6';
import { hsk2ExtendedVocabulary } from './hsk2-extended';
import { hsk3ExtendedVocabulary } from './hsk3-extended';
import { hsk4ExtendedVocabulary } from './hsk4-extended';
import { hsk5ExtendedVocabulary } from './hsk5-extended';
import { hsk6ExtendedVocabulary } from './hsk6-extended';
import { pdfMsutongVocabulary } from './msutong/pdf-vocabulary';
import type { MsutongWord } from './msutong/so-cap-1-vocab';
import { msutongReadingComprehension, type ReadingComprehensionQuestion, type ReadingComprehensionPassage } from './msutong/reading-comprehension';

const vocabularyData: { [key: string]: VocabularyWord[] } = {
  '1': hsk1Vocabulary,
  '2': [...hsk2Vocabulary, ...hsk2ExtendedVocabulary],
  '3': [...hsk3Vocabulary, ...hsk3ExtendedVocabulary],
  '4': [...hsk4Vocabulary, ...hsk4ExtendedVocabulary],
  '5': [...hsk5Vocabulary, ...hsk5ExtendedVocabulary],
  '6': [...hsk6Vocabulary, ...hsk6ExtendedVocabulary],
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
    'quyen-1': pdfMsutongVocabulary.filter(word => word.bookSlug === 'quyen-1'),
    'quyen-2': pdfMsutongVocabulary.filter(word => word.bookSlug === 'quyen-2'),
    'quyen-3': pdfMsutongVocabulary.filter(word => word.bookSlug === 'quyen-3'),
    'quyen-4': pdfMsutongVocabulary.filter(word => word.bookSlug === 'quyen-4'),
  },
  // Dữ liệu cho các cấp độ khác sẽ được thêm vào đây
};

const msutongReadingComprehensionData: { [level: string]: ReadingComprehensionPassage[] } = {
  'so-cap': msutongReadingComprehension,
  // Dữ liệu cho các cấp độ khác sẽ được thêm vào đây
};

export const getFullMsutongVocabularyByLevel = (level: string): MsutongWord[] => {
  const levelData = msutongVocabularyData[level];
  if (!levelData) return [];
  
  const combinedVocabulary: MsutongWord[] = [];
  for (const bookSlug in levelData) {
    combinedVocabulary.push(...levelData[bookSlug]);
  }
  
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

export const getVocabularyByMsutong = (level: string, lessonIds: string[]): VocabularyWord[] => {
  const selections = [...new Set(lessonIds)].flatMap(id => {
    const parsed = parseMsutongLessonId(id);
    return parsed ? [parsed] : [];
  });

  const combinedVocabulary: MsutongWord[] = [];
  const levelData = msutongVocabularyData[level];
  if (!levelData) return [];

  selections.forEach(({ bookSlug, lessonNumber }) => {
    const bookData = levelData[bookSlug];
    if (bookData) {
      // Filter by the lesson number (which is now 1-10 in the data files)
      const filteredByLesson = bookData.filter(word => word.lesson === lessonNumber);
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

export const getReadingComprehensionByMsutong = (level: string, lessonIds: string[]): ReadingComprehensionPassage[] => {
  const passagesForLevel = msutongReadingComprehensionData[level];
  if (!passagesForLevel) return [];

  // If no specific lessons selected, return all passages for the level
  if (lessonIds.length === 0) {
    return passagesForLevel;
  }

  const selectedPassages: ReadingComprehensionPassage[] = [];
  const uniquePassageIds = new Set<number>();

  [...new Set(lessonIds)].forEach(id => {
    const parsed = parseMsutongLessonId(id);
    if (!parsed) return;
    const { bookSlug, lessonNumber } = parsed;

    passagesForLevel.forEach(passage => {
      if (passage.bookSlug === bookSlug && passage.lesson === lessonNumber && !uniquePassageIds.has(passage.id)) {
        selectedPassages.push(passage);
        uniquePassageIds.add(passage.id);
      }
    });
  });

  return selectedPassages;
};


export type { VocabularyWord, MsutongWord, ReadingComprehensionPassage, ReadingComprehensionQuestion };