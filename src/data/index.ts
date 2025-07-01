import { hsk1Vocabulary, type VocabularyWord } from './hsk1';
import { hsk2Vocabulary } from './hsk2';
import { hsk3Vocabulary } from './hsk3';
import { hsk4Vocabulary } from './hsk4';
import { hsk5Vocabulary } from './hsk5';
import { hsk6Vocabulary } from './hsk6';

const vocabularyData: { [key: string]: VocabularyWord[] } = {
  '1': hsk1Vocabulary,
  '2': hsk2Vocabulary,
  '3': hsk3Vocabulary,
  '4': hsk4Vocabulary,
  '5': hsk5Vocabulary,
  '6': hsk6Vocabulary,
};

export const getVocabularyByLevel = (level: string): VocabularyWord[] => {
  return vocabularyData[level] || [];
};

// Placeholder data for Msutong textbooks
const msutongData: { [book: string]: { [lesson: string]: VocabularyWord[] } } = {
  'boya': {
    '1': [], // You will add data here later
    '2': [],
  },
  'hanyu': {
    '1': [],
    '2': [],
  }
};

export const getVocabularyByMsutong = (book: string, lesson: string): VocabularyWord[] => {
  return msutongData[book]?.[lesson] || [];
};


export type { VocabularyWord };