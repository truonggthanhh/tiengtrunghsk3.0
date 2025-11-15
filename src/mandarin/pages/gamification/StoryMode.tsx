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
  // CHAPTER 1: BEIJING - ⭐ EASY - Basic greetings
  beijing: [
    { type: 'meaning', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào', question: 'Chọn nghĩa đúng:', options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'], correctAnswer: 'Xin chào' },
    { type: 'pinyin', hanzi: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt', question: 'Chọn pinyin đúng:', options: ['zài jiàn', 'xièxiè', 'nǐ hǎo', 'duì bù qǐ'], correctAnswer: 'zài jiàn' },
    { type: 'meaning', hanzi: '谢谢', pinyin: 'xiè xiè', meaning: 'Cảm ơn', question: 'Chọn nghĩa đúng:', options: ['Xin lỗi', 'Cảm ơn', 'Xin chào', 'Tạm biệt'], correctAnswer: 'Cảm ơn' },
    { type: 'pinyin', hanzi: '对不起', pinyin: 'duì bu qǐ', meaning: 'Xin lỗi', question: 'Chọn pinyin đúng:', options: ['duì bu qǐ', 'zài jiàn', 'nǐ hǎo', 'xiè xiè'], correctAnswer: 'duì bu qǐ' },
    { type: 'meaning', hanzi: '是', pinyin: 'shì', meaning: 'Là / Phải', question: 'Chọn nghĩa đúng:', options: ['Không', 'Là / Phải', 'Có thể', 'Chưa'], correctAnswer: 'Là / Phải' },
  ],

  // CHAPTER 2: SHANGHAI - ⭐ EASY - Daily activities
  shanghai: [
    { type: 'meaning', hanzi: '吃饭', pinyin: 'chī fàn', meaning: 'Ăn cơm', question: 'Chọn nghĩa đúng:', options: ['Ăn cơm', 'Uống nước', 'Ngủ', 'Đi bộ'], correctAnswer: 'Ăn cơm' },
    { type: 'pinyin', hanzi: '喝水', pinyin: 'hē shuǐ', meaning: 'Uống nước', question: 'Chọn pinyin đúng:', options: ['hē shuǐ', 'chī fàn', 'mǎi', 'qián'], correctAnswer: 'hē shuǐ' },
    { type: 'meaning', hanzi: '买', pinyin: 'mǎi', meaning: 'Mua', question: 'Chọn nghĩa đúng:', options: ['Bán', 'Mua', 'Ăn', 'Uống'], correctAnswer: 'Mua' },
    { type: 'hanzi', hanzi: '钱', pinyin: 'qián', meaning: 'Tiền', question: 'Chọn chữ Hán có nghĩa "Tiền":', options: ['钱', '时', '饭', '水'], correctAnswer: '钱' },
    { type: 'meaning', hanzi: '多少', pinyin: 'duō shǎo', meaning: 'Bao nhiêu', question: 'Chọn nghĩa đúng:', options: ['Ở đâu', 'Khi nào', 'Bao nhiêu', 'Tại sao'], correctAnswer: 'Bao nhiêu' },
    { type: 'meaning', hanzi: '便宜', pinyin: 'pián yi', meaning: 'Rẻ', question: 'Chọn nghĩa đúng:', options: ['Đắt', 'Rẻ', 'Tốt', 'Xấu'], correctAnswer: 'Rẻ' },
  ],

  // CHAPTER 3: GREAT WALL - ⭐⭐ MEDIUM - Culture & history
  greatwall: [
    { type: 'meaning', hanzi: '历史', pinyin: 'lì shǐ', meaning: 'Lịch sử', question: 'Chọn nghĩa đúng:', options: ['Lịch sử', 'Văn hóa', 'Nghệ thuật', 'Khoa học'], correctAnswer: 'Lịch sử' },
    { type: 'pinyin', hanzi: '文化', pinyin: 'wén huà', meaning: 'Văn hóa', question: 'Chọn pinyin đúng:', options: ['wén huà', 'lì shǐ', 'cháng chéng', 'gǔ lǎo'], correctAnswer: 'wén huà' },
    { type: 'hanzi', hanzi: '长城', pinyin: 'cháng chéng', meaning: 'Vạn Lý Trường Thành', question: 'Chọn chữ Hán có nghĩa "Vạn Lý Trường Thành":', options: ['长城', '宫殿', '寺庙', '山'], correctAnswer: '长城' },
    { type: 'meaning', hanzi: '古老', pinyin: 'gǔ lǎo', meaning: 'Cổ xưa', question: 'Chọn nghĩa đúng:', options: ['Hiện đại', 'Cổ xưa', 'Mới', 'Trẻ'], correctAnswer: 'Cổ xưa' },
    { type: 'sentence', hanzi: '美丽', pinyin: 'měi lì', meaning: 'Đẹp', question: 'Điền từ thích hợp: 这个地方很___。(Nơi này rất đẹp)', sentence: '这个地方很美丽。', options: ['美丽', '古老', '现代', '高'], correctAnswer: '美丽' },
    { type: 'meaning', hanzi: '壮观', pinyin: 'zhuàng guān', meaning: 'Hùng vĩ', question: 'Chọn nghĩa đúng:', options: ['Nhỏ bé', 'Hùng vĩ', 'Nhàm chán', 'Đơn giản'], correctAnswer: 'Hùng vĩ' },
    { type: 'pinyin', hanzi: '建筑', pinyin: 'jiàn zhù', meaning: 'Kiến trúc', question: 'Chọn pinyin đúng:', options: ['jiàn zhù', 'huì huà', 'yīn yuè', 'wǔ dǎo'], correctAnswer: 'jiàn zhù' },
  ],

  // CHAPTER 4: XI'AN - ⭐⭐ MEDIUM - Food & taste
  xian: [
    { type: 'meaning', hanzi: '面条', pinyin: 'miàn tiáo', meaning: 'Mì', question: 'Chọn nghĩa đúng:', options: ['Cơm', 'Mì', 'Bánh mì', 'Súp'], correctAnswer: 'Mì' },
    { type: 'hanzi', hanzi: '饺子', pinyin: 'jiǎo zi', meaning: 'Bánh bao', question: 'Chọn chữ Hán có nghĩa "Bánh bao":', options: ['饺子', '面条', '米饭', '汤'], correctAnswer: '饺子' },
    { type: 'sentence', hanzi: '好吃', pinyin: 'hǎo chī', meaning: 'Ngon', question: 'Điền từ thích hợp: 这个菜很___。(Món này rất ngon)', sentence: '这个菜很好吃。', options: ['好吃', '难吃', '甜', '苦'], correctAnswer: '好吃' },
    { type: 'meaning', hanzi: '辣', pinyin: 'là', meaning: 'Cay', question: 'Chọn nghĩa đúng:', options: ['Ngọt', 'Chua', 'Cay', 'Mặn'], correctAnswer: 'Cay' },
    { type: 'pinyin', hanzi: '甜', pinyin: 'tián', meaning: 'Ngọt', question: 'Chọn pinyin đúng:', options: ['tián', 'suān', 'kǔ', 'xián'], correctAnswer: 'tián' },
    { type: 'meaning', hanzi: '咸', pinyin: 'xián', meaning: 'Mặn', question: 'Chọn nghĩa đúng:', options: ['Ngọt', 'Mặn', 'Cay', 'Chua'], correctAnswer: 'Mặn' },
    { type: 'meaning', hanzi: '酸', pinyin: 'suān', meaning: 'Chua', question: 'Chọn nghĩa đúng:', options: ['Ngọt', 'Chua', 'Đắng', 'Mặn'], correctAnswer: 'Chua' },
    { type: 'hanzi', hanzi: '苦', pinyin: 'kǔ', meaning: 'Đắng', question: 'Chọn chữ Hán có nghĩa "Đắng":', options: ['苦', '甜', '酸', '咸'], correctAnswer: '苦' },
  ],

  // CHAPTER 5: CHENGDU - ⭐⭐ MEDIUM - Animals & nature
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
  ],

  // CHAPTER 6: GUILIN - ⭐⭐⭐ HARD - Scenery & travel
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
  ],

  // CHAPTER 7: HONG KONG - ⭐⭐⭐ HARD - Modern city
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
  ],

  // CHAPTER 8: FORBIDDEN CITY - ⭐⭐⭐⭐ VERY HARD - Imperial culture
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
  ],

  // CHAPTER 9: SUZHOU - ⭐⭐⭐⭐ VERY HARD - Poetry & elegance
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
  ],

  // CHAPTER 10: TIBET - ⭐⭐⭐⭐ VERY HARD - Spirituality
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
      description: 'Bắt đầu hành trình với các cụm từ chào hỏi cơ bản. Từ vựng đơn giản, 2 dạng câu hỏi.',
      icon: '🏛️',
      difficulty: '⭐',
      lessons: generateLessons('beijing', 5),
      xpReward: 100,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '2',
      number: 2,
      title: 'Khám phá Thượng Hải',
      location: '上海 (Shanghai)',
      description: 'Học từ vựng sinh hoạt hàng ngày. Bắt đầu có thêm dạng chọn Hanzi.',
      icon: '🏙️',
      difficulty: '⭐',
      lessons: generateLessons('shanghai', 6),
      xpReward: 150,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '3',
      number: 3,
      title: 'Vạn Lý Trường Thành',
      location: '长城 (Great Wall)',
      description: 'Từ vựng về lịch sử và văn hóa. Xuất hiện câu hỏi điền từ vào câu.',
      icon: '🏰',
      difficulty: '⭐⭐',
      lessons: generateLessons('greatwall', 7),
      xpReward: 200,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '4',
      number: 4,
      title: 'Tây An cổ kính',
      location: '西安 (Xi\'an)',
      description: 'Ẩm thực và các vị. Tăng độ phức tạp với 4 dạng câu hỏi.',
      icon: '🗿',
      difficulty: '⭐⭐',
      lessons: generateLessons('xian', 8),
      xpReward: 250,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '5',
      number: 5,
      title: 'Thành Đô và gấu trúc',
      location: '成都 (Chengdu)',
      description: 'Động vật và thiên nhiên. Câu hỏi đa dạng hơn, yêu cầu hiểu ngữ cảnh.',
      icon: '🐼',
      difficulty: '⭐⭐',
      lessons: generateLessons('chengdu', 9),
      xpReward: 300,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '6',
      number: 6,
      title: 'Quế Lâm thơ mộng',
      location: '桂林 (Guilin)',
      description: 'Phong cảnh và du lịch. Từ vựng mô tả phức tạp, câu hỏi nâng cao.',
      icon: '⛰️',
      difficulty: '⭐⭐⭐',
      lessons: generateLessons('guilin', 10),
      xpReward: 350,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '7',
      number: 7,
      title: 'Hồng Kông sôi động',
      location: '香港 (Hong Kong)',
      description: 'Thành phố hiện đại. Từ vựng trừu tượng, nhiều câu phức tạp.',
      icon: '🌃',
      difficulty: '⭐⭐⭐',
      lessons: generateLessons('hongkong', 11),
      xpReward: 400,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '8',
      number: 8,
      title: 'Tử Cấm Thành huyền bí',
      location: '故宫 (Forbidden City)',
      description: 'Văn hóa hoàng gia cổ đại. Từ vựng chuyên sâu, câu hỏi khó.',
      icon: '👑',
      difficulty: '⭐⭐⭐⭐',
      lessons: generateLessons('forbiddencity', 12),
      xpReward: 500,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '9',
      number: 9,
      title: 'Tô Châu - Venice phương Đông',
      location: '苏州 (Suzhou)',
      description: 'Thơ ca và kiến trúc thanh lịch. Từ vựng văn học, độ khó cao.',
      icon: '🏮',
      difficulty: '⭐⭐⭐⭐',
      lessons: generateLessons('suzhou', 9),
      xpReward: 450,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '10',
      number: 10,
      title: 'Tây Tạng linh thiêng',
      location: '西藏 (Tibet)',
      description: 'Tâm linh và tín ngưỡng. Từ vựng cao cấp nhất, thử thách cuối cùng!',
      icon: '🕉️',
      difficulty: '⭐⭐⭐⭐',
      lessons: generateLessons('tibet', 10),
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
