/**
 * Cantonese Boss Battles Page
 * Challenge powerful bosses to test your language skills
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

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

export default function CantoneseBossBattles() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);

  // Mock boss data - will be replaced with real API data
  const mockBosses: Boss[] = [
    {
      id: '1',
      name: '詞彙守護者',
      description: '掌握基礎粵語詞彙的守護神',
      difficulty: 'easy',
      health: 100,
      xpReward: 50,
      isUnlocked: true,
      isDefeated: false
    },
    {
      id: '2',
      name: '聲調巨龍',
      description: '考驗你聲調掌握的強大巨龍',
      difficulty: 'medium',
      health: 200,
      xpReward: 100,
      isUnlocked: true,
      isDefeated: false
    },
    {
      id: '3',
      name: '語法大師',
      description: '精通粵語語法的終極挑戰',
      difficulty: 'hard',
      health: 300,
      xpReward: 200,
      isUnlocked: false,
      isDefeated: false
    },
    {
      id: '4',
      name: '粵語之王',
      description: '傳說中的粵語大師，最終挑戰',
      difficulty: 'legendary',
      health: 500,
      xpReward: 500,
      isUnlocked: false,
      isDefeated: false
    }
  ];

  // Require login
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">需要登入</h2>
              <p className="text-muted-foreground mb-6">
                請登入以挑戰Boss戰
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/cantonese">
                    <Home className="mr-2 h-4 w-4" /> 主頁
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/cantonese/login">立即登入</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">載入Boss戰中...</p>
          </div>
        </main>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'legendary': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '簡單';
      case 'medium': return '中等';
      case 'hard': return '困難';
      case 'legendary': return '傳奇';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Sword className="w-8 h-8 text-red-500" />
                Boss戰
              </h1>
              <p className="text-muted-foreground mt-1">
                挑戰強大的Boss來測試你的語言技能
              </p>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/cantonese/gamification">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/cantonese">
                  <Home className="mr-2 h-4 w-4" />
                  主頁
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Boss Battle Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">擊敗的Boss</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockBosses.filter(b => b.isDefeated).length} / {mockBosses.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">可用挑戰</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 / 3</div>
              <p className="text-xs text-muted-foreground mt-1">每天重置</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總獲得經驗值</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 XP</div>
            </CardContent>
          </Card>
        </div>

        {/* Boss Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBosses.map((boss) => (
            <Card
              key={boss.id}
              className={`relative overflow-hidden ${!boss.isUnlocked ? 'opacity-60' : 'hover:shadow-lg transition-shadow'}`}
            >
              {boss.difficulty === 'legendary' && (
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-br from-purple-500 to-pink-500 w-32 h-8 transform rotate-45 translate-x-8 -translate-y-2 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white transform -rotate-45 translate-y-3" />
                  </div>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {boss.name}
                      {boss.isDefeated && <Trophy className="w-5 h-5 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription className="mt-2">{boss.description}</CardDescription>
                  </div>
                  {!boss.isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(boss.difficulty)}>
                    {getDifficultyText(boss.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span>{boss.xpReward} XP</span>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      生命值
                    </span>
                    <span className="font-medium">{boss.health}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  disabled={!boss.isUnlocked}
                  variant={boss.isDefeated ? "outline" : "default"}
                >
                  <Sword className="mr-2 h-4 w-4" />
                  {boss.isDefeated ? '再次挑戰' : boss.isUnlocked ? '開始戰鬥' : '尚未解鎖'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>如何運作？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • 每個Boss都會測試你在粵語不同方面的技能
            </p>
            <p className="text-sm text-muted-foreground">
              • 擊敗Boss以獲得大量經驗值和特殊獎勵
            </p>
            <p className="text-sm text-muted-foreground">
              • 你每天有3次挑戰機會
            </p>
            <p className="text-sm text-muted-foreground">
              • 隨著你升級，更高難度的Boss將會解鎖
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
