export interface VocabularyWord {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  examples?: {
    hanzi: string;
    translation: string;
  }[];
}

export const hsk4Vocabulary: VocabularyWord[] = [
  { id: 2242, hanzi: "爱情", pinyin: "àiqíng", meaning: "Tình yêu", examples: [{ hanzi: "这是一个感人的爱情故事。", translation: "Đây là một câu chuyện tình yêu cảm động." }] },
  { id: 2243, hanzi: "安排", pinyin: "ānpái", meaning: "Sắp xếp", examples: [{ hanzi: "会议的日程已经安排好了。", translation: "Lịch trình của hội nghị đã được sắp xếp xong." }] },
  { id: 2244, hanzi: "安全", pinyin: "ānquán", meaning: "An toàn", examples: [{ hanzi: "请注意交通安全。", translation: "Xin hãy chú ý an toàn giao thông." }] },
  { id: 2245, hanzi: "按时", pinyin: "ànshí", meaning: "Đúng giờ", examples: [{ hanzi: "我们必须按时吃药。", translation: "Chúng ta phải uống thuốc đúng giờ." }] },
  { id: 2246, hanzi: "按照", pinyin: "ànzhào", meaning: "Theo, dựa theo", examples: [{ hanzi: "请按照要求完成作业。", translation: "Xin hãy hoàn thành bài tập theo yêu cầu." }] },
  { id: 2247, hanzi: "百分之", pinyin: "bǎifēnzhī", meaning: "Phần trăm", examples: [{ hanzi: "任务已经完成了百分之八十。", translation: "Nhiệm vụ đã hoàn thành được 80%." }] },
  { id: 2248, hanzi: "棒", pinyin: "bàng", meaning: "Giỏi, tuyệt", examples: [{ hanzi: "你的字写得真棒！", translation: "Chữ của bạn viết thật tuyệt!" }] },
  { id: 2249, hanzi: "包子", pinyin: "bāozi", meaning: "Bánh bao", examples: [{ hanzi: "这家店的包子很好吃。", translation: "Bánh bao của quán này rất ngon." }] },
  { id: 2250, hanzi: "保护", pinyin: "bǎohù", meaning: "Bảo vệ", examples: [{ hanzi: "我们应该保护野生动物。", translation: "Chúng ta nên bảo vệ động vật hoang dã." }] },
  { id: 2251, hanzi: "保证", pinyin: "bǎozhèng", meaning: "Bảo đảm", examples: [{ hanzi: "我保证明天准时到。", translation: "Tôi đảm bảo ngày mai sẽ đến đúng giờ." }] },
  { id: 2252, hanzi: "报名", pinyin: "bàomíng", meaning: "Đăng ký", examples: [{ hanzi: "你报名参加比赛了吗？", translation: "Bạn đã đăng ký tham gia cuộc thi chưa?" }] },
  { id: 2253, hanzi: "抱", pinyin: "bào", meaning: "Ôm", examples: [{ hanzi: "她高兴地抱住了妈妈。", translation: "Cô ấy vui mừng ôm chầm lấy mẹ." }] },
  { id: 2254, hanzi: "抱歉", pinyin: "bàoqiàn", meaning: "Xin lỗi", examples: [{ hanzi: "非常抱歉，我来晚了。", translation: "Vô cùng xin lỗi, tôi đến muộn rồi." }] },
  { id: 2255, hanzi: "倍", pinyin: "bèi", meaning: "Lần, gấp", examples: [{ hanzi: "今年的产量是去年的三倍。", translation: "Sản lượng năm nay gấp ba lần năm ngoái." }] },
  { id: 2256, hanzi: "本来", pinyin: "běnlái", meaning: "Vốn dĩ", examples: [{ hanzi: "我本来不打算来，但是他一再邀请。", translation: "Vốn dĩ tôi không định đến, nhưng anh ấy cứ mời mãi." }] },
  { id: 2257, hanzi: "笨", pinyin: "bèn", meaning: "Ngốc", examples: [{ hanzi: "你别说我笨，我只是反应慢一点。", translation: "Bạn đừng nói tôi ngốc, tôi chỉ là phản ứng chậm một chút." }] },
  { id: 2258, hanzi: "比如", pinyin: "bǐrú", meaning: "Ví dụ", examples: [{ hanzi: "他会很多种语言，比如英语、法语和日语。", translation: "Anh ấy biết nhiều thứ tiếng, ví dụ như tiếng Anh, tiếng Pháp và tiếng Nhật." }] },
  { id: 2259, hanzi: "毕业", pinyin: "bìyè", meaning: "Tốt nghiệp", examples: [{ hanzi: "他明年大学毕业。", translation: "Năm sau anh ấy tốt nghiệp đại học." }] },
  { id: 2260, hanzi: "遍", pinyin: "biàn", meaning: "Lần (lượt)", examples: [{ hanzi: "这个问题我已经解释过好几遍了。", translation: "Vấn đề này tôi đã giải thích mấy lần rồi." }] },
  { id: 2261, hanzi: "标准", pinyin: "biāozhǔn", meaning: "Tiêu chuẩn", examples: [{ hanzi: "这个产品的质量达到了国际标准。", translation: "Chất lượng của sản phẩm này đã đạt tiêu chuẩn quốc tế." }] },
  { id: 2262, hanzi: "表格", pinyin: "biǎogé", meaning: "Bảng biểu", examples: [{ hanzi: "请把这张表格填一下。", translation: "Xin hãy điền vào bảng này." }] },
  { id: 2263, hanzi: "表示", pinyin: "biǎoshì", meaning: "Biểu thị, tỏ rõ", examples: [{ hanzi: "他用微笑表示感谢。", translation: "Anh ấy dùng nụ cười để biểu thị sự cảm ơn." }] },
  { id: 2264, hanzi: "表演", pinyin: "biǎoyǎn", meaning: "Biểu diễn", examples: [{ hanzi: "他们的表演非常成功。", translation: "Buổi biểu diễn của họ rất thành công." }] },
  { id: 2265, hanzi: "表扬", pinyin: "biǎoyáng", meaning: "Biểu dương", examples: [{ hanzi: "他因为工作出色受到了表扬。", translation: "Anh ấy vì làm việc xuất sắc nên đã được biểu dương." }] },
  { id: 2266, hanzi: "饼干", pinyin: "bǐnggān", meaning: "Bánh quy", examples: [{ hanzi: "孩子喜欢吃饼干。", translation: "Trẻ con thích ăn bánh quy." }] },
  { id: 2267, hanzi: "并且", pinyin: "bìngqiě", meaning: "Và, đồng thời", examples: [{ hanzi: "他完成了任务，并且做得很好。", translation: "Anh ấy đã hoàn thành nhiệm vụ, và làm rất tốt." }] },
  { id: 2268, hanzi: "博士", pinyin: "bóshì", meaning: "Tiến sĩ", examples: [{ hanzi: "他是一位历史学博士。", translation: "Ông ấy là một tiến sĩ lịch sử học." }] },
  { id: 2269, hanzi: "不过", pinyin: "búguò", meaning: "Nhưng", examples: [{ hanzi: "我很想去，不过没有时间。", translation: "Tôi rất muốn đi, nhưng không có thời gian." }] },
  { id: 2270, hanzi: "不得不", pinyin: "bùdébù", meaning: "Không thể không", examples: [{ hanzi: "时间太晚了，我不得不回家了。", translation: "Thời gian muộn quá rồi, tôi không thể không về nhà." }] },
  { id: 2271, hanzi: "不管", pinyin: "bùguǎn", meaning: "Bất kể", examples: [{ hanzi: "不管遇到什么困难，我们都要坚持下去。", translation: "Bất kể gặp khó khăn gì, chúng ta đều phải kiên trì." }] },
  { id: 2272, hanzi: "不仅", pinyin: "bùjǐn", meaning: "Không chỉ", examples: [{ hanzi: "他不仅会画画，还会唱歌。", translation: "Anh ấy không chỉ biết vẽ, mà còn biết hát." }] },
  { id: 2273, hanzi: "部分", pinyin: "bùfen", meaning: "Bộ phận", examples: [{ hanzi: "这只是问题的一部分。", translation: "Đây chỉ là một phần của vấn đề." }] },
  { id: 2274, hanzi: "擦", pinyin: "cā", meaning: "Lau, chùi", examples: [{ hanzi: "请帮我把桌子擦干净。", translation: "Xin hãy giúp tôi lau sạch bàn." }] },
  { id: 2275, hanzi: "猜", pinyin: "cāi", meaning: "Đoán", examples: [{ hanzi: "你猜我今年多大？", translation: "Bạn đoán xem năm nay tôi bao nhiêu tuổi?" }] },
  { id: 2276, hanzi: "材料", pinyin: "cáiliào", meaning: "Tài liệu, vật liệu", examples: [{ hanzi: "我需要一些写报告的材料。", translation: "Tôi cần một số tài liệu để viết báo cáo." }] },
  { id: 2277, hanzi: "参观", pinyin: "cānguān", meaning: "Tham quan", examples: [{ hanzi: "我们明天去参观博物馆。", translation: "Ngày mai chúng tôi đi tham quan bảo tàng." }] },
  { id: 2278, hanzi: "餐厅", pinyin: "cāntīng", meaning: "Nhà ăn, phòng ăn", examples: [{ hanzi: "学校的餐厅在哪儿？", translation: "Nhà ăn của trường ở đâu?" }] },
  { id: 2279, hanzi: "厕所", pinyin: "cèsuǒ", meaning: "Nhà vệ sinh", examples: [{ hanzi: "请问，厕所在哪里？", translation: "Xin hỏi, nhà vệ sinh ở đâu?" }] },
  { id: 2280, hanzi: "差不多", pinyin: "chàbuduō", meaning: "Gần như, xấp xỉ", examples: [{ hanzi: "我们差不多高。", translation: "Chúng tôi cao gần như nhau." }] },
  { id: 2281, hanzi: "长城", pinyin: "Chángchéng", meaning: "Vạn Lý Trường Thành", examples: [{ hanzi: "我一直想去长城看看。", translation: "Tôi luôn muốn đến Vạn Lý Trường Thành xem thử." }] },
  { id: 2282, hanzi: "长江", pinyin: "Chángjiāng", meaning: "Sông Trường Giang", examples: [{ hanzi: "长江是中国最长的河流。", translation: "Sông Trường Giang là con sông dài nhất Trung Quốc." }] },
  { id: 2283, hanzi: "尝", pinyin: "cháng", meaning: "Nếm", examples: [{ hanzi: "你尝尝这个菜，味道很好。", translation: "Bạn nếm thử món này đi, vị rất ngon." }] },
  { id: 2284, hanzi: "场", pinyin: "chǎng", meaning: "Trận, buổi", examples: [{ hanzi: "今天下午有一场足球比赛。", translation: "Chiều nay có một trận thi đấu bóng đá." }] },
  { id: 2285, hanzi: "超过", pinyin: "chāoguò", meaning: "Vượt quá", examples: [{ hanzi: "他的成绩超过了所有人。", translation: "Thành tích của anh ấy đã vượt qua tất cả mọi người." }] },
  { id: 2286, hanzi: "成功", pinyin: "chénggōng", meaning: "Thành công", examples: [{ hanzi: "祝你成功！", translation: "Chúc bạn thành công!" }] },
  { id: 2287, hanzi: "成为", pinyin: "chéngwéi", meaning: "Trở thành", examples: [{ hanzi: "他想成为一名医生。", translation: "Anh ấy muốn trở thành một bác sĩ." }] },
  { id: 2288, hanzi: "诚实", pinyin: "chéngshí", meaning: "Thành thật", examples: [{ hanzi: "他是一个诚实的人。", translation: "Anh ấy là một người thành thật." }] },
  { id: 2289, hanzi: "乘坐", pinyin: "chéngzuò", meaning: "Đi (phương tiện)", examples: [{ hanzi: "请您乘坐本次航班。", translation: "Mời ngài đi chuyến bay lần này." }] },
  { id: 2290, hanzi: "吃惊", pinyin: "chījīng", meaning: "Kinh ngạc", examples: [{ hanzi: "听到这个消息，我很吃惊。", translation: "Nghe được tin này, tôi rất kinh ngạc." }] },
  { id: 2291, hanzi: "重新", pinyin: "chóngxīn", meaning: "Làm lại", examples: [{ hanzi: "请你重新说一遍。", translation: "Xin bạn hãy nói lại một lần nữa." }] }
];