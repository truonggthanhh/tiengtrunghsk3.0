import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/components/gamification/GamificationProvider';
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
  Sparkles
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

interface Boss {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  health: number;
  xpReward: number;
  isUnlocked: boolean;
  isDefeated: boolean;
}

const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-orange-500',
  legendary: 'bg-purple-500',
};

export default function MandarinBossBattles() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);

  // Mock boss data
  const mockBosses: Boss[] = [
    {
      id: '1',
      name: '词汇守护者',
      description: '掌握基础汉语词汇的守护神',
      difficulty: 'easy',
      health: 100,
      xpReward: 50,
      isUnlocked: true,
      isDefeated: false,
    },
    {
      id: '2',
      name: '语法大师',
      description: '精通汉语语法的强大对手',
      difficulty: 'medium',
      health: 200,
      xpReward: 100,
      isUnlocked: true,
      isDefeated: false,
    },
    {
      id: '3',
      name: '成语霸主',
      description: '挑战你对成语的理解',
      difficulty: 'hard',
      health: 300,
      xpReward: 200,
      isUnlocked: false,
      isDefeated: false,
    },
    {
      id: '4',
      name: '诗词仙人',
      description: '传说中的古诗词大师',
      difficulty: 'legendary',
      health: 500,
      xpReward: 500,
      isUnlocked: false,
      isDefeated: false,
    },
  ];

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
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/mandarin">
                    <Home className="mr-2 h-4 w-4" /> Trang chủ
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/mandarin/login">Đăng nhập ngay</Link>
                </Button>
              </div>
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
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
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
            <div className="hidden md:flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Level {userProgress.current_level}
              </Badge>
            </div>
          )}
        </div>

        {/* Boss Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBosses.map((boss) => (
            <Card
              key={boss.id}
              className={`relative overflow-hidden ${
                boss.isUnlocked
                  ? 'cursor-pointer hover-scale border-2'
                  : 'opacity-60'
              }`}
              onClick={() => boss.isUnlocked && setSelectedBoss(boss)}
            >
              {/* Difficulty Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className={difficultyColors[boss.difficulty]}>
                  {boss.difficulty.toUpperCase()}
                </Badge>
              </div>

              {/* Lock Icon for locked bosses */}
              {!boss.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <Lock className="w-16 h-16 text-muted-foreground" />
                </div>
              )}

              {/* Defeated Badge */}
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
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-2xl">
                    <Sword className="w-8 h-8 text-white" />
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
                    <span className="font-bold">{boss.health}</span>
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
                  variant={boss.isDefeated ? 'outline' : 'default'}
                >
                  {boss.isDefeated ? 'Chiến đấu lại' : 'Bắt đầu chiến đấu'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <Card className="mt-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-300">
          <CardContent className="text-center py-12">
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Tính năng đang phát triển</h3>
            <p className="text-muted-foreground">
              Chế độ đấu Boss sẽ sớm ra mắt với nhiều thử thách thú vị!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
