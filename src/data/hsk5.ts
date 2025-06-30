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
  { id: 3251, hanzi: "本质", pinyin: "běnzhì", meaning: "Bản chất", examples: [{ hanzi: "我们要看到问题的本质。", translation: "Chúng ta phải nhìn thấy bản chất của vấn đề." }] }
];