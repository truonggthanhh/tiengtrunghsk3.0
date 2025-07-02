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
  {
    id: 1,
    lesson: 1,
    bookSlug: 'quyen-1',
    title: "Giới thiệu bản thân",
    passage: "你好！我叫王小明，我是中国人。我是一名学生，在大学学习汉语。我很高兴认识你。",
    questions: [
      {
        questionText: "王小明是哪国人？",
        options: ["美国人", "中国人", "英国人", "南非人"],
        correctAnswerIndex: 1,
        explanation: "王小明 nói '我是中国人' (Tôi là người Trung Quốc)."
      },
      {
        questionText: "王小明在大学学习什么？",
        options: ["英语", "法语", "汉语", "日语"],
        correctAnswerIndex: 2,
        explanation: "王小明 nói '在大学学习汉语' (học tiếng Hán ở đại học)."
      }
    ]
  },
  {
    id: 2,
    lesson: 2,
    bookSlug: 'quyen-1',
    title: "Đi taxi",
    passage: "师傅，去人民广场多少钱？到了。谢谢！不客气。远吗？不远，很近。",
    questions: [
      {
        questionText: "Họ muốn đi đâu?",
        options: ["Ga tàu hỏa", "Sân bay", "Quảng trường Nhân Dân", "Trường học"],
        correctAnswerIndex: 2,
        explanation: "Người nói hỏi '去人民广场多少钱？' (Đến Quảng trường Nhân Dân bao nhiêu tiền?)"
      },
      {
        questionText: "Từ '远' có nghĩa là gì?",
        options: ["Gần", "Xa", "Đắt", "Rẻ"],
        correctAnswerIndex: 1,
        explanation: "Trong đoạn hội thoại có '远吗？不远，很近。' (Xa không? Không xa, rất gần.)"
      }
    ]
  },
  {
    id: 3,
    lesson: 1,
    bookSlug: 'quyen-2',
    title: "Sở thích",
    passage: "你平时喜欢做什么？我常常听音乐，也喜欢唱歌。你呢？我喜欢跳街舞，也喜欢打篮球。",
    questions: [
      {
        questionText: "Người thứ nhất thường làm gì?",
        options: ["Nghe nhạc và hát", "Nhảy hip-hop và chơi bóng rổ", "Xem tivi", "Đọc sách"],
        correctAnswerIndex: 0,
        explanation: "Người thứ nhất nói '我常常听音乐，也喜欢唱歌' (Tôi thường xuyên nghe nhạc, cũng thích hát)."
      },
      {
        questionText: "Người thứ hai thích môn thể thao nào?",
        options: ["Bóng đá", "Bóng chuyền", "Bóng rổ", "Bơi lội"],
        correctAnswerIndex: 2,
        explanation: "Người thứ hai nói '我喜欢跳街舞，也喜欢打篮球' (Tôi thích nhảy hip-hop, cũng thích chơi bóng rổ)."
      }
    ]
  },
  {
    id: 4,
    lesson: 3,
    bookSlug: 'quyen-2',
    title: "Điện thoại hết pin",
    passage: "对不起，我的手机没电了，可以借我一支笔吗？没问题。对了，你有手机吗？我没有。",
    questions: [
      {
        questionText: "Điện thoại của người nói bị làm sao?",
        options: ["Bị hỏng", "Hết pin", "Bị mất", "Không có tín hiệu"],
        correctAnswerIndex: 1,
        explanation: "Người nói nói '我的手机没电了' (Điện thoại của tôi hết pin rồi)."
      },
      {
        questionText: "Người nói muốn mượn gì?",
        options: ["Sách", "Máy tính", "Bút", "Điện thoại"],
        correctAnswerIndex: 2,
        explanation: "Người nói hỏi '可以借我一支笔吗？' (Có thể cho tôi mượn một cây bút không?)"
      }
    ]
  },
  {
    id: 5,
    lesson: 10,
    bookSlug: 'quyen-1',
    title: "Gia đình",
    passage: "照片上是谁？这是我的家人。我爸爸是律师，我妈妈是医生。我哥哥是医生，我姐姐是老师。我弟弟是学生，今年八岁。我们家有六口人。这只狗很可爱。",
    questions: [
      {
        questionText: "Bố của người nói làm nghề gì?",
        options: ["Bác sĩ", "Giáo viên", "Luật sư", "Học sinh"],
        correctAnswerIndex: 2,
        explanation: "Người nói nói '我爸爸是律师' (Bố tôi là luật sư)."
      },
      {
        questionText: "Gia đình người nói có bao nhiêu người (không tính chó)?",
        options: ["Ba", "Bốn", "Năm", "Sáu"],
        correctAnswerIndex: 3,
        explanation: "Người nói nói '我们家有六口人' (Nhà tôi có sáu người)."
      },
      {
        questionText: "Em trai của người nói bao nhiêu tuổi?",
        options: ["Bảy tuổi", "Tám tuổi", "Chín tuổi", "Mười tuổi"],
        correctAnswerIndex: 1,
        explanation: "Người nói nói '我弟弟是学生，今年八岁' (Em trai tôi là học sinh, năm nay tám tuổi)."
      }
    ]
  },
];