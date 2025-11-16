import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  ArrowLeft,
  ScrollText,
  Lock,
  MapPin,
  Star,
  CheckCircle2,
  BookOpen,
  Map,
  Trophy,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import confetti from 'canvas-confetti';

interface Lesson {
  id: string;
  title: string;
  vocabulary: VocabQuestion[];
  completed: boolean;
}

interface VocabQuestion {
  type: 'meaning' | 'pinyin' | 'hanzi' | 'sentence';
  hanzi: string;
  pinyin: string;
  meaning: string;
  question: string;
  options: string[];
  correctAnswer: string;
  sentence?: string; // For sentence type questions
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  location: string;
  description: string;
  icon: string;
  difficulty: '⭐' | '⭐⭐' | '⭐⭐⭐' | '⭐⭐⭐⭐';
  lessons: Lesson[];
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

// VOCABULARY DATABASE - ALL ANSWERS IN VIETNAMESE
// DIVERSE QUESTION TYPES: meaning, pinyin, hanzi, sentence

const vocabDatabase: Record<string, VocabQuestion[]> = {
  // CHAPTER 1: BEIJING - ⭐ EASY - Basic greetings (20 questions)
  beijing: [
    { type: 'meaning', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào', question: 'Chọn nghĩa đúng:', options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'], correctAnswer: 'Xin chào' },
    { type: 'pinyin', hanzi: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt', question: 'Chọn pinyin đúng:', options: ['zài jiàn', 'xièxiè', 'nǐ hǎo', 'duì bù qǐ'], correctAnswer: 'zài jiàn' },
    { type: 'meaning', hanzi: '谢谢', pinyin: 'xiè xiè', meaning: 'Cảm ơn', question: 'Chọn nghĩa đúng:', options: ['Xin lỗi', 'Cảm ơn', 'Xin chào', 'Tạm biệt'], correctAnswer: 'Cảm ơn' },
    { type: 'pinyin', hanzi: '对不起', pinyin: 'duì bu qǐ', meaning: 'Xin lỗi', question: 'Chọn pinyin đúng:', options: ['duì bu qǐ', 'zài jiàn', 'nǐ hǎo', 'xiè xiè'], correctAnswer: 'duì bu qǐ' },
    { type: 'meaning', hanzi: '是', pinyin: 'shì', meaning: 'Là / Phải', question: 'Chọn nghĩa đúng:', options: ['Không', 'Là / Phải', 'Có thể', 'Chưa'], correctAnswer: 'Là / Phải' },
    { type: 'hanzi', hanzi: '不', pinyin: 'bù', meaning: 'Không', question: 'Chọn chữ Hán có nghĩa "Không":', options: ['不', '是', '好', '很'], correctAnswer: '不' },
    { type: 'sentence', hanzi: '好', pinyin: 'hǎo', meaning: 'Tốt', question: 'Điền từ thích hợp: 你___吗？(Bạn có khỏe không?)', sentence: '你好吗？', options: ['好', '坏', '忙', '累'], correctAnswer: '好' },
    { type: 'meaning', hanzi: '我', pinyin: 'wǒ', meaning: 'Tôi', question: 'Chọn nghĩa đúng:', options: ['Bạn', 'Tôi', 'Anh ấy', 'Cô ấy'], correctAnswer: 'Tôi' },
    { type: 'pinyin', hanzi: '你', pinyin: 'nǐ', meaning: 'Bạn', question: 'Chọn pinyin đúng:', options: ['nǐ', 'wǒ', 'tā', 'nín'], correctAnswer: 'nǐ' },
    { type: 'hanzi', hanzi: '他', pinyin: 'tā', meaning: 'Anh ấy', question: 'Chọn chữ Hán có nghĩa "Anh ấy":', options: ['他', '她', '你', '我'], correctAnswer: '他' },
    { type: 'meaning', hanzi: '她', pinyin: 'tā', meaning: 'Cô ấy', question: 'Chọn nghĩa đúng:', options: ['Anh ấy', 'Cô ấy', 'Tôi', 'Bạn'], correctAnswer: 'Cô ấy' },
    { type: 'sentence', hanzi: '们', pinyin: 'men', meaning: '(số nhiều)', question: 'Điền từ thích hợp: 我___(chúng tôi)', sentence: '我们', options: ['们', '的', '和', '也'], correctAnswer: '们' },
    { type: 'pinyin', hanzi: '您', pinyin: 'nín', meaning: 'Ngài (lịch sự)', question: 'Chọn pinyin đúng:', options: ['nín', 'nǐ', 'nǐmen', 'tā'], correctAnswer: 'nín' },
    { type: 'meaning', hanzi: '早上好', pinyin: 'zǎo shang hǎo', meaning: 'Chào buổi sáng', question: 'Chọn nghĩa đúng:', options: ['Chào buổi sáng', 'Chào buổi trưa', 'Chào buổi tối', 'Chúc ngủ ngon'], correctAnswer: 'Chào buổi sáng' },
    { type: 'hanzi', hanzi: '晚安', pinyin: 'wǎn ān', meaning: 'Chúc ngủ ngon', question: 'Chọn chữ Hán có nghĩa "Chúc ngủ ngon":', options: ['晚安', '早安', '午安', '你好'], correctAnswer: '晚安' },
    { type: 'sentence', hanzi: '请', pinyin: 'qǐng', meaning: 'Xin mời / Làm ơn', question: 'Điền từ thích hợp: ___进。(Mời vào)', sentence: '请进。', options: ['请', '谢', '对', '好'], correctAnswer: '请' },
    { type: 'meaning', hanzi: '没关系', pinyin: 'méi guān xi', meaning: 'Không sao', question: 'Chọn nghĩa đúng:', options: ['Không sao', 'Xin lỗi', 'Cảm ơn', 'Tạm biệt'], correctAnswer: 'Không sao' },
    { type: 'pinyin', hanzi: '不客气', pinyin: 'bú kè qi', meaning: 'Không có gì', question: 'Chọn pinyin đúng:', options: ['bú kè qi', 'xiè xie', 'duì bù qǐ', 'zài jiàn'], correctAnswer: 'bú kè qi' },
    { type: 'hanzi', hanzi: '欢迎', pinyin: 'huān yíng', meaning: 'Chào mừng', question: 'Chọn chữ Hán có nghĩa "Chào mừng":', options: ['欢迎', '再见', '谢谢', '你好'], correctAnswer: '欢迎' },
    { type: 'meaning', hanzi: '认识你很高兴', pinyin: 'rèn shi nǐ hěn gāo xìng', meaning: 'Rất vui được gặp bạn', question: 'Chọn nghĩa đúng:', options: ['Rất vui được gặp bạn', 'Tạm biệt', 'Xin lỗi', 'Cảm ơn'], correctAnswer: 'Rất vui được gặp bạn' },
  ],

  // CHAPTER 2: SHANGHAI - ⭐ EASY - Daily activities (20 questions)
  shanghai: [
    { type: 'meaning', hanzi: '吃饭', pinyin: 'chī fàn', meaning: 'Ăn cơm', question: 'Chọn nghĩa đúng:', options: ['Ăn cơm', 'Uống nước', 'Ngủ', 'Đi bộ'], correctAnswer: 'Ăn cơm' },
    { type: 'pinyin', hanzi: '喝水', pinyin: 'hē shuǐ', meaning: 'Uống nước', question: 'Chọn pinyin đúng:', options: ['hē shuǐ', 'chī fàn', 'mǎi', 'qián'], correctAnswer: 'hē shuǐ' },
    { type: 'meaning', hanzi: '买', pinyin: 'mǎi', meaning: 'Mua', question: 'Chọn nghĩa đúng:', options: ['Bán', 'Mua', 'Ăn', 'Uống'], correctAnswer: 'Mua' },
    { type: 'hanzi', hanzi: '钱', pinyin: 'qián', meaning: 'Tiền', question: 'Chọn chữ Hán có nghĩa "Tiền":', options: ['钱', '时', '饭', '水'], correctAnswer: '钱' },
    { type: 'meaning', hanzi: '多少', pinyin: 'duō shǎo', meaning: 'Bao nhiêu', question: 'Chọn nghĩa đúng:', options: ['Ở đâu', 'Khi nào', 'Bao nhiêu', 'Tại sao'], correctAnswer: 'Bao nhiêu' },
    { type: 'meaning', hanzi: '便宜', pinyin: 'pián yi', meaning: 'Rẻ', question: 'Chọn nghĩa đúng:', options: ['Đắt', 'Rẻ', 'Tốt', 'Xấu'], correctAnswer: 'Rẻ' },
    { type: 'sentence', hanzi: '睡觉', pinyin: 'shuì jiào', meaning: 'Ngủ', question: 'Điền từ thích hợp: 我要___了。(Tôi muốn đi ngủ)', sentence: '我要睡觉了。', options: ['睡觉', '起床', '工作', '玩'], correctAnswer: '睡觉' },
    { type: 'hanzi', hanzi: '工作', pinyin: 'gōng zuò', meaning: 'Làm việc', question: 'Chọn chữ Hán có nghĩa "Làm việc":', options: ['工作', '学习', '休息', '玩'], correctAnswer: '工作' },
    { type: 'pinyin', hanzi: '学习', pinyin: 'xué xí', meaning: 'Học tập', question: 'Chọn pinyin đúng:', options: ['xué xí', 'gōng zuò', 'xiū xi', 'wán'], correctAnswer: 'xué xí' },
    { type: 'meaning', hanzi: '休息', pinyin: 'xiū xi', meaning: 'Nghỉ ngơi', question: 'Chọn nghĩa đúng:', options: ['Làm việc', 'Nghỉ ngơi', 'Học', 'Chơi'], correctAnswer: 'Nghỉ ngơi' },
    { type: 'sentence', hanzi: '去', pinyin: 'qù', meaning: 'Đi', question: 'Điền từ thích hợp: 我要___上海。(Tôi muốn đi Thượng Hải)', sentence: '我要去上海。', options: ['去', '来', '在', '从'], correctAnswer: '去' },
    { type: 'hanzi', hanzi: '来', pinyin: 'lái', meaning: 'Đến', question: 'Chọn chữ Hán có nghĩa "Đến":', options: ['来', '去', '走', '跑'], correctAnswer: '来' },
    { type: 'pinyin', hanzi: '看', pinyin: 'kàn', meaning: 'Xem / Nhìn', question: 'Chọn pinyin đúng:', options: ['kàn', 'tīng', 'shuō', 'xiě'], correctAnswer: 'kàn' },
    { type: 'meaning', hanzi: '听', pinyin: 'tīng', meaning: 'Nghe', question: 'Chọn nghĩa đúng:', options: ['Xem', 'Nghe', 'Nói', 'Viết'], correctAnswer: 'Nghe' },
    { type: 'sentence', hanzi: '说', pinyin: 'shuō', meaning: 'Nói', question: 'Điền từ thích hợp: 他___中文。(Anh ấy nói tiếng Trung)', sentence: '他说中文。', options: ['说', '听', '看', '写'], correctAnswer: '说' },
    { type: 'hanzi', hanzi: '写', pinyin: 'xiě', meaning: 'Viết', question: 'Chọn chữ Hán có nghĩa "Viết":', options: ['写', '读', '说', '听'], correctAnswer: '写' },
    { type: 'pinyin', hanzi: '读', pinyin: 'dú', meaning: 'Đọc', question: 'Chọn pinyin đúng:', options: ['dú', 'xiě', 'shuō', 'tīng'], correctAnswer: 'dú' },
    { type: 'meaning', hanzi: '打电话', pinyin: 'dǎ diàn huà', meaning: 'Gọi điện thoại', question: 'Chọn nghĩa đúng:', options: ['Gọi điện thoại', 'Gửi tin nhắn', 'Viết thư', 'Xem TV'], correctAnswer: 'Gọi điện thoại' },
    { type: 'sentence', hanzi: '上网', pinyin: 'shàng wǎng', meaning: 'Lên mạng', question: 'Điền từ thích hợp: 我喜欢___。(Tôi thích lên mạng)', sentence: '我喜欢上网。', options: ['上网', '看书', '睡觉', '运动'], correctAnswer: '上网' },
    { type: 'hanzi', hanzi: '时间', pinyin: 'shí jiān', meaning: 'Thời gian', question: 'Chọn chữ Hán có nghĩa "Thời gian":', options: ['时间', '地点', '人', '钱'], correctAnswer: '时间' },
  ],

  // CHAPTER 3: GREAT WALL - ⭐⭐ MEDIUM - Culture & history (20 questions)
  greatwall: [
    { type: 'meaning', hanzi: '历史', pinyin: 'lì shǐ', meaning: 'Lịch sử', question: 'Chọn nghĩa đúng:', options: ['Lịch sử', 'Văn hóa', 'Nghệ thuật', 'Khoa học'], correctAnswer: 'Lịch sử' },
    { type: 'pinyin', hanzi: '文化', pinyin: 'wén huà', meaning: 'Văn hóa', question: 'Chọn pinyin đúng:', options: ['wén huà', 'lì shǐ', 'cháng chéng', 'gǔ lǎo'], correctAnswer: 'wén huà' },
    { type: 'hanzi', hanzi: '长城', pinyin: 'cháng chéng', meaning: 'Vạn Lý Trường Thành', question: 'Chọn chữ Hán có nghĩa "Vạn Lý Trường Thành":', options: ['长城', '宫殿', '寺庙', '山'], correctAnswer: '长城' },
    { type: 'meaning', hanzi: '古老', pinyin: 'gǔ lǎo', meaning: 'Cổ xưa', question: 'Chọn nghĩa đúng:', options: ['Hiện đại', 'Cổ xưa', 'Mới', 'Trẻ'], correctAnswer: 'Cổ xưa' },
    { type: 'sentence', hanzi: '美丽', pinyin: 'měi lì', meaning: 'Đẹp', question: 'Điền từ thích hợp: 这个地方很___。(Nơi này rất đẹp)', sentence: '这个地方很美丽。', options: ['美丽', '古老', '现代', '高'], correctAnswer: '美丽' },
    { type: 'meaning', hanzi: '壮观', pinyin: 'zhuàng guān', meaning: 'Hùng vĩ', question: 'Chọn nghĩa đúng:', options: ['Nhỏ bé', 'Hùng vĩ', 'Nhàm chán', 'Đơn giản'], correctAnswer: 'Hùng vĩ' },
    { type: 'pinyin', hanzi: '建筑', pinyin: 'jiàn zhù', meaning: 'Kiến trúc', question: 'Chọn pinyin đúng:', options: ['jiàn zhù', 'huì huà', 'yīn yuè', 'wǔ dǎo'], correctAnswer: 'jiàn zhù' },
    { type: 'hanzi', hanzi: '长', pinyin: 'cháng', meaning: 'Dài', question: 'Chọn chữ Hán có nghĩa "Dài":', options: ['长', '短', '高', '低'], correctAnswer: '长' },
    { type: 'sentence', hanzi: '伟大', pinyin: 'wěi dà', meaning: 'Vĩ đại', question: 'Điền từ thích hợp: 长城是___的建筑。(Vạn Lý Trường Thành là kiến trúc vĩ đại)', sentence: '长城是伟大的建筑。', options: ['伟大', '小', '丑', '新'], correctAnswer: '伟大' },
    { type: 'meaning', hanzi: '参观', pinyin: 'cān guān', meaning: 'Tham quan', question: 'Chọn nghĩa đúng:', options: ['Tham quan', 'Xây dựng', 'Phá hủy', 'Mua'], correctAnswer: 'Tham quan' },
    { type: 'pinyin', hanzi: '游客', pinyin: 'yóu kè', meaning: 'Du khách', question: 'Chọn pinyin đúng:', options: ['yóu kè', 'gōng rén', 'lǎo shī', 'yī shēng'], correctAnswer: 'yóu kè' },
    { type: 'hanzi', hanzi: '拍照', pinyin: 'pāi zhào', meaning: 'Chụp ảnh', question: 'Chọn chữ Hán có nghĩa "Chụp ảnh":', options: ['拍照', '画画', '唱歌', '跳舞'], correctAnswer: '拍照' },
    { type: 'meaning', hanzi: '风景', pinyin: 'fēng jǐng', meaning: 'Phong cảnh', question: 'Chọn nghĩa đúng:', options: ['Phong cảnh', 'Thời tiết', 'Mùa', 'Ngày'], correctAnswer: 'Phong cảnh' },
    { type: 'sentence', hanzi: '爬', pinyin: 'pá', meaning: 'Leo', question: 'Điền từ thích hợp: 我们___长城。(Chúng tôi leo Vạn Lý Trường Thành)', sentence: '我们爬长城。', options: ['爬', '跑', '飞', '游'], correctAnswer: '爬' },
    { type: 'pinyin', hanzi: '石头', pinyin: 'shí tou', meaning: 'Đá', question: 'Chọn pinyin đúng:', options: ['shí tou', 'mù tou', 'tiě', 'jīn'], correctAnswer: 'shí tou' },
    { type: 'meaning', hanzi: '城墙', pinyin: 'chéng qiáng', meaning: 'Tường thành', question: 'Chọn nghĩa đúng:', options: ['Cổng', 'Tường thành', 'Tòa tháp', 'Cầu'], correctAnswer: 'Tường thành' },
    { type: 'hanzi', hanzi: '保护', pinyin: 'bǎo hù', meaning: 'Bảo vệ', question: 'Chọn chữ Hán có nghĩa "Bảo vệ":', options: ['保护', '破坏', '建造', '拆'], correctAnswer: '保护' },
    { type: 'sentence', hanzi: '世界遗产', pinyin: 'shì jiè yí chǎn', meaning: 'Di sản thế giới', question: 'Điền từ thích hợp: 长城是___。(Vạn Lý Trường Thành là di sản thế giới)', sentence: '长城是世界遗产。', options: ['世界遗产', '新建筑', '商店', '学校'], correctAnswer: '世界遗产' },
    { type: 'pinyin', hanzi: '著名', pinyin: 'zhù míng', meaning: 'Nổi tiếng', question: 'Chọn pinyin đúng:', options: ['zhù míng', 'pǔ tōng', 'mò shēng', 'xīn'], correctAnswer: 'zhù míng' },
    { type: 'meaning', hanzi: '千年', pinyin: 'qiān nián', meaning: 'Nghìn năm', question: 'Chọn nghĩa đúng:', options: ['Một năm', 'Nghìn năm', 'Trăm năm', 'Mười năm'], correctAnswer: 'Nghìn năm' },
  ],

  // CHAPTER 4: XI'AN - ⭐⭐ MEDIUM - Food & taste (20 questions)
  xian: [
    { type: 'meaning', hanzi: '面条', pinyin: 'miàn tiáo', meaning: 'Mì', question: 'Chọn nghĩa đúng:', options: ['Cơm', 'Mì', 'Bánh mì', 'Súp'], correctAnswer: 'Mì' },
    { type: 'hanzi', hanzi: '饺子', pinyin: 'jiǎo zi', meaning: 'Bánh bao', question: 'Chọn chữ Hán có nghĩa "Bánh bao":', options: ['饺子', '面条', '米饭', '汤'], correctAnswer: '饺子' },
    { type: 'sentence', hanzi: '好吃', pinyin: 'hǎo chī', meaning: 'Ngon', question: 'Điền từ thích hợp: 这个菜很___。(Món này rất ngon)', sentence: '这个菜很好吃。', options: ['好吃', '难吃', '甜', '苦'], correctAnswer: '好吃' },
    { type: 'meaning', hanzi: '辣', pinyin: 'là', meaning: 'Cay', question: 'Chọn nghĩa đúng:', options: ['Ngọt', 'Chua', 'Cay', 'Mặn'], correctAnswer: 'Cay' },
    { type: 'pinyin', hanzi: '甜', pinyin: 'tián', meaning: 'Ngọt', question: 'Chọn pinyin đúng:', options: ['tián', 'suān', 'kǔ', 'xián'], correctAnswer: 'tián' },
    { type: 'meaning', hanzi: '咸', pinyin: 'xián', meaning: 'Mặn', question: 'Chọn nghĩa đúng:', options: ['Ngọt', 'Mặn', 'Cay', 'Chua'], correctAnswer: 'Mặn' },
    { type: 'meaning', hanzi: '酸', pinyin: 'suān', meaning: 'Chua', question: 'Chọn nghĩa đúng:', options: ['Ngọt', 'Chua', 'Đắng', 'Mặn'], correctAnswer: 'Chua' },
    { type: 'hanzi', hanzi: '苦', pinyin: 'kǔ', meaning: 'Đắng', question: 'Chọn chữ Hán có nghĩa "Đắng":', options: ['苦', '甜', '酸', '咸'], correctAnswer: '苦' },
    { type: 'pinyin', hanzi: '米饭', pinyin: 'mǐ fàn', meaning: 'Cơm', question: 'Chọn pinyin đúng:', options: ['mǐ fàn', 'miàn tiáo', 'bāo zi', 'tāng'], correctAnswer: 'mǐ fàn' },
    { type: 'sentence', hanzi: '菜', pinyin: 'cài', meaning: 'Rau / Món ăn', question: 'Điền từ thích hợp: 这个___好吃。(Món này ngon)', sentence: '这个菜好吃。', options: ['菜', '水', '书', '车'], correctAnswer: '菜' },
    { type: 'meaning', hanzi: '肉', pinyin: 'ròu', meaning: 'Thịt', question: 'Chọn nghĩa đúng:', options: ['Cá', 'Thịt', 'Rau', 'Trứng'], correctAnswer: 'Thịt' },
    { type: 'hanzi', hanzi: '鱼', pinyin: 'yú', meaning: 'Cá', question: 'Chọn chữ Hán có nghĩa "Cá":', options: ['鱼', '肉', '菜', '蛋'], correctAnswer: '鱼' },
    { type: 'pinyin', hanzi: '鸡蛋', pinyin: 'jī dàn', meaning: 'Trứng gà', question: 'Chọn pinyin đúng:', options: ['jī dàn', 'jī ròu', 'yā ròu', 'niú ròu'], correctAnswer: 'jī dàn' },
    { type: 'meaning', hanzi: '汤', pinyin: 'tāng', meaning: 'Súp', question: 'Chọn nghĩa đúng:', options: ['Nước', 'Súp', 'Trà', 'Cà phê'], correctAnswer: 'Súp' },
    { type: 'sentence', hanzi: '茶', pinyin: 'chá', meaning: 'Trà', question: 'Điền từ thích hợp: 我喜欢喝___。(Tôi thích uống trà)', sentence: '我喜欢喝茶。', options: ['茶', '酒', '奶', '汤'], correctAnswer: '茶' },
    { type: 'hanzi', hanzi: '咖啡', pinyin: 'kā fēi', meaning: 'Cà phê', question: 'Chọn chữ Hán có nghĩa "Cà phê":', options: ['咖啡', '茶', '奶', '酒'], correctAnswer: '咖啡' },
    { type: 'pinyin', hanzi: '牛奶', pinyin: 'niú nǎi', meaning: 'Sữa', question: 'Chọn pinyin đúng:', options: ['niú nǎi', 'dòu jiāng', 'guǒ zhī', 'kě lè'], correctAnswer: 'niú nǎi' },
    { type: 'meaning', hanzi: '果汁', pinyin: 'guǒ zhī', meaning: 'Nước ép trái cây', question: 'Chọn nghĩa đúng:', options: ['Sữa', 'Nước ép trái cây', 'Nước lọc', 'Rượu'], correctAnswer: 'Nước ép trái cây' },
    { type: 'sentence', hanzi: '水果', pinyin: 'shuǐ guǒ', meaning: 'Trái cây', question: 'Điền từ thích hợp: 我喜欢吃___。(Tôi thích ăn trái cây)', sentence: '我喜欢吃水果。', options: ['水果', '蔬菜', '肉', '饭'], correctAnswer: '水果' },
    { type: 'hanzi', hanzi: '蔬菜', pinyin: 'shū cài', meaning: 'Rau', question: 'Chọn chữ Hán có nghĩa "Rau":', options: ['蔬菜', '水果', '肉', '鱼'], correctAnswer: '蔬菜' },
  ],

  // CHAPTER 5: CHENGDU - ⭐⭐ MEDIUM - Animals & nature (20 questions)
  chengdu: [
    { type: 'meaning', hanzi: '熊猫', pinyin: 'xióng māo', meaning: 'Gấu trúc', question: 'Chọn nghĩa đúng:', options: ['Gấu trúc', 'Hổ', 'Sư tử', 'Gấu'], correctAnswer: 'Gấu trúc' },
    { type: 'sentence', hanzi: '动物', pinyin: 'dòng wù', meaning: 'Động vật', question: 'Điền từ thích hợp: 熊猫是一种___。(Gấu trúc là một loài động vật)', sentence: '熊猫是一种动物。', options: ['动物', '植物', '人', '东西'], correctAnswer: '动物' },
    { type: 'pinyin', hanzi: '可爱', pinyin: 'kě ài', meaning: 'Dễ thương', question: 'Chọn pinyin đúng:', options: ['kě ài', 'chǒu', 'kě pà', 'dà'], correctAnswer: 'kě ài' },
    { type: 'hanzi', hanzi: '自然', pinyin: 'zì rán', meaning: 'Thiên nhiên', question: 'Chọn chữ Hán có nghĩa "Thiên nhiên":', options: ['自然', '城市', '建筑', '汽车'], correctAnswer: '自然' },
    { type: 'meaning', hanzi: '森林', pinyin: 'sēn lín', meaning: 'Rừng', question: 'Chọn nghĩa đúng:', options: ['Sa mạc', 'Đại dương', 'Rừng', 'Núi'], correctAnswer: 'Rừng' },
    { type: 'meaning', hanzi: '竹子', pinyin: 'zhú zi', meaning: 'Tre', question: 'Chọn nghĩa đúng:', options: ['Cây', 'Tre', 'Cỏ', 'Hoa'], correctAnswer: 'Tre' },
    { type: 'sentence', hanzi: '保护', pinyin: 'bǎo hù', meaning: 'Bảo vệ', question: 'Điền từ thích hợp: 我们要___大自然。(Chúng ta phải bảo vệ thiên nhiên)', sentence: '我们要保护大自然。', options: ['保护', '破坏', '卖', '吃'], correctAnswer: '保护' },
    { type: 'pinyin', hanzi: '珍稀', pinyin: 'zhēn xī', meaning: 'Quý hiếm', question: 'Chọn pinyin đúng:', options: ['zhēn xī', 'pǔ tōng', 'duō', 'shǎo'], correctAnswer: 'zhēn xī' },
    { type: 'meaning', hanzi: '可爱的', pinyin: 'kě ài de', meaning: 'Đáng yêu', question: 'Chọn nghĩa đúng:', options: ['Đáng sợ', 'Đáng yêu', 'Giận dữ', 'Buồn'], correctAnswer: 'Đáng yêu' },
    { type: 'hanzi', hanzi: '老虎', pinyin: 'lǎo hǔ', meaning: 'Hổ', question: 'Chọn chữ Hán có nghĩa "Hổ":', options: ['老虎', '狮子', '熊猫', '猴子'], correctAnswer: '老虎' },
    { type: 'pinyin', hanzi: '狮子', pinyin: 'shī zi', meaning: 'Sư tử', question: 'Chọn pinyin đúng:', options: ['shī zi', 'lǎo hǔ', 'xióng māo', 'hóu zi'], correctAnswer: 'shī zi' },
    { type: 'sentence', hanzi: '大象', pinyin: 'dà xiàng', meaning: 'Voi', question: 'Điền từ thích hợp: ___很大。(Voi rất to)', sentence: '大象很大。', options: ['大象', '老鼠', '猫', '狗'], correctAnswer: '大象' },
    { type: 'meaning', hanzi: '猴子', pinyin: 'hóu zi', meaning: 'Khỉ', question: 'Chọn nghĩa đúng:', options: ['Khỉ', 'Hổ', 'Sư tử', 'Voi'], correctAnswer: 'Khỉ' },
    { type: 'hanzi', hanzi: '鸟', pinyin: 'niǎo', meaning: 'Chim', question: 'Chọn chữ Hán có nghĩa "Chim":', options: ['鸟', '鱼', '猫', '狗'], correctAnswer: '鸟' },
    { type: 'pinyin', hanzi: '花', pinyin: 'huā', meaning: 'Hoa', question: 'Chọn pinyin đúng:', options: ['huā', 'cǎo', 'shù', 'yè'], correctAnswer: 'huā' },
    { type: 'meaning', hanzi: '树', pinyin: 'shù', meaning: 'Cây', question: 'Chọn nghĩa đúng:', options: ['Cỏ', 'Hoa', 'Cây', 'Lá'], correctAnswer: 'Cây' },
    { type: 'sentence', hanzi: '草', pinyin: 'cǎo', meaning: 'Cỏ', question: 'Điền từ thích hợp: 绿色的___。(Cỏ xanh)', sentence: '绿色的草。', options: ['草', '水', '天', '云'], correctAnswer: '草' },
    { type: 'hanzi', hanzi: '叶子', pinyin: 'yè zi', meaning: 'Lá cây', question: 'Chọn chữ Hán có nghĩa "Lá cây":', options: ['叶子', '花', '草', '根'], correctAnswer: '叶子' },
    { type: 'pinyin', hanzi: '环境', pinyin: 'huán jìng', meaning: 'Môi trường', question: 'Chọn pinyin đúng:', options: ['huán jìng', 'chéng shì', 'xiāng cūn', 'guó jiā'], correctAnswer: 'huán jìng' },
    { type: 'meaning', hanzi: '生态', pinyin: 'shēng tài', meaning: 'Sinh thái', question: 'Chọn nghĩa đúng:', options: ['Sinh thái', 'Kinh tế', 'Chính trị', 'Văn hóa'], correctAnswer: 'Sinh thái' },
  ],

  // CHAPTER 6: GUILIN - ⭐⭐⭐ HARD - Scenery & travel (20 questions)
  guilin: [
    { type: 'meaning', hanzi: '山', pinyin: 'shān', meaning: 'Núi', question: 'Chọn nghĩa đúng:', options: ['Sông', 'Núi', 'Biển', 'Hồ'], correctAnswer: 'Núi' },
    { type: 'hanzi', hanzi: '水', pinyin: 'shuǐ', meaning: 'Nước', question: 'Chọn chữ Hán có nghĩa "Nước":', options: ['火', '水', '风', '土'], correctAnswer: '水' },
    { type: 'sentence', hanzi: '河', pinyin: 'hé', meaning: 'Sông', question: 'Điền từ thích hợp: 桂林的___很美。(Sông ở Quế Lâm rất đẹp)', sentence: '桂林的河很美。', options: ['河', '海', '湖', '洋'], correctAnswer: '河' },
    { type: 'pinyin', hanzi: '风景', pinyin: 'fēng jǐng', meaning: 'Phong cảnh', question: 'Chọn pinyin đúng:', options: ['fēng jǐng', 'jiàn zhù', 'qì chē', 'shí wù'], correctAnswer: 'fēng jǐng' },
    { type: 'meaning', hanzi: '旅游', pinyin: 'lǚ yóu', meaning: 'Du lịch', question: 'Chọn nghĩa đúng:', options: ['Làm việc', 'Học tập', 'Du lịch', 'Ngủ'], correctAnswer: 'Du lịch' },
    { type: 'hanzi', hanzi: '照相', pinyin: 'zhào xiàng', meaning: 'Chụp ảnh', question: 'Chọn chữ Hán có nghĩa "Chụp ảnh":', options: ['画', '照相', '写', '唱'], correctAnswer: '照相' },
    { type: 'sentence', hanzi: '美景', pinyin: 'měi jǐng', meaning: 'Cảnh đẹp', question: 'Điền từ thích hợp: 这里的___如画。(Cảnh đẹp nơi đây như tranh vẽ)', sentence: '这里的美景如画。', options: ['美景', '丑景', '黑夜', '雨天'], correctAnswer: '美景' },
    { type: 'meaning', hanzi: '漂亮', pinyin: 'piào liang', meaning: 'Xinh đẹp', question: 'Chọn nghĩa đúng:', options: ['Xấu', 'Xinh đẹp', 'To', 'Nhỏ'], correctAnswer: 'Xinh đẹp' },
    { type: 'pinyin', hanzi: '自然美', pinyin: 'zì rán měi', meaning: 'Vẻ đẹp tự nhiên', question: 'Chọn pinyin đúng:', options: ['zì rán měi', 'rén gōng', 'chéng shì', 'xiàn dài'], correctAnswer: 'zì rán měi' },
    { type: 'meaning', hanzi: '如画', pinyin: 'rú huà', meaning: 'Như tranh vẽ', question: 'Chọn nghĩa đúng:', options: ['Xấu xí', 'Như tranh vẽ', 'Nhàm chán', 'Đơn điệu'], correctAnswer: 'Như tranh vẽ' },
    { type: 'hanzi', hanzi: '湖', pinyin: 'hú', meaning: 'Hồ', question: 'Chọn chữ Hán có nghĩa "Hồ":', options: ['湖', '河', '海', '洋'], correctAnswer: '湖' },
    { type: 'pinyin', hanzi: '海', pinyin: 'hǎi', meaning: 'Biển', question: 'Chọn pinyin đúng:', options: ['hǎi', 'hé', 'hú', 'jiāng'], correctAnswer: 'hǎi' },
    { type: 'sentence', hanzi: '岛', pinyin: 'dǎo', meaning: 'Đảo', question: 'Điền từ thích hợp: 这是一个美丽的___。(Đây là một hòn đảo đẹp)', sentence: '这是一个美丽的岛。', options: ['岛', '山', '城', '村'], correctAnswer: '岛' },
    { type: 'meaning', hanzi: '桥', pinyin: 'qiáo', meaning: 'Cầu', question: 'Chọn nghĩa đúng:', options: ['Đường', 'Cầu', 'Tòa nhà', 'Xe'], correctAnswer: 'Cầu' },
    { type: 'hanzi', hanzi: '船', pinyin: 'chuán', meaning: 'Thuyền', question: 'Chọn chữ Hán có nghĩa "Thuyền":', options: ['船', '车', '飞机', '火车'], correctAnswer: '船' },
    { type: 'pinyin', hanzi: '游船', pinyin: 'yóu chuán', meaning: 'Du thuyền', question: 'Chọn pinyin đúng:', options: ['yóu chuán', 'huǒ chē', 'fēi jī', 'qì chē'], correctAnswer: 'yóu chuán' },
    { type: 'meaning', hanzi: '观光', pinyin: 'guān guāng', meaning: 'Tham quan', question: 'Chọn nghĩa đúng:', options: ['Làm việc', 'Tham quan', 'Nghỉ ngơi', 'Học tập'], correctAnswer: 'Tham quan' },
    { type: 'sentence', hanzi: '景点', pinyin: 'jǐng diǎn', meaning: 'Điểm du lịch', question: 'Điền từ thích hợp: 这是著名的___。(Đây là điểm du lịch nổi tiếng)', sentence: '这是著名的景点。', options: ['景点', '商店', '学校', '医院'], correctAnswer: '景点' },
    { type: 'hanzi', hanzi: '导游', pinyin: 'dǎo yóu', meaning: 'Hướng dẫn viên', question: 'Chọn chữ Hán có nghĩa "Hướng dẫn viên":', options: ['导游', '司机', '医生', '老师'], correctAnswer: '导游' },
    { type: 'pinyin', hanzi: '风光', pinyin: 'fēng guāng', meaning: 'Phong quang', question: 'Chọn pinyin đúng:', options: ['fēng guāng', 'chéng shì', 'jiàn zhù', 'rén qún'], correctAnswer: 'fēng guāng' },
  ],

  // CHAPTER 7: HONG KONG - ⭐⭐⭐ HARD - Modern city (20 questions)
  hongkong: [
    { type: 'meaning', hanzi: '繁华', pinyin: 'fán huá', meaning: 'Phồn hoa', question: 'Chọn nghĩa đúng:', options: ['Nghèo nàn', 'Phồn hoa', 'Yên tĩnh', 'Vắng vẻ'], correctAnswer: 'Phồn hoa' },
    { type: 'sentence', hanzi: '热闹', pinyin: 'rè nào', meaning: 'Náo nhiệt', question: 'Điền từ thích hợp: 香港很___。(Hồng Kông rất náo nhiệt)', sentence: '香港很热闹。', options: ['热闹', '安静', '空', '暗'], correctAnswer: '热闹' },
    { type: 'hanzi', hanzi: '现代', pinyin: 'xiàn dài', meaning: 'Hiện đại', question: 'Chọn chữ Hán có nghĩa "Hiện đại":', options: ['古代', '现代', '老', '传统'], correctAnswer: '现代' },
    { type: 'pinyin', hanzi: '高楼', pinyin: 'gāo lóu', meaning: 'Tòa nhà cao', question: 'Chọn pinyin đúng:', options: ['gāo lóu', 'xiǎo wū', 'huā yuán', 'lù'], correctAnswer: 'gāo lóu' },
    { type: 'meaning', hanzi: '购物', pinyin: 'gòu wù', meaning: 'Mua sắm', question: 'Chọn nghĩa đúng:', options: ['Làm việc', 'Mua sắm', 'Ngủ', 'Ăn'], correctAnswer: 'Mua sắm' },
    { type: 'sentence', hanzi: '美食', pinyin: 'měi shí', meaning: 'Ẩm thực ngon', question: 'Điền từ thích hợp: 香港的___很有名。(Ẩm thực Hồng Kông rất nổi tiếng)', sentence: '香港的美食很有名。', options: ['美食', '坏食', '水', '药'], correctAnswer: '美食' },
    { type: 'hanzi', hanzi: '夜景', pinyin: 'yè jǐng', meaning: 'Cảnh đêm', question: 'Chọn chữ Hán có nghĩa "Cảnh đêm":', options: ['早晨', '夜景', '下午', '日落'], correctAnswer: '夜景' },
    { type: 'pinyin', hanzi: '国际化', pinyin: 'guó jì huà', meaning: 'Quốc tế hóa', question: 'Chọn pinyin đúng:', options: ['guó jì huà', 'dāng dì', 'nóng cūn', 'xiǎo'], correctAnswer: 'guó jì huà' },
    { type: 'meaning', hanzi: '东西方', pinyin: 'dōng xī fāng', meaning: 'Đông Tây phương', question: 'Chọn nghĩa đúng:', options: ['Bắc Nam', 'Đông Tây phương', 'Lên Xuống', 'Trái Phải'], correctAnswer: 'Đông Tây phương' },
    { type: 'sentence', hanzi: '融合', pinyin: 'róng hé', meaning: 'Hòa trộn', question: 'Điền từ thích hợp: 东西文化在这里___。(Văn hóa Đông Tây hòa trộn tại đây)', sentence: '东西文化在这里融合。', options: ['融合', '分开', '打架', '避开'], correctAnswer: '融合' },
    { type: 'meaning', hanzi: '维多利亚港', pinyin: 'wéi duō lì yà gǎng', meaning: 'Cảng Victoria', question: 'Chọn nghĩa đúng:', options: ['Sân bay', 'Cảng Victoria', 'Núi', 'Chùa'], correctAnswer: 'Cảng Victoria' },
    { type: 'hanzi', hanzi: '商场', pinyin: 'shāng chǎng', meaning: 'Trung tâm thương mại', question: 'Chọn chữ Hán có nghĩa "Trung tâm thương mại":', options: ['商场', '学校', '医院', '公园'], correctAnswer: '商场' },
    { type: 'pinyin', hanzi: '地铁', pinyin: 'dì tiě', meaning: 'Tàu điện ngầm', question: 'Chọn pinyin đúng:', options: ['dì tiě', 'gōng jiāo', 'chū zū', 'huǒ chē'], correctAnswer: 'dì tiě' },
    { type: 'meaning', hanzi: '摩天大楼', pinyin: 'mó tiān dà lóu', meaning: 'Nhà chọc trời', question: 'Chọn nghĩa đúng:', options: ['Nhà nhỏ', 'Nhà chọc trời', 'Vườn', 'Cầu'], correctAnswer: 'Nhà chọc trời' },
    { type: 'sentence', hanzi: '灯光', pinyin: 'dēng guāng', meaning: 'Ánh đèn', question: 'Điền từ thích hợp: 夜晚的___很美。(Ánh đèn ban đêm rất đẹp)', sentence: '夜晚的灯光很美。', options: ['灯光', '黑暗', '太阳', '月亮'], correctAnswer: '灯光' },
    { type: 'hanzi', hanzi: '港口', pinyin: 'gǎng kǒu', meaning: 'Cảng', question: 'Chọn chữ Hán có nghĩa "Cảng":', options: ['港口', '机场', '车站', '码头'], correctAnswer: '港口' },
    { type: 'pinyin', hanzi: '繁忙', pinyin: 'fán máng', meaning: 'Bận rộn', question: 'Chọn pinyin đúng:', options: ['fán máng', 'xiū xián', 'kōng xián', 'lǎn'], correctAnswer: 'fán máng' },
    { type: 'meaning', hanzi: '发达', pinyin: 'fā dá', meaning: 'Phát triển', question: 'Chọn nghĩa đúng:', options: ['Lạc hậu', 'Phát triển', 'Nghèo', 'Cũ'], correctAnswer: 'Phát triển' },
    { type: 'sentence', hanzi: '经济', pinyin: 'jīng jì', meaning: 'Kinh tế', question: 'Điền từ thích hợp: 香港的___很发达。(Kinh tế Hồng Kông rất phát triển)', sentence: '香港的经济很发达。', options: ['经济', '农业', '历史', '地理'], correctAnswer: '经济' },
    { type: 'hanzi', hanzi: '金融中心', pinyin: 'jīn róng zhōng xīn', meaning: 'Trung tâm tài chính', question: 'Chọn chữ Hán có nghĩa "Trung tâm tài chính":', options: ['金融中心', '文化中心', '体育中心', '医疗中心'], correctAnswer: '金融中心' },
  ],

  // CHAPTER 8: FORBIDDEN CITY - ⭐⭐⭐⭐ VERY HARD - Imperial culture (20 questions)
  forbiddencity: [
    { type: 'meaning', hanzi: '皇帝', pinyin: 'huáng dì', meaning: 'Hoàng đế', question: 'Chọn nghĩa đúng:', options: ['Hoàng đế', 'Lính', 'Nông dân', 'Giáo viên'], correctAnswer: 'Hoàng đế' },
    { type: 'sentence', hanzi: '宫殿', pinyin: 'gōng diàn', meaning: 'Cung điện', question: 'Điền từ thích hợp: 这是古代的___。(Đây là cung điện cổ đại)', sentence: '这是古代的宫殿。', options: ['宫殿', '房子', '学校', '商店'], correctAnswer: '宫殿' },
    { type: 'hanzi', hanzi: '皇宫', pinyin: 'huáng gōng', meaning: 'Hoàng cung', question: 'Chọn chữ Hán có nghĩa "Hoàng cung":', options: ['寺庙', '皇宫', '市场', '花园'], correctAnswer: '皇宫' },
    { type: 'pinyin', hanzi: '古代', pinyin: 'gǔ dài', meaning: 'Thời cổ đại', question: 'Chọn pinyin đúng:', options: ['gǔ dài', 'xiàn dài', 'wèi lái', 'xiàn zài'], correctAnswer: 'gǔ dài' },
    { type: 'meaning', hanzi: '传统', pinyin: 'chuán tǒng', meaning: 'Truyền thống', question: 'Chọn nghĩa đúng:', options: ['Hiện đại', 'Truyền thống', 'Mới', 'Ngoại lai'], correctAnswer: 'Truyền thống' },
    { type: 'sentence', hanzi: '龙', pinyin: 'lóng', meaning: 'Rồng', question: 'Điền từ thích hợp: ___是中国的象征。(Rồng là biểu tượng của Trung Quốc)', sentence: '龙是中国的象征。', options: ['龙', '虎', '鸟', '鱼'], correctAnswer: '龙' },
    { type: 'hanzi', hanzi: '凤凰', pinyin: 'fèng huáng', meaning: 'Phượng hoàng', question: 'Chọn chữ Hán có nghĩa "Phượng hoàng":', options: ['龙', '凤凰', '虎', '狮'], correctAnswer: '凤凰' },
    { type: 'pinyin', hanzi: '金色', pinyin: 'jīn sè', meaning: 'Màu vàng', question: 'Chọn pinyin đúng:', options: ['jīn sè', 'yín sè', 'hóng sè', 'lán sè'], correctAnswer: 'jīn sè' },
    { type: 'meaning', hanzi: '红色', pinyin: 'hóng sè', meaning: 'Màu đỏ', question: 'Chọn nghĩa đúng:', options: ['Màu đỏ', 'Màu xanh', 'Màu lục', 'Màu vàng'], correctAnswer: 'Màu đỏ' },
    { type: 'sentence', hanzi: '威严', pinyin: 'wēi yán', meaning: 'Uy nghiêm', question: 'Điền từ thích hợp: 皇帝很___。(Hoàng đế rất uy nghiêm)', sentence: '皇帝很威严。', options: ['威严', '软弱', '小', '可爱'], correctAnswer: '威严' },
    { type: 'hanzi', hanzi: '雕刻', pinyin: 'diāo kè', meaning: 'Chạm khắc', question: 'Chọn chữ Hán có nghĩa "Chạm khắc":', options: ['绘画', '雕刻', '写字', '跳舞'], correctAnswer: '雕刻' },
    { type: 'meaning', hanzi: '艺术', pinyin: 'yì shù', meaning: 'Nghệ thuật', question: 'Chọn nghĩa đúng:', options: ['Khoa học', 'Nghệ thuật', 'Thể thao', 'Kinh doanh'], correctAnswer: 'Nghệ thuật' },
    { type: 'pinyin', hanzi: '皇后', pinyin: 'huáng hòu', meaning: 'Hoàng hậu', question: 'Chọn pinyin đúng:', options: ['huáng hòu', 'gōng zhǔ', 'tài zi', 'wáng zi'], correctAnswer: 'huáng hòu' },
    { type: 'sentence', hanzi: '太子', pinyin: 'tài zǐ', meaning: 'Thái tử', question: 'Điền từ thích hợp: ___将继承皇位。(Thái tử sẽ kế thừa ngôi vua)', sentence: '太子将继承皇位。', options: ['太子', '大臣', '将军', '百姓'], correctAnswer: '太子' },
    { type: 'hanzi', hanzi: '大臣', pinyin: 'dà chén', meaning: 'Đại thần', question: 'Chọn chữ Hán có nghĩa "Đại thần":', options: ['大臣', '士兵', '农民', '商人'], correctAnswer: '大臣' },
    { type: 'meaning', hanzi: '朝廷', pinyin: 'cháo tíng', meaning: 'Triều đình', question: 'Chọn nghĩa đúng:', options: ['Chợ', 'Triều đình', 'Chùa', 'Trường'], correctAnswer: 'Triều đình' },
    { type: 'pinyin', hanzi: '玉', pinyin: 'yù', meaning: 'Ngọc', question: 'Chọn pinyin đúng:', options: ['yù', 'jīn', 'yín', 'tóng'], correctAnswer: 'yù' },
    { type: 'sentence', hanzi: '宝座', pinyin: 'bǎo zuò', meaning: 'Ngai vàng', question: 'Điền từ thích hợp: 皇帝坐在___上。(Hoàng đế ngồi trên ngai vàng)', sentence: '皇帝坐在宝座上。', options: ['宝座', '椅子', '地上', '床'], correctAnswer: '宝座' },
    { type: 'hanzi', hanzi: '御花园', pinyin: 'yù huā yuán', meaning: 'Vườn hoàng gia', question: 'Chọn chữ Hán có nghĩa "Vườn hoàng gia":', options: ['御花园', '公园', '森林', '田地'], correctAnswer: '御花园' },
    { type: 'meaning', hanzi: '权力', pinyin: 'quán lì', meaning: 'Quyền lực', question: 'Chọn nghĩa đúng:', options: ['Tiền bạc', 'Quyền lực', 'Sức khỏe', 'Tri thức'], correctAnswer: 'Quyền lực' },
  ],

  // CHAPTER 9: SUZHOU - ⭐⭐⭐⭐ VERY HARD - Poetry & elegance (20 questions)
  suzhou: [
    { type: 'meaning', hanzi: '园林', pinyin: 'yuán lín', meaning: 'Vườn cổ', question: 'Chọn nghĩa đúng:', options: ['Vườn cổ', 'Rừng', 'Sa mạc', 'Đại dương'], correctAnswer: 'Vườn cổ' },
    { type: 'sentence', hanzi: '水乡', pinyin: 'shuǐ xiāng', meaning: 'Làng nước', question: 'Điền từ thích hợp: 苏州是江南___。(Tô Châu là làng nước Nam Giang)', sentence: '苏州是江南水乡。', options: ['水乡', '山乡', '沙乡', '冰乡'], correctAnswer: '水乡' },
    { type: 'hanzi', hanzi: '小桥', pinyin: 'xiǎo qiáo', meaning: 'Cầu nhỏ', question: 'Chọn chữ Hán có nghĩa "Cầu nhỏ":', options: ['大路', '小桥', '高楼', '深井'], correctAnswer: '小桥' },
    { type: 'pinyin', hanzi: '流水', pinyin: 'liú shuǐ', meaning: 'Nước chảy', question: 'Chọn pinyin đúng:', options: ['liú shuǐ', 'jìng shuǐ', 'bīng', 'zhēng qì'], correctAnswer: 'liú shuǐ' },
    { type: 'meaning', hanzi: '人家', pinyin: 'rén jiā', meaning: 'Nhà cửa', question: 'Chọn nghĩa đúng:', options: ['Động vật', 'Nhà cửa', 'Cây cối', 'Tòa nhà'], correctAnswer: 'Nhà cửa' },
    { type: 'sentence', hanzi: '江南', pinyin: 'jiāng nán', meaning: 'Nam Giang', question: 'Điền từ thích hợp: ___风景如画。(Phong cảnh Nam Giang như tranh vẽ)', sentence: '江南风景如画。', options: ['江南', '北方', '东方', '西方'], correctAnswer: '江南' },
    { type: 'hanzi', hanzi: '诗意', pinyin: 'shī yì', meaning: 'Thơ mộng', question: 'Chọn chữ Hán có nghĩa "Thơ mộng":', options: ['无聊', '诗意', '丑', '吵'], correctAnswer: '诗意' },
    { type: 'pinyin', hanzi: '宁静', pinyin: 'níng jìng', meaning: 'Thanh tĩnh', question: 'Chọn pinyin đúng:', options: ['níng jìng', 'chǎo nào', 'hùn luàn', 'máng'], correctAnswer: 'níng jìng' },
    { type: 'meaning', hanzi: '优雅', pinyin: 'yōu yǎ', meaning: 'Thanh lịch', question: 'Chọn nghĩa đúng:', options: ['Thô kệch', 'Thanh lịch', 'Ồn ào', 'Đơn giản'], correctAnswer: 'Thanh lịch' },
    { type: 'sentence', hanzi: '古典', pinyin: 'gǔ diǎn', meaning: 'Cổ điển', question: 'Điền từ thích hợp: 苏州园林很___。(Vườn Tô Châu rất cổ điển)', sentence: '苏州园林很古典。', options: ['古典', '现代', '丑陋', '新'], correctAnswer: '古典' },
    { type: 'hanzi', hanzi: '亭子', pinyin: 'tíng zi', meaning: 'Gác nhỏ', question: 'Chọn chữ Hán có nghĩa "Gác nhỏ":', options: ['亭子', '大楼', '工厂', '车站'], correctAnswer: '亭子' },
    { type: 'pinyin', hanzi: '假山', pinyin: 'jiǎ shān', meaning: 'Núi giả (trong vườn)', question: 'Chọn pinyin đúng:', options: ['jiǎ shān', 'zhēn shān', 'dà shān', 'xiǎo shān'], correctAnswer: 'jiǎ shān' },
    { type: 'meaning', hanzi: '池塘', pinyin: 'chí táng', meaning: 'Ao', question: 'Chọn nghĩa đúng:', options: ['Sông', 'Ao', 'Biển', 'Suối'], correctAnswer: 'Ao' },
    { type: 'sentence', hanzi: '莲花', pinyin: 'lián huā', meaning: 'Hoa sen', question: 'Điền từ thích hợp: 池塘里有___。(Trong ao có hoa sen)', sentence: '池塘里有莲花。', options: ['莲花', '玫瑰', '菊花', '兰花'], correctAnswer: '莲花' },
    { type: 'hanzi', hanzi: '诗人', pinyin: 'shī rén', meaning: 'Thi nhân', question: 'Chọn chữ Hán có nghĩa "Thi nhân":', options: ['诗人', '画家', '音乐家', '作家'], correctAnswer: '诗人' },
    { type: 'pinyin', hanzi: '画家', pinyin: 'huà jiā', meaning: 'Họa sĩ', question: 'Chọn pinyin đúng:', options: ['huà jiā', 'shī rén', 'zuò jiā', 'gē shǒu'], correctAnswer: 'huà jiā' },
    { type: 'meaning', hanzi: '墨水', pinyin: 'mò shuǐ', meaning: 'Mực', question: 'Chọn nghĩa đúng:', options: ['Nước', 'Mực', 'Sơn', 'Dầu'], correctAnswer: 'Mực' },
    { type: 'sentence', hanzi: '书法', pinyin: 'shū fǎ', meaning: 'Thư pháp', question: 'Điền từ thích hợp: 中国___很美。(Thư pháp Trung Quốc rất đẹp)', sentence: '中国书法很美。', options: ['书法', '音乐', '舞蹈', '电影'], correctAnswer: '书法' },
    { type: 'hanzi', hanzi: '竹林', pinyin: 'zhú lín', meaning: 'Rừng tre', question: 'Chọn chữ Hán có nghĩa "Rừng tre":', options: ['竹林', '松林', '花园', '草地'], correctAnswer: '竹林' },
    { type: 'meaning', hanzi: '悠闲', pinyin: 'yōu xián', meaning: 'Thư thái', question: 'Chọn nghĩa đúng:', options: ['Bận rộn', 'Thư thái', 'Lo lắng', 'Mệt mỏi'], correctAnswer: 'Thư thái' },
  ],

  // CHAPTER 10: TIBET - ⭐⭐⭐⭐ VERY HARD - Spirituality (20 questions)
  tibet: [
    { type: 'meaning', hanzi: '高原', pinyin: 'gāo yuán', meaning: 'Cao nguyên', question: 'Chọn nghĩa đúng:', options: ['Thung lũng', 'Cao nguyên', 'Bãi biển', 'Đồng bằng'], correctAnswer: 'Cao nguyên' },
    { type: 'sentence', hanzi: '雪山', pinyin: 'xuě shān', meaning: 'Núi tuyết', question: 'Điền từ thích hợp: 西藏有很多___。(Tây Tạng có nhiều núi tuyết)', sentence: '西藏有很多雪山。', options: ['雪山', '海滩', '沙漠', '森林'], correctAnswer: '雪山' },
    { type: 'hanzi', hanzi: '寺庙', pinyin: 'sì miào', meaning: 'Chùa chiền', question: 'Chọn chữ Hán có nghĩa "Chùa chiền":', options: ['学校', '寺庙', '市场', '医院'], correctAnswer: '寺庙' },
    { type: 'pinyin', hanzi: '信仰', pinyin: 'xìn yǎng', meaning: 'Tín ngưỡng', question: 'Chọn pinyin đúng:', options: ['xìn yǎng', 'huái yí', 'kǒng jù', 'fèn nù'], correctAnswer: 'xìn yǎng' },
    { type: 'meaning', hanzi: '神圣', pinyin: 'shén shèng', meaning: 'Thiêng liêng', question: 'Chọn nghĩa đúng:', options: ['Bình thường', 'Thiêng liêng', 'Bẩn', 'Hỏng'], correctAnswer: 'Thiêng liêng' },
    { type: 'sentence', hanzi: '虔诚', pinyin: 'qián chéng', meaning: 'Sùng đạo', question: 'Điền từ thích hợp: 信徒很___。(Tín đồ rất sùng đạo)', sentence: '信徒很虔诚。', options: ['虔诚', '懒惰', '粗心', '无礼'], correctAnswer: '虔诚' },
    { type: 'hanzi', hanzi: '纯净', pinyin: 'chún jìng', meaning: 'Trong sạch', question: 'Chọn chữ Hán có nghĩa "Trong sạch":', options: ['脏', '纯净', '混', '污'], correctAnswer: '纯净' },
    { type: 'pinyin', hanzi: '蓝天', pinyin: 'lán tiān', meaning: 'Bầu trời xanh', question: 'Chọn pinyin đúng:', options: ['lán tiān', 'hóng tiān', 'hēi yè', 'huī yún'], correctAnswer: 'lán tiān' },
    { type: 'meaning', hanzi: '白云', pinyin: 'bái yún', meaning: 'Mây trắng', question: 'Chọn nghĩa đúng:', options: ['Khói đen', 'Mây trắng', 'Lửa đỏ', 'Nước xanh'], correctAnswer: 'Mây trắng' },
    { type: 'sentence', hanzi: '朝圣', pinyin: 'cháo shèng', meaning: 'Hành hương', question: 'Điền từ thích hợp: 很多人来西藏___。(Nhiều người đến Tây Tạng hành hương)', sentence: '很多人来西藏朝圣。', options: ['朝圣', '购物', '工作', '玩'], correctAnswer: '朝圣' },
    { type: 'hanzi', hanzi: '佛教', pinyin: 'fó jiào', meaning: 'Phật giáo', question: 'Chọn chữ Hán có nghĩa "Phật giáo":', options: ['佛教', '道教', '基督教', '伊斯兰教'], correctAnswer: '佛教' },
    { type: 'pinyin', hanzi: '喇嘛', pinyin: 'lǎ ma', meaning: 'Lạt Ma', question: 'Chọn pinyin đúng:', options: ['lǎ ma', 'hé shang', 'dào shì', 'mù shī'], correctAnswer: 'lǎ ma' },
    { type: 'meaning', hanzi: '经文', pinyin: 'jīng wén', meaning: 'Kinh văn', question: 'Chọn nghĩa đúng:', options: ['Kinh văn', 'Tiểu thuyết', 'Thơ ca', 'Báo chí'], correctAnswer: 'Kinh văn' },
    { type: 'sentence', hanzi: '祈祷', pinyin: 'qí dǎo', meaning: 'Cầu nguyện', question: 'Điền từ thích hợp: 信徒在___。(Tín đồ đang cầu nguyện)', sentence: '信徒在祈祷。', options: ['祈祷', '唱歌', '跳舞', '睡觉'], correctAnswer: '祈祷' },
    { type: 'hanzi', hanzi: '佛像', pinyin: 'fó xiàng', meaning: 'Tượng Phật', question: 'Chọn chữ Hán có nghĩa "Tượng Phật":', options: ['佛像', '人像', '动物', '植物'], correctAnswer: '佛像' },
    { type: 'pinyin', hanzi: '香', pinyin: 'xiāng', meaning: 'Hương', question: 'Chọn pinyin đúng:', options: ['xiāng', 'yān', 'huǒ', 'shuǐ'], correctAnswer: 'xiāng' },
    { type: 'meaning', hanzi: '磕头', pinyin: 'kē tóu', meaning: 'Lạy', question: 'Chọn nghĩa đúng:', options: ['Đứng', 'Lạy', 'Ngồi', 'Nằm'], correctAnswer: 'Lạy' },
    { type: 'sentence', hanzi: '宁静', pinyin: 'níng jìng', meaning: 'Yên tĩnh', question: 'Điền từ thích hợp: 寺庙很___。(Chùa rất yên tĩnh)', sentence: '寺庙很宁静。', options: ['宁静', '吵闹', '混乱', '脏'], correctAnswer: '宁静' },
    { type: 'hanzi', hanzi: '转经筒', pinyin: 'zhuàn jīng tǒng', meaning: 'Bánh xe kinh nguyện', question: 'Chọn chữ Hán có nghĩa "Bánh xe kinh nguyện":', options: ['转经筒', '车轮', '风车', '水车'], correctAnswer: '转经筒' },
    { type: 'meaning', hanzi: '圣洁', pinyin: 'shèng jié', meaning: 'Thánh khiết', question: 'Chọn nghĩa đúng:', options: ['Bẩn thỉu', 'Thánh khiết', 'Ồn ào', 'Tối tăm'], correctAnswer: 'Thánh khiết' },
  ],
};

// Generate lessons for each chapter
const generateLessons = (chapterKey: string, count: number): Lesson[] => {
  const vocab = vocabDatabase[chapterKey] || [];
  const lessons: Lesson[] = [];
  const vocabPerLesson = Math.ceil(vocab.length / count);

  for (let i = 0; i < count; i++) {
    const startIdx = i * vocabPerLesson;
    const endIdx = Math.min(startIdx + vocabPerLesson, vocab.length);
    const lessonVocab = vocab.slice(startIdx, endIdx);

    lessons.push({
      id: `${chapterKey}-lesson-${i + 1}`,
      title: `Bài ${i + 1}`,
      vocabulary: lessonVocab,
      completed: false,
    });
  }

  return lessons;
};

export default function MandarinStoryMode() {
  const { session } = useSession();
  const { userProgress, isLoading, addXP } = useGamification();
  const navigate = useNavigate();

  // Lesson playing state
  const [playingLesson, setPlayingLesson] = useState<{ chapter: Chapter; lesson: Lesson } | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [lessonComplete, setLessonComplete] = useState(false);

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      number: 1,
      title: 'Chào mừng đến Bắc Kinh',
      location: '北京 (Beijing)',
      description: 'Bắt đầu hành trình với các cụm từ chào hỏi cơ bản. Mỗi bài 10 câu hỏi, 4 dạng đa dạng.',
      icon: '🏛️',
      difficulty: '⭐',
      lessons: generateLessons('beijing', 2),
      xpReward: 100,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '2',
      number: 2,
      title: 'Khám phá Thượng Hải',
      location: '上海 (Shanghai)',
      description: 'Học từ vựng sinh hoạt hàng ngày. Mỗi bài 10 câu với nhiều dạng câu hỏi.',
      icon: '🏙️',
      difficulty: '⭐',
      lessons: generateLessons('shanghai', 2),
      xpReward: 150,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '3',
      number: 3,
      title: 'Vạn Lý Trường Thành',
      location: '长城 (Great Wall)',
      description: 'Từ vựng về lịch sử và văn hóa. Mỗi bài 10 câu với câu hỏi điền từ.',
      icon: '🏰',
      difficulty: '⭐⭐',
      lessons: generateLessons('greatwall', 2),
      xpReward: 200,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '4',
      number: 4,
      title: 'Tây An cổ kính',
      location: '西安 (Xi\'an)',
      description: 'Ẩm thực và các vị. Mỗi bài 10 câu với 4 dạng câu hỏi đa dạng.',
      icon: '🗿',
      difficulty: '⭐⭐',
      lessons: generateLessons('xian', 2),
      xpReward: 250,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '5',
      number: 5,
      title: 'Thành Đô và gấu trúc',
      location: '成都 (Chengdu)',
      description: 'Động vật và thiên nhiên. Mỗi bài 10 câu với câu hỏi ngữ cảnh.',
      icon: '🐼',
      difficulty: '⭐⭐',
      lessons: generateLessons('chengdu', 2),
      xpReward: 300,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '6',
      number: 6,
      title: 'Quế Lâm thơ mộng',
      location: '桂林 (Guilin)',
      description: 'Phong cảnh và du lịch. Mỗi bài 10 câu với từ vựng mô tả phức tạp.',
      icon: '⛰️',
      difficulty: '⭐⭐⭐',
      lessons: generateLessons('guilin', 2),
      xpReward: 350,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '7',
      number: 7,
      title: 'Hồng Kông sôi động',
      location: '香港 (Hong Kong)',
      description: 'Thành phố hiện đại. Mỗi bài 10 câu với từ vựng trừu tượng.',
      icon: '🌃',
      difficulty: '⭐⭐⭐',
      lessons: generateLessons('hongkong', 2),
      xpReward: 400,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '8',
      number: 8,
      title: 'Tử Cấm Thành huyền bí',
      location: '故宫 (Forbidden City)',
      description: 'Văn hóa hoàng gia cổ đại. Mỗi bài 10 câu với từ vựng chuyên sâu.',
      icon: '👑',
      difficulty: '⭐⭐⭐⭐',
      lessons: generateLessons('forbiddencity', 2),
      xpReward: 500,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '9',
      number: 9,
      title: 'Tô Châu - Venice phương Đông',
      location: '苏州 (Suzhou)',
      description: 'Thơ ca và kiến trúc thanh lịch. Mỗi bài 10 câu với từ vựng văn học.',
      icon: '🏮',
      difficulty: '⭐⭐⭐⭐',
      lessons: generateLessons('suzhou', 2),
      xpReward: 450,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '10',
      number: 10,
      title: 'Tây Tạng linh thiêng',
      location: '西藏 (Tibet)',
      description: 'Tâm linh và tín ngưỡng. Mỗi bài 10 câu - thử thách cuối cùng!',
      icon: '🕉️',
      difficulty: '⭐⭐⭐⭐',
      lessons: generateLessons('tibet', 2),
      xpReward: 600,
      isUnlocked: true,
      isCompleted: false,
    },
  ]);

  const handleStartLesson = (chapter: Chapter, lesson: Lesson) => {
    setPlayingLesson({ chapter, lesson });
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(null);
    setLessonComplete(false);
  };

  const handleAnswer = (answer: string) => {
    if (!playingLesson || showResult) return;

    const question = playingLesson.lesson.vocabulary[currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;

    setShowResult(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < playingLesson.lesson.vocabulary.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowResult(null);
      } else {
        // Lesson complete
        setLessonComplete(true);

        // Mark lesson as completed
        setChapters(prev => prev.map(ch => {
          if (ch.id === playingLesson.chapter.id) {
            const updatedLessons = ch.lessons.map(l =>
              l.id === playingLesson.lesson.id ? { ...l, completed: true } : l
            );
            const allCompleted = updatedLessons.every(l => l.completed);
            return {
              ...ch,
              lessons: updatedLessons,
              isCompleted: allCompleted,
            };
          }
          return ch;
        }));

        // Add XP
        const xpEarned = Math.floor((score + 1) / playingLesson.lesson.vocabulary.length * 50);
        if (addXP) {
          addXP(xpEarned);
        }

        // Confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 1500);
  };

  const handleExitLesson = () => {
    setPlayingLesson(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(null);
    setLessonComplete(false);
  };

  const progressPercent = (chapters.filter(c => c.isCompleted).length / chapters.length) * 100;

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Yêu cầu đăng nhập</h2>
              <p className="text-muted-foreground mb-6">
                Vui lòng đăng nhập để khám phá câu chuyện
              </p>
              <Button asChild>
                <Link to="/mandarin/login">Đăng nhập ngay</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  // Playing Lesson Screen
  if (playingLesson && !lessonComplete) {
    const question = playingLesson.lesson.vocabulary[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / playingLesson.lesson.vocabulary.length) * 100;

    // Get question type icon
    const getQuestionTypeIcon = (type: string) => {
      switch(type) {
        case 'meaning': return '📖';
        case 'pinyin': return '🔊';
        case 'hanzi': return '✍️';
        case 'sentence': return '💬';
        default: return '❓';
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={handleExitLesson}>
              <X className="mr-2 h-4 w-4" /> Thoát
            </Button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {playingLesson.chapter.title} - {playingLesson.lesson.title}
              </h2>
              <p className="text-sm text-gray-300">
                Câu {currentQuestionIndex + 1}/{playingLesson.lesson.vocabulary.length} {getQuestionTypeIcon(question.type)}
              </p>
            </div>
            <div className="w-20 text-right">
              <span className="text-white font-bold">⭐ {score}</span>
            </div>
          </div>

          {/* Progress */}
          <Progress value={progressPercent} className="h-3 mb-8" />

          {/* Question Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="text-center text-white">
                {question.type === 'meaning' || question.type === 'hanzi' ? (
                  <>
                    <div className="text-6xl mb-6 font-bold">{question.hanzi}</div>
                    <div className="text-3xl text-purple-300 mb-4">{question.pinyin}</div>
                  </>
                ) : question.type === 'pinyin' ? (
                  <>
                    <div className="text-6xl mb-6 font-bold">{question.hanzi}</div>
                    <div className="text-2xl text-purple-300 mb-4">Nghĩa: {question.meaning}</div>
                  </>
                ) : (
                  <div className="text-2xl text-purple-300 mb-6">{question.sentence?.replace(question.hanzi, '___')}</div>
                )}
                <div className="text-xl text-gray-300 mt-4">{question.question}</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult !== null}
                    className={`h-20 text-lg font-semibold ${
                      showResult === 'correct' && option === question.correctAnswer
                        ? 'bg-green-600 hover:bg-green-700'
                        : showResult === 'wrong' && option === question.correctAnswer
                        ? 'bg-green-600 hover:bg-green-700'
                        : showResult === 'wrong' && option !== question.correctAnswer
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {showResult && option === question.correctAnswer && (
                      <Check className="mr-2 h-5 w-5" />
                    )}
                    {showResult === 'wrong' && option !== question.correctAnswer && (
                      <X className="mr-2 h-5 w-5" />
                    )}
                    {option}
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className={`mt-6 p-4 rounded-lg text-center font-bold text-white ${
                  showResult === 'correct' ? 'bg-green-600' : 'bg-red-600'
                } animate-pulse`}>
                  {showResult === 'correct' ? (
                    <>✓ Chính xác! <span className="text-yellow-300">+1 sao</span></>
                  ) : (
                    <>✗ Sai rồi! Đáp án đúng: <span className="underline">{question.correctAnswer}</span></>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Lesson Complete Screen
  if (lessonComplete && playingLesson) {
    const percentage = Math.floor((score / playingLesson.lesson.vocabulary.length) * 100);
    const xpEarned = Math.floor((score / playingLesson.lesson.vocabulary.length) * 50);

    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center">
          <Card className="w-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500">
            <CardHeader className="text-center">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-bounce" />
              <CardTitle className="text-4xl mb-2">🎉 Hoàn Thành!</CardTitle>
              <CardDescription className="text-xl">
                {playingLesson.chapter.title} - {playingLesson.lesson.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-3">
                <div className="text-5xl font-bold text-yellow-600">{percentage}%</div>
                <p className="text-muted-foreground">
                  Đúng {score}/{playingLesson.lesson.vocabulary.length} câu
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-600">
                <Star className="w-6 h-6" />
                +{xpEarned} XP
              </div>

              {percentage === 100 && (
                <div className="text-lg font-bold text-green-600">
                  ⭐ Hoàn hảo! Bạn giỏi quá!
                </div>
              )}
              {percentage >= 80 && percentage < 100 && (
                <div className="text-lg font-bold text-blue-600">
                  👏 Rất tốt! Cố gắng thêm nhé!
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={handleExitLesson} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button onClick={() => handleStartLesson(playingLesson.chapter, playingLesson.lesson)} className="flex-1">
                <Trophy className="mr-2 h-4 w-4" />
                Làm lại
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  // Main Story Mode View
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/mandarin/gamification">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <ScrollText className="w-8 h-8 text-blue-500" />
              Chế Độ Câu Chuyện
            </h1>
            <p className="text-muted-foreground mt-1">
              10 chương với độ khó tăng dần - 4 dạng câu hỏi đa dạng 📖🔊✍️💬
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Tiến Độ Tổng Thể
                </CardTitle>
                <CardDescription>
                  {chapters.filter(c => c.isCompleted).length} / {chapters.length} chương đã hoàn thành
                </CardDescription>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="h-4" />
          </CardContent>
        </Card>

        {/* Chapter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((chapter) => {
            const completedLessons = chapter.lessons.filter(l => l.completed).length;
            const progressPercent = (completedLessons / chapter.lessons.length) * 100;

            return (
              <Card
                key={chapter.id}
                className={`hover-scale ${
                  chapter.isCompleted
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500'
                    : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                }`}
              >
                {chapter.isCompleted && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Hoàn thành
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{chapter.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline">Chương {chapter.number}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {chapter.location}
                        </Badge>
                        <Badge className="bg-yellow-500">{chapter.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-2xl mb-2">{chapter.title}</CardTitle>
                      <CardDescription className="text-base">
                        {chapter.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        Bài học
                      </span>
                      <span className="font-bold">
                        {completedLessons} / {chapter.lessons.length}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  {/* Lessons List */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {chapter.lessons.map((lesson, idx) => (
                      <Button
                        key={lesson.id}
                        variant={lesson.completed ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleStartLesson(chapter, lesson)}
                        className={lesson.completed ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {lesson.completed && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {idx + 1}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">+{chapter.xpReward} XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
