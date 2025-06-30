import { hsk1Vocabulary, type VocabularyWord } from './hsk1';
import { hsk2Vocabulary } from './hsk2';
import { hsk3Vocabulary } from './hsk3';
import { hsk4Vocabulary } from './hsk4';

const vocabularyData: { [key: string]: VocabularyWord[] } = {
  '1': hsk1Vocabulary,
  '2': hsk2Vocabulary,
  '3': hsk3Vocabulary,
  '4': hsk4Vocabulary,
  '5': [],
  '6': [],
};

export const getVocabularyByLevel = (level: string): VocabularyWord[] => {
  return vocabularyData[level] || [];
};