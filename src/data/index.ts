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

// Placeholder data for Msutong textbooks
// Cấu trúc dữ liệu giả định: { level: { book: { lesson: VocabularyWord[] } } }
const msutongData: { [level: string]: { [book: string]: { [lesson: string]: VocabularyWord[] } } } = {
  'so-cap': {
    'quyen-1': {
      '1': [
        { id: 10001, hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" },
        { id: 10002, hanzi: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn" },
      ],
      '2': [
        { id: 10003, hanzi: "再见", pinyin: "zàijiàn", meaning: "Tạm biệt" },
      ]
    },
    'quyen-2': {
        '1': [
            { id: 20001, hanzi: "学校", pinyin: "xuéxiào", meaning: "Trường học" },
        ]
    }
  },
  // Thêm dữ liệu cho trung-cap, cao-cap khi có
};

export const getVocabularyByMsutong = (level: string, books: string[], lessons: number[]): VocabularyWord[] => {
  let combinedVocabulary: VocabularyWord[] = [];
  const levelData = msutongData[level];
  if (!levelData) return [];

  books.forEach(bookSlug => {
    const bookData = levelData[bookSlug];
    if (bookData) {
      lessons.forEach(lessonNum => {
        const lessonData = bookData[lessonNum.toString()];
        if (lessonData) {
          combinedVocabulary.push(...lessonData);
        }
      });
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


export type { VocabularyWord };