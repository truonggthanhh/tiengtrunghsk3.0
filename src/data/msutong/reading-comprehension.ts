export interface ReadingComprehensionQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface ReadingComprehensionPassage {
  id: number;
  lesson: number;
  bookSlug: string;
  title: string;
  passage: string;
  questions: ReadingComprehensionQuestion[];
}

export const msutongReadingComprehension: ReadingComprehensionPassage[] = [
  // MSUTONG 1 - ĐỌC HIỂU
  {
    id: 1006,
    lesson: 6,
    bookSlug: 'quyen-1',
    title: "Giới thiệu bản thân",
    passage: "马文是上海人,他在美国留学,学习英语。他认识一个美国朋友,叫高丽。高丽在大学学习汉语,她也是马文的英语老师。她有一个男朋友,叫大卫,他(她)是法国人,在中国工作,他是老师,在大学教法语。",
    questions: [
      {
        questionText: "马文是哪国人？",
        options: ["美国人", "中国人", "英国人", "法国人"],
        correctAnswerIndex: 1, // Based on "马文是上海人" (Shanghai is in China)
        explanation: "马文 là người Thượng Hải, Thượng Hải ở Trung Quốc."
      },
      {
        questionText: "高丽在大学学习什么？",
        options: ["英语", "法语", "汉语", "日语"],
        correctAnswerIndex: 2,
        explanation: "高丽 nói '在大学学习汉语' (học tiếng Hán ở đại học)."
      },
      {
        questionText: "大卫是哪国人？",
        options: ["美国人", "中国人", "英国人", "法国人"],
        correctAnswerIndex: 3,
        explanation: "Đại Vệ là người Pháp."
      }
    ]
  },
  {
    id: 1007,
    lesson: 7,
    bookSlug: 'quyen-1',
    title: "Tìm đường đến ngân hàng",
    passage: "我们大学附近有一家书店、一家超市和一家中国饭店。书店在大学对面。超市在书店后面。饭店在超市对面。饭店的名字叫四川饭店,常常有很多中国学生和留学生。大学附近没有银行,银行很远。",
    questions: [
      {
        questionText: "Đại học gần những địa điểm nào?",
        options: ["Chỉ có hiệu sách", "Hiệu sách, siêu thị và nhà hàng Trung Quốc", "Chỉ có siêu thị và nhà hàng", "Không có gì cả"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '我们大学附近有一家书店、一家超市和一家中国饭店'."
      },
      {
        questionText: "Siêu thị nằm ở đâu?",
        options: ["Đối diện đại học", "Sau hiệu sách", "Đối diện nhà hàng", "Gần ngân hàng"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '超市在书店后面'."
      },
      {
        questionText: "Có ngân hàng gần đại học không?",
        options: ["Có", "Không", "Không rõ", "Chỉ có ngân hàng Trung Quốc"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '大学附近没有银行'."
      }
    ]
  },
  {
    id: 1008,
    lesson: 8,
    bookSlug: 'quyen-1',
    title: "Sinh nhật Văn Lệ",
    passage: "今天是文丽的生日,因为今天是她的生日,她的美国朋友海伦请她喝咖啡,中国朋友小明请她吃饭。英国朋友欧文请她看电影,她很高兴。星期六晚上他们都一起去。",
    questions: [
      {
        questionText: "Ai mời Văn Lệ uống cà phê?",
        options: ["Tiểu Minh", "Helen", "Owen", "Không ai cả"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '她的美国朋友海伦请她喝咖啡'."
      },
      {
        questionText: "Văn Lệ sẽ đi đâu vào tối thứ Bảy?",
        options: ["Uống cà phê", "Ăn cơm", "Xem phim", "Tất cả các hoạt động trên"],
        correctAnswerIndex: 3,
        explanation: "Đoạn văn nói '星期六晚上他们都一起去', ngụ ý họ sẽ cùng nhau tham gia các hoạt động đã được mời."
      }
    ]
  },
  {
    id: 1009,
    lesson: 9,
    bookSlug: 'quyen-1',
    title: "Đi ăn món Tứ Xuyên",
    passage: "我和朋友今天都很想吃中国菜,可是今天我们都没空,我们想明天去四川饭店。那家饭店很有名,那儿的菜又好吃又便宜。饭店很远,在人民公园附近,那儿没有地铁,坐出租车太贵了,我们想坐公交车去。",
    questions: [
      {
        questionText: "Họ muốn đi ăn món gì?",
        options: ["Món Hàn Quốc", "Món Nhật Bản", "Món Trung Quốc", "Món Pháp"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '我和朋友今天都很想吃中国菜'."
      },
      {
        questionText: "Nhà hàng Tứ Xuyên có đặc điểm gì?",
        options: ["Đắt và không ngon", "Nổi tiếng, ngon và rẻ", "Gần và có tàu điện ngầm", "Không nổi tiếng"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '那家饭店很有名,那儿的菜又好吃又便宜'."
      },
      {
        questionText: "Họ dự định đi đến nhà hàng bằng phương tiện gì?",
        options: ["Taxi", "Tàu điện ngầm", "Xe buýt", "Đi bộ"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '坐出租车太贵了,我们想坐公交车去'."
      }
    ]
  },
  {
    id: 1010,
    lesson: 10,
    bookSlug: 'quyen-1',
    title: "Giới thiệu về Minh Kinh",
    passage: "你们好!我叫明京,我是韩国留学生。我今年二十三岁,在中国学习汉语。我很喜欢汉语,也喜欢中国菜,还喜欢看中国电影。我家有五口人,我爸爸、妈妈、哥哥、姐姐和我。我没有弟弟、妹妹。我哥哥在银行工作,姐姐在超市工作。他们都在韩国。我爸爸、妈妈在中国工作,他们的公司在上海。我有很多朋友,我很喜欢他们。",
    questions: [
      {
        questionText: "Minh Kinh là người nước nào?",
        options: ["Trung Quốc", "Mỹ", "Hàn Quốc", "Nhật Bản"],
        correctAnswerIndex: 2,
        explanation: "Minh Kinh nói '我是韩国留学生' (Tôi là lưu học sinh Hàn Quốc)."
      },
      {
        questionText: "Bố mẹ của Minh Kinh làm việc ở đâu?",
        options: ["Hàn Quốc", "Trung Quốc", "Mỹ", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '我爸爸、妈妈在中国工作'."
      },
      {
        questionText: "Gia đình Minh Kinh có bao nhiêu người?",
        options: ["Bốn", "Năm", "Sáu", "Bảy"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '我家有五口人'."
      }
    ]
  },

  // MSUTONG 2 - ĐỌC HIỂU
  {
    id: 2001,
    lesson: 1,
    bookSlug: 'quyen-2',
    title: "Sở thích của Điền Lệ",
    passage: "我有一个好朋友,她叫田丽。她是中国人,现在在中国音乐学院学习汉语。她今年20岁。她喜欢唱歌、跳舞,还喜欢听音乐。她喜欢听中国音乐,唱中国歌,她常常一边唱歌,一边跳舞。可是,她不喜欢打球,也不喜欢看电视。她常常在家听音乐、唱歌、学汉语。我们周末常常一起吃饭、看电影。",
    questions: [
      {
        questionText: "Điền Lệ đang học gì ở Học viện Âm nhạc Trung Quốc?",
        options: ["Tiếng Anh", "Tiếng Pháp", "Tiếng Hán", "Tiếng Nhật"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '现在在中国音乐学院学习汉语'."
      },
      {
        questionText: "Điền Lệ thích những hoạt động nào?",
        options: ["Hát, nhảy và nghe nhạc", "Chơi bóng và xem tivi", "Chỉ hát và nhảy", "Chỉ nghe nhạc"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '她喜欢唱歌、跳舞,还喜欢听音乐'."
      },
      {
        questionText: "Điền Lệ không thích làm gì?",
        options: ["Chơi bóng", "Nghe nhạc", "Hát", "Học tiếng Hán"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '她不喜欢打球,也不喜欢看电视'."
      }
    ]
  },
  {
    id: 2002,
    lesson: 2,
    bookSlug: 'quyen-2',
    title: "Thói quen sinh hoạt của lưu học sinh",
    passage: "田中、大卫和欧文都是留学生。他们是同学,平时一起上课,一起吃饭。田中每天六点半起床,晚上十点左右睡觉,因为他喜欢早睡早起。大卫每天七点三刻起床,晚上十二点多睡觉,他喜欢晚睡晚起。欧文每天七点半起床,晚上十一点左右,有时候十二点才睡觉。他们每天中午十二点一起吃饭。大卫和欧文周末常常一起打球。",
    questions: [
      {
        questionText: "Ai thích dậy sớm và ngủ sớm?",
        options: ["Tanaka", "David", "Owen", "Tất cả"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '田中每天六点半起床,晚上十点左右睡觉,因为他喜欢早睡早起'."
      },
      {
        questionText: "David thường dậy lúc mấy giờ?",
        options: ["6:30", "7:00", "7:45", "8:00"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '大卫每天七点三刻起床' (7 giờ 3 khắc = 7:45)."
      },
      {
        questionText: "Ai thường chơi bóng vào cuối tuần?",
        options: ["Tanaka và David", "David và Owen", "Tanaka và Owen", "Tất cả"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '大卫和欧文周末常常一起打球'."
      }
    ]
  },
  {
    id: 2003,
    lesson: 3,
    bookSlug: 'quyen-2',
    title: "David muốn tìm bạn gái",
    passage: "欧文和大卫是好朋友,都在中国学习汉语。欧文的汉语很好,因为他的女朋友是中国人,常常教他汉语。大卫没有女朋友,他也想找一个中国女朋友。欧文的女朋友有一个妹妹,叫王小文,很漂亮。大卫认识小文,想做她的男朋友。他想给小文打电话,请她看电影。",
    questions: [
      {
        questionText: "Tại sao tiếng Hán của Owen rất tốt?",
        options: ["Anh ấy học rất chăm chỉ", "Bạn gái anh ấy là người Trung Quốc và thường dạy anh ấy", "Anh ấy sống ở Trung Quốc", "Anh ấy có năng khiếu"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '欧文的汉语很好,因为他的女朋友是中国人,常常教他汉语'."
      },
      {
        questionText: "David muốn làm gì với Tiểu Văn?",
        options: ["Mời cô ấy uống cà phê", "Mời cô ấy ăn cơm", "Mời cô ấy xem phim", "Mời cô ấy đi du lịch"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '他想给小文打电话,请她看电影'."
      }
    ]
  },
  {
    id: 2004,
    lesson: 4,
    bookSlug: 'quyen-2',
    title: "Mua sắm quần áo",
    passage: "李美京、黄文丽和海伦是好朋友,她们平时常常一起学习,周末有时候一起看电影,一起喝咖啡。这个星期天,她们一起去买衣服。李美京想买衬衫,她不知道买什么颜色的,黄色的那件,她觉得太大了,红色的那件,她觉得不错。黄文丽想买一条裤子,她喜欢那条黑色的,可是觉得太贵了,想买那条蓝色的,又觉得大小不合适。海伦买了一双白色的鞋,很好看,也不贵,她很高兴。",
    questions: [
      {
        questionText: "Vào Chủ Nhật này, họ đi đâu?",
        options: ["Đi xem phim", "Đi uống cà phê", "Đi mua quần áo", "Đi học"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '这个星期天,她们一起去买衣服'."
      },
      {
        questionText: "Lý Mỹ Kinh cuối cùng đã mua chiếc áo sơ mi màu gì?",
        options: ["Màu vàng", "Màu đỏ", "Màu đen", "Không mua"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '黄色的那件,她觉得太大了,红色的那件,她觉得不错', ngụ ý cô ấy chọn chiếc màu đỏ."
      },
      {
        questionText: "Tại sao Hoàng Văn Lệ không mua chiếc quần màu đen?",
        options: ["Nó quá nhỏ", "Nó quá đắt", "Nó không đẹp", "Nó không hợp"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '她喜欢那条黑色的,可是觉得太贵了'."
      }
    ]
  },
  {
    id: 2005,
    lesson: 5,
    bookSlug: 'quyen-2',
    title: "Bạn bè của Tanaka",
    passage: "田中有很多朋友,有中国人、英国人、韩国人。他常常跟他们一起玩儿。高小明很喜欢打篮球,田中常常跟他一起打;欧文喜欢旅行,田中常常跟他一起去;美京很喜欢买东西,田中周末跟她一起去超市;海伦喜欢学习,田中有时候跟她一起去图书馆,跟她一起学习汉语。田中很喜欢他们。",
    questions: [
      {
        questionText: "Tanaka có những người bạn đến từ đâu?",
        options: ["Chỉ Trung Quốc", "Trung Quốc, Anh, Hàn Quốc", "Chỉ Anh và Hàn Quốc", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '田中有很多朋友,有中国人、英国人、韩国人'."
      },
      {
        questionText: "Ai thường đi du lịch cùng Tanaka?",
        options: ["Cao Tiểu Minh", "Owen", "Mỹ Kinh", "Helen"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '欧文喜欢旅行,田中常常跟他一起去'."
      },
      {
        questionText: "Ai thường đi siêu thị cùng Tanaka vào cuối tuần?",
        options: ["Cao Tiểu Minh", "Owen", "Mỹ Kinh", "Helen"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '美京很喜欢买东西,田中周末跟她一起去超市'."
      }
    ]
  },
  {
    id: 2006,
    lesson: 6,
    bookSlug: 'quyen-2',
    title: "Tham quan bảo tàng",
    passage: "上个星期天,大卫和田中去参观了博物馆。那家博物馆很大,有很多好玩儿的东西。博物馆的门票很便宜。他们还想去一次。下午他们看了一个英国电影,电影票真贵,他们不太喜欢,看的人不多。晚上他们去吃了中国菜。那家饭店叫小四川,饭店的菜很好吃,他们很爱吃四川菜,吃了很多。",
    questions: [
      {
        questionText: "David và Tanaka đã đi đâu vào Chủ Nhật tuần trước?",
        options: ["Đi xem phim", "Đi ăn tối", "Đi bảo tàng", "Đi mua sắm"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '上个星期天,大卫和田中去参观了博物馆'."
      },
      {
        questionText: "Họ cảm thấy thế nào về bộ phim Anh?",
        options: ["Rất thích", "Không thích lắm", "Rất hay", "Rất rẻ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '电影票真贵,他们不太喜欢,看的人不多'."
      },
      {
        questionText: "Món ăn ở nhà hàng Tiểu Tứ Xuyên như thế nào?",
        options: ["Không ngon", "Rất ngon", "Rất đắt", "Không có nhiều người ăn"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '饭店的菜很好吃,他们很爱吃四川菜,吃了很多'."
      }
    ]
  },
  {
    id: 2007,
    lesson: 7,
    bookSlug: 'quyen-2',
    title: "Helen đi du lịch Hải Nam",
    passage: "海伦去海南旅行了。她是跟男朋友一起从上海坐飞机去的。从上海到海南要两个半小时,他们觉得很快。他们很喜欢海南,在那儿玩了两天。他们在海边拍了很多照片。在飞机上,他们还认识了两个中国朋友,他们一起在海南玩了两天。海伦觉得海南很有意思。",
    questions: [
      {
        questionText: "Helen đi du lịch Hải Nam với ai?",
        options: ["Bạn bè", "Gia đình", "Bạn trai", "Một mình"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '她是跟男朋友一起从上海坐飞机去的'."
      },
      {
        questionText: "Họ đã đi đến Hải Nam bằng phương tiện gì?",
        options: ["Tàu hỏa", "Xe buýt", "Máy bay", "Ô tô"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '从上海坐飞机去的'."
      },
      {
        questionText: "Họ đã làm gì ở Hải Nam?",
        options: ["Chụp ảnh ở bờ biển", "Đi mua sắm", "Đi thăm bảo tàng", "Đi ăn món Tứ Xuyên"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '他们在海边拍了很多照片'."
      }
    ]
  },
  {
    id: 2008,
    lesson: 8,
    bookSlug: 'quyen-2',
    title: "Helen đến nhà Mỹ Kinh ăn cơm",
    passage: "海伦昨天去美京家吃饭了。美京很会做菜,昨天做的三个韩国菜都很好吃,海伦吃了很多。美京很聪明,除了会做菜以外,还会自己做红酒,她做了两瓶红酒。海伦尝了一下,味道非常好喝。她平时只喝一点儿酒,可是昨天喝了一大杯。美京和海伦每个星期五和星期三都一起去图书馆学习,除了学习以外,还常常一起玩儿。她们是好朋友。",
    questions: [
      {
        questionText: "Mỹ Kinh đã làm món ăn nước nào?",
        options: ["Món Trung Quốc", "Món Hàn Quốc", "Món Nhật Bản", "Món Pháp"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '昨天做的三个韩国菜都很好吃'."
      },
      {
        questionText: "Ngoài nấu ăn, Mỹ Kinh còn biết làm gì?",
        options: ["Làm bánh", "Làm rượu vang", "Làm trà sữa", "Làm cà phê"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '除了会做菜以外,还会自己做红酒'."
      },
      {
        questionText: "Helen và Mỹ Kinh thường đi đâu để học?",
        options: ["Thư viện", "Trường học", "Nhà riêng", "Quán cà phê"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '美京和海伦每个星期五和星期三都一起去图书馆学习'."
      }
    ]
  },
  {
    id: 2009,
    lesson: 9,
    bookSlug: 'quyen-2',
    title: "Kế hoạch cuối tuần",
    passage: "田中、欧文和文丽是好朋友,这个周末他们一起去玩儿,去哪儿呢?欧文很喜欢动物,他想去郊区的动物园看熊猫,因为他没去过,可是田中和文丽都不感兴趣,他们都不想去。田中建议去吃烤鸭,可是文丽说上个星期吃过,不喜欢烤鸭的味道。文丽打算去看京剧,欧文和田中也去过,但是还想去,田中也感兴趣。他们决定一起去。",
    questions: [
      {
        questionText: "Owen muốn đi đâu vào cuối tuần?",
        options: ["Đi xem kịch", "Đi ăn vịt quay", "Đi sở thú xem gấu trúc", "Đi du lịch"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '欧文很喜欢动物,他想去郊区的动物园看熊猫'."
      },
      {
        questionText: "Tại sao Văn Lệ không muốn ăn vịt quay?",
        options: ["Cô ấy không thích vịt quay", "Cô ấy đã ăn vào tuần trước", "Nó quá đắt", "Nó không ngon"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '文丽说上个星期吃过,不喜欢烤鸭的味道'."
      },
      {
        questionText: "Cuối cùng họ quyết định đi đâu?",
        options: ["Đi sở thú", "Đi ăn vịt quay", "Đi xem kịch", "Đi du lịch"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '文丽打算去看京剧,欧文和田中也去过,但是还想去,田中也感兴趣。他们决定一起去'."
      }
    ]
  },
  // Bài 10 của Quyển 2 có vẻ là bài ôn tập tổng hợp, không có đoạn đọc hiểu riêng.
  // Tôi sẽ bỏ qua bài 10 của quyển 2 vì không có nội dung đọc hiểu cụ thể.

  // MSUTONG 3 - ĐỌC HIỂU
  {
    id: 3001,
    lesson: 1,
    bookSlug: 'quyen-3',
    title: "Nhà của Tiểu Minh",
    passage: "小明的家在大城市,交通和生活都非常方便。他家的左边是一家超市,右边是一家商店,再右边是一家银行。小明家离书店也很近,书店就在他家的前边。小明常常去这家书店买书。小明家的后面是咖啡店,再后面是小学。小明的爸爸在面包店工作,那家店就在超市的左边。他爸爸去工作太方便了。对了,小明家附近还有一家四川饭店,那家饭店在面包店后边。小明一家人常常去那儿吃饭。",
    questions: [
      {
        questionText: "Nhà của Tiểu Minh ở đâu?",
        options: ["Nông thôn", "Thành phố lớn", "Thị trấn nhỏ", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '小明的家在大城市'."
      },
      {
        questionText: "Hiệu sách nằm ở đâu so với nhà Tiểu Minh?",
        options: ["Bên trái", "Bên phải", "Phía trước", "Phía sau"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '书店就在他家的前边'."
      },
      {
        questionText: "Bố của Tiểu Minh làm việc ở đâu?",
        options: ["Siêu thị", "Cửa hàng", "Tiệm bánh", "Ngân hàng"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '小明的爸爸在面包店工作'."
      }
    ]
  },
  {
    id: 3002,
    lesson: 2,
    bookSlug: 'quyen-3',
    title: "Helen học dùng điện thoại",
    passage: "海伦刚刚买了手机,还不(会)用。她的好朋友高小明用微信帮她买了SIM卡。海伦不知道在哪儿买充值卡,也不会给手机充值。高小明在网上给她充了一百块钱。现在海伦的手机已经可以用了。高小明还给她的手机下了微信APP,可是海伦不会用汉语发微信。高小明教海伦用拼音输入法,海伦觉得不太容易。现在海伦加了高小明的微信,是他的微信好友了。",
    questions: [
      {
        questionText: "Ai đã giúp Helen mua SIM card và nạp tiền?",
        options: ["Bạn trai", "Tiểu Minh", "Giáo viên", "Không ai cả"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '她的好朋友高小明用微信帮她买了SIM卡' và '高小明在网上给她充了一百块钱'."
      },
      {
        questionText: "Helen cảm thấy thế nào khi học cách gõ tiếng Hán bằng pinyin?",
        options: ["Rất dễ", "Không quá dễ", "Rất khó", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '海伦觉得不太容易'."
      },
      {
        questionText: "Helen đã làm gì sau khi điện thoại có thể dùng được?",
        options: ["Gọi điện cho bạn bè", "Tải WeChat APP", "Mua thêm thẻ nạp", "Đi mua sắm"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '高小明还给她的手机下了微信APP'."
      }
    ]
  },
  {
    id: 3003,
    lesson: 3,
    bookSlug: 'quyen-3',
    title: "Tanaka bị ốm",
    passage: "田中身体不舒服,头疼、拉肚子,有点儿发烧,没有胃口。昨天只吃了一顿饭。他去学校附近的医院看病。那家医院不大,看病的人非常多。医生给田中量了一下体温,说可能是因为田中吃的水果不新鲜。田中需要吃药、打针。现在田中每天吃两次药,去医院打一次针。不过,两天了,他还是不想吃饭。后天有比赛,怎么办?田中很担心,有没有一吃就好的药呢?",
    questions: [
      {
        questionText: "Tanaka có những triệu chứng gì?",
        options: ["Đau đầu, tiêu chảy, sốt, chán ăn", "Đau bụng, ho, sốt", "Đau họng, sổ mũi, mệt mỏi", "Đau đầu, mệt mỏi, không ngủ được"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '头疼、拉肚子,有点儿发烧,没有胃口'."
      },
      {
        questionText: "Bác sĩ nói Tanaka bị ốm có thể là do nguyên nhân gì?",
        options: ["Ăn quá nhiều", "Ăn đồ ăn không sạch", "Ăn trái cây không tươi", "Uống nước lạnh"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '说可能是因为田中吃的水果不新鲜'."
      },
      {
        questionText: "Tanaka đang lo lắng về điều gì?",
        options: ["Không có tiền mua thuốc", "Không có ai chăm sóc", "Không thể tham gia trận đấu", "Không thể ăn cơm"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '后天有比赛,怎么办?田中很担心'."
      }
    ]
  },
  {
    id: 3004,
    lesson: 4,
    bookSlug: 'quyen-3',
    title: "Tiệc sinh nhật của Tanaka",
    passage: "明天是田中的生日,很多朋友要来参加他的生日聚会。在哪儿吃饭呢?高小明建议田中请大家吃四川菜,他给田中介绍了一家很有(人气)的四川饭店。四川菜非常辣,但是,田中觉得应该让大家尝尝。他让小明马上给饭店打电话预约,自己发微信告诉朋友聚会的时间和地方。",
    questions: [
      {
        questionText: "Ngày mai là sinh nhật của ai?",
        options: ["Tiểu Minh", "Tanaka", "Văn Lệ", "Helen"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '明天是田中的生日'."
      },
      {
        questionText: "Tiểu Minh đã giới thiệu nhà hàng nào?",
        options: ["Nhà hàng Hàn Quốc", "Nhà hàng Nhật Bản", "Nhà hàng Tứ Xuyên", "Nhà hàng Pháp"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '他给田中介绍了一家很有(人气)的四川饭店'."
      },
      {
        questionText: "Tanaka đã làm gì để thông báo cho bạn bè về bữa tiệc?",
        options: ["Gọi điện thoại", "Gửi tin nhắn WeChat", "Gửi email", "Gửi thư tay"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '自己发微信告诉朋友聚会的时间和地方'."
      }
    ]
  },
  {
    id: 3005,
    lesson: 5,
    bookSlug: 'quyen-3',
    title: "Helen ở Trung Quốc",
    passage: "海伦来中国留学以前,没有学过汉语。刚来中国的时候,她没有中国朋友,不会买东西,不知道怎么坐公交车,生活很不习惯,现在都习惯了。在中国,海伦从星期一到星期五学习,周末去超市买东西,或者跟朋友一起玩儿。来中国快半年了,朋友们都说她瘦了,可是,海伦说自己胖了,因为越来越了解中国了,汉语越来越好了,朋友越来越多了。",
    questions: [
      {
        questionText: "Trước khi đến Trung Quốc, Helen đã học tiếng Hán chưa?",
        options: ["Rồi", "Chưa", "Không rõ", "Một chút"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '海伦来中国留学以前,没有学过汉语'."
      },
      {
        questionText: "Khi mới đến Trung Quốc, Helen gặp khó khăn gì?",
        options: ["Không có bạn bè Trung Quốc, không biết mua đồ, không biết đi xe buýt", "Không có tiền, không có chỗ ở", "Không thích đồ ăn Trung Quốc", "Không thích thời tiết Trung Quốc"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '她没有中国朋友,不会买东西,不知道怎么坐公交车,生活很不习惯'."
      },
      {
        questionText: "Tại sao Helen nói mình béo lên?",
        options: ["Cô ấy ăn quá nhiều", "Cô ấy ít vận động", "Cô ấy ngày càng hiểu Trung Quốc hơn, tiếng Hán tốt hơn và có nhiều bạn hơn", "Cô ấy thích đồ ăn Trung Quốc"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '海伦说自己胖了,因为越来越了解中国了,汉语越来越好了,朋友越来越多了'."
      }
    ]
  },
  {
    id: 3006,
    lesson: 6,
    bookSlug: 'quyen-3',
    title: "Giới thiệu bạn gái Tiểu Vương",
    passage: "今天小王穿得很帅,要去跟他女朋友见面。你认识他的女朋友吗?我给你介绍一下:她个子高高的,瘦瘦的,皮肤白白的,头发长长的,眼睛大大的,长得非常漂亮。她唱歌唱得很好听,球也打得很不错。我说得很详细吧。",
    questions: [
      {
        questionText: "Bạn gái của Tiểu Vương có đặc điểm ngoại hình nào?",
        options: ["Thấp, béo, da đen", "Cao, gầy, da trắng, tóc dài, mắt to", "Trung bình, tóc ngắn, mắt nhỏ", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn mô tả '她个子高高的,瘦瘦的,皮肤白白的,头发长长的,眼睛大大的,长得非常漂亮'."
      },
      {
        questionText: "Bạn gái của Tiểu Vương có tài năng gì?",
        options: ["Nấu ăn ngon", "Hát hay và chơi bóng giỏi", "Vẽ đẹp", "Nói tiếng Anh lưu loát"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '她唱歌唱得很好听,球也打得很不错'."
      }
    ]
  },
  {
    id: 3007,
    lesson: 7,
    bookSlug: 'quyen-3',
    title: "Lần đầu đi xe buýt ở Trung Quốc",
    passage: "卡玛拉第一次在中国坐公交车。公交车来了以后,大家应该从前门上去,投币或者刷公交卡,下车的时候,大家应该从后门下去。在车上,年轻人看到老人上车会起来,让老人坐。下车时,一般也会让老人先下去。",
    questions: [
      {
        questionText: "Khi lên xe buýt ở Trung Quốc, mọi người nên làm gì?",
        options: ["Lên từ cửa sau", "Lên từ cửa trước và trả tiền bằng tiền xu hoặc thẻ", "Lên từ cửa trước và không cần trả tiền", "Lên từ cửa giữa"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '大家应该从前门上去,投币或者刷公交卡'."
      },
      {
        questionText: "Khi có người già lên xe, người trẻ nên làm gì?",
        options: ["Giả vờ ngủ", "Đứng dậy nhường chỗ", "Không làm gì cả", "Yêu cầu người già đứng"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '年轻人看到老人上车会起来,让老人坐'."
      }
    ]
  },
  {
    id: 3008,
    lesson: 8,
    bookSlug: 'quyen-3',
    title: "Owen học kéo đàn nhị",
    passage: "欧文的中国朋友上个周末请欧文去了音乐会。欧文听了二胡演奏以后,对二胡特别有兴趣,很想学习拉二胡。他的中国朋友知道以后,送了他一把新二胡,但没有时间教他。欧文发短信问王文丽,有没有会拉二胡的中国学生,他想教中国学生英语,请中国学生教他拉二胡,不用付学费。王文丽说,下个星期告诉他结果。",
    questions: [
      {
        questionText: "Owen đã đi đâu vào cuối tuần trước?",
        options: ["Đi xem phim", "Đi nghe hòa nhạc", "Đi ăn tối", "Đi mua sắm"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '欧文的中国朋友上个周末请欧文去了音乐会'."
      },
      {
        questionText: "Tại sao Owen muốn học kéo đàn nhị?",
        options: ["Anh ấy thích âm nhạc Trung Quốc", "Bạn bè anh ấy đều biết chơi", "Anh ấy rất hứng thú sau khi nghe biểu diễn", "Anh ấy muốn trở thành nhạc sĩ"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '欧文听了二胡演奏以后,对二胡特别有兴趣'."
      },
      {
        questionText: "Owen muốn đổi lấy việc học kéo đàn nhị bằng cách nào?",
        options: ["Trả tiền học phí", "Dạy tiếng Anh cho học sinh Trung Quốc", "Giúp đỡ bạn bè", "Không cần trả gì cả"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '他想教中国学生英语,请中国学生教他拉二胡,不用付学费'."
      }
    ]
  },
  {
    id: 3009,
    lesson: 9,
    bookSlug: 'quyen-3',
    title: "Thời tiết ở Vân Nam",
    passage: "春节我跟中国朋友一起去了他的老家云南。现在是冬天,可是在云南,跟春天一样,非常暖和。听说那里的夏天也很舒服,最高温度只有30度左右。云南一年四季的天气都很好,雨下得不多,风也不大。冬天不下雪,夏天不刮台风。云南一年的温度都差不多,真是个好地方。",
    questions: [
      {
        questionText: "Người nói đã đi đâu vào dịp Tết Nguyên đán?",
        options: ["Bắc Kinh", "Thượng Hải", "Vân Nam", "Hải Nam"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '春节我跟中国朋友一起去了他的老家云南'."
      },
      {
        questionText: "Thời tiết ở Vân Nam vào mùa đông như thế nào?",
        options: ["Rất lạnh và có tuyết", "Ấm áp như mùa xuân", "Mưa nhiều và gió lớn", "Khô hanh"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '现在是冬天,可是在云南,跟春天一样,非常暖和'."
      },
      {
        questionText: "Nhiệt độ cao nhất vào mùa hè ở Vân Nam khoảng bao nhiêu?",
        options: ["Dưới 20 độ", "Khoảng 25 độ", "Khoảng 30 độ", "Trên 35 độ"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '最高温度只有30度左右'."
      }
    ]
  },
  // Bài 10 của Quyển 3 là bài ôn tập tổng hợp, không có đoạn đọc hiểu riêng.

  // MSUTONG 4 - ĐỌC HIỂU
  {
    id: 4001,
    lesson: 1,
    bookSlug: 'quyen-4',
    title: "Kế hoạch nghỉ lễ Trung Thu",
    passage: "中秋节快到了,放一天假。因为中秋节是星期五,可以休息三天。欧文打算星期五和星期六开车去旅行,旅行回来以后在家睡一天觉。卡玛拉的朋友热情地请她去玩儿,她打算星期五早上就去朋友家,晚上回来。然后星期六下午打球,星期天在家复习。海伦要参加HSK考试,每天在家学习。金美京感冒了,想在宿舍休息。",
    questions: [
      {
        questionText: "Kỳ nghỉ Trung Thu kéo dài bao nhiêu ngày?",
        options: ["Một ngày", "Hai ngày", "Ba ngày", "Bốn ngày"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '放一天假。因为中秋节是星期五,可以休息三天'."
      },
      {
        questionText: "Owen dự định làm gì sau khi đi du lịch về?",
        options: ["Đi chơi với bạn bè", "Ngủ một ngày ở nhà", "Đi học", "Đi làm thêm"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '旅行回来以后在家睡一天觉'."
      },
      {
        questionText: "Helen sẽ làm gì trong kỳ nghỉ?",
        options: ["Đi du lịch", "Đi chơi với bạn bè", "Học để thi HSK", "Nghỉ ngơi ở ký túc xá"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '海伦要参加HSK考试,每天在家学习'."
      }
    ]
  },
  {
    id: 4002,
    lesson: 2,
    bookSlug: 'quyen-4',
    title: "Tiểu Minh tìm việc",
    passage: "高小明快大学毕业了,在找工作。他给很多公司发了简历,有公司让他今天上午十点去面试。这是一家英国公司,需要用英语面试。小明非常紧张,昨晚没有睡好觉,早上又看错了时间,六点就起来了。我有点儿担心,让他面试完了以后,给我打个电话。希望他能找到满意的工作。",
    questions: [
      {
        questionText: "Tiểu Minh đang làm gì?",
        options: ["Đi học", "Tìm việc", "Đi du lịch", "Nghỉ ngơi"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '高小明快大学毕业了,在找工作'."
      },
      {
        questionText: "Công ty yêu cầu Tiểu Minh phỏng vấn bằng ngôn ngữ nào?",
        options: ["Tiếng Trung", "Tiếng Anh", "Tiếng Pháp", "Tiếng Nhật"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '这是一家英国公司,需要用英语面试'."
      },
      {
        questionText: "Tại sao Tiểu Minh lại dậy sớm?",
        options: ["Anh ấy muốn tập thể dục", "Anh ấy xem nhầm giờ", "Anh ấy muốn học bài", "Anh ấy muốn đi làm sớm"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '早上又看错了时间,六点就起来了'."
      }
    ]
  },
  {
    id: 4003,
    lesson: 3,
    bookSlug: 'quyen-4',
    title: "Chuyện của cô Hoàng",
    passage: "黄老师的家在20楼,今天中午快递员送快递来的时候电梯坏了。快递有30多公斤,快递员打电话告诉黄老师不能送上去,下午再送过来。下午快递员来的时候,电梯已经修好了。黄老师收到快递以后,跟快递员一起坐电梯下来,她想开信箱取报纸。不过,今天的报纸还没有送过来,一会儿还得下来看看。",
    questions: [
      {
        questionText: "Nhà cô Hoàng ở tầng mấy?",
        options: ["Tầng 10", "Tầng 20", "Tầng 30", "Tầng 40"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '黄老师的家在20楼'."
      },
      {
        questionText: "Tại sao nhân viên giao hàng không thể giao hàng vào buổi trưa?",
        options: ["Vì cô Hoàng không có nhà", "Vì thang máy bị hỏng", "Vì hàng quá nặng", "Vì không tìm thấy địa chỉ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '快递员送快递来的时候电梯坏了'."
      },
      {
        questionText: "Cô Hoàng muốn lấy gì từ hộp thư?",
        options: ["Thư", "Tạp chí", "Báo", "Bưu kiện"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '她想开信箱取报纸'."
      }
    ]
  },
  {
    id: 4004,
    lesson: 4,
    bookSlug: 'quyen-4',
    title: "Owen ở khách sạn",
    passage: "欧文住的宾馆可以在网上预订,入住时需要付押金,退房的时候需要带好押金的收据。入住以后可以免费上网,但需要密码。密码放在房间的桌子上。欧文预订的房间带早餐,早上餐厅开到九点半。按照规定,应该十二点以前退房,但是服务台说可以延长到下午一点。那儿离地铁站很近,走过去只要五分钟。",
    questions: [
      {
        questionText: "Owen đặt phòng khách sạn bằng cách nào?",
        options: ["Qua điện thoại", "Trực tiếp tại quầy", "Qua mạng", "Qua bạn bè"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '欧文住的宾馆可以在网上预订'."
      },
      {
        questionText: "Khi trả phòng, cần mang theo gì?",
        options: ["Hộ chiếu", "Thẻ phòng", "Biên lai đặt cọc", "Chứng minh thư"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '退房的时候需要带好押金的收据'."
      },
      {
        questionText: "Thời gian trả phòng có thể kéo dài đến mấy giờ?",
        options: ["12 giờ trưa", "1 giờ chiều", "2 giờ chiều", "3 giờ chiều"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '可以延长到下午一点'."
      }
    ]
  },
  {
    id: 4005,
    lesson: 5,
    bookSlug: 'quyen-4',
    title: "Kamala thuê nhà",
    passage: "卡玛拉想租一套房子,小明陪她去了房产公司。她想租两室一厅,房产公司告诉她两室一厅一个月要五千块以上。卡玛拉觉得租不起,准备租一室一厅。房产公司给她介绍了三套房子:一套有新家具和家用电器,每月四千五百块;一套家具比较旧,每月三千七百块;还有一套电器比较旧,每月四千块。卡玛拉想租带新家具的那套。她看不懂合同,小明用英语告诉她意思,她说都没有问题,现在就能签合同。",
    questions: [
      {
        questionText: "Kamala muốn thuê loại nhà nào ban đầu?",
        options: ["Một phòng ngủ một phòng khách", "Hai phòng ngủ một phòng khách", "Ba phòng ngủ một phòng khách", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '她想租两室一厅'."
      },
      {
        questionText: "Tại sao Kamala không thuê căn hai phòng ngủ một phòng khách?",
        options: ["Nó quá nhỏ", "Nó quá đắt", "Nó không có đồ nội thất", "Nó quá xa"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '卡玛拉觉得租不起'."
      },
      {
        questionText: "Kamala cuối cùng muốn thuê căn nhà nào?",
        options: ["Căn có đồ nội thất mới", "Căn có đồ nội thất cũ", "Căn có đồ điện cũ", "Căn rẻ nhất"],
        correctAnswerIndex: 0,
        explanation: "Đoạn văn nói '卡玛拉想租带新家具的那套'."
      }
    ]
  },
  {
    id: 4006,
    lesson: 6,
    bookSlug: 'quyen-4',
    title: "Bức ảnh gia đình",
    passage: "这是我的全家福,来中国以前拍的。前面坐着我的爸爸、妈妈。妈妈抱着我哥哥一岁的女儿,爸爸抱着我哥哥三岁的儿子。孩子们笑着,可爱极了。我、我哥哥和嫂嫂站在爸爸和妈妈的后面。哥哥拉着嫂嫂的左手,嫂嫂的右手放在儿子头上。我在看手机,因为拍照的时候,手机响了,我看了一下。",
    questions: [
      {
        questionText: "Bức ảnh này được chụp khi nào?",
        options: ["Sau khi đến Trung Quốc", "Trước khi đến Trung Quốc", "Trong dịp Tết Nguyên đán", "Không rõ"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '来中国以前拍的'."
      },
      {
        questionText: "Ai đang ôm con gái một tuổi của anh trai người nói?",
        options: ["Bố", "Mẹ", "Người nói", "Anh trai"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '妈妈抱着我哥哥一岁的女儿'."
      },
      {
        questionText: "Người nói đang làm gì trong bức ảnh?",
        options: ["Cười", "Đứng cạnh bố mẹ", "Xem điện thoại", "Ôm con"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '我在看手机,因为拍照的时候,手机响了,我看了一下'."
      }
    ]
  },
  {
    id: 4007,
    lesson: 7,
    bookSlug: 'quyen-4',
    title: "Helen đổi tiền và làm thẻ",
    passage: "海伦去银行换钱,办借记卡,需要填写中文表格。海伦有的地方看不懂,想请银行职员翻译成英语。银行职员不会英语,翻译不了。海伦填写表格的时候,把地址写错了,写了美国的地址。办借记卡很方便,一会儿就办好了。今天汇率不错,海伦换了五百美元,把换好的人民币都存在了新办的借记卡里。",
    questions: [
      {
        questionText: "Helen đi ngân hàng để làm gì?",
        options: ["Gửi tiền", "Rút tiền", "Đổi tiền và làm thẻ ghi nợ", "Vay tiền"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '海伦去银行换钱,办借记卡'."
      },
      {
        questionText: "Tại sao nhân viên ngân hàng không thể giúp Helen dịch?",
        options: ["Họ không có thời gian", "Họ không biết tiếng Anh", "Họ không muốn giúp", "Họ không hiểu câu hỏi"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '银行职员不会英语,翻译不了'."
      },
      {
        questionText: "Helen đã viết sai thông tin gì trong biểu mẫu?",
        options: ["Tên", "Số điện thoại", "Địa chỉ", "Ngày sinh"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '把地址写错了,写了美国的地址'."
      }
    ]
  },
  {
    id: 4008,
    lesson: 8,
    bookSlug: 'quyen-4',
    title: "Tanaka ở sân bay",
    passage: "田中今天回日本去了。在机场安检时,安检员先让田中扔了打火机,又说他电脑包里放着水果刀,让他打开包,把东西都拿出来检查。他把电脑拿了出来,安检员也把包拿过去检查了一会儿,从里面找出来一把水果刀。田中已经忘了是什么时候放进去的。这怎么能带上飞机呢?",
    questions: [
      {
        questionText: "Tanaka đang ở đâu?",
        options: ["Ga tàu hỏa", "Sân bay", "Bến xe buýt", "Bến tàu"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '在机场安检时' (khi kiểm tra an ninh ở sân bay)."
      },
      {
        questionText: "Nhân viên an ninh đã yêu cầu Tanaka vứt bỏ thứ gì đầu tiên?",
        options: ["Dao gọt hoa quả", "Bật lửa", "Máy tính", "Điện thoại"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '安检员先让田中扔了打火机'."
      },
      {
        questionText: "Nhân viên an ninh đã tìm thấy gì trong túi của Tanaka?",
        options: ["Bật lửa", "Dao gọt hoa quả", "Điện thoại", "Máy tính"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '从里面找出来一把水果刀'."
      }
    ]
  },
  {
    id: 4009,
    lesson: 9,
    bookSlug: 'quyen-4',
    title: "Máy tính của Kamala bị virus",
    passage: "卡玛拉的电脑被病毒感染了,总是死机,上不了网。卡玛拉请欧文帮她杀毒,病毒是杀掉了,可很多文件被删除掉了,找不回来了。欧文说可能是她的U盘先被感染,U盘再把病毒带给了电脑。还有,卡玛拉刚开通了手机银行,手机又被病毒感染,被盗掉了三千块钱。她最近真是太倒霉了。",
    questions: [
      {
        questionText: "Máy tính của Kamala bị làm sao?",
        options: ["Bị hỏng màn hình", "Bị nhiễm virus", "Bị mất", "Bị hết pin"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '卡玛拉的电脑被病毒感染了'."
      },
      {
        questionText: "Ai đã giúp Kamala diệt virus?",
        options: ["Tiểu Minh", "Owen", "Helen", "Tanaka"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '卡玛拉请欧文帮她杀毒'."
      },
      {
        questionText: "Kamala đã bị mất bao nhiêu tiền từ ngân hàng di động?",
        options: ["Một nghìn", "Hai nghìn", "Ba nghìn", "Bốn nghìn"],
        correctAnswerIndex: 2,
        explanation: "Đoạn văn nói '被盗掉了三千块钱'."
      }
    ]
  },
  {
    id: 4010,
    lesson: 10,
    bookSlug: 'quyen-4',
    title: "Kamala về nước",
    passage: "上个月卡玛拉给一家美国公司发了简历,通过了那家公司的网上面试。那家公司要求卡玛拉马上回国工作。卡玛拉想马上把房子退了,可是来不及及办手续,就把钥匙小明那里那儿,请他办一下。卡玛拉买了后天的机票回国,她不想坐出租车去机场,因为去机场的高速公路常常堵车,早上也叫不到出租车。她想坐地铁去机场,但是有两个行李箱,一个人拿不了。小明准备送她到机场。",
    questions: [
      {
        questionText: "Kamala đã nhận được lời mời làm việc từ công ty nào?",
        options: ["Công ty Trung Quốc", "Công ty Mỹ", "Công ty Anh", "Công ty Hàn Quốc"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '卡玛拉给一家美国公司发了简历'."
      },
      {
        questionText: "Tại sao Kamala không muốn đi taxi ra sân bay?",
        options: ["Vì quá đắt", "Vì đường cao tốc thường tắc và khó gọi taxi vào buổi sáng", "Vì cô ấy muốn đi tàu điện ngầm", "Vì cô ấy có quá nhiều hành lý"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '因为去机场的高速公路常常堵车,早上也叫不到出租车'."
      },
      {
        questionText: "Ai sẽ tiễn Kamala ra sân bay?",
        options: ["Bạn trai", "Tiểu Minh", "Helen", "Owen"],
        correctAnswerIndex: 1,
        explanation: "Đoạn văn nói '小明准备送她到机场'."
      }
    ]
  },
];