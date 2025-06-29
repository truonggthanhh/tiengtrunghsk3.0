import { hsk1Vocabulary, type VocabularyWord } from './hsk1';

const vocabularyData: { [key: string]: VocabularyWord[] } = {
  '1': hsk1Vocabulary,
  // Dữ liệu cho các cấp độ HSK khác sẽ được thêm vào đây
  '2': [],
  '3': [],
  '4': [],
  '5': [],
  '6': [],
};

export const getVocabularyByLevel = (level: string): VocabularyWord[] => {
  return vocabularyData[level] || [];
};