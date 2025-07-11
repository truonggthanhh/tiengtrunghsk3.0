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

export const hsk2Vocabulary: VocabularyWord[] = [
  { id: 501, hanzi: "吧", pinyin: "ba", meaning: "Đi, nhé (trợ từ)", examples: [{ hanzi: "我们走吧。", translation: "Chúng ta đi đi." }] },
  { id: 502, hanzi: "白", pinyin: "bái", meaning: "Trắng", examples: [{ hanzi: "我喜欢白色的衣服。", translation: "Tôi thích quần áo màu trắng." }] },
  { id: 503, hanzi: "百", pinyin: "bǎi", meaning: "Trăm", examples: [{ hanzi: "这本书一百块钱。", translation: "Quyển sách này 100 đồng." }] },
  { id: 504, hanzi: "帮助", pinyin: "bāngzhù", meaning: "Giúp đỡ", examples: [{ hanzi: "谢谢你的帮助。", translation: "Cảm ơn sự giúp đỡ của bạn." }] },
  { id: 505, hanzi: "报纸", pinyin: "bàozhǐ", meaning: "Báo", examples: [{ hanzi: "爷爷每天早上都看报纸。", translation: "Ông nội mỗi buổi sáng đều đọc báo." }] },
  { id: 506, hanzi: "比", pinyin: "bǐ", meaning: "So với", examples: [{ hanzi: "他比我高。", translation: "Anh ấy cao hơn tôi." }] },
  { id: 507, hanzi: "别", pinyin: "bié", meaning: "Đừng", examples: [{ hanzi: "别说话了。", translation: "Đừng nói chuyện nữa." }] },
  { id: 508, hanzi: "长", pinyin: "cháng", meaning: "Dài", examples: [{ hanzi: "这条路很长。", translation: "Con đường này rất dài." }] },
  { id: 509, hanzi: "唱歌", pinyin: "chànggē", meaning: "Hát", examples: [{ hanzi: "她唱歌唱得很好听。", translation: "Cô ấy hát rất hay." }] },
  { id: 510, hanzi: "出", pinyin: "chū", meaning: "Ra", examples: [{ hanzi: "他出去了。", translation: "Anh ấy ra ngoài rồi." }] },
  { id: 511, hanzi: "穿", pinyin: "chuān", meaning: "Mặc", examples: [{ hanzi: "今天很冷，多穿点衣服。", translation: "Hôm nay rất lạnh, mặc thêm chút quần áo đi." }] },
  { id: 512, hanzi: "次", pinyin: "cì", meaning: "Lần", examples: [{ hanzi: "我去过一次北京。", translation: "Tôi đã đến Bắc Kinh một lần." }] },
  { id: 513, hanzi: "从", pinyin: "cóng", meaning: "Từ", examples: [{ hanzi: "我从学校回家。", translation: "Tôi từ trường về nhà." }] },
  { id: 514, hanzi: "错", pinyin: "cuò", meaning: "Sai", examples: [{ hanzi: "对不起，我错了。", translation: "Xin lỗi, tôi sai rồi." }] },
  { id: 515, hanzi: "打篮球", pinyin: "dǎ lánqiú", meaning: "Chơi bóng rổ", examples: [{ hanzi: "他喜欢打篮球。", translation: "Anh ấy thích chơi bóng rổ." }] },
  { id: 516, hanzi: "大家", pinyin: "dàjiā", meaning: "Mọi người", examples: [{ hanzi: "大家好！", translation: "Chào mọi người!" }] },
  { id: 517, hanzi: "到", pinyin: "dào", meaning: "Đến", examples: [{ hanzi: "我到家了。", translation: "Tôi đến nhà rồi." }] },
  { id: 518, hanzi: "得", pinyin: "de", meaning: "Đến nỗi (trợ từ)", examples: [{ hanzi: "他跑得很快。", translation: "Anh ấy chạy rất nhanh." }] },
  { id: 519, hanzi: "等", pinyin: "děng", meaning: "Đợi", examples: [{ hanzi: "请等一下。", translation: "Xin đợi một chút." }] },
  { id: 520, hanzi: "弟弟", pinyin: "dìdi", meaning: "Em trai", examples: [{ hanzi: "我弟弟比我小三岁。", translation: "Em trai tôi nhỏ hơn tôi 3 tuổi." }] },
  { id: 521, hanzi: "第一", pinyin: "dì-yī", meaning: "Thứ nhất", examples: [{ hanzi: "这是我第一次来中国。", translation: "Đây là lần đầu tiên tôi đến Trung Quốc." }] },
  { id: 522, hanzi: "懂", pinyin: "dǒng", meaning: "Hiểu", examples: [{ hanzi: "你懂我的意思吗？", translation: "Bạn có hiểu ý của tôi không?" }] },
  { id: 523, hanzi: "对", pinyin: "duì", meaning: "Đúng", examples: [{ hanzi: "你说得很对。", translation: "Bạn nói rất đúng." }] },
  { id: 524, hanzi: "房间", pinyin: "fángjiān", meaning: "Phòng", examples: [{ hanzi: "我的房间不大。", translation: "Phòng của tôi không lớn." }] },
  { id: 525, hanzi: "非常", pinyin: "fēicháng", meaning: "Vô cùng", examples: [{ hanzi: "我非常喜欢这个电影。", translation: "Tôi vô cùng thích bộ phim này." }] },
  { id: 526, hanzi: "服务员", pinyin: "fúwùyuán", meaning: "Nhân viên phục vụ", examples: [{ hanzi: "服务员，请给我一杯水。", translation: "Phục vụ, cho tôi một cốc nước." }] },
  { id: 527, hanzi: "高", pinyin: "gāo", meaning: "Cao", examples: [{ hanzi: "他个子很高。", translation: "Anh ấy dáng người rất cao." }] },
  { id: 528, hanzi: "告诉", pinyin: "gàosu", meaning: "Nói cho biết", examples: [{ hanzi: "请告诉我你的电话号码。", translation: "Xin hãy cho tôi biết số điện thoại của bạn." }] },
  { id: 529, hanzi: "哥哥", pinyin: "gēge", meaning: "Anh trai", examples: [{ hanzi: "我哥哥是工程师。", translation: "Anh trai tôi là kỹ sư." }] },
  { id: 530, hanzi: "给", pinyin: "gěi", meaning: "Cho", examples: [{ hanzi: "请把这本书给我。", translation: "Xin hãy đưa quyển sách này cho tôi." }] },
  { id: 531, hanzi: "公共汽车", pinyin: "gōnggòng qìchē", meaning: "Xe buýt", examples: [{ hanzi: "我每天坐公共汽车上班。", translation: "Tôi mỗi ngày đi xe buýt đi làm." }] },
  { id: 532, hanzi: "公司", pinyin: "gōngsī", meaning: "Công ty", examples: [{ hanzi: "他在一家大公司工作。", translation: "Anh ấy làm việc ở một công ty lớn." }] },
  { id: 533, hanzi: "贵", pinyin: "guì", meaning: "Đắt", examples: [{ hanzi: "这件衣服太贵了。", translation: "Bộ quần áo này đắt quá." }] },
  { id: 534, hanzi: "过", pinyin: "guo", meaning: "Qua, rồi", examples: [{ hanzi: "我吃过饭了。", translation: "Tôi ăn cơm rồi." }] },
  { id: 535, hanzi: "还", pinyin: "hái", meaning: "Vẫn, còn", examples: [{ hanzi: "他还在睡觉。", translation: "Anh ấy vẫn đang ngủ." }] },
  { id: 536, hanzi: "孩子", pinyin: "háizi", meaning: "Đứa trẻ", examples: [{ hanzi: "这个孩子很聪明。", translation: "Đứa trẻ này rất thông minh." }] },
  { id: 537, hanzi: "好吃", pinyin: "hǎochī", meaning: "Ngon", examples: [{ hanzi: "这个菜很好吃。", translation: "Món ăn này rất ngon." }] },
  { id: 538, hanzi: "黑", pinyin: "hēi", meaning: "Đen", examples: [{ hanzi: "我有一只黑色的猫。", translation: "Tôi có một con mèo màu đen." }] },
  { id: 539, hanzi: "红", pinyin: "hóng", meaning: "Đỏ", examples: [{ hanzi: "她喜欢穿红色的裙子。", translation: "Cô ấy thích mặc váy màu đỏ." }] },
  { id: 540, hanzi: "欢迎", pinyin: "huānyíng", meaning: "Hoan nghênh", examples: [{ hanzi: "欢迎来到我们家。", translation: "Chào mừng đến nhà chúng tôi." }] },
  { id: 541, hanzi: "回答", pinyin: "huídá", meaning: "Trả lời", examples: [{ hanzi: "请回答我的问题。", translation: "Xin hãy trả lời câu hỏi của tôi." }] },
  { id: 542, hanzi: "机场", pinyin: "jīchǎng", meaning: "Sân bay", examples: [{ hanzi: "我们坐出租车去机场。", translation: "Chúng tôi đi taxi đến sân bay." }] },
  { id: 543, hanzi: "鸡蛋", pinyin: "jīdàn", meaning: "Trứng gà", examples: [{ hanzi: "我早上吃了一个鸡蛋。", translation: "Buổi sáng tôi đã ăn một quả trứng gà." }] },
  { id: 544, hanzi: "件", pinyin: "jiàn", meaning: "Chiếc, cái (lượng từ)", examples: [{ hanzi: "这件衣服很漂亮。", translation: "Bộ quần áo này rất đẹp." }] },
  { id: 545, hanzi: "教室", pinyin: "jiàoshì", meaning: "Phòng học", examples: [{ hanzi: "教室里有很多学生。", translation: "Trong phòng học có rất nhiều học sinh." }] },
  { id: 546, hanzi: "姐姐", pinyin: "jiějie", meaning: "Chị gái", examples: [{ hanzi: "我姐姐是护士。", translation: "Chị gái tôi là y tá." }] },
  { id: 547, hanzi: "介绍", pinyin: "jièshào", meaning: "Giới thiệu", examples: [{ hanzi: "我来介绍一下，这是我的朋友。", translation: "Để tôi giới thiệu một chút, đây là bạn của tôi." }] },
  { id: 548, hanzi: "进", pinyin: "jìn", meaning: "Vào", examples: [{ hanzi: "请进！", translation: "Mời vào!" }] },
  { id: 549, hanzi: "近", pinyin: "jìn", meaning: "Gần", examples: [{ hanzi: "我家离公司很近。", translation: "Nhà tôi cách công ty rất gần." }] },
  { id: 550, hanzi: "就", pinyin: "jiù", meaning: "Thì, là", examples: [{ hanzi: "我马上就到。", translation: "Tôi đến ngay đây." }] },
  { id: 551, hanzi: "觉得", pinyin: "juéde", meaning: "Cảm thấy", examples: [{ hanzi: "我觉得有点儿累。", translation: "Tôi cảm thấy hơi mệt." }] },
  { id: 552, hanzi: "咖啡", pinyin: "kāfēi", meaning: "Cà phê", examples: [{ hanzi: "你想喝咖啡还是茶？", translation: "Bạn muốn uống cà phê hay trà?" }] },
  { id: 553, hanzi: "开始", pinyin: "kāishǐ", meaning: "Bắt đầu", examples: [{ hanzi: "电影九点开始。", translation: "Phim bắt đầu lúc 9 giờ." }] },
  { id: 554, hanzi: "考试", pinyin: "kǎoshì", meaning: "Thi, kỳ thi", examples: [{ hanzi: "明天有汉语考试。", translation: "Ngày mai có kỳ thi tiếng Hán." }] },
  { id: 555, hanzi: "可能", pinyin: "kěnéng", meaning: "Có thể, khả năng", examples: [{ hanzi: "他可能不知道这件事。", translation: "Anh ấy có thể không biết chuyện này." }] },
  { id: 556, hanzi: "可以", pinyin: "kěyǐ", meaning: "Có thể, được phép", examples: [{ hanzi: "我可以进来吗？", translation: "Tôi có thể vào được không?" }] },
  { id: 557, hanzi: "课", pinyin: "kè", meaning: "Bài học", examples: [{ hanzi: "我们今天有两节课。", translation: "Hôm nay chúng tôi có hai tiết học." }] },
  { id: 558, hanzi: "快", pinyin: "kuài", meaning: "Nhanh", examples: [{ hanzi: "他跑得真快！", translation: "Anh ấy chạy thật nhanh!" }] },
  { id: 559, hanzi: "快乐", pinyin: "kuàilè", meaning: "Vui vẻ", examples: [{ hanzi: "祝你生日快乐！", translation: "Chúc bạn sinh nhật vui vẻ!" }] },
  { id: 560, hanzi: "累", pinyin: "lèi", meaning: "Mệt", examples: [{ hanzi: "我今天很累。", translation: "Hôm nay tôi rất mệt." }] },
  { id: 561, hanzi: "离", pinyin: "lí", meaning: "Cách", examples: [{ hanzi: "学校离我家不远。", translation: "Trường học cách nhà tôi không xa." }] },
  { id: 562, hanzi: "两", pinyin: "liǎng", meaning: "Hai", examples: [{ hanzi: "我有两个苹果。", translation: "Tôi có hai quả táo." }] },
  { id: 563, hanzi: "路", pinyin: "lù", meaning: "Đường", examples: [{ hanzi: "这条路很宽。", translation: "Con đường này rất rộng." }] },
  { id: 564, hanzi: "旅游", pinyin: "lǚyóu", meaning: "Du lịch", examples: [{ hanzi: "我喜欢去旅游。", translation: "Tôi thích đi du lịch." }] },
  { id: 565, hanzi: "卖", pinyin: "mài", meaning: "Bán", examples: [{ hanzi: "这个商店卖水果。", translation: "Cửa hàng này bán hoa quả." }] },
  { id: 566, hanzi: "慢", pinyin: "màn", meaning: "Chậm", examples: [{ hanzi: "请说慢一点儿。", translation: "Xin hãy nói chậm một chút." }] },
  { id: 567, hanzi: "忙", pinyin: "máng", meaning: "Bận", examples: [{ hanzi: "你最近忙吗？", translation: "Gần đây bạn có bận không?" }] },
  { id: 568, hanzi: "每", pinyin: "měi", meaning: "Mỗi", examples: [{ hanzi: "我每天都跑步。", translation: "Tôi mỗi ngày đều chạy bộ." }] },
  { id: 569, hanzi: "妹妹", pinyin: "mèimei", meaning: "Em gái", examples: [{ hanzi: "我妹妹是学生。", translation: "Em gái tôi là học sinh." }] },
  { id: 570, hanzi: "门", pinyin: "mén", meaning: "Cửa", examples: [{ hanzi: "请关上门。", translation: "Xin hãy đóng cửa." }] },
  { id: 571, hanzi: "男人", pinyin: "nánrén", meaning: "Đàn ông", examples: [{ hanzi: "那个男人是谁？", translation: "Người đàn ông kia là ai?" }] },
  { id: 572, hanzi: "您", pinyin: "nín", meaning: "Ngài, ông, bà", examples: [{ hanzi: "您好！", translation: "Chào ngài!" }] },
  { id: 573, hanzi: "牛奶", pinyin: "niúnǎi", meaning: "Sữa bò", examples: [{ hanzi: "我喜欢喝牛奶。", translation: "Tôi thích uống sữa bò." }] },
  { id: 574, hanzi: "女人", pinyin: "nǚrén", meaning: "Phụ nữ", examples: [{ hanzi: "那个女人很漂亮。", translation: "Người phụ nữ kia rất xinh đẹp." }] },
  { id: 575, hanzi: "旁边", pinyin: "pángbiān", meaning: "Bên cạnh", examples: [{ hanzi: "银行就在邮局旁边。", translation: "Ngân hàng ở ngay bên cạnh bưu điện." }] },
  { id: 576, hanzi: "跑步", pinyin: "pǎobù", meaning: "Chạy bộ", examples: [{ hanzi: "他每天早上都去跑步。", translation: "Anh ấy mỗi buổi sáng đều đi chạy bộ." }] },
  { id: 577, hanzi: "便宜", pinyin: "piányi", meaning: "Rẻ", examples: [{ hanzi: "这里的衣服很便宜。", translation: "Quần áo ở đây rất rẻ." }] },
  { id: 578, hanzi: "票", pinyin: "piào", meaning: "Vé", examples: [{ hanzi: "我买了两张电影票。", translation: "Tôi đã mua hai vé xem phim." }] },
  { id: 579, hanzi: "妻子", pinyin: "qīzi", meaning: "Vợ", examples: [{ hanzi: "他的妻子是医生。", translation: "Vợ của anh ấy là bác sĩ." }] },
  { id: 580, hanzi: "起床", pinyin: "qǐchuáng", meaning: "Thức dậy", examples: [{ hanzi: "我每天七点起床。", translation: "Tôi mỗi ngày thức dậy lúc 7 giờ." }] },
  { id: 581, hanzi: "千", pinyin: "qiān", meaning: "Nghìn", examples: [{ hanzi: "这台电脑三千块。", translation: "Cái máy tính này 3000 đồng." }] },
  { id: 582, hanzi: "铅笔", pinyin: "qiānbǐ", meaning: "Bút chì", examples: [{ hanzi: "请借我一支铅笔。", translation: "Xin hãy cho tôi mượn một chiếc bút chì." }] },
  { id: 583, hanzi: "晴", pinyin: "qíng", meaning: "Trời trong", examples: [{ hanzi: "今天天气很晴。", translation: "Hôm nay thời tiết rất trong." }] },
  { id: 584, hanzi: "去年", pinyin: "qùnián", meaning: "Năm ngoái", examples: [{ hanzi: "我去年去了中国。", translation: "Năm ngoái tôi đã đi Trung Quốc." }] },
  { id: 585, hanzi: "让", pinyin: "ràng", meaning: "Nhường, để cho", examples: [{ hanzi: "请让我看看。", translation: "Xin hãy để tôi xem." }] },
  { id: 586, hanzi: "日", pinyin: "rì", meaning: "Ngày", examples: [{ hanzi: "今天是几月几日？", translation: "Hôm nay là ngày mấy tháng mấy?" }] },
  { id: 587, hanzi: "上班", pinyin: "shàngbān", meaning: "Đi làm", examples: [{ hanzi: "我爸爸每天开车去上班。", translation: "Bố tôi mỗi ngày lái xe đi làm." }] },
  { id: 588, hanzi: "身体", pinyin: "shēntǐ", meaning: "Sức khỏe, cơ thể", examples: [{ hanzi: "祝你身体健康！", translation: "Chúc bạn sức khỏe dồi dào!" }] },
  { id: 589, hanzi: "生病", pinyin: "shēngbìng", meaning: "Bị ốm", examples: [{ hanzi: "他生病了，不能来上课。", translation: "Anh ấy bị ốm rồi, không thể đến lớp." }] },
  { id: 590, hanzi: "生日", pinyin: "shēngrì", meaning: "Sinh nhật", examples: [{ hanzi: "你的生日是几月几号？", translation: "Sinh nhật của bạn là ngày mấy tháng mấy?" }] },
  { id: 591, hanzi: "时间", pinyin: "shíjiān", meaning: "Thời gian", examples: [{ hanzi: "我们没有时间了。", translation: "Chúng ta không có thời gian nữa rồi." }] },
  { id: 592, hanzi: "事情", pinyin: "shìqing", meaning: "Sự việc", examples: [{ hanzi: "你有什么事情吗？", translation: "Bạn có việc gì không?" }] },
  { id: 593, hanzi: "手表", pinyin: "shǒubiǎo", meaning: "Đồng hồ đeo tay", examples: [{ hanzi: "这块手表很漂亮。", translation: "Chiếc đồng hồ này rất đẹp." }] },
  { id: 594, hanzi: "手机", pinyin: "shǒujī", meaning: "Điện thoại di động", examples: [{ hanzi: "我的手机没电了。", translation: "Điện thoại của tôi hết pin rồi." }] },
  { id: 595, hanzi: "送", pinyin: "sòng", meaning: "Tặng, tiễn", examples: [{ hanzi: "我送你一个礼物。", translation: "Tôi tặng bạn một món quà." }] },
  { id: 596, hanzi: "虽然", pinyin: "suīrán", meaning: "Tuy rằng", examples: [{ hanzi: "虽然下雨了，但是我们还是要去。", translation: "Tuy trời mưa rồi, nhưng chúng tôi vẫn phải đi." }] },
  { id: 597, hanzi: "但是", pinyin: "dànshì", meaning: "Nhưng", examples: [{ hanzi: "我想去，但是没有时间。", translation: "Tôi muốn đi, nhưng không có thời gian." }] },
  { id: 598, hanzi: "它", pinyin: "tā", meaning: "Nó (chỉ vật)", examples: [{ hanzi: "小猫在哪儿？它在桌子下面。", translation: "Mèo con ở đâu? Nó ở dưới bàn." }] },
  { id: 599, hanzi: "踢足球", pinyin: "tī zúqiú", meaning: "Đá bóng", examples: [{ hanzi: "男孩子们都喜欢踢足球。", translation: "Các bạn nam đều thích đá bóng." }] },
  { id: 600, hanzi: "题", pinyin: "tí", meaning: "Câu hỏi, đề", examples: [{ hanzi: "这道题太难了。", translation: "Câu hỏi này khó quá." }] },
  { id: 601, hanzi: "跳舞", pinyin: "tiàowǔ", meaning: "Nhảy múa", examples: [{ hanzi: "她跳舞跳得很好。", translation: "Cô ấy nhảy rất đẹp." }] },
  { id: 602, hanzi: "外", pinyin: "wài", meaning: "Ngoài", examples: [{ hanzi: "外面很冷。", translation: "Bên ngoài rất lạnh." }] },
  { id: 603, hanzi: "完", pinyin: "wán", meaning: "Xong", examples: [{ hanzi: "我做完作业了。", translation: "Tôi làm xong bài tập rồi." }] },
  { id: 604, hanzi: "玩", pinyin: "wán", meaning: "Chơi", examples: [{ hanzi: "孩子们在公园里玩。", translation: "Bọn trẻ đang chơi trong công viên." }] },
  { id: 605, hanzi: "晚上", pinyin: "wǎnshang", meaning: "Buổi tối", examples: [{ hanzi: "你晚上有空吗？", translation: "Buổi tối bạn có rảnh không?" }] },
  { id: 606, hanzi: "万", pinyin: "wàn", meaning: "Vạn, mười nghìn", examples: [{ hanzi: "这个城市有一百万人。", translation: "Thành phố này có một triệu người." }] },
  { id: 607, hanzi: "为什么", pinyin: "wèi shénme", meaning: "Tại sao", examples: [{ hanzi: "你为什么不高兴？", translation: "Tại sao bạn không vui?" }] },
  { id: 608, hanzi: "问", pinyin: "wèn", meaning: "Hỏi", examples: [{ hanzi: "我想问一个问题。", translation: "Tôi muốn hỏi một câu hỏi." }] },
  { id: 609, hanzi: "问题", pinyin: "wèntí", meaning: "Vấn đề", examples: [{ hanzi: "我有一个问题。", translation: "Tôi có một vấn đề." }] },
  { id: 610, hanzi: "西瓜", pinyin: "xīguā", meaning: "Dưa hấu", examples: [{ hanzi: "夏天吃西瓜很舒服。", translation: "Mùa hè ăn dưa hấu rất dễ chịu." }] },
  { id: 611, hanzi: "希望", pinyin: "xīwàng", meaning: "Hy vọng", examples: [{ hanzi: "我希望明天是个好天气。", translation: "Tôi hy vọng ngày mai là một ngày thời tiết tốt." }] },
  { id: 612, hanzi: "洗", pinyin: "xǐ", meaning: "Rửa, giặt", examples: [{ hanzi: "吃饭前要洗手。", translation: "Trước khi ăn cơm phải rửa tay." }] },
  { id: 613, hanzi: "小时", pinyin: "xiǎoshí", meaning: "Tiếng đồng hồ", examples: [{ hanzi: "我等了你一个小时。", translation: "Tôi đã đợi bạn một tiếng đồng hồ." }] },
  { id: 614, hanzi: "笑", pinyin: "xiào", meaning: "Cười", examples: [{ hanzi: "他笑着对我说。", translation: "Anh ấy cười và nói với tôi." }] },
  { id: 615, hanzi: "新", pinyin: "xīn", meaning: "Mới", examples: [{ hanzi: "这是我的新衣服。", translation: "Đây là quần áo mới của tôi." }] },
  { id: 616, hanzi: "姓", pinyin: "xìng", meaning: "Họ", examples: [{ hanzi: "您贵姓？", translation: "Quý danh của ngài là gì?" }] },
  { id: 617, hanzi: "休息", pinyin: "xiūxi", meaning: "Nghỉ ngơi", examples: [{ hanzi: "工作累了，休息一下吧。", translation: "Làm việc mệt rồi, nghỉ ngơi một chút đi." }] },
  { id: 618, hanzi: "雪", pinyin: "xuě", meaning: "Tuyết", examples: [{ hanzi: "冬天这里会下雪。", translation: "Mùa đông ở đây sẽ có tuyết rơi." }] },
  { id: 619, hanzi: "颜色", pinyin: "yánsè", meaning: "Màu sắc", examples: [{ hanzi: "你喜欢什么颜色？", translation: "Bạn thích màu gì?" }] },
  { id: 620, hanzi: "眼睛", pinyin: "yǎnjing", meaning: "Mắt", examples: [{ hanzi: "她的眼睛很漂亮。", translation: "Mắt của cô ấy rất đẹp." }] },
  { id: 621, hanzi: "羊肉", pinyin: "yángròu", meaning: "Thịt dê", examples: [{ hanzi: "我不喜欢吃羊肉。", translation: "Tôi không thích ăn thịt dê." }] },
  { id: 622, hanzi: "药", pinyin: "yào", meaning: "Thuốc", examples: [{ hanzi: "你该吃药了。", translation: "Bạn nên uống thuốc rồi." }] },
  { id: 623, hanzi: "要", pinyin: "yào", meaning: "Cần, muốn", examples: [{ hanzi: "我要一杯咖啡。", translation: "Tôi muốn một cốc cà phê." }] },
  { id: 624, hanzi: "也", pinyin: "yě", meaning: "Cũng", examples: [{ hanzi: "他也是学生。", translation: "Anh ấy cũng là học sinh." }] },
  { id: 625, hanzi: "已经", pinyin: "yǐjīng", meaning: "Đã", examples: [{ hanzi: "我已经吃过饭了。", translation: "Tôi đã ăn cơm rồi." }] },
  { id: 626, hanzi: "一起", pinyin: "yìqǐ", meaning: "Cùng nhau", examples: [{ hanzi: "我们一起去吧。", translation: "Chúng ta cùng đi đi." }] },
  { id: 627, hanzi: "意思", pinyin: "yìsi", meaning: "Ý nghĩa", examples: [{ hanzi: "你明白我的意思吗？", translation: "Bạn có hiểu ý của tôi không?" }] },
  { id: 628, hanzi: "因为", pinyin: "yīnwèi", meaning: "Bởi vì", examples: [{ hanzi: "因为下雨，所以我们没去。", translation: "Bởi vì trời mưa, cho nên chúng tôi không đi." }] },
  { id: 629, hanzi: "所以", pinyin: "suǒyǐ", meaning: "Cho nên", examples: [{ hanzi: "因为下雨，所以我们没去。", translation: "Bởi vì trời mưa, cho nên chúng tôi không đi." }] },
  { id: 630, hanzi: "阴", pinyin: "yīn", meaning: "Âm u", examples: [{ hanzi: "今天天很阴。", translation: "Hôm nay trời rất âm u." }] },
  { id: 631, hanzi: "游泳", pinyin: "yóuyǒng", meaning: "Bơi", examples: [{ hanzi: "夏天我喜欢去游泳。", translation: "Mùa hè tôi thích đi bơi." }] },
  { id: 632, hanzi: "右边", pinyin: "yòubian", meaning: "Bên phải", examples: [{ hanzi: "洗手间在右边。", translation: "Nhà vệ sinh ở bên phải." }] },
  { id: 633, hanzi: "鱼", pinyin: "yú", meaning: "Cá", examples: [{ hanzi: "我喜欢吃鱼。", translation: "Tôi thích ăn cá." }] },
  { id: 634, hanzi: "远", pinyin: "yuǎn", meaning: "Xa", examples: [{ hanzi: "他家离这里很远。", translation: "Nhà anh ấy cách đây rất xa." }] },
  { id: 635, hanzi: "运动", pinyin: "yùndòng", meaning: "Vận động", examples: [{ hanzi: "多运动对身体好。", translation: "Vận động nhiều tốt cho sức khỏe." }] },
  { id: 636, hanzi: "再", pinyin: "zài", meaning: "Lại, nữa", examples: [{ hanzi: "请再说一遍。", translation: "Xin hãy nói lại một lần nữa." }] },
  { id: 637, hanzi: "早上", pinyin: "zǎoshang", meaning: "Buổi sáng", examples: [{ hanzi: "早上好！", translation: "Chào buổi sáng!" }] },
  { id: 638, hanzi: "丈夫", pinyin: "zhàngfu", meaning: "Chồng", examples: [{ hanzi: "她的丈夫是老师。", translation: "Chồng của cô ấy là giáo viên." }] },
  { id: 639, hanzi: "找", pinyin: "zhǎo", meaning: "Tìm", examples: [{ hanzi: "你在找什么？", translation: "Bạn đang tìm gì vậy?" }] },
  { id: 640, hanzi: "着", pinyin: "zhe", meaning: "Đang (trợ từ)", examples: [{ hanzi: "门开着呢。", translation: "Cửa đang mở đấy." }] },
  { id: 641, hanzi: "真", pinyin: "zhēn", meaning: "Thật", examples: [{ hanzi: "你真漂亮！", translation: "Bạn thật xinh đẹp!" }] },
  { id: 642, hanzi: "正在", pinyin: "zhèngzài", meaning: "Đang", examples: [{ hanzi: "我正在看书。", translation: "Tôi đang đọc sách." }] },
  { id: 643, hanzi: "知道", pinyin: "zhīdào", meaning: "Biết", examples: [{ hanzi: "我知道了。", translation: "Tôi biết rồi." }] },
  { id: 644, hanzi: "准备", pinyin: "zhǔnbèi", meaning: "Chuẩn bị", examples: [{ hanzi: "你准备好了吗？", translation: "Bạn chuẩn bị xong chưa?" }] },
  { id: 645, hanzi: "自行车", pinyin: "zìxíngchē", meaning: "Xe đạp", examples: [{ hanzi: "我骑自行车上学。", translation: "Tôi đi xe đạp đi học." }] },
  { id: 646, hanzi: "走", pinyin: "zǒu", meaning: "Đi", examples: [{ hanzi: "我们走吧。", translation: "Chúng ta đi thôi." }] },
  { id: 647, hanzi: "最", pinyin: "zuì", meaning: "Nhất", examples: [{ hanzi: "他是我最好的朋友。", translation: "Anh ấy là người bạn tốt nhất của tôi." }] },
  { id: 648, hanzi: "左边", pinyin: "zuǒbian", meaning: "Bên trái", examples: [{ hanzi: "银行在左边。", translation: "Ngân hàng ở bên trái." }] }
];