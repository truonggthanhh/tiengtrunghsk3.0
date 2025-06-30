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

export const hsk3Vocabulary: VocabularyWord[] = [
  { id: 1273, hanzi: "啊", pinyin: "a", meaning: "Thán từ biểu thị sự ngạc nhiên hoặc tán thành", examples: [{ hanzi: "啊，这儿的风景真美！", translation: "A, phong cảnh ở đây thật đẹp!" }] },
  { id: 1274, hanzi: "阿姨", pinyin: "āyí", meaning: "Dì, cô", examples: [{ hanzi: "王阿姨是我们家的邻居。", translation: "Dì Vương là hàng xóm của nhà chúng tôi." }] },
  { id: 1275, hanzi: "矮", pinyin: "ǎi", meaning: "Thấp, lùn", examples: [{ hanzi: "他虽然个子矮，但是篮球打得很好。", translation: "Tuy anh ấy thấp, nhưng chơi bóng rổ rất giỏi." }] },
  { id: 1276, hanzi: "爱好", pinyin: "àihào", meaning: "Sở thích", examples: [{ hanzi: "我的爱好是看书和听音乐。", translation: "Sở thích của tôi là đọc sách và nghe nhạc." }] },
  { id: 1277, hanzi: "安静", pinyin: "ānjìng", meaning: "Yên tĩnh", examples: [{ hanzi: "请保持安静，不要大声说话。", translation: "Xin hãy giữ yên tĩnh, đừng nói to." }] },
  { id: 1278, hanzi: "安排", pinyin: "ānpái", meaning: "Sắp xếp", examples: [{ hanzi: "经理安排了今天的工作。", translation: "Giám đốc đã sắp xếp công việc hôm nay." }] },
  { id: 1279, hanzi: "安全", pinyin: "ānquán", meaning: "An toàn", examples: [{ hanzi: "开车时要注意安全。", translation: "Khi lái xe cần chú ý an toàn." }] },
  { id: 1280, hanzi: "按时", pinyin: "ànshí", meaning: "Đúng giờ", examples: [{ hanzi: "我们必须按时完成任务。", translation: "Chúng ta phải hoàn thành nhiệm vụ đúng giờ." }] },
  { id: 1281, hanzi: "按照", pinyin: "ànzhào", meaning: "Theo, dựa theo", examples: [{ hanzi: "请按照说明书操作。", translation: "Xin hãy thao tác theo sách hướng dẫn." }] },
  { id: 1282, hanzi: "把", pinyin: "bǎ", meaning: "Đem (giới từ)", examples: [{ hanzi: "请把门关上。", translation: "Xin hãy đóng cửa." }] },
  { id: 1283, hanzi: "百分之", pinyin: "bǎifēnzhī", meaning: "Phần trăm", examples: [{ hanzi: "这次考试，百分之九十的同学都及格了。", translation: "Kỳ thi lần này, 90% học sinh đều đỗ." }] },
  { id: 1284, hanzi: "搬", pinyin: "bān", meaning: "Dọn, chuyển", examples: [{ hanzi: "我们下个月搬家。", translation: "Tháng sau chúng tôi chuyển nhà." }] },
  { id: 1285, hanzi: "班", pinyin: "bān", meaning: "Lớp", examples: [{ hanzi: "我们班有三十个学生。", translation: "Lớp chúng tôi có 30 học sinh." }] },
  { id: 1286, hanzi: "半", pinyin: "bàn", meaning: "Nửa, rưỡi", examples: [{ hanzi: "现在是八点半。", translation: "Bây giờ là 8 rưỡi." }] },
  { id: 1287, hanzi: "办法", pinyin: "bànfǎ", meaning: "Biện pháp", examples: [{ hanzi: "你有什么好办法吗？", translation: "Bạn có biện pháp nào hay không?" }] },
  { id: 1288, hanzi: "办公室", pinyin: "bàngōngshì", meaning: "Văn phòng", examples: [{ hanzi: "他的办公室在三楼。", translation: "Văn phòng của anh ấy ở tầng ba." }] },
  { id: 1289, hanzi: "帮忙", pinyin: "bāngmáng", meaning: "Giúp đỡ", examples: [{ hanzi: "你能帮我一个忙吗？", translation: "Bạn có thể giúp tôi một việc không?" }] },
  { id: 1290, hanzi: "棒", pinyin: "bàng", meaning: "Giỏi, tuyệt", examples: [{ hanzi: "你真棒！", translation: "Bạn thật tuyệt!" }] },
  { id: 1291, hanzi: "包", pinyin: "bāo", meaning: "Túi, bao", examples: [{ hanzi: "我的包里有本书。", translation: "Trong túi của tôi có một quyển sách." }] },
  { id: 1292, hanzi: "包括", pinyin: "bāokuò", meaning: "Bao gồm", examples: [{ hanzi: "我们的服务包括免费早餐。", translation: "Dịch vụ của chúng tôi bao gồm bữa sáng miễn phí." }] },
  { id: 1293, hanzi: "包子", pinyin: "bāozi", meaning: "Bánh bao", examples: [{ hanzi: "我喜欢吃肉包子。", translation: "Tôi thích ăn bánh bao nhân thịt." }] },
  { id: 1294, hanzi: "饱", pinyin: "bǎo", meaning: "No", examples: [{ hanzi: "我吃饱了。", translation: "Tôi ăn no rồi." }] },
  { id: 1295, hanzi: "保护", pinyin: "bǎohù", meaning: "Bảo vệ", examples: [{ hanzi: "我们应该保护环境。", translation: "Chúng ta nên bảo vệ môi trường." }] },
  { id: 1296, hanzi: "保证", pinyin: "bǎozhèng", meaning: "Bảo đảm", examples: [{ hanzi: "我保证完成任务。", translation: "Tôi đảm bảo hoàn thành nhiệm vụ." }] },
  { id: 1297, hanzi: "报名", pinyin: "bàomíng", meaning: "Đăng ký", examples: [{ hanzi: "我想报名参加这个活动。", translation: "Tôi muốn đăng ký tham gia hoạt động này." }] },
  { id: 1298, hanzi: "抱", pinyin: "bào", meaning: "Ôm", examples: [{ hanzi: "妈妈抱着孩子。", translation: "Mẹ đang ôm con." }] },
  { id: 1299, hanzi: "抱歉", pinyin: "bàoqiàn", meaning: "Xin lỗi", examples: [{ hanzi: "很抱歉，我迟到了。", translation: "Rất xin lỗi, tôi đến muộn." }] },
  { id: 1300, hanzi: "被", pinyin: "bèi", meaning: "Bị, được", examples: [{ hanzi: "我的钱包被偷了。", translation: "Ví của tôi bị trộm rồi." }] },
  { id: 1301, hanzi: "倍", pinyin: "bèi", meaning: "Lần, gấp", examples: [{ hanzi: "今年的收入是去年的两倍。", translation: "Thu nhập năm nay gấp đôi năm ngoái." }] },
  { id: 1302, hanzi: "本来", pinyin: "běnlái", meaning: "Vốn dĩ", examples: [{ hanzi: "我本来想去看电影，但是突然有事了。", translation: "Vốn dĩ tôi muốn đi xem phim, nhưng đột nhiên có việc." }] },
  { id: 1303, hanzi: "笨", pinyin: "bèn", meaning: "Ngốc", examples: [{ hanzi: "他虽然有点笨，但是很努力。", translation: "Anh ấy tuy hơi ngốc, nhưng rất nỗ lực." }] },
  { id: 1304, hanzi: "北方", pinyin: "běifāng", meaning: "Phương bắc", examples: [{ hanzi: "北方的冬天很冷。", translation: "Mùa đông ở phương bắc rất lạnh." }] },
  { id: 1305, hanzi: "比如", pinyin: "bǐrú", meaning: "Ví dụ", examples: [{ hanzi: "我喜欢很多运动，比如跑步、游泳和打篮球。", translation: "Tôi thích nhiều môn thể thao, ví dụ như chạy bộ, bơi lội và chơi bóng rổ." }] },
  { id: 1306, hanzi: "比较", pinyin: "bǐjiào", meaning: "Tương đối, so sánh", examples: [{ hanzi: "今天天气比较好。", translation: "Thời tiết hôm nay tương đối tốt." }] },
  { id: 1307, hanzi: "比赛", pinyin: "bǐsài", meaning: "Thi đấu", examples: [{ hanzi: "明天有足球比赛。", translation: "Ngày mai có trận thi đấu bóng đá." }] },
  { id: 1308, hanzi: "笔记本", pinyin: "bǐjìběn", meaning: "Vở ghi", examples: [{ hanzi: "我把重要的事都记在笔记本上。", translation: "Tôi ghi hết những việc quan trọng vào vở." }] },
  { id: 1309, hanzi: "必须", pinyin: "bìxū", meaning: "Phải, cần phải", examples: [{ hanzi: "你必须马上离开。", translation: "Bạn phải rời đi ngay lập tức." }] },
  { id: 1310, hanzi: "毕业", pinyin: "bìyè", meaning: "Tốt nghiệp", examples: [{ hanzi: "我明年大学毕业。", translation: "Năm sau tôi tốt nghiệp đại học." }] },
  { id: 1311, hanzi: "遍", pinyin: "biàn", meaning: "Lần (lượt)", examples: [{ hanzi: "这篇文章我看了三遍。", translation: "Bài viết này tôi đã đọc ba lần." }] },
  { id: 1312, hanzi: "变化", pinyin: "biànhuà", meaning: "Thay đổi", examples: [{ hanzi: "这几年，我的家乡变化很大。", translation: "Mấy năm nay, quê hương tôi thay đổi rất lớn." }] },
  { id: 1313, hanzi: "标准", pinyin: "biāozhǔn", meaning: "Tiêu chuẩn", examples: [{ hanzi: "他的普通话说得很标准。", translation: "Tiếng phổ thông của anh ấy nói rất chuẩn." }] },
  { id: 1314, hanzi: "表格", pinyin: "biǎogé", meaning: "Bảng biểu", examples: [{ hanzi: "请填写这张表格。", translation: "Xin hãy điền vào bảng này." }] },
  { id: 1315, hanzi: "表示", pinyin: "biǎoshì", meaning: "Biểu thị, tỏ rõ", examples: [{ hanzi: "他点头表示同意。", translation: "Anh ấy gật đầu tỏ ý đồng ý." }] },
  { id: 1316, hanzi: "表演", pinyin: "biǎoyǎn", meaning: "Biểu diễn", examples: [{ hanzi: "今天的表演很精彩。", translation: "Buổi biểu diễn hôm nay rất đặc sắc." }] },
  { id: 1317, hanzi: "表扬", pinyin: "biǎoyáng", meaning: "Biểu dương", examples: [{ hanzi: "老师表扬了他。", translation: "Giáo viên đã biểu dương anh ấy." }] },
  { id: 1318, hanzi: "别人", pinyin: "biérén", meaning: "Người khác", examples: [{ hanzi: "不要在背后说别人的坏话。", translation: "Đừng nói xấu người khác sau lưng." }] },
  { id: 1319, hanzi: "宾馆", pinyin: "bīnguǎn", meaning: "Nhà khách", examples: [{ hanzi: "我们住在这家宾馆。", translation: "Chúng tôi ở tại nhà khách này." }] },
  { id: 1320, hanzi: "饼干", pinyin: "bǐnggān", meaning: "Bánh quy", examples: [{ hanzi: "我喜欢吃巧克力饼干。", translation: "Tôi thích ăn bánh quy sô cô la." }] },
  { id: 1321, hanzi: "冰箱", pinyin: "bīngxiāng", meaning: "Tủ lạnh", examples: [{ hanzi: "冰箱里有很多水果。", translation: "Trong tủ lạnh có rất nhiều hoa quả." }] },
  { id: 1322, hanzi: "并且", pinyin: "bìngqiě", meaning: "Và, đồng thời", examples: [{ hanzi: "他很聪明，并且很努力。", translation: "Anh ấy rất thông minh, và cũng rất nỗ lực." }] },
  { id: 1323, hanzi: "博士", pinyin: "bóshì", meaning: "Tiến sĩ", examples: [{ hanzi: "他是一位化学博士。", translation: "Ông ấy là một tiến sĩ hóa học." }] },
  { id: 1324, hanzi: "不但", pinyin: "búdàn", meaning: "Không những", examples: [{ hanzi: "他不但会说英语，而且会说法语。", translation: "Anh ấy không những biết nói tiếng Anh, mà còn biết nói tiếng Pháp." }] },
  { id: 1325, hanzi: "不得不", pinyin: "bùdébù", meaning: "Không thể không", examples: [{ hanzi: "雨下得太大了，我不得不留下来。", translation: "Mưa to quá, tôi không thể không ở lại." }] },
  { id: 1326, hanzi: "不管", pinyin: "bùguǎn", meaning: "Bất kể", examples: [{ hanzi: "不管多晚，他都会等我回家。", translation: "Bất kể muộn thế nào, anh ấy đều sẽ đợi tôi về nhà." }] },
  { id: 1327, hanzi: "不过", pinyin: "búguò", meaning: "Nhưng", examples: [{ hanzi: "这个手机很好，不过太贵了。", translation: "Cái điện thoại này rất tốt, nhưng đắt quá." }] },
  { id: 1328, hanzi: "不仅", pinyin: "bùjǐn", meaning: "Không chỉ", examples: [{ hanzi: "他不仅学习好，体育也好。", translation: "Anh ấy không chỉ học giỏi, thể thao cũng giỏi." }] },
  { id: 1329, hanzi: "部分", pinyin: "bùfen", meaning: "Bộ phận", examples: [{ hanzi: "大部分同学都同意这个计划。", translation: "Đại bộ phận học sinh đều đồng ý với kế hoạch này." }] }
];