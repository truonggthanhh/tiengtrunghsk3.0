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

export const hsk5Vocabulary: VocabularyWord[] = [
  { id: 3223, hanzi: "唉", pinyin: "āi", meaning: "Thán từ: à, ừ (biểu thị sự thất vọng hoặc đồng ý)", examples: [{ hanzi: "唉，真没办法。", translation: "Ài, thật hết cách." }] },
  { id: 3224, hanzi: "爱护", pinyin: "àihù", meaning: "Yêu quý, bảo vệ", examples: [{ hanzi: "我们都应该爱护小动物。", translation: "Chúng ta đều nên yêu quý động vật nhỏ." }] },
  { id: 3225, hanzi: "爱心", pinyin: "àixīn", meaning: "Lòng yêu thương", examples: [{ hanzi: "他是一个很有爱心的人。", translation: "Anh ấy là một người rất có lòng yêu thương." }] },
  { id: 3226, hanzi: "安慰", pinyin: "ānwèi", meaning: "An ủi", examples: [{ hanzi: "她需要你的安慰。", translation: "Cô ấy cần sự an ủi của bạn." }] },
  { id: 3227, hanzi: "安装", pinyin: "ānzhuāng", meaning: "Lắp đặt", examples: [{ hanzi: "工人正在安装空调。", translation: "Công nhân đang lắp đặt điều hòa." }] },
  { id: 3228, hanzi: "岸", pinyin: "àn", meaning: "Bờ", examples: [{ hanzi: "小船慢慢地靠岸了。", translation: "Chiếc thuyền nhỏ từ từ cập bờ." }] },
  { id: 3229, hanzi: "暗", pinyin: "àn", meaning: "Tối, ngầm", examples: [{ hanzi: "房间里很暗，看不清楚。", translation: "Trong phòng rất tối, không nhìn rõ." }] },
  { id: 3230, hanzi: "熬夜", pinyin: "áoyè", meaning: "Thức đêm", examples: [{ hanzi: "为了准备考试，他经常熬夜。", translation: "Để chuẩn bị cho kỳ thi, anh ấy thường xuyên thức đêm." }] },
  { id: 3231, hanzi: "把握", pinyin: "bǎwò", meaning: "Nắm chắc", examples: [{ hanzi: "你要把握住这次机会。", translation: "Bạn phải nắm chắc cơ hội lần này." }] },
  { id: 3232, hanzi: "摆", pinyin: "bǎi", meaning: "Bày, đặt", examples: [{ hanzi: "桌子上摆着很多花。", translation: "Trên bàn bày rất nhiều hoa." }] },
  { id: 3233, hanzi: "办理", pinyin: "bànlǐ", meaning: "Làm (thủ tục)", examples: [{ hanzi: "我要去银行办理一些业务。", translation: "Tôi phải đến ngân hàng làm một số thủ tục." }] },
  { id: 3234, hanzi: "傍晚", pinyin: "bàngwǎn", meaning: "Chập tối", examples: [{ hanzi: "傍晚的时候，我们去散步吧。", translation: "Lúc chập tối, chúng ta đi dạo đi." }] },
  { id: 3235, hanzi: "包裹", pinyin: "bāoguǒ", meaning: "Bưu kiện", examples: [{ hanzi: "我收到了一个大包裹。", translation: "Tôi đã nhận được một bưu kiện lớn." }] },
  { id: 3236, hanzi: "包含", pinyin: "bāohán", meaning: "Bao hàm", examples: [{ hanzi: "这篇文章包含了很多有用的信息。", translation: "Bài viết này bao hàm rất nhiều thông tin hữu ích." }] },
  { id: 3237, hanzi: "薄", pinyin: "báo", meaning: "Mỏng", examples: [{ hanzi: "这本书很薄。", translation: "Quyển sách này rất mỏng." }] },
  { id: 3238, hanzi: "宝贝", pinyin: "bǎobèi", meaning: "Bảo bối", examples: [{ hanzi: "你是我的小宝贝。", translation: "Em là bảo bối nhỏ của anh." }] },
  { id: 3239, hanzi: "宝贵", pinyin: "bǎoguì", meaning: "Quý báu", examples: [{ hanzi: "时间是非常宝贵的。", translation: "Thời gian là vô cùng quý báu." }] },
  { id: 3240, hanzi: "保持", pinyin: "bǎochí", meaning: "Duy trì", examples: [{ hanzi: "请保持安静。", translation: "Xin hãy duy trì sự yên tĩnh." }] },
  { id: 3241, hanzi: "保存", pinyin: "bǎocún", meaning: "Bảo tồn, lưu", examples: [{ hanzi: "请把这个文件保存一下。", translation: "Xin hãy lưu tài liệu này lại." }] },
  { id: 3242, hanzi: "保留", pinyin: "bǎoliú", meaning: "Bảo lưu", examples: [{ hanzi: "我保留我的意见。", translation: "Tôi bảo lưu ý kiến của mình." }] },
  { id: 3243, hanzi: "保险", pinyin: "bǎoxiǎn", meaning: "Bảo hiểm", examples: [{ hanzi: "你买保险了吗？", translation: "Bạn đã mua bảo hiểm chưa?" }] },
  { id: 3244, hanzi: "报告", pinyin: "bàogào", meaning: "Báo cáo", examples: [{ hanzi: "他正在写一份工作报告。", translation: "Anh ấy đang viết một bản báo cáo công việc." }] },
  { id: 3245, hanzi: "悲观", pinyin: "bēiguān", meaning: "Bi quan", examples: [{ hanzi: "不要对未来太悲观。", translation: "Đừng quá bi quan về tương lai." }] },
  { id: 3246, hanzi: "背", pinyin: "bèi", meaning: "Lưng, cõng", examples: [{ hanzi: "他背着一个大书包。", translation: "Anh ấy đang cõng một cái cặp sách lớn." }] },
  { id: 3247, hanzi: "背景", pinyin: "bèijǐng", meaning: "Bối cảnh", examples: [{ hanzi: "这张照片的背景很美。", translation: "Bối cảnh của bức ảnh này rất đẹp." }] },
  { id: 3248, hanzi: "被子", pinyin: "bèizi", meaning: "Cái chăn", examples: [{ hanzi: "天冷了，盖上被子吧。", translation: "Trời lạnh rồi, đắp chăn vào đi." }] },
  { id: 3249, hanzi: "本科", pinyin: "běnkē", meaning: "Đại học (chính quy)", examples: [{ hanzi: "他正在读本科。", translation: "Anh ấy đang học đại học." }] },
  { id: 3250, hanzi: "本领", pinyin: "běnlǐng", meaning: "Bản lĩnh", examples: [{ hanzi: "他很有本领。", translation: "Anh ấy rất có bản lĩnh." }] },
  { id: 3251, hanzi: "本质", pinyin: "běnzhì", meaning: "Bản chất", examples: [{ hanzi: "我们要看到问题的本质。", translation: "Chúng ta phải nhìn thấy bản chất của vấn đề." }] },
  { id: 3252, hanzi: "比例", pinyin: "bǐlì", meaning: "Tỷ lệ", examples: [{ hanzi: "男女比例失调了。", translation: "Tỷ lệ nam nữ đã mất cân đối." }] },
  { id: 3253, hanzi: "必然", pinyin: "bìrán", meaning: "Tất nhiên", examples: [{ hanzi: "努力是成功必然的条件。", translation: "Nỗ lực là điều kiện tất nhiên của thành công." }] },
  { id: 3254, hanzi: "必要", pinyin: "bìyào", meaning: "Cần thiết", examples: [{ hanzi: "学好基础知识是必要的。", translation: "Học tốt kiến thức cơ bản là cần thiết." }] },
  { id: 3255, hanzi: "编辑", pinyin: "biānjí", meaning: "Biên tập", examples: [{ hanzi: "他是一位图书编辑。", translation: "Anh ấy là một biên tập viên sách." }] },
  { id: 3256, hanzi: "鞭炮", pinyin: "biānpào", meaning: "Pháo", examples: [{ hanzi: "过年要放鞭炮。", translation: "Năm mới phải đốt pháo." }] },
  { id: 3257, hanzi: "便", pinyin: "biàn", meaning: "Liền, thì", examples: [{ hanzi: "他听了我的话，便去做了。", translation: "Anh ấy nghe lời tôi, liền đi làm." }] },
  { id: 3258, hanzi: "辩论", pinyin: "biànlùn", meaning: "Biện luận", examples: [{ hanzi: "他们正在进行一场激烈的辩论。", translation: "Họ đang tiến hành một cuộc biện luận kịch liệt." }] },
  { id: 3259, hanzi: "标点", pinyin: "biāodiǎn", meaning: "Dấu chấm câu", examples: [{ hanzi: "写文章要注意使用标点符号。", translation: "Viết văn cần chú ý sử dụng dấu chấm câu." }] },
  { id: 3260, hanzi: "标志", pinyin: "biāozhì", meaning: "Biểu tượng, dấu hiệu", examples: [{ hanzi: "这个标志是什么意思？", translation: "Biểu tượng này có ý nghĩa gì?" }] },
  { id: 3261, hanzi: "表达", pinyin: "biǎodá", meaning: "Bày tỏ", examples: [{ hanzi: "他不太会表达自己的感情。", translation: "Anh ấy không giỏi bày tỏ tình cảm của mình." }] },
  { id: 3262, hanzi: "表面", pinyin: "biǎomiàn", meaning: "Bề mặt", examples: [{ hanzi: "不要只看事物的表面。", translation: "Đừng chỉ nhìn bề ngoài của sự vật." }] },
  { id: 3263, hanzi: "表明", pinyin: "biǎomíng", meaning: "Bày tỏ rõ", examples: [{ hanzi: "他的态度表明了一切。", translation: "Thái độ của anh ấy đã cho thấy tất cả." }] },
  { id: 3264, hanzi: "表情", pinyin: "biǎoqíng", meaning: "Biểu cảm", examples: [{ hanzi: "她的表情很奇怪。", translation: "Biểu cảm của cô ấy rất kỳ lạ." }] },
  { id: 3265, hanzi: "表现", pinyin: "biǎoxiàn", meaning: "Biểu hiện, thể hiện", examples: [{ hanzi: "他在工作中的表现很好。", translation: "Sự thể hiện của anh ấy trong công việc rất tốt." }] },
  { id: 3266, hanzi: "丙", pinyin: "bǐng", meaning: "Bính (can thứ ba)", examples: [{ hanzi: "甲、乙、丙、丁。", translation: "Giáp, Ất, Bính, Đinh." }] },
  { id: 3267, hanzi: "病毒", pinyin: "bìngdú", meaning: "Vi-rút", examples: [{ hanzi: "电脑中病毒了。", translation: "Máy tính bị nhiễm vi-rút rồi." }] },
  { id: 3268, hanzi: "玻璃", pinyin: "bōli", meaning: "Thủy tinh", examples: [{ hanzi: "小心别打破玻璃。", translation: "Cẩn thận đừng làm vỡ kính." }] },
  { id: 3269, hanzi: "博物馆", pinyin: "bówùguǎn", meaning: "Bảo tàng", examples: [{ hanzi: "这个城市有很多博物馆。", translation: "Thành phố này có rất nhiều bảo tàng." }] },
  { id: 3270, hanzi: "脖子", pinyin: "bózi", meaning: "Cổ", examples: [{ hanzi: "他的脖子很长。", translation: "Cổ của anh ấy rất dài." }] },
  { id: 3271, hanzi: "不必", pinyin: "búbì", meaning: "Không cần", examples: [{ hanzi: "你不必担心。", translation: "Bạn không cần lo lắng." }] },
  { id: 3272, hanzi: "不断", pinyin: "búduàn", meaning: "Không ngừng", examples: [{ hanzi: "社会在不断发展。", translation: "Xã hội không ngừng phát triển." }] }
];