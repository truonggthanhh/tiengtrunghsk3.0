import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/components/gamification/GamificationProvider.shared';
import {
  Home,
  Loader2,
  Lock,
  Sword,
  Trophy,
  Heart,
  Zap,
  ArrowLeft,
  Crown,
  Sparkles,
  Shield,
  Target,
  X,
  Check
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider.shared';
import confetti from 'canvas-confetti';

interface Boss {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  maxHealth: number;
  currentHealth: number;
  xpReward: number;
  questions: Question[];
  isUnlocked: boolean;
  isDefeated: boolean;
  avatar: string; // Boss emoji avatar
}

interface Question {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
  damage: number;
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-orange-500',
  legendary: 'bg-purple-500',
};

// Question pool for boss battles
const questionPool = [
  {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: '?',
    options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'],
    correctAnswer: 'Xin chào',
  },
  {
    hanzi: '谢谢',
    pinyin: 'xiè xiè',
    meaning: '?',
    options: ['Làm ơn', 'Xin lỗi', 'Cảm ơn', 'Xin phép'],
    correctAnswer: 'Cảm ơn',
  },
  {
    hanzi: '再见',
    pinyin: 'zài jiàn',
    meaning: '?',
    options: ['Xin chào', 'Tạm biệt', 'Hẹn gặp lại', 'Chúc ngủ ngon'],
    correctAnswer: 'Tạm biệt',
  },
  {
    hanzi: '对不起',
    pinyin: 'duì bu qǐ',
    meaning: '?',
    options: ['Cảm ơn', 'Xin lỗi', 'Xin phép', 'Làm ơn'],
    correctAnswer: 'Xin lỗi',
  },
  {
    hanzi: '学习',
    pinyin: 'xué xí',
    meaning: '?',
    options: ['Học tập', 'Chơi', 'Làm việc', 'Ngủ'],
    correctAnswer: 'Học tập',
  },
  {
    hanzi: '吃饭',
    pinyin: 'chī fàn',
    meaning: '?',
    options: ['Ăn cơm', 'Uống', 'Ngủ', 'Học'],
    correctAnswer: 'Ăn cơm',
  },
  {
    hanzi: '喝水',
    pinyin: 'hē shuǐ',
    meaning: '?',
    options: ['Ăn', 'Uống nước', 'Nấu ăn', 'Rửa'],
    correctAnswer: 'Uống nước',
  },
  {
    hanzi: '睡觉',
    pinyin: 'shuì jiào',
    meaning: '?',
    options: ['Ngủ', 'Thức dậy', 'Mơ', 'Nghỉ ngơi'],
    correctAnswer: 'Ngủ',
  },
  {
    hanzi: '朋友',
    pinyin: 'péng yǒu',
    meaning: '?',
    options: ['Bạn bè', 'Gia đình', 'Giáo viên', 'Học sinh'],
    correctAnswer: 'Bạn bè',
  },
  {
    hanzi: '老师',
    pinyin: 'lǎo shī',
    meaning: '?',
    options: ['Học sinh', 'Giáo viên', 'Bạn bè', 'Cha mẹ'],
    correctAnswer: 'Giáo viên',
  },
  {
    hanzi: '学生',
    pinyin: 'xué shēng',
    meaning: '?',
    options: ['Giáo viên', 'Học sinh', 'Công nhân', 'Bác sĩ'],
    correctAnswer: 'Học sinh',
  },
  {
    hanzi: '家',
    pinyin: 'jiā',
    meaning: '?',
    options: ['Nhà', 'Trường học', 'Văn phòng', 'Công viên'],
    correctAnswer: 'Nhà',
  },
  {
    hanzi: '学校',
    pinyin: 'xué xiào',
    meaning: '?',
    options: ['Nhà', 'Trường học', 'Bệnh viện', 'Nhà hàng'],
    correctAnswer: 'Trường học',
  },
  {
    hanzi: '医院',
    pinyin: 'yī yuàn',
    meaning: '?',
    options: ['Trường học', 'Bệnh viện', 'Khách sạn', 'Bảo tàng'],
    correctAnswer: 'Bệnh viện',
  },
  {
    hanzi: '书',
    pinyin: 'shū',
    meaning: '?',
    options: ['Sách', 'Bút', 'Giấy', 'Bàn'],
    correctAnswer: 'Sách',
  },
];

// Generate random questions from pool
const generateQuestions = (count: number = 5, damage: number = 20): Question[] => {
  const shuffled = [...questionPool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((q, index) => ({
    id: String(index + 1),
    ...q,
    damage,
  }));
};

export default function MandarinBossBattles() {
  const { session } = useSession();
  const { userProgress, isLoading, addXP } = useGamification();
  const navigate = useNavigate();
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [battleComplete, setBattleComplete] = useState(false);
  const [victory, setVictory] = useState(false);

  const [bosses, setBosses] = useState<Boss[]>([
    {
      id: '1',
      name: '词汇守护者',
      description: '掌握基础汉语词汇的守护神',
      difficulty: 'easy',
      maxHealth: 100,
      currentHealth: 100,
      xpReward: 50,
      questions: generateQuestions(5, 20),
      isUnlocked: true,
      isDefeated: false,
      avatar: '🐸', // Green frog for beginner
    },
    {
      id: '2',
      name: '语法大师',
      description: '精通汉语语法的强大对手',
      difficulty: 'medium',
      maxHealth: 150,
      currentHealth: 150,
      xpReward: 100,
      questions: generateQuestions(7, 20),
      isUnlocked: true,
      isDefeated: false,
      avatar: '🐺', // Wolf for medium
    },
    {
      id: '3',
      name: '成语霸主',
      description: '挑战你对成语的理解',
      difficulty: 'hard',
      maxHealth: 200,
      currentHealth: 200,
      xpReward: 200,
      questions: generateQuestions(10, 20),
      isUnlocked: true, // Unlock all levels
      isDefeated: false,
      avatar: '🐉', // Dragon for hard
    },
    {
      id: '4',
      name: '诗词仙人',
      description: '传说中的古诗词大师',
      difficulty: 'legendary',
      maxHealth: 300,
      currentHealth: 300,
      xpReward: 500,
      questions: generateQuestions(15, 20),
      isUnlocked: true, // Unlock all levels
      isDefeated: false,
      avatar: '👹', // Demon/Oni for legendary
    },
  ]);

  const handleStartBattle = (boss: Boss) => {
    setSelectedBoss(boss);
    setCurrentQuestion(0);
    setPlayerHealth(100);
    setBattleComplete(false);
    setVictory(false);
    setShowResult(null);
  };

  const handleAnswer = (answer: string) => {
    if (!selectedBoss || showResult) return;

    const question = selectedBoss.questions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;

    setShowResult(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (isCorrect) {
        // Player attacks boss
        const newHealth = selectedBoss.currentHealth - question.damage;
        setSelectedBoss({
          ...selectedBoss,
          currentHealth: Math.max(0, newHealth),
        });

        if (newHealth <= 0) {
          // Victory!
          setVictory(true);
          setBattleComplete(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Update boss as defeated
          setBosses(prev => prev.map(b =>
            b.id === selectedBoss.id ? { ...b, isDefeated: true } : b
          ));

          // Add XP
          if (addXP) {
            addXP(selectedBoss.xpReward);
          }
        } else if (currentQuestion < selectedBoss.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          // No more questions but boss still alive
          setCurrentQuestion(0);
        }
      } else {
        // Boss attacks player
        const newPlayerHealth = playerHealth - 25;
        setPlayerHealth(Math.max(0, newPlayerHealth));

        if (newPlayerHealth <= 0) {
          // Defeat
          setVictory(false);
          setBattleComplete(true);
        }
      }

      setShowResult(null);
    }, 1000);
  };

  const handleBackToSelection = () => {
    setSelectedBoss(null);
    setBattleComplete(false);
  };

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
                Vui lòng đăng nhập để chiến đấu với Boss
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

  // Battle Screen
  if (selectedBoss && !battleComplete) {
    const question = selectedBoss.questions[currentQuestion];
    const bossHealthPercent = (selectedBoss.currentHealth / selectedBoss.maxHealth) * 100;
    const playerHealthPercent = playerHealth;

    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Battle Header */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={handleBackToSelection}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Rút lui
            </Button>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">vs {selectedBoss.name}</h2>
              <p className="text-sm text-gray-300">Câu {currentQuestion + 1}/{selectedBoss.questions.length}</p>
            </div>
            <div className="w-24" />
          </div>

          {/* Health Bars */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Boss Health */}
            <Card className="bg-red-900/50 border-red-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{selectedBoss.avatar}</span>
                    <span className="font-bold text-white">{selectedBoss.name}</span>
                  </div>
                  <span className="text-sm text-red-300">{selectedBoss.currentHealth}/{selectedBoss.maxHealth}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={bossHealthPercent} className="h-4 bg-red-950" />
              </CardContent>
            </Card>

            {/* Player Health */}
            <Card className="bg-blue-900/50 border-blue-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🧑</span>
                    <span className="font-bold text-white">Bạn</span>
                  </div>
                  <span className="text-sm text-blue-300">{playerHealth}/100</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={playerHealthPercent} className="h-4 bg-blue-950" />
              </CardContent>
            </Card>
          </div>

          {/* Question Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700">
            <CardHeader>
              <CardTitle className="text-center text-white">
                <div className="text-5xl mb-4 font-bold">{question.hanzi}</div>
                <div className="text-2xl text-purple-300 mb-2">{question.pinyin}</div>
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
                        : showResult === 'wrong' && option !== question.correctAnswer
                        ? 'bg-red-600 hover:bg-red-700'
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
                <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
                  showResult === 'correct' ? 'bg-green-600' : 'bg-red-600'
                } text-white animate-pulse`}>
                  {showResult === 'correct' ? '✓ Chính xác! Tấn công -' + question.damage + ' HP!' : '✗ Sai rồi! Bị tấn công -25 HP!'}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Battle Complete Screen
  if (battleComplete && selectedBoss) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center">
          <Card className={`w-full ${victory ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500' : 'bg-gradient-to-br from-gray-500/20 to-gray-700/20 border-gray-500'}`}>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {victory ? (
                  <Trophy className="w-24 h-24 text-yellow-500 animate-bounce" />
                ) : (
                  <X className="w-24 h-24 text-red-500" />
                )}
              </div>
              <CardTitle className="text-4xl mb-2">
                {victory ? '🎉 Chiến Thắng!' : '💀 Thất Bại!'}
              </CardTitle>
              <CardDescription className="text-xl">
                {victory
                  ? `Bạn đã đánh bại ${selectedBoss.name}!`
                  : `Bạn đã bị ${selectedBoss.name} đánh bại!`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {victory && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-600">
                    <Zap className="w-6 h-6" />
                    +{selectedBoss.xpReward} XP
                  </div>
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span>Boss đã được đánh dấu là đã hoàn thành!</span>
                  </div>
                </div>
              )}
              {!victory && (
                <p className="text-muted-foreground">
                  Đừng bỏ cuộc! Hãy học thêm từ vựng và thử lại!
                </p>
              )}
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={handleBackToSelection} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              {!victory && (
                <Button onClick={() => handleStartBattle(selectedBoss)} className="flex-1">
                  <Target className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  // Boss Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link to="/mandarin/gamification">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Sword className="w-8 h-8 text-red-500" />
                Đấu Boss
              </h1>
              <p className="text-muted-foreground mt-1">
                Thử thách kiến thức tiếng Trung với các Boss mạnh mẽ
              </p>
            </div>
          </div>

          {userProgress && (
            <Badge variant="outline" className="text-lg px-4 py-2 hidden md:flex">
              <Trophy className="w-4 h-4 mr-2" />
              Level {userProgress.current_level}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bosses.map((boss) => (
            <Card
              key={boss.id}
              className={`relative overflow-hidden ${
                boss.isUnlocked
                  ? 'cursor-pointer hover-scale border-2'
                  : 'opacity-60'
              }`}
            >
              <div className="absolute top-4 right-4 z-10">
                <Badge className={difficultyColors[boss.difficulty]}>
                  {boss.difficulty.toUpperCase()}
                </Badge>
              </div>

              {!boss.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <Lock className="w-16 h-16 text-muted-foreground" />
                </div>
              )}

              {boss.isDefeated && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="secondary" className="bg-green-500">
                    <Crown className="w-3 h-3 mr-1" />
                    Đã chiến thắng
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-2xl text-5xl">
                    {boss.avatar}
                  </div>
                </div>
                <CardTitle className="text-2xl">{boss.name}</CardTitle>
                <CardDescription className="text-base">
                  {boss.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      HP
                    </span>
                    <span className="font-bold">{boss.maxHealth}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Phần thưởng
                  </span>
                  <span className="font-bold text-primary">
                    +{boss.xpReward} XP
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  disabled={!boss.isUnlocked}
                  onClick={() => handleStartBattle(boss)}
                  variant={boss.isDefeated ? 'outline' : 'default'}
                >
                  {boss.isDefeated ? 'Chiến đấu lại' : 'Bắt đầu chiến đấu'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
