import type { VocabularyWord } from '@/data';

export interface MsutongWord extends VocabularyWord {
  lesson: number;
}

export const msutong_so_cap_1_vocab: MsutongWord[] = [
  // Bài 1
  { id: 10101, lesson: 1, hanzi: "你好", pinyin: "nǐ hǎo", meaning: "Xin chào" },
  { id: 10102, lesson: 1, hanzi: "你", pinyin: "nǐ", meaning: "Bạn, ông, bà, anh, chị, em" },
  { id: 10103, lesson: 1, hanzi: "好", pinyin: "hǎo", meaning: "Tốt, khỏe, hay" },
  { id: 10104, lesson: 1, hanzi: "吗", pinyin: "ma", meaning: "Không (trợ từ nghi vấn)" },
  { id: 10105, lesson: 1, hanzi: "我", pinyin: "wǒ", meaning: "Tôi, tớ, mình" },
  { id: 10106, lesson: 1, hanzi: "很", pinyin: "hěn", meaning: "Rất" },
  { id: 10107, lesson: 1, hanzi: "呢", pinyin: "ne", meaning: "Thì, còn (trợ từ)" },
  { id: 10108, lesson: 1, hanzi: "也", pinyin: "yě", meaning: "Cũng" },
  { id: 10109, lesson: 1, hanzi: "老师", pinyin: "lǎoshī", meaning: "Giáo viên" },
  { id: 10110, lesson: 1, hanzi: "您", pinyin: "nín", meaning: "Ngài, ông, bà (kính trọng)" },

  // Bài 2
  { id: 10201, lesson: 2, hanzi: "谢谢", pinyin: "xièxie", meaning: "Cảm ơn" },
  { id: 10202, lesson: 2, hanzi: "不客气", pinyin: "bú kèqi", meaning: "Đừng khách sáo" },
  { id: 10203, lesson: 2, hanzi: "不", pinyin: "bù", meaning: "Không" },
  { id: 10204, lesson: 2, hanzi: "客气", pinyin: "kèqi", meaning: "Khách sáo" },
  { id: 10205, lesson: 2, hanzi: "再见", pinyin: "zàijiàn", meaning: "Tạm biệt" },
  { id: 10206, lesson: 2, hanzi: "再", pinyin: "zài", meaning: "Lại, nữa" },
  { id: 10207, lesson: 2, hanzi: "见", pinyin: "jiàn", meaning: "Thấy, gặp" },
  { id: 10208, lesson: 2, hanzi: "是", pinyin: "shì", meaning: "Là, phải" },
  { id: 10209, lesson: 2, hanzi: "对不起", pinyin: "duìbuqǐ", meaning: "Xin lỗi" },
  { id: 10210, lesson: 2, hanzi: "没关系", pinyin: "méi guānxi", meaning: "Không sao đâu" },

  // Bài 3
  { id: 10301, lesson: 3, hanzi: "叫", pinyin: "jiào", meaning: "Gọi, tên là" },
  { id: 10302, lesson: 3, hanzi: "什么", pinyin: "shénme", meaning: "Cái gì" },
  { id: 10303, lesson: 3, hanzi: "名字", pinyin: "míngzi", meaning: "Tên" },
  { id: 10304, lesson: 3, hanzi: "他", pinyin: "tā", meaning: "Anh ấy, ông ấy" },
  { id: 10305, lesson: 3, hanzi: "她", pinyin: "tā", meaning: "Cô ấy, bà ấy" },
  { id: 10306, lesson: 3, hanzi: "学生", pinyin: "xuésheng", meaning: "Học sinh" },
  { id: 10307, lesson: 3, hanzi: "学习", pinyin: "xuéxí", meaning: "Học tập" },
  { id: 10308, lesson: 3, hanzi: "汉语", pinyin: "Hànyǔ", meaning: "Tiếng Hán" },
  { id: 10309, lesson: 3, hanzi: "中国", pinyin: "Zhōngguó", meaning: "Trung Quốc" },
  { id: 10310, lesson: 3, hanzi: "人", pinyin: "rén", meaning: "Người" },

  // Bài 4 (Placeholder)
  { id: 10401, lesson: 4, hanzi: "学习", pinyin: "xuéxí", meaning: "Học tập" },
  { id: 10402, lesson: 4, hanzi: "中文", pinyin: "Zhōngwén", meaning: "Tiếng Trung" },
  { id: 10403, lesson: 4, hanzi: "朋友", pinyin: "péngyou", meaning: "Bạn bè" },
  { id: 10404, lesson: 4, hanzi: "喜欢", pinyin: "xǐhuan", meaning: "Thích" },
  { id: 10405, lesson: 4, hanzi: "吃饭", pinyin: "chī fàn", meaning: "Ăn cơm" },
  { id: 10406, lesson: 4, hanzi: "喝水", pinyin: "hē shuǐ", meaning: "Uống nước" },
  { id: 10407, lesson: 4, hanzi: "看书", pinyin: "kàn shū", meaning: "Đọc sách" },
  { id: 10408, lesson: 4, hanzi: "去", pinyin: "qù", meaning: "Đi" },
  { id: 10409, lesson: 4, hanzi: "来", pinyin: "lái", meaning: "Đến" },
  { id: 10410, lesson: 4, hanzi: "家", pinyin: "jiā", meaning: "Nhà" },

  // Bài 5 (Placeholder)
  { id: 10501, lesson: 5, hanzi: "学校", pinyin: "xuéxiào", meaning: "Trường học" },
  { id: 10502, lesson: 5, hanzi: "商店", pinyin: "shāngdiàn", meaning: "Cửa hàng" },
  { id: 10503, lesson: 5, hanzi: "买", pinyin: "mǎi", meaning: "Mua" },
  { id: 10504, lesson: 5, hanzi: "东西", pinyin: "dōngxi", meaning: "Đồ vật" },
  { id: 10505, lesson: 5, hanzi: "多少", pinyin: "duōshao", meaning: "Bao nhiêu" },
  { id: 10506, lesson: 5, hanzi: "钱", pinyin: "qián", meaning: "Tiền" },
  { id: 10507, lesson: 5, hanzi: "衣服", pinyin: "yīfu", meaning: "Quần áo" },
  { id: 10508, lesson: 5, hanzi: "件", pinyin: "jiàn", meaning: "Chiếc (lượng từ)" },
  { id: 10509, lesson: 5, hanzi: "颜色", pinyin: "yánsè", meaning: "Màu sắc" },
  { id: 10510, lesson: 5, hanzi: "漂亮", pinyin: "piàoliang", meaning: "Xinh đẹp" },

  // Bài 6 (Placeholder)
  { id: 10601, lesson: 6, hanzi: "今天", pinyin: "jīntiān", meaning: "Hôm nay" },
  { id: 10602, lesson: 6, hanzi: "明天", pinyin: "míngtiān", meaning: "Ngày mai" },
  { id: 10603, lesson: 6, hanzi: "昨天", pinyin: "zuótiān", meaning: "Hôm qua" },
  { id: 10604, lesson: 6, hanzi: "星期", pinyin: "xīngqī", meaning: "Tuần" },
  { id: 10605, lesson: 6, hanzi: "月", pinyin: "yuè", meaning: "Tháng" },
  { id: 10606, lesson: 6, hanzi: "日", pinyin: "rì", meaning: "Ngày" },
  { id: 10607, lesson: 6, hanzi: "年", pinyin: "nián", meaning: "Năm" },
  { id: 10608, lesson: 6, hanzi: "现在", pinyin: "xiànzài", meaning: "Bây giờ" },
  { id: 10609, lesson: 6, hanzi: "点", pinyin: "diǎn", meaning: "Giờ" },
  { id: 10610, lesson: 6, hanzi: "分", pinyin: "fēn", meaning: "Phút" },

  // Bài 7 (Placeholder)
  { id: 10701, lesson: 7, hanzi: "吃", pinyin: "chī", meaning: "Ăn" },
  { id: 10702, lesson: 7, hanzi: "喝", pinyin: "hē", meaning: "Uống" },
  { id: 10703, lesson: 7, hanzi: "米饭", pinyin: "mǐfàn", meaning: "Cơm" },
  { id: 10704, lesson: 7, hanzi: "菜", pinyin: "cài", meaning: "Món ăn" },
  { id: 10705, lesson: 7, hanzi: "水果", pinyin: "shuǐguǒ", meaning: "Hoa quả" },
  { id: 10706, lesson: 7, hanzi: "苹果", pinyin: "píngguǒ", meaning: "Táo" },
  { id: 10707, lesson: 7, hanzi: "水", pinyin: "shuǐ", meaning: "Nước" },
  { id: 10708, lesson: 7, hanzi: "茶", pinyin: "chá", meaning: "Trà" },
  { id: 10709, lesson: 7, hanzi: "咖啡", pinyin: "kāfēi", meaning: "Cà phê" },
  { id: 10710, lesson: 7, hanzi: "牛奶", pinyin: "niúnǎi", meaning: "Sữa" },

  // Bài 8 (Placeholder)
  { id: 10801, lesson: 8, hanzi: "爸爸", pinyin: "bàba", meaning: "Bố" },
  { id: 10802, lesson: 8, hanzi: "妈妈", pinyin: "māma", meaning: "Mẹ" },
  { id: 10803, lesson: 8, hanzi: "哥哥", pinyin: "gēge", meaning: "Anh trai" },
  { id: 10804, lesson: 8, hanzi: "姐姐", pinyin: "jiějie", meaning: "Chị gái" },
  { id: 10805, lesson: 8, hanzi: "弟弟", pinyin: "dìdi", meaning: "Em trai" },
  { id: 10806, lesson: 8, hanzi: "妹妹", pinyin: "mèimei", meaning: "Em gái" },
  { id: 10807, lesson: 8, hanzi: "儿子", pinyin: "érzi", meaning: "Con trai" },
  { id: 10808, lesson: 8, hanzi: "女儿", pinyin: "nǚ'ér", meaning: "Con gái" },
  { id: 10809, lesson: 8, hanzi: "家人", pinyin: "jiārén", meaning: "Người nhà" },
  { id: 10810, lesson: 8, hanzi: "朋友", pinyin: "péngyou", meaning: "Bạn bè" },

  // Bài 9 (Placeholder)
  { id: 10901, lesson: 9, hanzi: "医生", pinyin: "yīshēng", meaning: "Bác sĩ" },
  { id: 10902, lesson: 9, hanzi: "老师", pinyin: "lǎoshī", meaning: "Giáo viên" },
  { id: 10903, lesson: 9, hanzi: "学生", pinyin: "xuésheng", meaning: "Học sinh" },
  { id: 10904, lesson: 9, hanzi: "工作", pinyin: "gōngzuò", meaning: "Công việc" },
  { id: 10905, lesson: 9, hanzi: "医院", pinyin: "yīyuàn", meaning: "Bệnh viện" },
  { id: 10906, lesson: 9, hanzi: "学校", pinyin: "xuéxiào", meaning: "Trường học" },
  { id: 10907, lesson: 9, hanzi: "公司", pinyin: "gōngsī", meaning: "Công ty" },
  { id: 10908, lesson: 9, hanzi: "饭店", pinyin: "fàndiàn", meaning: "Nhà hàng" },
  { id: 10909, lesson: 9, hanzi: "商店", pinyin: "shāngdiàn", meaning: "Cửa hàng" },
  { id: 10910, lesson: 9, hanzi: "家", pinyin: "jiā", meaning: "Nhà" },

  // Bài 10 (Placeholder)
  { id: 11001, lesson: 10, hanzi: "大", pinyin: "dà", meaning: "To, lớn" },
  { id: 11002, lesson: 10, hanzi: "小", pinyin: "xiǎo", meaning: "Nhỏ, bé" },
  { id: 11003, lesson: 10, hanzi: "多", pinyin: "duō", meaning: "Nhiều" },
  { id: 11004, lesson: 10, hanzi: "少", pinyin: "shǎo", meaning: "Ít" },
  { id: 11005, lesson: 10, hanzi: "冷", pinyin: "lěng", meaning: "Lạnh" },
  { id: 11006, lesson: 10, hanzi: "热", pinyin: "rè", meaning: "Nóng" },
  { id: 11007, lesson: 10, hanzi: "好", pinyin: "hǎo", meaning: "Tốt" },
  { id: 10008, lesson: 10, hanzi: "不好", pinyin: "bù hǎo", meaning: "Không tốt" },
  { id: 10009, lesson: 10, hanzi: "很", pinyin: "hěn", meaning: "Rất" },
  { id: 10010, lesson: 10, hanzi: "太", pinyin: "tài", meaning: "Quá" },
];