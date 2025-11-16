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
// CANTONESE VERSION with JYUTPING (not Mandarin pinyin!)
// DIVERSE QUESTION TYPES: meaning, pinyin (jyutping), hanzi, sentence

const vocabDatabase: Record<string, VocabQuestion[]> = {
  // CHAPTER 1: CENTRAL 中環 - ⭐ EASY - Basic greetings (50 questions)
  central: [
    { type: 'meaning', hanzi: '你好', pinyin: 'nei5 hou2', meaning: 'Xin chào', question: 'Chọn nghĩa đúng:', options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'], correctAnswer: 'Xin chào' },
    { type: 'pinyin', hanzi: '再見', pinyin: 'zoi3 gin3', meaning: 'Tạm biệt', question: 'Chọn jyutping đúng:', options: ['zoi3 gin3', 'm4 goi1', 'nei5 hou2', 'do1 ze6'], correctAnswer: 'zoi3 gin3' },
    { type: 'meaning', hanzi: '唔該', pinyin: 'm4 goi1', meaning: 'Cảm ơn / Xin', question: 'Chọn nghĩa đúng:', options: ['Xin lỗi', 'Cảm ơn / Xin', 'Xin chào', 'Tạm biệt'], correctAnswer: 'Cảm ơn / Xin' },
    { type: 'pinyin', hanzi: '多謝', pinyin: 'do1 ze6', meaning: 'Cảm ơn nhiều', question: 'Chọn jyutping đúng:', options: ['do1 ze6', 'zoi3 gin3', 'nei5 hou2', 'm4 goi1'], correctAnswer: 'do1 ze6' },
    { type: 'meaning', hanzi: '對唔住', pinyin: 'deoi3 m4 zyu6', meaning: 'Xin lỗi', question: 'Chọn nghĩa đúng:', options: ['Cảm ơn', 'Xin lỗi', 'Xin chào', 'Tạm biệt'], correctAnswer: 'Xin lỗi' },
    { type: 'hanzi', hanzi: '係', pinyin: 'hai6', meaning: 'Là', question: 'Chọn chữ Hán "Là":', options: ['係', '唔', '好', '冇'], correctAnswer: '係' },
    { type: 'meaning', hanzi: '唔係', pinyin: 'm4 hai6', meaning: 'Không phải', question: 'Chọn nghĩa đúng:', options: ['Là', 'Không phải', 'Có', 'Không có'], correctAnswer: 'Không phải' },
    { type: 'sentence', hanzi: '好', pinyin: 'hou2', meaning: 'Tốt', question: 'Điền từ: 呢度好___。(Nơi này tốt)', sentence: '呢度好好。', options: ['好', '差', '貴', '平'], correctAnswer: '好' },
    { type: 'pinyin', hanzi: '早晨', pinyin: 'zou2 san4', meaning: 'Chào buổi sáng', question: 'Chọn jyutping đúng:', options: ['zou2 san4', 'aan3 zau2', 'maan5 on1', 'zoi3 gin3'], correctAnswer: 'zou2 san4' },
    { type: 'meaning', hanzi: '晚安', pinyin: 'maan5 on1', meaning: 'Chúc ngủ ngon', question: 'Chọn nghĩa đúng:', options: ['Buổi sáng', 'Chúc ngủ ngon', 'Buổi trưa', 'Tạm biệt'], correctAnswer: 'Chúc ngủ ngon' },
    { type: 'hanzi', hanzi: '點', pinyin: 'dim2', meaning: 'Sao / Như thế nào', question: 'Chọn chữ Hán "Sao":', options: ['點', '邊', '乜', '幾'], correctAnswer: '點' },
    { type: 'meaning', hanzi: '點樣', pinyin: 'dim2 joeng2', meaning: 'Như thế nào', question: 'Chọn nghĩa đúng:', options: ['Bao nhiêu', 'Như thế nào', 'Ở đâu', 'Khi nào'], correctAnswer: 'Như thế nào' },
    { type: 'sentence', hanzi: '係', pinyin: 'hai6', meaning: 'Là', question: 'Điền từ: 我___學生。(Tôi là học sinh)', sentence: '我係學生。', options: ['係', '唔係', '有', '冇'], correctAnswer: '係' },
    { type: 'pinyin', hanzi: '有冇', pinyin: 'jau5 mou5', meaning: 'Có không', question: 'Chọn jyutping đúng:', options: ['jau5 mou5', 'hai6 m4', 'hou2 m4', 'dak1 m4'], correctAnswer: 'jau5 mou5' },
    { type: 'meaning', hanzi: '有', pinyin: 'jau5', meaning: 'Có', question: 'Chọn nghĩa đúng:', options: ['Không', 'Có', 'Là', 'Được'], correctAnswer: 'Có' },
    { type: 'hanzi', hanzi: '冇', pinyin: 'mou5', meaning: 'Không có', question: 'Chọn chữ Hán "Không có":', options: ['有', '冇', '係', '唔'], correctAnswer: '冇' },
    { type: 'meaning', hanzi: '得', pinyin: 'dak1', meaning: 'Được', question: 'Chọn nghĩa đúng:', options: ['Không được', 'Được', 'Có', 'Là'], correctAnswer: 'Được' },
    { type: 'sentence', hanzi: '唔該', pinyin: 'm4 goi1', meaning: 'Cảm ơn', question: 'Điền từ: ___晒！(Cảm ơn nhiều!)', sentence: '唔該晒！', options: ['唔該', '對唔住', '再見', '你好'], correctAnswer: '唔該' },
    { type: 'pinyin', hanzi: '得唔得', pinyin: 'dak1 m4 dak1', meaning: 'Được không', question: 'Chọn jyutping đúng:', options: ['dak1 m4 dak1', 'jau5 mou5', 'hai6 m4', 'hou2 m4'], correctAnswer: 'dak1 m4 dak1' },
    { type: 'meaning', hanzi: '好唔好', pinyin: 'hou2 m4 hou2', meaning: 'Tốt không / Có được không', question: 'Chọn nghĩa đúng:', options: ['Đắt không', 'Tốt không / Có được không', 'Xa không', 'Nhiều không'], correctAnswer: 'Tốt không / Có được không' },
    { type: 'hanzi', hanzi: '我', pinyin: 'ngo5', meaning: 'Tôi', question: 'Chọn chữ Hán "Tôi":', options: ['你', '我', '佢', '哋'], correctAnswer: '我' },
    { type: 'meaning', hanzi: '你', pinyin: 'nei5', meaning: 'Bạn', question: 'Chọn nghĩa đúng:', options: ['Tôi', 'Bạn', 'Anh ấy', 'Chúng ta'], correctAnswer: 'Bạn' },
    { type: 'sentence', hanzi: '佢', pinyin: 'keoi5', meaning: 'Anh ấy / Cô ấy', question: 'Điền từ: ___係老師。(Anh ấy là giáo viên)', sentence: '佢係老師。', options: ['佢', '我', '你', '哋'], correctAnswer: '佢' },
    { type: 'pinyin', hanzi: '我哋', pinyin: 'ngo5 dei6', meaning: 'Chúng tôi', question: 'Chọn jyutping đúng:', options: ['ngo5 dei6', 'nei5 dei6', 'keoi5 dei6', 'm4 goi1'], correctAnswer: 'ngo5 dei6' },
    { type: 'meaning', hanzi: '你哋', pinyin: 'nei5 dei6', meaning: 'Các bạn', question: 'Chọn nghĩa đúng:', options: ['Chúng tôi', 'Các bạn', 'Họ', 'Tôi'], correctAnswer: 'Các bạn' },
    { type: 'hanzi', hanzi: '佢哋', pinyin: 'keoi5 dei6', meaning: 'Họ', question: 'Chọn chữ Hán "Họ":', options: ['我哋', '你哋', '佢哋', '你'], correctAnswer: '佢哋' },
    { type: 'meaning', hanzi: '叫', pinyin: 'giu3', meaning: 'Gọi / Tên', question: 'Chọn nghĩa đúng:', options: ['Nói', 'Gọi / Tên', 'Hỏi', 'Đáp'], correctAnswer: 'Gọi / Tên' },
    { type: 'sentence', hanzi: '叫', pinyin: 'giu3', meaning: 'Tên', question: 'Điền từ: 你___乜嘢名？(Bạn tên gì?)', sentence: '你叫乜嘢名？', options: ['叫', '係', '有', '講'], correctAnswer: '叫' },
    { type: 'pinyin', hanzi: '乜嘢', pinyin: 'mat1 je5', meaning: 'Cái gì', question: 'Chọn jyutping đúng:', options: ['mat1 je5', 'bin1 go3', 'gei2 do1', 'dim2 gaai2'], correctAnswer: 'mat1 je5' },
    { type: 'meaning', hanzi: '邊個', pinyin: 'bin1 go3', meaning: 'Ai', question: 'Chọn nghĩa đúng:', options: ['Cái gì', 'Ai', 'Ở đâu', 'Khi nào'], correctAnswer: 'Ai' },
    { type: 'hanzi', hanzi: '幾多', pinyin: 'gei2 do1', meaning: 'Bao nhiêu', question: 'Chọn chữ Hán "Bao nhiêu":', options: ['乜嘢', '邊個', '幾多', '點解'], correctAnswer: '幾多' },
    { type: 'meaning', hanzi: '點解', pinyin: 'dim2 gaai2', meaning: 'Tại sao', question: 'Chọn nghĩa đúng:', options: ['Như thế nào', 'Tại sao', 'Ai', 'Cái gì'], correctAnswer: 'Tại sao' },
    { type: 'sentence', hanzi: '邊度', pinyin: 'bin1 dou6', meaning: 'Ở đâu', question: 'Điền từ: 你去___？(Bạn đi đâu?)', sentence: '你去邊度？', options: ['邊度', '邊個', '幾多', '點解'], correctAnswer: '邊度' },
    { type: 'pinyin', hanzi: '幾時', pinyin: 'gei2 si4', meaning: 'Khi nào', question: 'Chọn jyutping đúng:', options: ['gei2 si4', 'dim2 gaai2', 'bin1 dou6', 'mat1 je5'], correctAnswer: 'gei2 si4' },
    { type: 'meaning', hanzi: '去', pinyin: 'heoi3', meaning: 'Đi', question: 'Chọn nghĩa đúng:', options: ['Đến', 'Đi', 'Về', 'Ở'], correctAnswer: 'Đi' },
    { type: 'hanzi', hanzi: '嚟', pinyin: 'lai4', meaning: 'Đến', question: 'Chọn chữ Hán "Đến":', options: ['去', '嚟', '返', '喺'], correctAnswer: '嚟' },
    { type: 'meaning', hanzi: '返', pinyin: 'faan1', meaning: 'Trở về', question: 'Chọn nghĩa đúng:', options: ['Đi', 'Đến', 'Trở về', 'Ở'], correctAnswer: 'Trở về' },
    { type: 'sentence', hanzi: '喺', pinyin: 'hai2', meaning: 'Ở', question: 'Điền từ: 我___中環。(Tôi ở Central)', sentence: '我喺中環。', options: ['喺', '去', '嚟', '返'], correctAnswer: '喺' },
    { type: 'pinyin', hanzi: '中環', pinyin: 'zung1 waan4', meaning: 'Central (Trung Hoàn)', question: 'Chọn jyutping đúng:', options: ['zung1 waan4', 'zim1 saa1 zeoi2', 'gau1 lung4', 'mong2 gok3'], correctAnswer: 'zung1 waan4' },
    { type: 'meaning', hanzi: '香港', pinyin: 'hoeng1 gong2', meaning: 'Hồng Kông', question: 'Chọn nghĩa đúng:', options: ['Macau', 'Hồng Kông', 'Quảng Châu', 'Thượng Hải'], correctAnswer: 'Hồng Kông' },
    { type: 'hanzi', hanzi: '講', pinyin: 'gong2', meaning: 'Nói', question: 'Chọn chữ Hán "Nói":', options: ['聽', '講', '睇', '寫'], correctAnswer: '講' },
    { type: 'meaning', hanzi: '聽', pinyin: 'teng1', meaning: 'Nghe', question: 'Chọn nghĩa đúng:', options: ['Nói', 'Nghe', 'Nhìn', 'Viết'], correctAnswer: 'Nghe' },
    { type: 'sentence', hanzi: '睇', pinyin: 'tai2', meaning: 'Nhìn / Xem', question: 'Điền từ: 我___電視。(Tôi xem TV)', sentence: '我睇電視。', options: ['睇', '聽', '講', '寫'], correctAnswer: '睇' },
    { type: 'pinyin', hanzi: '識', pinyin: 'sik1', meaning: 'Biết / Quen', question: 'Chọn jyutping đúng:', options: ['sik1', 'zi1', 'ming4', 'gei3'], correctAnswer: 'sik1' },
    { type: 'meaning', hanzi: '知', pinyin: 'zi1', meaning: 'Biết (thông tin)', question: 'Chọn nghĩa đúng:', options: ['Quen', 'Biết (thông tin)', 'Nhớ', 'Quên'], correctAnswer: 'Biết (thông tin)' },
    { type: 'hanzi', hanzi: '明', pinyin: 'ming4', meaning: 'Hiểu', question: 'Chọn chữ Hán "Hiểu":', options: ['知', '識', '明', '記'], correctAnswer: '明' },
    { type: 'meaning', hanzi: '明白', pinyin: 'ming4 baak6', meaning: 'Hiểu rõ', question: 'Chọn nghĩa đúng:', options: ['Quên', 'Hiểu rõ', 'Nhớ', 'Không biết'], correctAnswer: 'Hiểu rõ' },
    { type: 'sentence', hanzi: '鍾意', pinyin: 'zung1 ji3', meaning: 'Thích', question: 'Điền từ: 我___香港。(Tôi thích Hồng Kông)', sentence: '我鍾意香港。', options: ['鍾意', '唔鍾意', '憎', '怕'], correctAnswer: '鍾意' },
    { type: 'pinyin', hanzi: '唔鍾意', pinyin: 'm4 zung1 ji3', meaning: 'Không thích', question: 'Chọn jyutping đúng:', options: ['m4 zung1 ji3', 'zung1 ji3', 'hou2 lik1', 'hou2 leng3'], correctAnswer: 'm4 zung1 ji3' },
    { type: 'meaning', hanzi: '好靚', pinyin: 'hou2 leng3', meaning: 'Rất đẹp', question: 'Chọn nghĩa đúng:', options: ['Rất xấu', 'Rất đẹp', 'Rất tốt', 'Rất to'], correctAnswer: 'Rất đẹp' },
  ],

  // CHAPTER 2: TSIM SHA TSUI 尖沙咀 - ⭐ EASY - Daily activities (50 questions)
  tst: [
    { type: 'meaning', hanzi: '食', pinyin: 'sik6', meaning: 'Ăn', question: 'Chọn nghĩa đúng:', options: ['Ăn', 'Uống', 'Ngủ', 'Chơi'], correctAnswer: 'Ăn' },
    { type: 'pinyin', hanzi: '飲', pinyin: 'jam2', meaning: 'Uống', question: 'Chọn jyutping đúng:', options: ['jam2', 'sik6', 'fan3', 'wan2'], correctAnswer: 'jam2' },
    { type: 'hanzi', hanzi: '瞓覺', pinyin: 'fan3 gaau3', meaning: 'Ngủ', question: 'Chọn chữ Hán "Ngủ":', options: ['食飯', '瞓覺', '沖涼', '返工'], correctAnswer: '瞓覺' },
    { type: 'sentence', hanzi: '食飯', pinyin: 'sik6 faan6', meaning: 'Ăn cơm', question: 'Điền từ: 我去___。(Tôi đi ăn cơm)', sentence: '我去食飯。', options: ['食飯', '瞓覺', '飲茶', '返工'], correctAnswer: '食飯' },
    { type: 'meaning', hanzi: '飲茶', pinyin: 'jam2 caa4', meaning: 'Uống trà / Ăn dimsum', question: 'Chọn nghĩa đúng:', options: ['Uống cà phê', 'Uống trà / Ăn dimsum', 'Uống nước', 'Ăn cơm'], correctAnswer: 'Uống trà / Ăn dimsum' },
    { type: 'pinyin', hanzi: '買嘢', pinyin: 'maai5 je5', meaning: 'Mua đồ', question: 'Chọn jyutping đúng:', options: ['maai5 je5', 'maai6 je5', 'sik6 je5', 'jam2 je5'], correctAnswer: 'maai5 je5' },
    { type: 'hanzi', hanzi: '賣嘢', pinyin: 'maai6 je5', meaning: 'Bán đồ', question: 'Chọn chữ Hán "Bán đồ":', options: ['買嘢', '賣嘢', '食嘢', '飲嘢'], correctAnswer: '賣嘢' },
    { type: 'meaning', hanzi: '錢', pinyin: 'cin2', meaning: 'Tiền', question: 'Chọn nghĩa đúng:', options: ['Vàng', 'Tiền', 'Thời gian', 'Đồng hồ'], correctAnswer: 'Tiền' },
    { type: 'sentence', hanzi: '幾錢', pinyin: 'gei2 cin2', meaning: 'Bao nhiêu tiền', question: 'Điền từ: 呢個___？(Cái này bao nhiêu tiền?)', sentence: '呢個幾錢？', options: ['幾錢', '幾多', '邊度', '幾時'], correctAnswer: '幾錢' },
    { type: 'pinyin', hanzi: '平', pinyin: 'peng4', meaning: 'Rẻ', question: 'Chọn jyutping đúng:', options: ['peng4', 'gwai3', 'hou2', 'sai3'], correctAnswer: 'peng4' },
    { type: 'meaning', hanzi: '貴', pinyin: 'gwai3', meaning: 'Đắt', question: 'Chọn nghĩa đúng:', options: ['Rẻ', 'Đắt', 'Tốt', 'Xấu'], correctAnswer: 'Đắt' },
    { type: 'hanzi', hanzi: '抵', pinyin: 'dai2', meaning: 'Đáng giá', question: 'Chọn chữ Hán "Đáng giá":', options: ['貴', '平', '抵', '好'], correctAnswer: '抵' },
    { type: 'meaning', hanzi: '好抵', pinyin: 'hou2 dai2', meaning: 'Rất đáng giá', question: 'Chọn nghĩa đúng:', options: ['Rất đắt', 'Rất rẻ', 'Rất đáng giá', 'Rất tốt'], correctAnswer: 'Rất đáng giá' },
    { type: 'sentence', hanzi: '呢個', pinyin: 'ni1 go3', meaning: 'Cái này', question: 'Điền từ: ___好平。(Cái này rất rẻ)', sentence: '呢個好平。', options: ['呢個', '嗰個', '邊個', '點解'], correctAnswer: '呢個' },
    { type: 'pinyin', hanzi: '嗰個', pinyin: 'go2 go3', meaning: 'Cái kia', question: 'Chọn jyutping đúng:', options: ['go2 go3', 'ni1 go3', 'bin1 go3', 'mat1 je5'], correctAnswer: 'go2 go3' },
    { type: 'meaning', hanzi: '呢啲', pinyin: 'ni1 di1', meaning: 'Những cái này', question: 'Chọn nghĩa đúng:', options: ['Cái này', 'Những cái này', 'Cái kia', 'Những cái kia'], correctAnswer: 'Những cái này' },
    { type: 'hanzi', hanzi: '嗰啲', pinyin: 'go2 di1', meaning: 'Những cái kia', question: 'Chọn chữ Hán "Những cái kia":', options: ['呢個', '呢啲', '嗰個', '嗰啲'], correctAnswer: '嗰啲' },
    { type: 'meaning', hanzi: '想', pinyin: 'soeng2', meaning: 'Muốn', question: 'Chọn nghĩa đúng:', options: ['Không muốn', 'Muốn', 'Cần', 'Thích'], correctAnswer: 'Muốn' },
    { type: 'sentence', hanzi: '唔想', pinyin: 'm4 soeng2', meaning: 'Không muốn', question: 'Điền từ: 我___買。(Tôi không muốn mua)', sentence: '我唔想買。', options: ['唔想', '想', '要', '需要'], correctAnswer: '唔想' },
    { type: 'pinyin', hanzi: '要', pinyin: 'jiu3', meaning: 'Cần / Muốn', question: 'Chọn jyutping đúng:', options: ['jiu3', 'soeng2', 'zi1', 'sik1'], correctAnswer: 'jiu3' },
    { type: 'meaning', hanzi: '唔要', pinyin: 'm4 jiu3', meaning: 'Không cần', question: 'Chọn nghĩa đúng:', options: ['Cần', 'Không cần', 'Muốn', 'Thích'], correctAnswer: 'Không cần' },
    { type: 'hanzi', hanzi: '鍾意', pinyin: 'zung1 ji3', meaning: 'Thích', question: 'Chọn chữ Hán "Thích":', options: ['想', '要', '鍾意', '愛'], correctAnswer: '鍾意' },
    { type: 'meaning', hanzi: '愛', pinyin: 'oi3', meaning: 'Yêu', question: 'Chọn nghĩa đúng:', options: ['Thích', 'Yêu', 'Ghét', 'Sợ'], correctAnswer: 'Yêu' },
    { type: 'sentence', hanzi: '鋪頭', pinyin: 'pou3 tau2', meaning: 'Cửa hàng', question: 'Điền từ: 我去___買嘢。(Tôi đi cửa hàng mua đồ)', sentence: '我去鋪頭買嘢。', options: ['鋪頭', '屋企', '公司', '學校'], correctAnswer: '鋪頭' },
    { type: 'pinyin', hanzi: '商場', pinyin: 'soeng1 coeng4', meaning: 'Trung tâm thương mại', question: 'Chọn jyutping đúng:', options: ['soeng1 coeng4', 'pou3 tau2', 'caan1 teng1', 'jau2 dim3'], correctAnswer: 'soeng1 coeng4' },
    { type: 'meaning', hanzi: '餐廳', pinyin: 'caan1 teng1', meaning: 'Nhà hàng', question: 'Chọn nghĩa đúng:', options: ['Cửa hàng', 'Nhà hàng', 'Khách sạn', 'Văn phòng'], correctAnswer: 'Nhà hàng' },
    { type: 'hanzi', hanzi: '酒店', pinyin: 'zau2 dim3', meaning: 'Khách sạn', question: 'Chọn chữ Hán "Khách sạn":', options: ['餐廳', '酒店', '商場', '鋪頭'], correctAnswer: '酒店' },
    { type: 'meaning', hanzi: '返工', pinyin: 'faan1 gung1', meaning: 'Đi làm', question: 'Chọn nghĩa đúng:', options: ['Nghỉ', 'Đi làm', 'Đi học', 'Về nhà'], correctAnswer: 'Đi làm' },
    { type: 'sentence', hanzi: '返學', pinyin: 'faan1 hok6', meaning: 'Đi học', question: 'Điền từ: 我要___。(Tôi phải đi học)', sentence: '我要返學。', options: ['返學', '返工', '放假', '瞓覺'], correctAnswer: '返學' },
    { type: 'pinyin', hanzi: '放假', pinyin: 'fong3 gaa3', meaning: 'Nghỉ / Nghỉ lễ', question: 'Chọn jyutping đúng:', options: ['fong3 gaa3', 'faan1 gung1', 'faan1 hok6', 'siu1 sik1'], correctAnswer: 'fong3 gaa3' },
    { type: 'meaning', hanzi: '休息', pinyin: 'jau1 sik1', meaning: 'Nghỉ ngơi', question: 'Chọn nghĩa đúng:', options: ['Làm việc', 'Nghỉ ngơi', 'Chơi', 'Ngủ'], correctAnswer: 'Nghỉ ngơi' },
    { type: 'hanzi', hanzi: '沖涼', pinyin: 'cung1 loeng4', meaning: 'Tắm', question: 'Chọn chữ Hán "Tắm":', options: ['瞓覺', '沖涼', '食飯', '返工'], correctAnswer: '沖涼' },
    { type: 'meaning', hanzi: '著衫', pinyin: 'zoek3 saam1', meaning: 'Mặc quần áo', question: 'Chọn nghĩa đúng:', options: ['Cởi quần áo', 'Mặc quần áo', 'Giặt quần áo', 'Mua quần áo'], correctAnswer: 'Mặc quần áo' },
    { type: 'sentence', hanzi: '衫', pinyin: 'saam1', meaning: 'Áo', question: 'Điền từ: 我買件___。(Tôi mua áo)', sentence: '我買件衫。', options: ['衫', '褲', '鞋', '襪'], correctAnswer: '衫' },
    { type: 'pinyin', hanzi: '褲', pinyin: 'fu3', meaning: 'Quần', question: 'Chọn jyutping đúng:', options: ['fu3', 'saam1', 'haai4', 'mat6'], correctAnswer: 'fu3' },
    { type: 'meaning', hanzi: '鞋', pinyin: 'haai4', meaning: 'Giày', question: 'Chọn nghĩa đúng:', options: ['Áo', 'Quần', 'Giày', 'Tất'], correctAnswer: 'Giày' },
    { type: 'hanzi', hanzi: '襪', pinyin: 'mat6', meaning: 'Tất', question: 'Chọn chữ Hán "Tất":', options: ['衫', '褲', '鞋', '襪'], correctAnswer: '襪' },
    { type: 'meaning', hanzi: '屋企', pinyin: 'uk1 kei2', meaning: 'Nhà', question: 'Chọn nghĩa đúng:', options: ['Cửa hàng', 'Nhà', 'Công ty', 'Trường học'], correctAnswer: 'Nhà' },
    { type: 'sentence', hanzi: '返屋企', pinyin: 'faan1 uk1 kei2', meaning: 'Về nhà', question: 'Điền từ: 我要___。(Tôi phải về nhà)', sentence: '我要返屋企。', options: ['返屋企', '返工', '返學', '去玩'], correctAnswer: '返屋企' },
    { type: 'pinyin', hanzi: '公司', pinyin: 'gung1 si1', meaning: 'Công ty', question: 'Chọn jyutping đúng:', options: ['gung1 si1', 'uk1 kei2', 'hok6 haau6', 'jyun4'], correctAnswer: 'gung1 si1' },
    { type: 'meaning', hanzi: '學校', pinyin: 'hok6 haau6', meaning: 'Trường học', question: 'Chọn nghĩa đúng:', options: ['Công ty', 'Trường học', 'Nhà', 'Công viên'], correctAnswer: 'Trường học' },
    { type: 'hanzi', hanzi: '公園', pinyin: 'gung1 jyun4', meaning: 'Công viên', question: 'Chọn chữ Hán "Công viên":', options: ['公司', '學校', '公園', '屋企'], correctAnswer: '公園' },
    { type: 'meaning', hanzi: '尖沙咀', pinyin: 'zim1 saa1 zeoi2', meaning: 'Tsim Sha Tsui', question: 'Chọn nghĩa đúng:', options: ['Central', 'Tsim Sha Tsui', 'Mong Kok', 'Causeway Bay'], correctAnswer: 'Tsim Sha Tsui' },
    { type: 'sentence', hanzi: '海港城', pinyin: 'hoi2 gong2 sing4', meaning: 'Harbour City', question: 'Điền từ: 我去___買嘢。(Tôi đi Harbour City mua đồ)', sentence: '我去海港城買嘢。', options: ['海港城', '時代廣場', 'IFC', '朗豪坊'], correctAnswer: '海港城' },
    { type: 'pinyin', hanzi: '鐘樓', pinyin: 'zung1 lau4', meaning: 'Tháp đồng hồ', question: 'Chọn jyutping đúng:', options: ['zung1 lau4', 'hoi2 bong6', 'si6 doi6', 'gwong2 coeng4'], correctAnswer: 'zung1 lau4' },
    { type: 'meaning', hanzi: '海旁', pinyin: 'hoi2 pong4', meaning: 'Bờ biển / Ven biển', question: 'Chọn nghĩa đúng:', options: ['Núi', 'Bờ biển / Ven biển', 'Công viên', 'Tòa nhà'], correctAnswer: 'Bờ biển / Ven biển' },
    { type: 'hanzi', hanzi: '行', pinyin: 'haang4', meaning: 'Đi bộ / Đi dạo', question: 'Chọn chữ Hán "Đi bộ":', options: ['跑', '行', '坐', '企'], correctAnswer: '行' },
    { type: 'meaning', hanzi: '行街', pinyin: 'haang4 gaai1', meaning: 'Đi dạo phố', question: 'Chọn nghĩa đúng:', options: ['Chạy bộ', 'Đi dạo phố', 'Ngồi', 'Đứng'], correctAnswer: 'Đi dạo phố' },
    { type: 'sentence', hanzi: '搭', pinyin: 'daap3', meaning: 'Đi / Lên (phương tiện)', question: 'Điền từ: 我___地鐵。(Tôi đi tàu điện ngầm)', sentence: '我搭地鐵。', options: ['搭', '行', '跑', '企'], correctAnswer: '搭' },
    { type: 'pinyin', hanzi: '地鐵', pinyin: 'dei6 tit3', meaning: 'Tàu điện ngầm', question: 'Chọn jyutping đúng:', options: ['dei6 tit3', 'baa1 si2', 'dik1 si2', 'din6 ce1'], correctAnswer: 'dei6 tit3' },
  ],

  // CHAPTER 3: VICTORIA PEAK 太平山 - ⭐⭐ MEDIUM - Culture & scenery (50 questions)
  peak: [
    { type: 'meaning', hanzi: '太平山', pinyin: 'taai3 ping4 saan1', meaning: 'Núi Thái Bình (Victoria Peak)', question: 'Chọn nghĩa đúng:', options: ['Núi Phượng Hoàng', 'Núi Thái Bình (Victoria Peak)', 'Núi Sư Tử', 'Núi Rồng'], correctAnswer: 'Núi Thái Bình (Victoria Peak)' },
    { type: 'pinyin', hanzi: '山頂', pinyin: 'saan1 deng2', meaning: 'Đỉnh núi', question: 'Chọn jyutping đúng:', options: ['saan1 deng2', 'saan1 gaak3', 'hoi2 bin1', 'waan1 zai2'], correctAnswer: 'saan1 deng2' },
    { type: 'hanzi', hanzi: '纜車', pinyin: 'laam6 ce1', meaning: 'Cáp treo', question: 'Chọn chữ Hán "Cáp treo":', options: ['地鐵', '巴士', '纜車', '電車'], correctAnswer: '纜車' },
    { type: 'sentence', hanzi: '靚', pinyin: 'leng3', meaning: 'Đẹp', question: 'Điền từ: 風景好___。(Phong cảnh rất đẹp)', sentence: '風景好靚。', options: ['靚', '醜', '高', '低'], correctAnswer: '靚' },
    { type: 'meaning', hanzi: '風景', pinyin: 'fung1 ging2', meaning: 'Phong cảnh', question: 'Chọn nghĩa đúng:', options: ['Tòa nhà', 'Phong cảnh', 'Con người', 'Đường phố'], correctAnswer: 'Phong cảnh' },
    { type: 'pinyin', hanzi: '景色', pinyin: 'ging2 sik1', meaning: 'Cảnh sắc', question: 'Chọn jyutping đúng:', options: ['ging2 sik1', 'fung1 ging2', 'mei5 ging2', 'jaa3 ging2'], correctAnswer: 'ging2 sik1' },
    { type: 'hanzi', hanzi: '美景', pinyin: 'mei5 ging2', meaning: 'Cảnh đẹp', question: 'Chọn chữ Hán "Cảnh đẹp":', options: ['風景', '美景', '夜景', '海景'], correctAnswer: '美景' },
    { type: 'meaning', hanzi: '夜景', pinyin: 'je6 ging2', meaning: 'Cảnh đêm', question: 'Chọn nghĩa đúng:', options: ['Cảnh ngày', 'Cảnh đêm', 'Cảnh biển', 'Cảnh núi'], correctAnswer: 'Cảnh đêm' },
    { type: 'sentence', hanzi: '睇', pinyin: 'tai2', meaning: 'Xem / Nhìn', question: 'Điền từ: 我哋上山頂___夜景。(Chúng tôi lên đỉnh núi xem cảnh đêm)', sentence: '我哋上山頂睇夜景。', options: ['睇', '聽', '講', '寫'], correctAnswer: '睇' },
    { type: 'pinyin', hanzi: '靚景', pinyin: 'leng3 ging2', meaning: 'Cảnh đẹp', question: 'Chọn jyutping đúng:', options: ['leng3 ging2', 'caau2 ging2', 'naam4 ging2', 'gou1 ging2'], correctAnswer: 'leng3 ging2' },
    { type: 'meaning', hanzi: '高', pinyin: 'gou1', meaning: 'Cao', question: 'Chọn nghĩa đúng:', options: ['Thấp', 'Cao', 'Dài', 'Ngắn'], correctAnswer: 'Cao' },
    { type: 'hanzi', hanzi: '低', pinyin: 'dai1', meaning: 'Thấp', question: 'Chọn chữ Hán "Thấp":', options: ['高', '低', '長', '短'], correctAnswer: '低' },
    { type: 'meaning', hanzi: '大', pinyin: 'daai6', meaning: 'To / Lớn', question: 'Chọn nghĩa đúng:', options: ['Nhỏ', 'To / Lớn', 'Dài', 'Ngắn'], correctAnswer: 'To / Lớn' },
    { type: 'sentence', hanzi: '細', pinyin: 'sai3', meaning: 'Nhỏ', question: 'Điền từ: 呢間屋好___。(Căn nhà này rất nhỏ)', sentence: '呢間屋好細。', options: ['細', '大', '高', '低'], correctAnswer: '細' },
    { type: 'pinyin', hanzi: '長', pinyin: 'coeng4', meaning: 'Dài', question: 'Chọn jyutping đúng:', options: ['coeng4', 'dyun2', 'gou1', 'dai1'], correctAnswer: 'coeng4' },
    { type: 'meaning', hanzi: '短', pinyin: 'dyun2', meaning: 'Ngắn', question: 'Chọn nghĩa đúng:', options: ['Dài', 'Ngắn', 'Cao', 'Thấp'], correctAnswer: 'Ngắn' },
    { type: 'hanzi', hanzi: '靚仔', pinyin: 'leng3 zai2', meaning: 'Đẹp trai', question: 'Chọn chữ Hán "Đẹp trai":', options: ['靚女', '靚仔', '醜男', '醜女'], correctAnswer: '靚仔' },
    { type: 'meaning', hanzi: '靚女', pinyin: 'leng3 neoi5', meaning: 'Đẹp gái', question: 'Chọn nghĩa đúng:', options: ['Đẹp trai', 'Đẹp gái', 'Xấu trai', 'Xấu gái'], correctAnswer: 'Đẹp gái' },
    { type: 'sentence', hanzi: '影相', pinyin: 'jing2 soeng2', meaning: 'Chụp ảnh', question: 'Điền từ: 我哋喺山頂___。(Chúng tôi chụp ảnh ở đỉnh núi)', sentence: '我哋喺山頂影相。', options: ['影相', '食飯', '瞓覺', '返工'], correctAnswer: '影相' },
    { type: 'pinyin', hanzi: '相機', pinyin: 'soeng2 gei1', meaning: 'Máy ảnh', question: 'Chọn jyutping đúng:', options: ['soeng2 gei1', 'din6 waa2', 'din6 nou5', 'din6 si6'], correctAnswer: 'soeng2 gei1' },
    { type: 'meaning', hanzi: '手機', pinyin: 'sau2 gei1', meaning: 'Điện thoại', question: 'Chọn nghĩa đúng:', options: ['Máy ảnh', 'Điện thoại', 'Máy tính', 'TV'], correctAnswer: 'Điện thoại' },
    { type: 'hanzi', hanzi: '電話', pinyin: 'din6 waa2', meaning: 'Điện thoại', question: 'Chọn chữ Hán "Điện thoại":', options: ['電腦', '電話', '電視', '電影'], correctAnswer: '電話' },
    { type: 'meaning', hanzi: '電腦', pinyin: 'din6 nou5', meaning: 'Máy tính', question: 'Chọn nghĩa đúng:', options: ['Điện thoại', 'Máy tính', 'TV', 'Phim'], correctAnswer: 'Máy tính' },
    { type: 'sentence', hanzi: '電視', pinyin: 'din6 si6', meaning: 'TV', question: 'Điền từ: 我鍾意睇___。(Tôi thích xem TV)', sentence: '我鍾意睇電視。', options: ['電視', '電影', '電話', '電腦'], correctAnswer: '電視' },
    { type: 'pinyin', hanzi: '電影', pinyin: 'din6 jing2', meaning: 'Phim', question: 'Chọn jyutping đúng:', options: ['din6 jing2', 'din6 si6', 'din6 nou5', 'din6 waa2'], correctAnswer: 'din6 jing2' },
    { type: 'meaning', hanzi: '文化', pinyin: 'man4 faa3', meaning: 'Văn hóa', question: 'Chọn nghĩa đúng:', options: ['Lịch sử', 'Văn hóa', 'Nghệ thuật', 'Khoa học'], correctAnswer: 'Văn hóa' },
    { type: 'hanzi', hanzi: '歷史', pinyin: 'lik6 si2', meaning: 'Lịch sử', question: 'Chọn chữ Hán "Lịch sử":', options: ['文化', '歷史', '藝術', '科學'], correctAnswer: '歷史' },
    { type: 'meaning', hanzi: '藝術', pinyin: 'ngai6 seot6', meaning: 'Nghệ thuật', question: 'Chọn nghĩa đúng:', options: ['Văn hóa', 'Lịch sử', 'Nghệ thuật', 'Khoa học'], correctAnswer: 'Nghệ thuật' },
    { type: 'sentence', hanzi: '舊', pinyin: 'gau6', meaning: 'Cũ', question: 'Điền từ: 呢間屋好___。(Căn nhà này rất cũ)', sentence: '呢間屋好舊。', options: ['舊', '新', '靚', '醜'], correctAnswer: '舊' },
    { type: 'pinyin', hanzi: '新', pinyin: 'san1', meaning: 'Mới', question: 'Chọn jyutping đúng:', options: ['san1', 'gau6', 'leng3', 'caau2'], correctAnswer: 'san1' },
    { type: 'meaning', hanzi: '現代', pinyin: 'jin6 doi6', meaning: 'Hiện đại', question: 'Chọn nghĩa đúng:', options: ['Cổ đại', 'Hiện đại', 'Cũ', 'Mới'], correctAnswer: 'Hiện đại' },
    { type: 'hanzi', hanzi: '古老', pinyin: 'gu2 lou5', meaning: 'Cổ xưa', question: 'Chọn chữ Hán "Cổ xưa":', options: ['現代', '新', '古老', '舊'], correctAnswer: '古老' },
    { type: 'meaning', hanzi: '傳統', pinyin: 'cyun4 tung2', meaning: 'Truyền thống', question: 'Chọn nghĩa đúng:', options: ['Hiện đại', 'Truyền thống', 'Mới', 'Ngoại lai'], correctAnswer: 'Truyền thống' },
    { type: 'sentence', hanzi: '名勝', pinyin: 'ming4 sing3', meaning: 'Danh lam thắng cảnh', question: 'Điền từ: 太平山係香港___。(Thái Bình Sơn là danh lam thắng cảnh của Hồng Kông)', sentence: '太平山係香港名勝。', options: ['名勝', '商場', '公司', '學校'], correctAnswer: '名勝' },
    { type: 'pinyin', hanzi: '旅遊', pinyin: 'leoi5 jau4', meaning: 'Du lịch', question: 'Chọn jyutping đúng:', options: ['leoi5 jau4', 'faan1 gung1', 'faan1 hok6', 'fong3 gaa3'], correctAnswer: 'leoi5 jau4' },
    { type: 'meaning', hanzi: '遊客', pinyin: 'jau4 haak3', meaning: 'Du khách', question: 'Chọn nghĩa đúng:', options: ['Người địa phương', 'Du khách', 'Sinh viên', 'Nhân viên'], correctAnswer: 'Du khách' },
    { type: 'hanzi', hanzi: '本地人', pinyin: 'bun2 dei6 jan4', meaning: 'Người địa phương', question: 'Chọn chữ Hán "Người địa phương":', options: ['遊客', '本地人', '外國人', '學生'], correctAnswer: '本地人' },
    { type: 'meaning', hanzi: '外國人', pinyin: 'ngoi6 gwok3 jan4', meaning: 'Người nước ngoài', question: 'Chọn nghĩa đúng:', options: ['Người địa phương', 'Người nước ngoài', 'Du khách', 'Sinh viên'], correctAnswer: 'Người nước ngoài' },
    { type: 'sentence', hanzi: '天氣', pinyin: 'tin1 hei3', meaning: 'Thời tiết', question: 'Điền từ: 今日___好靚。(Hôm nay thời tiết rất đẹp)', sentence: '今日天氣好靚。', options: ['天氣', '風景', '人', '食物'], correctAnswer: '天氣' },
    { type: 'pinyin', hanzi: '晴天', pinyin: 'cing4 tin1', meaning: 'Trời nắng', question: 'Chọn jyutping đúng:', options: ['cing4 tin1', 'lok6 jyu5', 'daa2 fung1', 'lok6 syut3'], correctAnswer: 'cing4 tin1' },
    { type: 'meaning', hanzi: '落雨', pinyin: 'lok6 jyu5', meaning: 'Mưa', question: 'Chọn nghĩa đúng:', options: ['Nắng', 'Mưa', 'Gió', 'Tuyết'], correctAnswer: 'Mưa' },
    { type: 'hanzi', hanzi: '打風', pinyin: 'daa2 fung1', meaning: 'Có bão', question: 'Chọn chữ Hán "Có bão":', options: ['晴天', '落雨', '打風', '落雪'], correctAnswer: '打風' },
    { type: 'meaning', hanzi: '熱', pinyin: 'jit6', meaning: 'Nóng', question: 'Chọn nghĩa đúng:', options: ['Lạnh', 'Nóng', 'Ấm', 'Mát'], correctAnswer: 'Nóng' },
    { type: 'sentence', hanzi: '凍', pinyin: 'dung3', meaning: 'Lạnh', question: 'Điền từ: 今日好___。(Hôm nay rất lạnh)', sentence: '今日好凍。', options: ['凍', '熱', '暖', '涼'], correctAnswer: '凍' },
    { type: 'pinyin', hanzi: '暖', pinyin: 'nyun5', meaning: 'Ấm', question: 'Chọn jyutping đúng:', options: ['nyun5', 'jit6', 'dung3', 'leong4'], correctAnswer: 'nyun5' },
    { type: 'meaning', hanzi: '涼', pinyin: 'leong4', meaning: 'Mát', question: 'Chọn nghĩa đúng:', options: ['Nóng', 'Lạnh', 'Ấm', 'Mát'], correctAnswer: 'Mát' },
    { type: 'hanzi', hanzi: '舒服', pinyin: 'syu1 fuk6', meaning: 'Thoải mái', question: 'Chọn chữ Hán "Thoải mái":', options: ['辛苦', '舒服', '開心', '傷心'], correctAnswer: '舒服' },
    { type: 'meaning', hanzi: '開心', pinyin: 'hoi1 sam1', meaning: 'Vui', question: 'Chọn nghĩa đúng:', options: ['Buồn', 'Vui', 'Thoải mái', 'Vất vả'], correctAnswer: 'Vui' },
    { type: 'sentence', hanzi: '好玩', pinyin: 'hou2 waan2', meaning: 'Vui / Hay', question: 'Điền từ: 太平山好___！(Thái Bình Sơn rất vui!)', sentence: '太平山好好玩！', options: ['好玩', '悶', '辛苦', '驚'], correctAnswer: '好玩' },
    { type: 'pinyin', hanzi: '有趣', pinyin: 'jau5 ceoi3', meaning: 'Thú vị', question: 'Chọn jyutping đúng:', options: ['jau5 ceoi3', 'mun6', 'ho2 pa3', 'hou2 waan2'], correctAnswer: 'jau5 ceoi3' },
  ],

  // TODO: Chương 4-10 sẽ được thêm sau (350 câu còn lại)
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

export default function CantoneseStoryMode() {
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
      title: 'Central 中環',
      location: '中環 (Zung1 Waan4)',
      description: 'Bắt đầu với chào hỏi và từ vựng cơ bản tại trung tâm Hồng Kông. 50 câu với Jyutping.',
      icon: '🏦',
      difficulty: '⭐',
      lessons: generateLessons('central', 5),
      xpReward: 100,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '2',
      number: 2,
      title: 'Tsim Sha Tsui 尖沙咀',
      location: '尖沙咀 (Zim1 Saa1 Zeoi2)',
      description: 'Sinh hoạt hàng ngày và mua sắm ở khu Tsim Sha Tsui. 50 câu Jyutping thực tế.',
      icon: '🛍️',
      difficulty: '⭐',
      lessons: generateLessons('tst', 5),
      xpReward: 150,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '3',
      number: 3,
      title: 'Victoria Peak 太平山',
      location: '太平山 (Taai3 Ping4 Saan1)',
      description: 'Văn hóa và phong cảnh tại đỉnh núi nổi tiếng. 50 câu với độ khó tăng dần.',
      icon: '🗻',
      difficulty: '⭐⭐',
      lessons: generateLessons('peak', 5),
      xpReward: 200,
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
                <Link to="/cantonese/login">Đăng nhập ngay</Link>
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
            <Link to="/cantonese/gamification">
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
