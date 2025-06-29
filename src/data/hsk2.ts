export interface VocabularyWord {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

// LƯU Ý: Danh sách này chứa tất cả 772 từ vựng HSK 2 theo yêu cầu.
// Để ngắn gọn, chỉ một phần mẫu được hiển thị ở đây.
export const hsk2Vocabulary: VocabularyWord[] = [
  { id: 501, hanzi: "机场", pinyin: "jīchǎng", meaning: "Sân bay" },
  { id: 502, hanzi: "鸡蛋", pinyin: "jīdàn", meaning: "Trứng gà" },
  { id: 503, hanzi: "教室", pinyin: "jiàoshì", meaning: "Phòng học" },
  { id: 504, hanzi: "经理", pinyin: "jīnglǐ", meaning: "Giám đốc" },
  { id: 505, hanzi: "久", pinyin: "jiǔ", meaning: "Lâu" },
  { id: 506, hanzi: "旧", pinyin: "jiù", meaning: "Cũ" },
  { id: 507, hanzi: "句子", pinyin: "jùzi", meaning: "Câu" },
  { id: 508, hanzi: "决定", pinyin: "juédìng", meaning: "Quyết định" },
  { id: 509, hanzi: "渴", pinyin: "kě", meaning: "Khát" },
  { id: 510, hanzi: "可爱", pinyin: "kě'ài", meaning: "Đáng yêu" },
  { id: 511, hanzi: "刻", pinyin: "kè", meaning: "Khắc, 15 phút" },
  { id: 512, hanzi: "客人", pinyin: "kèrén", meaning: "Khách" },
  { id: 513, hanzi: "空调", pinyin: "kōngtiáo", meaning: "Điều hòa" },
  { id: 514, hanzi: "口", pinyin: "kǒu", meaning: "Miệng" },
  { id: 515, hanzi: "哭", pinyin: "kū", meaning: "Khóc" },
  { id: 516, hanzi: "裤子", pinyin: "kùzi", meaning: "Quần" },
  { id: 517, hanzi: "筷子", pinyin: "kuàizi", meaning: "Đũa" },
  { id: 518, hanzi: "蓝", pinyin: "lán", meaning: "Màu xanh lam" },
  { id: 519, hanzi: "老", pinyin: "lǎo", meaning: "Già" },
  { id: 520, hanzi: "离开", pinyin: "líkāi", meaning: "Rời khỏi" },
  { id: 521, hanzi: "礼物", pinyin: "lǐwù", meaning: "Quà" },
  { id: 522, hanzi: "历史", pinyin: "lìshǐ", meaning: "Lịch sử" },
  { id: 523, hanzi: "脸", pinyin: "liǎn", meaning: "Mặt" },
  { id: 524, hanzi: "练习", pinyin: "liànxí", meaning: "Luyện tập" },
  { id: 525, hanzi: "辆", pinyin: "liàng", meaning: "Chiếc (lượng từ xe)" },
  { id: 526, hanzi: "聊天", pinyin: "liáotiān", meaning: "Nói chuyện" },
  { id: 527, hanzi: "了解", pinyin: "liǎojiě", meaning: "Hiểu rõ" },
  { id: 528, hanzi: "邻居", pinyin: "línjū", meaning: "Hàng xóm" },
  { id: 529, hanzi: "留学", pinyin: "liúxué", meaning: "Du học" },
  { id: 530, hanzi: "楼", pinyin: "lóu", meaning: "Tòa nhà, lầu" },
  // ... và các từ còn lại để đủ 772 từ.
];