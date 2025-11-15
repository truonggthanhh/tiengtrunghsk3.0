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
  hanzi: string;
  pinyin: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  location: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

// Vocabulary database for all chapters
const vocabDatabase: Record<string, VocabQuestion[]> = {
  beijing: [
    { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello', options: ['Hello', 'Goodbye', 'Thanks', 'Sorry'], correctAnswer: 'Hello' },
    { hanzi: '再见', pinyin: 'zài jiàn', meaning: 'Goodbye', options: ['Hello', 'Goodbye', 'Please', 'Yes'], correctAnswer: 'Goodbye' },
    { hanzi: '谢谢', pinyin: 'xiè xiè', meaning: 'Thank you', options: ['Sorry', 'Thank you', 'Please', 'Welcome'], correctAnswer: 'Thank you' },
    { hanzi: '对不起', pinyin: 'duì bu qǐ', meaning: 'Sorry', options: ['Sorry', 'Thanks', 'Hello', 'Yes'], correctAnswer: 'Sorry' },
    { hanzi: '是', pinyin: 'shì', meaning: 'Yes/To be', options: ['No', 'Yes/To be', 'Maybe', 'Not'], correctAnswer: 'Yes/To be' },
  ],
  shanghai: [
    { hanzi: '吃饭', pinyin: 'chī fàn', meaning: 'To eat', options: ['To eat', 'To drink', 'To sleep', 'To walk'], correctAnswer: 'To eat' },
    { hanzi: '喝水', pinyin: 'hē shuǐ', meaning: 'To drink water', options: ['To eat', 'To drink water', 'To cook', 'To wash'], correctAnswer: 'To drink water' },
    { hanzi: '买', pinyin: 'mǎi', meaning: 'To buy', options: ['To sell', 'To buy', 'To eat', 'To drink'], correctAnswer: 'To buy' },
    { hanzi: '钱', pinyin: 'qián', meaning: 'Money', options: ['Time', 'Money', 'Food', 'Water'], correctAnswer: 'Money' },
    { hanzi: '多少', pinyin: 'duō shǎo', meaning: 'How much/many', options: ['Where', 'When', 'How much/many', 'Why'], correctAnswer: 'How much/many' },
    { hanzi: '便宜', pinyin: 'pián yi', meaning: 'Cheap', options: ['Expensive', 'Cheap', 'Good', 'Bad'], correctAnswer: 'Cheap' },
  ],
  greatwall: [
    { hanzi: '历史', pinyin: 'lì shǐ', meaning: 'History', options: ['History', 'Culture', 'Art', 'Science'], correctAnswer: 'History' },
    { hanzi: '文化', pinyin: 'wén huà', meaning: 'Culture', options: ['History', 'Culture', 'Language', 'Food'], correctAnswer: 'Culture' },
    { hanzi: '长城', pinyin: 'cháng chéng', meaning: 'Great Wall', options: ['Great Wall', 'Palace', 'Temple', 'Mountain'], correctAnswer: 'Great Wall' },
    { hanzi: '古老', pinyin: 'gǔ lǎo', meaning: 'Ancient', options: ['Modern', 'Ancient', 'New', 'Young'], correctAnswer: 'Ancient' },
    { hanzi: '美丽', pinyin: 'měi lì', meaning: 'Beautiful', options: ['Ugly', 'Beautiful', 'Big', 'Small'], correctAnswer: 'Beautiful' },
    { hanzi: '壮观', pinyin: 'zhuàng guān', meaning: 'Magnificent', options: ['Tiny', 'Magnificent', 'Boring', 'Simple'], correctAnswer: 'Magnificent' },
    { hanzi: '建筑', pinyin: 'jiàn zhù', meaning: 'Architecture', options: ['Architecture', 'Painting', 'Music', 'Dance'], correctAnswer: 'Architecture' },
  ],
  xian: [
    { hanzi: '面条', pinyin: 'miàn tiáo', meaning: 'Noodles', options: ['Rice', 'Noodles', 'Bread', 'Soup'], correctAnswer: 'Noodles' },
    { hanzi: '饺子', pinyin: 'jiǎo zi', meaning: 'Dumplings', options: ['Dumplings', 'Noodles', 'Rice', 'Soup'], correctAnswer: 'Dumplings' },
    { hanzi: '好吃', pinyin: 'hǎo chī', meaning: 'Delicious', options: ['Bad taste', 'Delicious', 'Spicy', 'Sweet'], correctAnswer: 'Delicious' },
    { hanzi: '辣', pinyin: 'là', meaning: 'Spicy', options: ['Sweet', 'Sour', 'Spicy', 'Salty'], correctAnswer: 'Spicy' },
    { hanzi: '甜', pinyin: 'tián', meaning: 'Sweet', options: ['Sweet', 'Sour', 'Bitter', 'Salty'], correctAnswer: 'Sweet' },
    { hanzi: '咸', pinyin: 'xián', meaning: 'Salty', options: ['Sweet', 'Salty', 'Spicy', 'Sour'], correctAnswer: 'Salty' },
    { hanzi: '酸', pinyin: 'suān', meaning: 'Sour', options: ['Sweet', 'Sour', 'Bitter', 'Salty'], correctAnswer: 'Sour' },
    { hanzi: '苦', pinyin: 'kǔ', meaning: 'Bitter', options: ['Sweet', 'Sour', 'Bitter', 'Salty'], correctAnswer: 'Bitter' },
  ],
  chengdu: [
    { hanzi: '熊猫', pinyin: 'xióng māo', meaning: 'Panda', options: ['Panda', 'Tiger', 'Lion', 'Bear'], correctAnswer: 'Panda' },
    { hanzi: '动物', pinyin: 'dòng wù', meaning: 'Animal', options: ['Plant', 'Animal', 'Person', 'Thing'], correctAnswer: 'Animal' },
    { hanzi: '可爱', pinyin: 'kě ài', meaning: 'Cute', options: ['Ugly', 'Cute', 'Scary', 'Big'], correctAnswer: 'Cute' },
    { hanzi: '自然', pinyin: 'zì rán', meaning: 'Nature', options: ['City', 'Nature', 'Building', 'Car'], correctAnswer: 'Nature' },
    { hanzi: '森林', pinyin: 'sēn lín', meaning: 'Forest', options: ['Desert', 'Ocean', 'Forest', 'Mountain'], correctAnswer: 'Forest' },
    { hanzi: '竹子', pinyin: 'zhú zi', meaning: 'Bamboo', options: ['Tree', 'Bamboo', 'Grass', 'Flower'], correctAnswer: 'Bamboo' },
    { hanzi: '保护', pinyin: 'bǎo hù', meaning: 'To protect', options: ['To destroy', 'To protect', 'To sell', 'To eat'], correctAnswer: 'To protect' },
    { hanzi: '珍稀', pinyin: 'zhēn xī', meaning: 'Rare', options: ['Common', 'Rare', 'Many', 'Few'], correctAnswer: 'Rare' },
    { hanzi: '可爱的', pinyin: 'kě ài de', meaning: 'Adorable', options: ['Scary', 'Adorable', 'Angry', 'Sad'], correctAnswer: 'Adorable' },
  ],
  guilin: [
    { hanzi: '山', pinyin: 'shān', meaning: 'Mountain', options: ['River', 'Mountain', 'Sea', 'Lake'], correctAnswer: 'Mountain' },
    { hanzi: '水', pinyin: 'shuǐ', meaning: 'Water', options: ['Fire', 'Water', 'Wind', 'Earth'], correctAnswer: 'Water' },
    { hanzi: '河', pinyin: 'hé', meaning: 'River', options: ['River', 'Sea', 'Lake', 'Ocean'], correctAnswer: 'River' },
    { hanzi: '风景', pinyin: 'fēng jǐng', meaning: 'Scenery', options: ['Scenery', 'Building', 'Car', 'Food'], correctAnswer: 'Scenery' },
    { hanzi: '旅游', pinyin: 'lǚ yóu', meaning: 'Tourism/Travel', options: ['Work', 'Study', 'Tourism/Travel', 'Sleep'], correctAnswer: 'Tourism/Travel' },
    { hanzi: '照相', pinyin: 'zhào xiàng', meaning: 'Take photos', options: ['Draw', 'Take photos', 'Write', 'Sing'], correctAnswer: 'Take photos' },
    { hanzi: '美景', pinyin: 'měi jǐng', meaning: 'Beautiful view', options: ['Ugly view', 'Beautiful view', 'Dark night', 'Rainy day'], correctAnswer: 'Beautiful view' },
    { hanzi: '漂亮', pinyin: 'piào liang', meaning: 'Pretty', options: ['Ugly', 'Pretty', 'Big', 'Small'], correctAnswer: 'Pretty' },
    { hanzi: '自然美', pinyin: 'zì rán měi', meaning: 'Natural beauty', options: ['Artificial', 'Natural beauty', 'City life', 'Modern'], correctAnswer: 'Natural beauty' },
    { hanzi: '如画', pinyin: 'rú huà', meaning: 'Picturesque', options: ['Ugly', 'Picturesque', 'Boring', 'Plain'], correctAnswer: 'Picturesque' },
  ],
  hongkong: [
    { hanzi: '繁华', pinyin: 'fán huá', meaning: 'Prosperous', options: ['Poor', 'Prosperous', 'Quiet', 'Empty'], correctAnswer: 'Prosperous' },
    { hanzi: '热闹', pinyin: 'rè nào', meaning: 'Lively/Bustling', options: ['Quiet', 'Lively/Bustling', 'Empty', 'Dark'], correctAnswer: 'Lively/Bustling' },
    { hanzi: '现代', pinyin: 'xiàn dài', meaning: 'Modern', options: ['Ancient', 'Modern', 'Old', 'Traditional'], correctAnswer: 'Modern' },
    { hanzi: '高楼', pinyin: 'gāo lóu', meaning: 'Tall building', options: ['Small house', 'Tall building', 'Garden', 'Road'], correctAnswer: 'Tall building' },
    { hanzi: '购物', pinyin: 'gòu wù', meaning: 'Shopping', options: ['Working', 'Shopping', 'Sleeping', 'Eating'], correctAnswer: 'Shopping' },
    { hanzi: '美食', pinyin: 'měi shí', meaning: 'Delicious food', options: ['Bad food', 'Delicious food', 'Water', 'Medicine'], correctAnswer: 'Delicious food' },
    { hanzi: '夜景', pinyin: 'yè jǐng', meaning: 'Night view', options: ['Morning', 'Night view', 'Afternoon', 'Sunset'], correctAnswer: 'Night view' },
    { hanzi: '国际化', pinyin: 'guó jì huà', meaning: 'International', options: ['Local', 'International', 'Rural', 'Small'], correctAnswer: 'International' },
    { hanzi: '东西方', pinyin: 'dōng xī fāng', meaning: 'East and West', options: ['North-South', 'East and West', 'Up-Down', 'Left-Right'], correctAnswer: 'East and West' },
    { hanzi: '融合', pinyin: 'róng hé', meaning: 'Fusion/Blend', options: ['Separate', 'Fusion/Blend', 'Fight', 'Avoid'], correctAnswer: 'Fusion/Blend' },
    { hanzi: '维多利亚港', pinyin: 'wéi duō lì yà gǎng', meaning: 'Victoria Harbor', options: ['Airport', 'Victoria Harbor', 'Mountain', 'Temple'], correctAnswer: 'Victoria Harbor' },
  ],
  forbiddencity: [
    { hanzi: '皇帝', pinyin: 'huáng dì', meaning: 'Emperor', options: ['Emperor', 'Soldier', 'Farmer', 'Teacher'], correctAnswer: 'Emperor' },
    { hanzi: '宫殿', pinyin: 'gōng diàn', meaning: 'Palace', options: ['House', 'Palace', 'School', 'Shop'], correctAnswer: 'Palace' },
    { hanzi: '皇宫', pinyin: 'huáng gōng', meaning: 'Imperial palace', options: ['Temple', 'Imperial palace', 'Market', 'Garden'], correctAnswer: 'Imperial palace' },
    { hanzi: '古代', pinyin: 'gǔ dài', meaning: 'Ancient times', options: ['Modern', 'Ancient times', 'Future', 'Present'], correctAnswer: 'Ancient times' },
    { hanzi: '传统', pinyin: 'chuán tǒng', meaning: 'Traditional', options: ['Modern', 'Traditional', 'New', 'Foreign'], correctAnswer: 'Traditional' },
    { hanzi: '龙', pinyin: 'lóng', meaning: 'Dragon', options: ['Dragon', 'Tiger', 'Bird', 'Fish'], correctAnswer: 'Dragon' },
    { hanzi: '凤凰', pinyin: 'fèng huáng', meaning: 'Phoenix', options: ['Dragon', 'Phoenix', 'Tiger', 'Lion'], correctAnswer: 'Phoenix' },
    { hanzi: '金色', pinyin: 'jīn sè', meaning: 'Golden', options: ['Silver', 'Golden', 'Red', 'Blue'], correctAnswer: 'Golden' },
    { hanzi: '红色', pinyin: 'hóng sè', meaning: 'Red', options: ['Red', 'Blue', 'Green', 'Yellow'], correctAnswer: 'Red' },
    { hanzi: '威严', pinyin: 'wēi yán', meaning: 'Majestic', options: ['Weak', 'Majestic', 'Small', 'Cute'], correctAnswer: 'Majestic' },
    { hanzi: '雕刻', pinyin: 'diāo kè', meaning: 'Carving', options: ['Painting', 'Carving', 'Writing', 'Dancing'], correctAnswer: 'Carving' },
    { hanzi: '艺术', pinyin: 'yì shù', meaning: 'Art', options: ['Science', 'Art', 'Sports', 'Business'], correctAnswer: 'Art' },
  ],
  suzhou: [
    { hanzi: '园林', pinyin: 'yuán lín', meaning: 'Garden', options: ['Garden', 'Forest', 'Desert', 'Ocean'], correctAnswer: 'Garden' },
    { hanzi: '水乡', pinyin: 'shuǐ xiāng', meaning: 'Water town', options: ['Mountain town', 'Water town', 'Desert town', 'Ice town'], correctAnswer: 'Water town' },
    { hanzi: '小桥', pinyin: 'xiǎo qiáo', meaning: 'Small bridge', options: ['Big road', 'Small bridge', 'Tall building', 'Deep well'], correctAnswer: 'Small bridge' },
    { hanzi: '流水', pinyin: 'liú shuǐ', meaning: 'Flowing water', options: ['Still water', 'Flowing water', 'Ice', 'Steam'], correctAnswer: 'Flowing water' },
    { hanzi: '人家', pinyin: 'rén jiā', meaning: 'Family/household', options: ['Animal', 'Family/household', 'Plant', 'Building'], correctAnswer: 'Family/household' },
    { hanzi: '江南', pinyin: 'jiāng nán', meaning: 'South of Yangtze', options: ['North', 'South of Yangtze', 'East', 'West'], correctAnswer: 'South of Yangtze' },
    { hanzi: '诗意', pinyin: 'shī yì', meaning: 'Poetic', options: ['Boring', 'Poetic', 'Ugly', 'Noisy'], correctAnswer: 'Poetic' },
    { hanzi: '宁静', pinyin: 'níng jìng', meaning: 'Peaceful', options: ['Noisy', 'Peaceful', 'Chaotic', 'Busy'], correctAnswer: 'Peaceful' },
    { hanzi: '优雅', pinyin: 'yōu yǎ', meaning: 'Elegant', options: ['Rough', 'Elegant', 'Loud', 'Simple'], correctAnswer: 'Elegant' },
  ],
  tibet: [
    { hanzi: '高原', pinyin: 'gāo yuán', meaning: 'Plateau', options: ['Valley', 'Plateau', 'Beach', 'Plain'], correctAnswer: 'Plateau' },
    { hanzi: '雪山', pinyin: 'xuě shān', meaning: 'Snow mountain', options: ['Beach', 'Desert', 'Snow mountain', 'Forest'], correctAnswer: 'Snow mountain' },
    { hanzi: '寺庙', pinyin: 'sì miào', meaning: 'Temple', options: ['School', 'Temple', 'Market', 'Hospital'], correctAnswer: 'Temple' },
    { hanzi: '信仰', pinyin: 'xìn yǎng', meaning: 'Faith/Belief', options: ['Doubt', 'Faith/Belief', 'Fear', 'Anger'], correctAnswer: 'Faith/Belief' },
    { hanzi: '神圣', pinyin: 'shén shèng', meaning: 'Sacred', options: ['Common', 'Sacred', 'Dirty', 'Broken'], correctAnswer: 'Sacred' },
    { hanzi: '虔诚', pinyin: 'qián chéng', meaning: 'Devout', options: ['Lazy', 'Devout', 'Careless', 'Rude'], correctAnswer: 'Devout' },
    { hanzi: '纯净', pinyin: 'chún jìng', meaning: 'Pure', options: ['Dirty', 'Pure', 'Mixed', 'Polluted'], correctAnswer: 'Pure' },
    { hanzi: '蓝天', pinyin: 'lán tiān', meaning: 'Blue sky', options: ['Red sky', 'Blue sky', 'Black night', 'Gray cloud'], correctAnswer: 'Blue sky' },
    { hanzi: '白云', pinyin: 'bái yún', meaning: 'White cloud', options: ['Black smoke', 'White cloud', 'Red fire', 'Blue water'], correctAnswer: 'White cloud' },
    { hanzi: '朝圣', pinyin: 'cháo shèng', meaning: 'Pilgrimage', options: ['Shopping', 'Pilgrimage', 'Working', 'Playing'], correctAnswer: 'Pilgrimage' },
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
      description: 'Bắt đầu hành trình học tiếng Trung tại thủ đô Bắc Kinh. Học các cụm từ chào hỏi và giới thiệu bản thân.',
      icon: '🏛️',
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
      description: 'Khám phá thành phố hiện đại Thượng Hải. Học từ vựng về mua sắm, ăn uống và di chuyển.',
      icon: '🏙️',
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
      description: 'Tham quan kỳ quan thế giới. Học các từ vựng về lịch sử và văn hóa Trung Quốc.',
      icon: '🏰',
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
      description: 'Khám phá thành phố cổ đại Tây An. Học về ẩm thực truyền thống và lịch sử nhà Tần.',
      icon: '🗿',
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
      description: 'Ghé thăm Thành Đô, quê hương của gấu trúc. Học từ vựng về động vật và thiên nhiên.',
      icon: '🐼',
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
      description: 'Thưởng ngoạn phong cảnh tuyệt đẹp Quế Lâm. Học từ vựng về thiên nhiên và du lịch.',
      icon: '⛰️',
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
      description: 'Trải nghiệm sự pha trộn văn hóa Đông Tây tại Hồng Kông. Học tiếng Quảng Đông cơ bản.',
      icon: '🌃',
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
      description: 'Khám phá cung điện hoàng gia cổ xưa. Học từ vựng nâng cao về văn hóa và lịch sử.',
      icon: '👑',
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
      description: 'Khám phá vườn cổ Tô Châu và kiến trúc truyền thống. Học từ vựng về nghệ thuật và thơ ca.',
      icon: '🏮',
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
      description: 'Hành hương đến vùng đất thiêng liêng Tây Tạng. Học về văn hóa Phật giáo Tây Tạng.',
      icon: '🕉️',
      lessons: generateLessons('tibet', 10),
      xpReward: 600,
      isUnlocked: true,
      isCompleted: false,
    },
  ]);

  const handleStartLesson = (chapter: Chapter, lesson: Lesson) => {
    if (lesson.completed) {
      // Replay lesson
      setPlayingLesson({ chapter, lesson });
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(null);
      setLessonComplete(false);
    } else {
      setPlayingLesson({ chapter, lesson });
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(null);
      setLessonComplete(false);
    }
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
        const xpEarned = Math.floor((score / playingLesson.lesson.vocabulary.length) * 50);
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
    }, 1000);
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
                Câu {currentQuestionIndex + 1}/{playingLesson.lesson.vocabulary.length}
              </p>
            </div>
            <div className="w-20 text-right">
              <span className="text-white font-bold">Score: {score}</span>
            </div>
          </div>

          {/* Progress */}
          <Progress value={progressPercent} className="h-3 mb-8" />

          {/* Question Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="text-center text-white">
                <div className="text-6xl mb-6 font-bold">{question.hanzi}</div>
                <div className="text-3xl text-purple-300 mb-4">{question.pinyin}</div>
                <div className="text-xl text-gray-300">Nghĩa là gì?</div>
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
                  {showResult === 'correct' ? '✓ Chính xác!' : `✗ Sai rồi! Đáp án đúng: ${question.correctAnswer}`}
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
              Hành trình qua 10 địa danh nổi tiếng của Trung Quốc
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
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Chương {chapter.number}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {chapter.location}
                        </Badge>
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
