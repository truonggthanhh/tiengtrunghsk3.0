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
import { msutong_so_cap_1_vocab, type MsutongWord } from './msutong/so-cap-1-vocab';
import { msutong_so_cap_2_vocab } from './msutong/so-cap-2-vocab';
import { msutong_so_cap_3_vocab } from './msutong/so-cap-3-vocab';
import { msutong_so_cap_4_vocab } from './msutong/so-cap-4-vocab';
import { soCap1ExtendedVocabulary } from './msutong/so-cap-1-extended';
import { soCap2ExtendedVocabulary } from './msutong/so-cap-2-extended';
import { soCap3ExtendedVocabulary } from './msutong/so-cap-3-extended';
import { soCap4ExtendedVocabulary } from './msutong/so-cap-4-extended';
import { msutongReadingComprehension, type ReadingComprehensionPassage } from './msutong/reading-comprehension';

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
    'quyen-1': [...msutong_so_cap_1_vocab, ...soCap1ExtendedVocabulary],
    'quyen-2': [...msutong_so_cap_2_vocab, ...soCap2ExtendedVocabulary],
    'quyen-3': [...msutong_so_cap_3_vocab, ...soCap3ExtendedVocabulary],
    'quyen-4': [...msutong_so_cap_4_vocab, ...soCap4ExtendedVocabulary],
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
  
  let combinedVocabulary: MsutongWord[] = [];
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
  const selections: { bookSlug: string; lessonNumber: number }[] = lessonIds.map(id => {
    const parts = id.split('-lesson-');
    return {
      bookSlug: parts[0],
      lessonNumber: parseInt(parts[1], 10), // This will now correctly be 1-10
    };
  });

  let combinedVocabulary: MsutongWord[] = [];
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

  lessonIds.forEach(id => {
    const parts = id.split('-lesson-');
    const bookSlug = parts[0];
    const lessonNumber = parseInt(parts[1], 10);

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