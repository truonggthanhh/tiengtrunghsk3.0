import type { VocabularyWord } from '@/data';

export interface MsutongWord extends VocabularyWord {
  lesson: number;
}

export const msutong_so_cap_3_vocab: MsutongWord[] = [
  // Bài 1
  { id: 30000, lesson: 1, hanzi: "北", pinyin: "běi", meaning: "Bắc", examples: [{ hanzi: "北方。", translation: "Miền Bắc." }] },
  { id: 30001, lesson: 1, hanzi: "北边", pinyin: "běibian", meaning: "phía Bắc", examples: [{ hanzi: "在北边。", translation: "Ở phía Bắc." }] },
  { id: 30002, lesson: 1, hanzi: "北方", pinyin: "běifāng", meaning: "miền Bắc", examples: [{ hanzi: "北方很冷。", translation: "Miền Bắc rất lạnh." }] },
  { id: 30003, lesson: 1, hanzi: "边", pinyin: "biān", meaning: "phía, bên ", examples: [{ hanzi: "东边。", translation: "Phía Đông." }] },
  { id: 30004, lesson: 1, hanzi: "城市", pinyin: "chéngshì", meaning: "thành phố", examples: [{ hanzi: "大城市。", translation: "Thành phố lớn." }, { hanzi: "城市很热闹。", translation: "Thành phố rất nhộn nhịp." }] },
  { id: 30005, lesson: 1, hanzi: "东边", pinyin: "dōngbian", meaning: "phía Đông", examples: [{ hanzi: "在东边。", translation: "Ở phía Đông." }] },
  { id: 30006, lesson: 1, hanzi: "方便", pinyin: "fāngbiàn", meaning: "thuận tiện", examples: [{ hanzi: "交通很方便。", translation: "Giao thông rất thuận tiện." }, { hanzi: "生活很方便。", translation: "Cuộc sống rất thuận tiện." }] },
  { id: 30007, lesson: 1, hanzi: "环境", pinyin: "huánjìng", meaning: "môi trường", examples: [{ hanzi: "环境很好。", translation: "Môi trường rất tốt." }] },
  { id: 30008, lesson: 1, hanzi: "交通", pinyin: "jiāotōng", meaning: "giao thông", examples: [{ hanzi: "交通很方便。", translation: "Giao thông rất thuận tiện." }] },
  { id: 30009, lesson: 1, hanzi: "老家", pinyin: "lǎojiā", meaning: "quê nhà", examples: [{ hanzi: "我的老家在农村。", translation: "Quê tôi ở nông thôn." }] },
  { id: 30010, lesson: 1, hanzi: "离", pinyin: "lí", meaning: "cách", examples: [{ hanzi: "离这儿很近。", translation: "Cách đây rất gần." }] },
  { id: 30011, lesson: 1, hanzi: "南", pinyin: "nán", meaning: "Nam", examples: [{ hanzi: "南方。", translation: "Miền Nam." }] },
  { id: 30012, lesson: 1, hanzi: "南方", pinyin: "nánfāng", meaning: "miền Nam", examples: [{ hanzi: "南方很暖和。", translation: "Miền Nam rất ấm áp." }] },
  { id: 30013, lesson: 1, hanzi: "农村", pinyin: "nóngcūn", meaning: "nông thôn", examples: [{ hanzi: "我的老家在农村。", translation: "Quê tôi ở nông thôn." }] },
  { id: 30014, lesson: 1, hanzi: "热闹", pinyin: "rènao", meaning: "nhộn nhịp", examples: [{ hanzi: "城市很热闹。", translation: "Thành phố rất nhộn nhịp." }] },
  { id: 30015, lesson: 1, hanzi: "山", pinyin: "shān", meaning: "núi", examples: [{ hanzi: "山很高。", translation: "Núi rất cao." }] },
  { id: 30016, lesson: 1, hanzi: "商店", pinyin: "shāngdiàn", meaning: "cửa hàng", examples: [{ hanzi: "商店在学校旁边。", translation: "Cửa hàng ở cạnh trường học." }] },
  { id: 30017, lesson: 1, hanzi: "生活", pinyin: "shēnghuó", meaning: "cuộc sống", examples: [{ hanzi: "生活很方便。", translation: "Cuộc sống rất thuận tiện." }] },
  { id: 30018, lesson: 1, hanzi: "小学", pinyin: "xiǎoxué", meaning: "tiểu học", examples: [{ hanzi: "我在小学学习。", translation: "Tôi học ở trường tiểu học." }] },
  { id: 30019, lesson: 1, hanzi: "新", pinyin: "xīn", meaning: "mới", examples: [{ hanzi: "新学校。", translation: "Trường học mới." }] },
  { id: 30020, lesson: 1, hanzi: "新鲜", pinyin: "xīnxiān", meaning: "trong lành, tươi ", examples: [{ hanzi: "空气很新鲜。", translation: "Không khí rất trong lành." }] },
  { id: 30021, lesson: 1, hanzi: "西边", pinyin: "xībian", meaning: "phía Tây", examples: [{ hanzi: "在西边。", translation: "Ở phía Tây." }] },
  { id: 30022, lesson: 1, hanzi: "站", pinyin: "zhàn", meaning: "trạm, bến, ga ", examples: [{ hanzi: "火车站。", translation: "Ga tàu hỏa." }] },
  { id: 30023, lesson: 1, hanzi: "一定", pinyin: "yídìng", meaning: "nhất định", examples: [{ hanzi: "你一定会喜欢。", translation: "Bạn nhất định sẽ thích." }] },
  { id: 30024, lesson: 1, hanzi: "田野", pinyin: "tiányě", meaning: "đồng ruộng", examples: [{ hanzi: "田野很美。", translation: "Đồng ruộng rất đẹp." }] },

  // Bài 2
  { id: 30025, lesson: 2, hanzi: "充值", pinyin: "chōng zhí", meaning: "nạp tiền", examples: [{ hanzi: "手机充值。", translation: "Nạp tiền điện thoại." }] },
  { id: 30026, lesson: 2, hanzi: "得", pinyin: "děi", meaning: "phải", examples: [{ hanzi: "我得去。", translation: "Tôi phải đi." }] },
  { id: 30027, lesson: 2, hanzi: "发", pinyin: "fā", meaning: "gửi", examples: [{ hanzi: "发短信。", translation: "Gửi tin nhắn." }] },
  { id: 30028, lesson: 2, hanzi: "介绍", pinyin: "jièshào", meaning: "giới thiệu", examples: [{ hanzi: "介绍一下。", translation: "Giới thiệu một chút." }] },
  { id: 30029, lesson: 2, hanzi: "卡", pinyin: "kǎ", meaning: "thẻ", examples: [{ hanzi: "手机卡。", translation: "Thẻ điện thoại." }] },
  { id: 30030, lesson: 2, hanzi: "能", pinyin: "néng", meaning: "có thể", examples: [{ hanzi: "我能帮你吗？", translation: "Tôi có thể giúp bạn không?" }] },
  { id: 30031, lesson: 2, hanzi: "容易", pinyin: "róngyì", meaning: "dễ, dễ dàng ", examples: [{ hanzi: "很容易。", translation: "Rất dễ." }] },
  { id: 30032, lesson: 2, hanzi: "上网", pinyin: "shàng wǎng", meaning: "lên mạng", examples: [{ hanzi: "上网聊天。", translation: "Lên mạng trò chuyện." }] },
  { id: 30033, lesson: 2, hanzi: "手写", pinyin: "shǒuxiě", meaning: "viết tay", examples: [{ hanzi: "手写输入法。", translation: "Phương pháp nhập liệu viết tay." }] },
  { id: 30034, lesson: 2, hanzi: "输入法", pinyin: "shūrùfǎ", meaning: "cách nhập liệu", examples: [{ hanzi: "手写输入法。", translation: "Phương pháp nhập liệu viết tay." }] },
  { id: 30035, lesson: 2, hanzi: "微信", pinyin: "wēixìn", meaning: "Wechat", examples: [{ hanzi: "用微信。", translation: "Dùng Wechat." }, { hanzi: "注册微信。", translation: "Đăng ký Wechat." }] },
  { id: 30036, lesson: 2, hanzi: "下", pinyin: "xià", meaning: "tải xuống", examples: [{ hanzi: "下载软件。", translation: "Tải phần mềm." }] },
  { id: 30037, lesson: 2, hanzi: "需要", pinyin: "xūyào", meaning: "cần", examples: [{ hanzi: "需要帮助吗？", translation: "Cần giúp đỡ không?" }] },
  { id: 30038, lesson: 2, hanzi: "一…就…", pinyin: "yī...jiù...", meaning: "vừa... liền, hễ...là ", examples: [{ hanzi: "我一回家就睡觉。", translation: "Tôi vừa về nhà là ngủ ngay." }] },
  { id: 30039, lesson: 2, hanzi: "应该", pinyin: "yīnggāi", meaning: "nên, cần ", examples: [{ hanzi: "你应该休息。", translation: "Bạn nên nghỉ ngơi." }] },
  { id: 30040, lesson: 2, hanzi: "种", pinyin: "zhǒng", meaning: "loại", examples: [{ hanzi: "这种手机。", translation: "Loại điện thoại này." }] },
  { id: 30041, lesson: 2, hanzi: "注册", pinyin: "zhù cè", meaning: "đăng kí", examples: [{ hanzi: "注册微信。", translation: "Đăng ký Wechat." }] },

  // Bài 3
  { id: 30042, lesson: 3, hanzi: "打针", pinyin: "dǎ zhēn", meaning: "tiêm", examples: [{ hanzi: "打针。", translation: "Tiêm." }] },
  { id: 30043, lesson: 3, hanzi: "担心", pinyin: "dān xīn", meaning: "lo lắng", examples: [{ hanzi: "别担心。", translation: "Đừng lo lắng." }] },
  { id: 30044, lesson: 3, hanzi: "蛋糕", pinyin: "dàngāo", meaning: "bánh gato", examples: [{ hanzi: "吃蛋糕。", translation: "Ăn bánh gato." }] },
  { id: 30045, lesson: 3, hanzi: "度", pinyin: "dù", meaning: "độ", examples: [{ hanzi: "三十八度。", translation: "38 độ." }] },
  { id: 30046, lesson: 3, hanzi: "发烧", pinyin: "fā shāo", meaning: "sốt", examples: [{ hanzi: "发烧了。", translation: "Bị sốt rồi." }] },
  { id: 30047, lesson: 3, hanzi: "感冒", pinyin: "gǎnmào", meaning: "cảm", examples: [{ hanzi: "感冒了。", translation: "Bị cảm rồi." }] },
  { id: 30048, lesson: 3, hanzi: "高", pinyin: "gāo", meaning: "cao", examples: [{ hanzi: "体温很高。", translation: "Nhiệt độ cơ thể rất cao." }] },
  { id: 30049, lesson: 3, hanzi: "看病", pinyin: "kàn bìng", meaning: "khám bệnh", examples: [{ hanzi: "去看病。", translation: "Đi khám bệnh." }] },
  { id: 30050, lesson: 3, hanzi: "拉肚子", pinyin: "lā dùzi", meaning: "tiêu chảy", examples: [{ hanzi: "拉肚子。", translation: "Tiêu chảy." }] },
  { id: 30051, lesson: 3, hanzi: "量", pinyin: "liáng", meaning: "đo", examples: [{ hanzi: "量体温。", translation: "Đo nhiệt độ cơ thể." }] },
  { id: 30052, lesson: 3, hanzi: "牛奶", pinyin: "niúnǎi", meaning: "sữa bò", examples: [{ hanzi: "喝牛奶。", translation: "Uống sữa bò." }] },
  { id: 30053, lesson: 3, hanzi: "舒服", pinyin: "shūfu", meaning: "thoải mái", examples: [{ hanzi: "不舒服。", translation: "Không thoải mái." }] },
  { id: 30054, lesson: 3, hanzi: "疼", pinyin: "téng", meaning: "đau", examples: [{ hanzi: "头疼。", translation: "Đau đầu." }] },
  { id: 30055, lesson: 3, hanzi: "体温", pinyin: "tǐwēn", meaning: "nhiệt độ cơ thể", examples: [{ hanzi: "量体温。", translation: "Đo nhiệt độ cơ thể." }] },
  { id: 30056, lesson: 3, hanzi: "头", pinyin: "tóu", meaning: "đầu", examples: [{ hanzi: "头疼。", translation: "Đau đầu." }] },
  { id: 30057, lesson: 3, hanzi: "头疼", pinyin: "tóuténg", meaning: "đau đầu", examples: [{ hanzi: "我头疼。", translation: "Tôi đau đầu." }] },
  { id: 30058, lesson: 3, hanzi: "洗手间", pinyin: "xǐshǒujiān", meaning: "nhà vệ sinh", examples: [{ hanzi: "去洗手间。", translation: "Đi nhà vệ sinh." }] },
  { id: 30059, lesson: 3, hanzi: "先", pinyin: "xiān", meaning: "trước", examples: [{ hanzi: "先休息一下。", translation: "Nghỉ ngơi một chút trước." }] },
  { id: 30060, lesson: 3, hanzi: "休息", pinyin: "xiūxi", meaning: "nghỉ ngơi", examples: [{ hanzi: "休息一下。", translation: "Nghỉ ngơi một chút." }, { hanzi: "先休息一下。", translation: "Nghỉ ngơi một chút trước." }] },
  { id: 30061, lesson: 3, hanzi: "药", pinyin: "yào", meaning: "thuốc", examples: [{ hanzi: "吃药。", translation: "Uống thuốc." }] },
  { id: 30062, lesson: 3, hanzi: "医院", pinyin: "yīyuàn", meaning: "bệnh viện", examples: [{ hanzi: "去医院。", translation: "Đi bệnh viện." }] },

  // Bài 4
  { id: 30063, lesson: 4, hanzi: "AA制", pinyin: "AA zhì", meaning: "tiền ai nấy trả", examples: [{ hanzi: "我们AA制吧。", translation: "Chúng ta tiền ai nấy trả đi." }] },
  { id: 30064, lesson: 4, hanzi: "白天", pinyin: "báitiān", meaning: "ban ngày", examples: [{ hanzi: "白天很忙。", translation: "Ban ngày rất bận." }] },
  { id: 30065, lesson: 4, hanzi: "带", pinyin: "dài", meaning: "dẫn, đem ", examples: [{ hanzi: "带朋友来。", translation: "Dẫn bạn đến." }] },
  { id: 30066, lesson: 4, hanzi: "短信", pinyin: "duǎnxìn", meaning: "tin nhắn", examples: [{ hanzi: "发短信。", translation: "Gửi tin nhắn." }] },
  { id: 30067, lesson: 4, hanzi: "客人", pinyin: "kèrén", meaning: "khách hàng", examples: [{ hanzi: "家里有客人。", translation: "Trong nhà có khách." }] },
  { id: 30068, lesson: 4, hanzi: "礼尚往来", pinyin: "lǐshàngwǎnglái", meaning: "có qua có lại", examples: [{ hanzi: "礼尚往来。", translation: "Có qua có lại." }] },
  { id: 30069, lesson: 4, hanzi: "请客", pinyin: "qǐng kè", meaning: "mời", examples: [{ hanzi: "我请客。", translation: "Tôi mời." }] },
  { id: 30070, lesson: 4, hanzi: "清楚", pinyin: "qīngchu", meaning: "rõ, rõ ràng ", examples: [{ hanzi: "听清楚了吗？", translation: "Nghe rõ chưa?" }] },
  { id: 30071, lesson: 4, hanzi: "问", pinyin: "wèn", meaning: "hỏi", examples: [{ hanzi: "问问题。", translation: "Hỏi vấn đề." }] },
  { id: 30072, lesson: 4, hanzi: "语伴", pinyin: "yǔbàn", meaning: "bạn cùng học ngoại ngữ", examples: [{ hanzi: "找语伴。", translation: "Tìm bạn cùng học ngoại ngữ." }] },
  { id: 30073, lesson: 4, hanzi: "预约", pinyin: "yùyuē", meaning: "đặt hẹn", examples: [{ hanzi: "预约时间。", translation: "Đặt hẹn thời gian." }] },
  { id: 30074, lesson: 4, hanzi: "聚会", pinyin: "jùhuì", meaning: "tụ họp, gặp mặt ", examples: [{ hanzi: "朋友聚会。", translation: "Bạn bè tụ họp." }] },
  { id: 30075, lesson: 4, hanzi: "同学", pinyin: "tóngxué", meaning: "bạn học", examples: [{ hanzi: "我的同学。", translation: "Bạn học của tôi." }] },
  { id: 30076, lesson: 4, hanzi: "人气", pinyin: "rénqì", meaning: "ý chí, chí khí ", examples: [{ hanzi: "人气很高。", translation: "Ý chí rất cao." }] },

  // Bài 5
  { id: 30077, lesson: 5, hanzi: "但是", pinyin: "dànshì", meaning: "nhưng", examples: [{ hanzi: "我想去，但是没时间。", translation: "Tôi muốn đi, nhưng không có thời gian." }] },
  { id: 30078, lesson: 5, hanzi: "懒", pinyin: "lǎn", meaning: "lười", examples: [{ hanzi: "他很懒。", translation: "Anh ấy rất lười." }] },
  { id: 30079, lesson: 5, hanzi: "了解", pinyin: "liǎojiě", meaning: "hiểu", examples: [{ hanzi: "了解情况。", translation: "Hiểu rõ tình hình." }] },
  { id: 30080, lesson: 5, hanzi: "胖", pinyin: "pàng", meaning: "mập, béo ", examples: [{ hanzi: "他有点儿胖。", translation: "Anh ấy hơi mập." }] },
  { id: 30081, lesson: 5, hanzi: "跑步", pinyin: "pǎo bù", meaning: "chạy bộ", examples: [{ hanzi: "每天跑步。", translation: "Chạy bộ mỗi ngày." }] },
  { id: 30082, lesson: 5, hanzi: "瘦", pinyin: "shòu", meaning: "gầy", examples: [{ hanzi: "她很瘦。", translation: "Cô ấy rất gầy." }] },
  { id: 30083, lesson: 5, hanzi: "讨价还价", pinyin: "tǎojià-huánjià", meaning: "mặc cả", examples: [{ hanzi: "喜欢讨价还价。", translation: "Thích mặc cả." }] },
  { id: 30084, lesson: 5, hanzi: "以后", pinyin: "yǐhòu", meaning: "sau này", examples: [{ hanzi: "以后再说。", translation: "Sau này nói sau." }] },
  { id: 30085, lesson: 5, hanzi: "以前", pinyin: "yǐqián", meaning: "trước đây", examples: [{ hanzi: "以前很瘦。", translation: "Trước đây rất gầy." }] },
  { id: 30086, lesson: 5, hanzi: "越来越", pinyin: "yuèláiyuè", meaning: "càng ngày càng", examples: [{ hanzi: "越来越好。", translation: "Càng ngày càng tốt." }] },
  { id: 30087, lesson: 5, hanzi: "最", pinyin: "zuì", meaning: "nhất", examples: [{ hanzi: "最好。", translation: "Tốt nhất." }] },
  { id: 30088, lesson: 5, hanzi: "进步", pinyin: "jìnbù", meaning: "tiến bộ", examples: [{ hanzi: "学习进步。", translation: "Học tập tiến bộ." }] },
  { id: 30089, lesson: 5, hanzi: "努力", pinyin: "nǔlì", meaning: "chăm chỉ, nỗ lực ", examples: [{ hanzi: "努力学习。", translation: "Nỗ lực học tập." }] },

  // Bài 6
  { id: 30090, lesson: 6, hanzi: "矮", pinyin: "ǎi", meaning: "lùn, thấp ", examples: [{ hanzi: "他个子矮。", translation: "Anh ấy thấp." }] },
  { id: 30091, lesson: 6, hanzi: "白", pinyin: "bái", meaning: "trắng", examples: [{ hanzi: "皮肤很白。", translation: "Da rất trắng." }] },
  { id: 30092, lesson: 6, hanzi: "比较", pinyin: "bǐjiào", meaning: "khá, tương đối ", examples: [{ hanzi: "比较高。", translation: "Khá cao." }] },
  { id: 30093, lesson: 6, hanzi: "长", pinyin: "cháng", meaning: "dài", examples: [{ hanzi: "头发很长。", translation: "Tóc rất dài." }] },
  { id: 30094, lesson: 6, hanzi: "个子", pinyin: "gèzi", meaning: "dáng người", examples: [{ hanzi: "个子很高。", translation: "Dáng người rất cao." }] },
  { id: 30095, lesson: 6, hanzi: "黄", pinyin: "huáng", meaning: "vàng", examples: [{ hanzi: "黄色的头发。", translation: "Tóc màu vàng." }] },
  { id: 30096, lesson: 6, hanzi: "皮肤", pinyin: "pífū", meaning: "da", examples: [{ hanzi: "皮肤很白。", translation: "Da rất trắng." }] },
  { id: 30097, lesson: 6, hanzi: "帅", pinyin: "shuài", meaning: "đẹp trai", examples: [{ hanzi: "他很帅。", translation: "Anh ấy rất đẹp trai." }] },
  { id: 30098, lesson: 6, hanzi: "T恤", pinyin: "T xù", meaning: "áo phông", examples: [{ hanzi: "穿T恤。", translation: "Mặc áo phông." }] },
  { id: 30099, lesson: 6, hanzi: "头发", pinyin: "tóufa", meaning: "tóc", examples: [{ hanzi: "头发很长。", translation: "Tóc rất dài." }] },
  { id: 30100, lesson: 6, hanzi: "同屋", pinyin: "tóngwū", meaning: "bạn cùng phòng", examples: [{ hanzi: "我的同屋。", translation: "Bạn cùng phòng của tôi." }] },
  { id: 30101, lesson: 6, hanzi: "详细", pinyin: "xiángxì", meaning: "chi tiết, kĩ càng ", examples: [{ hanzi: "详细介绍。", translation: "Giới thiệu chi tiết." }] },
  { id: 30102, lesson: 6, hanzi: "眼睛", pinyin: "yǎnjing", meaning: "mắt", examples: [{ hanzi: "大眼睛。", translation: "Mắt to." }] },
  { id: 30103, lesson: 6, hanzi: "样子", pinyin: "yàngzi", meaning: "hình dáng", examples: [{ hanzi: "什么样子？", translation: "Hình dáng thế nào?" }] },
  { id: 30104, lesson: 6, hanzi: "长", pinyin: "zhǎng", meaning: "lớn lên, mọc lên ", examples: [{ hanzi: "长得很帅。", translation: "Lớn lên rất đẹp trai." }] },
  { id: 30105, lesson: 6, hanzi: "仔细", pinyin: "zǐxì", meaning: "kĩ, cẩn thận ", examples: [{ hanzi: "仔细看。", translation: "Nhìn kỹ." }] },
  { id: 30106, lesson: 6, hanzi: "总是", pinyin: "zǒngshì", meaning: "luôn luôn", examples: [{ hanzi: "他总是很忙。", translation: "Anh ấy luôn luôn rất bận." }] },
  { id: 30107, lesson: 6, hanzi: "足球", pinyin: "zúqiú", meaning: "bóng đá", examples: [{ hanzi: "踢足球。", translation: "Đá bóng." }] },
  { id: 30108, lesson: 6, hanzi: "踢", pinyin: "tī", meaning: "đá", examples: [{ hanzi: "踢足球。", translation: "Đá bóng." }] },

  // Bài 7
  { id: 30109, lesson: 7, hanzi: "办", pinyin: "bàn", meaning: "làm", examples: [{ hanzi: "怎么办？", translation: "Làm thế nào?" }] },
  { id: 30110, lesson: 7, hanzi: "电梯", pinyin: "diàntī", meaning: "thang máy", examples: [{ hanzi: "坐电梯。", translation: "Đi thang máy." }, { hanzi: "坐电梯上楼吧。", translation: "Chúng ta đi thang máy lên lầu đi." }] },
  { id: 30111, lesson: 7, hanzi: "扶梯", pinyin: "fútī", meaning: "thang cuốn", examples: [{ hanzi: "坐扶梯。", translation: "Đi thang cuốn." }] },
  { id: 30112, lesson: 7, hanzi: "公交卡", pinyin: "gōngjiāokǎ", meaning: "thẻ xe buýt", examples: [{ hanzi: "刷公交卡。", translation: "Quẹt thẻ xe buýt." }] },
  { id: 30113, lesson: 7, hanzi: "挤", pinyin: "jǐ", meaning: "đông đúc", examples: [{ hanzi: "车上很挤。", translation: "Trên xe rất đông." }] },
  { id: 30114, lesson: 7, hanzi: "老人", pinyin: "lǎorén", meaning: "người già", examples: [{ hanzi: "帮助老人。", translation: "Giúp đỡ người già." }] },
  { id: 30115, lesson: 7, hanzi: "年轻人", pinyin: "niánqīngrén", meaning: "thanh niên", examples: [{ hanzi: "年轻人。", translation: "Thanh niên." }] },
  { id: 30116, lesson: 7, hanzi: "前门", pinyin: "qiánmén", meaning: "cửa trước", examples: [{ hanzi: "从前门上车。", translation: "Lên xe từ cửa trước." }] },
  { id: 30117, lesson: 7, hanzi: "售票机", pinyin: "shòupiàojī", meaning: "máy bán vé", examples: [{ hanzi: "自动售票机。", translation: "Máy bán vé tự động." }] },
  { id: 30118, lesson: 7, hanzi: "投入", pinyin: "tóurù", meaning: "bỏ vào, thả vào ", examples: [{ hanzi: "投入硬币。", translation: "Bỏ tiền xu vào." }] },
  { id: 30119, lesson: 7, hanzi: "一般", pinyin: "yìbān", meaning: "thông thường", examples: [{ hanzi: "一般情况。", translation: "Tình huống thông thường." }] },
  { id: 30120, lesson: 7, hanzi: "硬币", pinyin: "yìngbì", meaning: "tiền xu", examples: [{ hanzi: "投入硬币。", translation: "Bỏ tiền xu vào." }] },
  { id: 30121, lesson: 7, hanzi: "自动", pinyin: "zìdòng", meaning: "tự động", examples: [{ hanzi: "自动售票机。", translation: "Máy bán vé tự động." }] },
  { id: 30122, lesson: 7, hanzi: "打的", pinyin: "dǎ dī", meaning: "gọi taxi", examples: [{ hanzi: "打的去机场。", translation: "Gọi taxi đi sân bay." }] },
  { id: 30123, lesson: 7, hanzi: "入口", pinyin: "rùkǒu", meaning: "lối vào", examples: [{ hanzi: "入口在这儿。", translation: "Lối vào ở đây." }] },
  { id: 30124, lesson: 7, hanzi: "...的时候", pinyin: "...de shíhou", meaning: "khi..., lúc... ", examples: [{ hanzi: "上车的时候。", translation: "Lúc lên xe." }] },
  { id: 30125, lesson: 7, hanzi: "年轻", pinyin: "niánqīng", meaning: "trẻ", examples: [{ hanzi: "年轻人。", translation: "Thanh niên." }] },

  // Bài 8
  { id: 30126, lesson: 8, hanzi: "把", pinyin: "bǎ", meaning: "chiếc", examples: [{ hanzi: "一把二胡。", translation: "Một chiếc đàn nhị." }] },
  { id: 30127, lesson: 8, hanzi: "标准", pinyin: "biāozhǔn", meaning: "chuẩn", examples: [{ hanzi: "普通话很标准。", translation: "Tiếng phổ thông rất chuẩn." }] },
  { id: 30128, lesson: 8, hanzi: "二胡", pinyin: "èrhú", meaning: "đàn nhị", examples: [{ hanzi: "拉二胡。", translation: "Kéo đàn nhị." }, { hanzi: "一把二胡。", translation: "Một chiếc đàn nhị." }, { hanzi: "演奏二胡。", translation: "Diễn tấu đàn nhị." }] },
  { id: 30129, lesson: 8, hanzi: "费", pinyin: "fèi", meaning: "phí", examples: [{ hanzi: "学费。", translation: "Học phí." }] },
  { id: 30130, lesson: 8, hanzi: "付", pinyin: "fù", meaning: "trả, thanh toán ", examples: [{ hanzi: "付学费。", translation: "Trả học phí." }] },
  { id: 30131, lesson: 8, hanzi: "家教", pinyin: "jiājiào", meaning: "gia sư", examples: [{ hanzi: "找家教。", translation: "Tìm gia sư." }] },
  { id: 30132, lesson: 8, hanzi: "结果", pinyin: "jiéguǒ", meaning: "kết quả", examples: [{ hanzi: "结果怎么样？", translation: "Kết quả thế nào?" }] },
  { id: 30133, lesson: 8, hanzi: "技术", pinyin: "jìshù", meaning: "kĩ thuật", examples: [{ hanzi: "技术很好。", translation: "Kỹ thuật rất tốt." }] },
  { id: 30134, lesson: 8, hanzi: "拉二胡", pinyin: "lā èrhú", meaning: "kéo đàn nhị", examples: [{ hanzi: "拉二胡。", translation: "Kéo đàn nhị." }] },
  { id: 30135, lesson: 8, hanzi: "礼物", pinyin: "lǐwù", meaning: "món quà", examples: [{ hanzi: "送礼物。", translation: "Tặng quà." }] },
  { id: 30136, lesson: 8, hanzi: "普通话", pinyin: "pǔtōnghuà", meaning: "tiếng phổ thông", examples: [{ hanzi: "普通话很标准。", translation: "Tiếng phổ thông rất chuẩn." }, { hanzi: "说普通话。", translation: "Nói tiếng phổ thông." }] },
  { id: 30137, lesson: 8, hanzi: "学费", pinyin: "xuéfèi", meaning: "học phí", examples: [{ hanzi: "学费。", translation: "Học phí." }, { hanzi: "付学费。", translation: "Trả học phí." }] },
  { id: 30138, lesson: 8, hanzi: "演奏", pinyin: "yǎnzòu", meaning: "diễn tấu", examples: [{ hanzi: "演奏二胡。", translation: "Diễn tấu đàn nhị." }] },
  { id: 30139, lesson: 8, hanzi: "要求", pinyin: "yāoqiú", meaning: "yêu cầu", examples: [{ hanzi: "有什么要求？", translation: "Có yêu cầu gì không?" }] },
  { id: 30140, lesson: 8, hanzi: "意思", pinyin: "yìsi", meaning: "ý, ý nghĩa ", examples: [{ hanzi: "什么意思？", translation: "Ý gì?" }] },
  { id: 30141, lesson: 8, hanzi: "消息", pinyin: "xiāoxi", meaning: "tin tức, thông tin ", examples: [{ hanzi: "好消息。", translation: "Tin tốt." }] },
  { id: 30142, lesson: 8, hanzi: "熟人", pinyin: "shúrén", meaning: "người quen", examples: [{ hanzi: "他是我的熟人。", translation: "Anh ấy là người quen của tôi." }] },
  { id: 30143, lesson: 8, hanzi: "互相", pinyin: "hùxiāng", meaning: "lẫn nhau", examples: [{ hanzi: "互相帮助。", translation: "Giúp đỡ lẫn nhau." }] },
  { id: 30144, lesson: 8, hanzi: "特别", pinyin: "tèbié", meaning: "đặc biệt", examples: [{ hanzi: "特别好。", translation: "Đặc biệt tốt." }] },

  // Bài 9
  { id: 30145, lesson: 9, hanzi: "比", pinyin: "bǐ", meaning: "hơn", examples: [{ hanzi: "今天比昨天冷。", translation: "Hôm nay lạnh hơn hôm qua." }] },
  { id: 30146, lesson: 9, hanzi: "春天", pinyin: "chūntiān", meaning: "mùa xuân", examples: [{ hanzi: "春天来了。", translation: "Mùa xuân đến rồi." }] },
  { id: 30147, lesson: 9, hanzi: "低", pinyin: "dī", meaning: "thấp", examples: [{ hanzi: "温度很低。", translation: "Nhiệt độ rất thấp." }] },
  { id: 30148, lesson: 9, hanzi: "冬天", pinyin: "dōngtiān", meaning: "mùa đông", examples: [{ hanzi: "冬天很冷。", translation: "Mùa đông rất lạnh." }] },
  { id: 30149, lesson: 9, hanzi: "刮", pinyin: "guā", meaning: "thổi (gió)", examples: [{ hanzi: "刮风了。", translation: "Gió thổi rồi." }] },
  { id: 30150, lesson: 9, hanzi: "冷", pinyin: "lěng", meaning: "lạnh", examples: [{ hanzi: "今天比昨天冷。", translation: "Hôm nay lạnh hơn hôm qua." }, { hanzi: "今天很冷。", translation: "Hôm nay rất lạnh." }] },
  { id: 30151, lesson: 9, hanzi: "凉快", pinyin: "liángkuai", meaning: "mát mẻ", examples: [{ hanzi: "天气很凉快。", translation: "Thời tiết rất mát mẻ." }, { hanzi: "秋天很凉快。", translation: "Mùa thu rất mát mẻ." }] },
  { id: 30152, lesson: 9, hanzi: "暖和", pinyin: "nuǎnhuo", meaning: "ấm áp", examples: [{ hanzi: "天气很暖和。", translation: "Thời tiết rất ấm áp." }] },
  { id: 30153, lesson: 9, hanzi: "秋天", pinyin: "qiūtiān", meaning: "mùa thu", examples: [{ hanzi: "秋天很凉快。", translation: "Mùa thu rất mát mẻ." }] },
  { id: 30154, lesson: 9, hanzi: "热", pinyin: "rè", meaning: "nóng", examples: [{ hanzi: "今天很热。", translation: "Hôm nay rất nóng." }] },
  { id: 30155, lesson: 9, hanzi: "台风", pinyin: "táifēng", meaning: "bão", examples: [{ hanzi: "有台风。", translation: "Có bão." }] },
  { id: 30156, lesson: 9, hanzi: "天气", pinyin: "tiānqì", meaning: "thời tiết", examples: [{ hanzi: "天气预报。", translation: "Dự báo thời tiết." }, { hanzi: "天气很凉快。", translation: "Thời tiết rất mát mẻ." }, { hanzi: "天气很暖和。", translation: "Thời tiết rất ấm áp." }] },
  { id: 30157, lesson: 9, hanzi: "下雪", pinyin: "xià xuě", meaning: "tuyết rơi", examples: [{ hanzi: "下雪了。", translation: "Tuyết rơi rồi." }, { hanzi: "下雪。", translation: "Tuyết rơi." }] },
  { id: 30158, lesson: 9, hanzi: "下雨", pinyin: "xià yǔ", meaning: "trời mưa", examples: [{ hanzi: "下雨了。", translation: "Trời mưa rồi." }, { hanzi: "下雨。", translation: "Trời mưa." }] },
  { id: 30159, lesson: 9, hanzi: "夏天", pinyin: "xiàtiān", meaning: "mùa hè", examples: [{ hanzi: "夏天很热。", translation: "Mùa hè rất nóng." }] },
  { id: 30160, lesson: 9, hanzi: "雪", pinyin: "xuě", meaning: "tuyết", examples: [{ hanzi: "下雪。", translation: "Tuyết rơi." }] },
  { id: 30161, lesson: 9, hanzi: "雨", pinyin: "yǔ", meaning: "mưa", examples: [{ hanzi: "下雨。", translation: "Trời mưa." }] },
  { id: 30162, lesson: 9, hanzi: "预 báo", pinyin: "yùbào", meaning: "dự báo", examples: [{ hanzi: "天气预报。", translation: "Dự báo thời tiết." }] },
  { id: 30163, lesson: 9, hanzi: "左右", pinyin: "zuǒyòu", meaning: "khoảng", examples: [{ hanzi: "二十度左右。", translation: "Khoảng 20 độ." }] },
  { id: 30164, lesson: 9, hanzi: "温度", pinyin: "wēndù", meaning: "nhiệt độ", examples: [{ hanzi: "温度很高。", translation: "Nhiệt độ rất cao." }, { hanzi: "温度很低。", translation: "Nhiệt độ rất thấp." }] },
  { id: 30165, lesson: 9, hanzi: "更", pinyin: "gèng", meaning: "càng, hơn ", examples: [{ hanzi: "更冷。", translation: "Lạnh hơn." }] },
  { id: 30166, lesson: 9, hanzi: "差不多", pinyin: "chàbuduō", meaning: "tương tự", examples: [{ hanzi: "差不多一样。", translation: "Gần như giống nhau." }] },

  // Bài 10
  { id: 30167, lesson: 10, hanzi: "比", pinyin: "bǐ", meaning: "tỉ số", examples: [{ hanzi: "三比二。", translation: "3-2." }] },
  { id: 30168, lesson: 10, hanzi: "队", pinyin: "duì", meaning: "đội", examples: [{ hanzi: "中国队。", translation: "Đội Trung Quốc." }] },
  { id: 30169, lesson: 10, hanzi: "结束", pinyin: "jiéshù", meaning: "kết thúc", examples: [{ hanzi: "比赛结束了。", translation: "Trận đấu kết thúc rồi." }] },
  { id: 30170, lesson: 10, hanzi: "紧张", pinyin: "jǐnzhāng", meaning: "căng thẳng", examples: [{ hanzi: "我很紧张。", translation: "Tôi rất căng thẳng." }] },
  { id: 30171, lesson: 10, hanzi: "机会", pinyin: "jīhuì", meaning: "cơ hội", examples: [{ hanzi: "好机会。", translation: "Cơ hội tốt." }] },
  { id: 30172, lesson: 10, hanzi: "加油", pinyin: "jiā yóu", meaning: "cố lên", examples: [{ hanzi: "加油！", translation: "Cố lên!" }] },
  { id: 30173, lesson: 10, hanzi: "精彩", pinyin: "jīngcǎi", meaning: "đặc sắc, hấp dẫn ", examples: [{ hanzi: "比赛很精彩。", translation: "Trận đấu rất đặc sắc." }] },
  { id: 30174, lesson: 10, hanzi: "强", pinyin: "qiáng", meaning: "mạnh", examples: [{ hanzi: "实力很强。", translation: "Thực lực rất mạnh." }] },
  { id: 30175, lesson: 10, hanzi: "实力", pinyin: "shílì", meaning: "thực lực", examples: [{ hanzi: "实力很强。", translation: "Thực lực rất mạnh." }] },
  { id: 30176, lesson: 10, hanzi: "输", pinyin: "shū", meaning: "thua", examples: [{ hanzi: "输了。", translation: "Thua rồi." }] },
  { id: 30177, lesson: 10, hanzi: "赢", pinyin: "yíng", meaning: "thắng", examples: [{ hanzi: "赢了。", translation: "Thắng rồi." }] },
  { id: 30178, lesson: 10, hanzi: "运气", pinyin: "yùnqi", meaning: "may mắn", examples: [{ hanzi: "运气很好。", translation: "May mắn rất tốt." }] },
  { id: 30179, lesson: 10, hanzi: "转播", pinyin: "zhuǎnbō", meaning: "tiếp sóng", examples: [{ hanzi: "电视转播。", translation: "Truyền hình trực tiếp." }] },
  { id: 30180, lesson: 10, hanzi: "世界杯", pinyin: "shìjièbēi", meaning: "Worldcup", examples: [{ hanzi: "看世界杯。", translation: "Xem Worldcup." }] },
  { id: 30181, lesson: 10, hanzi: "房间", pinyin: "fángjiān", meaning: "phòng", examples: [{ hanzi: "在房间里。", translation: "Trong phòng." }] },
  { id: 30182, lesson: 10, hanzi: "迷", pinyin: "mí", meaning: "người hâm mộ", examples: [{ hanzi: "足球迷。", translation: "Người hâm mộ bóng đá." }] },
];