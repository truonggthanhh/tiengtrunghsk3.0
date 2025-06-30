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

export const hsk6Vocabulary: VocabularyWord[] = [
  { id: 4294, hanzi: "哎哟", pinyin: "āiyō", meaning: "Ối, chà (thán từ)", examples: [{ hanzi: "哎哟，我的头好疼！", translation: "Ối, đầu tôi đau quá!" }] },
  { id: 4295, hanzi: "挨", pinyin: "ái", meaning: "Chịu, bị", examples: [{ hanzi: "他因为迟到挨了批评。", translation: "Anh ấy bị phê bình vì đến muộn." }] },
  { id: 4296, hanzi: "癌症", pinyin: "áizhèng", meaning: "Bệnh ung thư", examples: [{ hanzi: "他被诊断出患有癌症。", translation: "Anh ấy bị chẩn đoán mắc bệnh ung thư." }] },
  { id: 4297, hanzi: "爱不释手", pinyin: "àibúshìshǒu", meaning: "Yêu thích không rời tay", examples: [{ hanzi: "这本书写得太好了，我看得爱不释手。", translation: "Quyển sách này viết hay quá, tôi đọc mà yêu không nỡ rời tay." }] },
  { id: 4298, hanzi: "爱戴", pinyin: "àidài", meaning: "Yêu mến và kính trọng", examples: [{ hanzi: "这位老师深受学生们的爱戴。", translation: "Vị giáo viên này nhận được sự yêu mến và kính trọng sâu sắc của học sinh." }] },
  { id: 4299, hanzi: "暧昧", pinyin: "àimèi", meaning: "Mập mờ, không rõ ràng", examples: [{ hanzi: "他们俩的关系很暧昧。", translation: "Mối quan hệ của hai người họ rất mập mờ." }] },
  { id: 4300, hanzi: "安宁", pinyin: "ānníng", meaning: "Yên ổn, thanh bình", examples: [{ hanzi: "我希望过上安宁的生活。", translation: "Tôi hy vọng có một cuộc sống yên ổn." }] },
  { id: 4301, hanzi: "安详", pinyin: "ānxiáng", meaning: "An tường, điềm tĩnh", examples: [{ hanzi: "老人安详地闭上了眼睛。", translation: "Ông lão điềm tĩnh nhắm mắt lại." }] },
  { id: 4302, hanzi: "安置", pinyin: "ānzhì", meaning: "Sắp xếp, bố trí", examples: [{ hanzi: "政府正在安置受灾群众。", translation: "Chính phủ đang sắp xếp chỗ ở cho người dân bị thiên tai." }] },
  { id: 4303, hanzi: "按摩", pinyin: "ànmó", meaning: "Mát-xa", examples: [{ hanzi: "按摩可以缓解肌肉疲劳。", translation: "Mát-xa có thể làm giảm mệt mỏi cơ bắp." }] },
  { id: 4304, hanzi: "案件", pinyin: "ànjiàn", meaning: "Vụ án", examples: [{ hanzi: "警察正在调查这个案件。", translation: "Cảnh sát đang điều tra vụ án này." }] },
  { id: 4305, hanzi: "案例", pinyin: "ànlì", meaning: "Trường hợp, vụ việc điển hình", examples: [{ hanzi: "这是一个典型的成功案例。", translation: "Đây là một trường hợp thành công điển hình." }] },
  { id: 4306, hanzi: "暗示", pinyin: "ànshì", meaning: "Ám chỉ, gợi ý", examples: [{ hanzi: "他用眼神暗示我不要说话。", translation: "Anh ấy dùng ánh mắt ám chỉ tôi đừng nói chuyện." }] },
  { id: 4307, hanzi: "昂贵", pinyin: "ángguì", meaning: "Đắt đỏ", examples: [{ hanzi: "这件珠宝非常昂贵。", translation: "Món đồ trang sức này vô cùng đắt đỏ." }] },
  { id: 4308, hanzi: "凹凸", pinyin: "āotū", meaning: "Lồi lõm", examples: [{ hanzi: "这条路凹凸不平，很难走。", translation: "Con đường này lồi lõm không bằng phẳng, rất khó đi." }] },
  { id: 4309, hanzi: "熬", pinyin: "áo", meaning: "Nấu, hầm; chịu đựng", examples: [{ hanzi: "这锅汤需要熬两个小时。", translation: "Nồi canh này cần hầm hai tiếng." }] },
  { id: 4310, hanzi: "奥秘", pinyin: "àomì", meaning: "Bí ẩn, huyền bí", examples: [{ hanzi: "宇宙的奥秘吸引着无数科学家去探索。", translation: "Bí ẩn của vũ trụ thu hút vô số nhà khoa học đi khám phá." }] },
  { id: 4311, hanzi: "巴不得", pinyin: "bābude", meaning: "Mong sao, chỉ mong", examples: [{ hanzi: "我巴不得现在就放假。", translation: "Tôi chỉ mong được nghỉ lễ ngay bây giờ." }] },
  { id: 4312, hanzi: "巴结", pinyin: "bājie", meaning: "Nịnh bợ", examples: [{ hanzi: "他总是巴结领导。", translation: "Anh ta luôn nịnh bợ lãnh đạo." }] },
  { id: 4313, hanzi: "扒", pinyin: "bā", meaning: "Bới, cào; bóc", examples: [{ hanzi: "他把橘子皮扒了。", translation: "Anh ấy đã bóc vỏ quýt." }] },
  { id: 4314, hanzi: "疤", pinyin: "bā", meaning: "Sẹo", examples: [{ hanzi: "他脸上有一道疤。", translation: "Trên mặt anh ấy có một vết sẹo." }] },
  { id: 4315, hanzi: "拔苗助长", pinyin: "bámiáozhùzhǎng", meaning: "Nóng vội, đốt cháy giai đoạn", examples: [{ hanzi: "教育孩子不能拔苗助长。", translation: "Giáo dục con cái không thể nóng vội đốt cháy giai đoạn." }] },
  { id: 4316, hanzi: "把关", pinyin: "bǎguān", meaning: "Kiểm soát, giữ cửa", examples: [{ hanzi: "产品质量一定要严格把关。", translation: "Chất lượng sản phẩm nhất định phải kiểm soát nghiêm ngặt." }] },
  { id: 4317, hanzi: "把手", pinyin: "bǎshou", meaning: "Tay cầm, tay nắm", examples: [{ hanzi: "门把手坏了。", translation: "Tay nắm cửa hỏng rồi." }] },
  { id: 4318, hanzi: "罢工", pinyin: "bàgōng", meaning: "Đình công", examples: [{ hanzi: "工人们决定举行罢工。", translation: "Các công nhân quyết định tổ chức đình công." }] },
  { id: 4319, hanzi: "霸道", pinyin: "bàdào", meaning: "Bá đạo, ngang ngược", examples: [{ hanzi: "他这个人很霸道，总是不听别人的意见。", translation: "Con người anh ta rất ngang ngược, luôn không nghe ý kiến của người khác." }] },
  { id: 4320, hanzi: "掰", pinyin: "bāi", meaning: "Bẻ, tách ra", examples: [{ hanzi: "他把面包掰成两半。", translation: "Anh ấy bẻ bánh mì thành hai nửa." }] },
  { id: 4321, hanzi: "摆脱", pinyin: "bǎituō", meaning: "Thoát khỏi", examples: [{ hanzi: "他终于摆脱了困境。", translation: "Anh ấy cuối cùng đã thoát khỏi tình thế khó khăn." }] },
  { id: 4322, hanzi: "拜访", pinyin: "bàifǎng", meaning: "Thăm viếng", examples: [{ hanzi: "我明天要去拜访一位老朋友。", translation: "Ngày mai tôi phải đi thăm một người bạn cũ." }] },
  { id: 4323, hanzi: "拜年", pinyin: "bàinián", meaning: "Chúc Tết", examples: [{ hanzi: "春节的时候，我们要去给亲戚拜年。", translation: "Lúc Tết, chúng tôi phải đi chúc Tết họ hàng." }] },
  { id: 4324, hanzi: "拜托", pinyin: "bàituō", meaning: "Nhờ vả, làm ơn", examples: [{ hanzi: "这件事就拜托你了。", translation: "Chuyện này nhờ cả vào bạn." }] },
  { id: 4325, hanzi: "败坏", pinyin: "bàihuài", meaning: "Làm hỏng, bại hoại", examples: [{ hanzi: "他的行为败坏了公司的名声。", translation: "Hành vi của anh ta đã làm bại hoại danh tiếng của công ty." }] },
  { id: 4326, hanzi: "颁布", pinyin: "bānbù", meaning: "Ban bố", examples: [{ hanzi: "政府颁布了新的法律。", translation: "Chính phủ đã ban bố luật mới." }] },
  { id: 4327, hanzi: "颁发", pinyin: "bānfā", meaning: "Ban phát, cấp phát", examples: [{ hanzi: "学校给获奖学生颁发了奖状。", translation: "Nhà trường đã cấp phát giấy khen cho học sinh đoạt giải." }] },
  { id: 4328, hanzi: "斑", pinyin: "bān", meaning: "Vết, đốm", examples: [{ hanzi: "这只猫身上有黑色的斑点。", translation: "Trên người con mèo này có những đốm đen." }] },
  { id: 4329, hanzi: "版本", pinyin: "bǎnběn", meaning: "Phiên bản", examples: [{ hanzi: "这个软件有几个不同的版本。", translation: "Phần mềm này có mấy phiên bản khác nhau." }] },
  { id: 4330, hanzi: "半途而废", pinyin: "bàntú'érfèi", meaning: "Bỏ cuộc giữa chừng", examples: [{ hanzi: "做事不能半途而废。", translation: "Làm việc không thể bỏ cuộc giữa chừng." }] },
  { id: 4331, hanzi: "半岛", pinyin: "bàndǎo", meaning: "Bán đảo", examples: [{ hanzi: "朝鲜半岛位于亚洲东部。", translation: "Bán đảo Triều Tiên nằm ở phía đông châu Á." }] },
  { id: 4332, hanzi: "伴侣", pinyin: "bànlǚ", meaning: "Bạn đời", examples: [{ hanzi: "他是我理想的生活伴侣。", translation: "Anh ấy là người bạn đời lý tưởng của tôi." }] },
  { id: 4333, hanzi: "伴随", pinyin: "bànsuí", meaning: "Đi cùng, kèm theo", examples: [{ hanzi: "成功往往伴随着艰辛。", translation: "Thành công thường đi kèm với gian khổ." }] },
  { id: 4334, hanzi: "扮演", pinyin: "bànyǎn", meaning: "Đóng vai", examples: [{ hanzi: "他在电影里扮演一个英雄。", translation: "Anh ấy đóng vai một anh hùng trong phim." }] },
  { id: 4335, hanzi: "绑架", pinyin: "bǎngjià", meaning: "Bắt cóc", examples: [{ hanzi: "他被匪徒绑架了。", translation: "Anh ấy đã bị bọn cướp bắt cóc." }] },
  { id: 4336, hanzi: "榜样", pinyin: "bǎngyàng", meaning: "Tấm gương", examples: [{ hanzi: "我们应该向雷锋同志学习，他是我们的好榜样。", translation: "Chúng ta nên học tập đồng chí Lôi Phong, ông là tấm gương tốt của chúng ta." }] },
  { id: 4337, hanzi: "磅", pinyin: "bàng", meaning: "Pound (đơn vị đo)", examples: [{ hanzi: "这个西瓜重十磅。", translation: "Quả dưa hấu này nặng mười pound." }] },
  { id: 4338, hanzi: "包庇", pinyin: "bāobì", meaning: "Bao che", examples: [{ hanzi: "我们不能包庇犯罪分子。", translation: "Chúng ta không thể bao che cho phần tử tội phạm." }] },
  { id: 4339, hanzi: "包袱", pinyin: "bāofu", meaning: "Gánh nặng", examples: [{ hanzi: "他心里有个沉重的包袱。", translation: "Trong lòng anh ấy có một gánh nặng trĩu." }] },
  { id: 4340, hanzi: "包围", pinyin: "bāowéi", meaning: "Bao vây", examples: [{ hanzi: "敌人被我们包围了。", translation: "Kẻ địch đã bị chúng ta bao vây." }] },
  { id: 4341, hanzi: "饱和", pinyin: "bǎohé", meaning: "Bão hòa", examples: [{ hanzi: "市场已经饱和了。", translation: "Thị trường đã bão hòa." }] },
  { id: 4342, hanzi: "饱经沧桑", pinyin: "bǎojīngcāngsāng", meaning: "Trải qua nhiều thăng trầm", examples: [{ hanzi: "这位老人饱经沧桑的脸上刻满了皱纹。", translation: "Trên khuôn mặt từng trải của ông lão này hằn đầy nếp nhăn." }] },
  { id: 4343, hanzi: "保管", pinyin: "bǎoguǎn", meaning: "Bảo quản", examples: [{ hanzi: "请把这些文件保管好。", translation: "Xin hãy bảo quản tốt những tài liệu này." }] }
];