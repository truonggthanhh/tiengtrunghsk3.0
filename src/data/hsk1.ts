export interface VocabularyWord {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export const hsk1Vocabulary: VocabularyWord[] = [
  { id: 1, hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" },
  { id: 2, hanzi: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn" },
  { id: 3, hanzi: "不客气", pinyin: "bú kèqi", meaning: "Đừng khách sáo" },
  { id: 4, hanzi: "再见", pinyin: "zàijiàn", meaning: "Tạm biệt" },
  { id: 5, hanzi: "我", pinyin: "wǒ", meaning: "Tôi" },
  { id: 6, hanzi: "你", pinyin: "nǐ", meaning: "Bạn" },
  { id: 7, hanzi: "他", pinyin: "tā", meaning: "Anh ấy" },
  { id: 8, hanzi: "她", pinyin: "tā", meaning: "Cô ấy" },
  { id: 9, hanzi: "我们", pinyin: "wǒmen", meaning: "Chúng tôi" },
  { id: 10, hanzi: "是", pinyin: "shì", meaning: "Là, phải" },
  { id: 11, hanzi: "爱", pinyin: "ài", meaning: "Yêu" },
  { id: 12, hanzi: "八", pinyin: "bā", meaning: "Tám" },
  { id: 13, hanzi: "爸爸", pinyin: "bàba", meaning: "Bố" },
  { id: 14, hanzi: "杯子", pinyin: "bēizi", meaning: "Cái cốc" },
  { id: 15, hanzi: "北京", pinyin: "Běijīng", meaning: "Bắc Kinh" },
];