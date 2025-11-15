/**
 * Cantonese Badges Page
 * View and manage achievement badges
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  Home,
  Loader2,
  Lock,
  Award,
  Sparkles,
  ArrowLeft,
  Trophy,
  Star,
  Crown,
  Target,
  Flame,
  BookOpen,
  Zap,
  Heart,
  Shield
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'learning' | 'achievement' | 'social' | 'special';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
  requirement: string;
}

export default function CantoneseBadges() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock badges data - will be replaced with real API data
  const mockBadges: BadgeItem[] = [
    // Learning Badges
    {
      id: 'b1',
      name: '初學者',
      description: '完成你的第一個課程',
      icon: <BookOpen className="w-8 h-8" />,
      rarity: 'common',
      category: 'learning',
      isUnlocked: true,
      unlockedAt: '3天前',
      requirement: '完成1個課程'
    },
    {
      id: 'b2',
      name: '勤學者',
      description: '完成10個課程',
      icon: <BookOpen className="w-8 h-8" />,
      rarity: 'common',
      category: 'learning',
      isUnlocked: true,
      unlockedAt: '1天前',
      requirement: '完成10個課程'
    },
    {
      id: 'b3',
      name: '學習大師',
      description: '完成50個課程',
      icon: <BookOpen className="w-8 h-8" />,
      rarity: 'rare',
      category: 'learning',
      isUnlocked: false,
      progress: 25,
      target: 50,
      requirement: '完成50個課程'
    },
    {
      id: 'b4',
      name: '粵語專家',
      description: '完成100個課程',
      icon: <Crown className="w-8 h-8" />,
      rarity: 'epic',
      category: 'learning',
      isUnlocked: false,
      progress: 25,
      target: 100,
      requirement: '完成100個課程'
    },

    // Achievement Badges
    {
      id: 'b5',
      name: '連勝',
      description: '保持7天連續學習',
      icon: <Flame className="w-8 h-8" />,
      rarity: 'rare',
      category: 'achievement',
      isUnlocked: false,
      progress: 3,
      target: 7,
      requirement: '連續學習7天'
    },
    {
      id: 'b6',
      name: '完美主義者',
      description: '在5個測驗中獲得100分',
      icon: <Star className="w-8 h-8" />,
      rarity: 'rare',
      category: 'achievement',
      isUnlocked: false,
      progress: 2,
      target: 5,
      requirement: '獲得5次100分'
    },
    {
      id: 'b7',
      name: 'Boss終結者',
      description: '擊敗你的第一個Boss',
      icon: <Trophy className="w-8 h-8" />,
      rarity: 'epic',
      category: 'achievement',
      isUnlocked: false,
      requirement: '擊敗1個Boss'
    },
    {
      id: 'b8',
      name: 'Boss大師',
      description: '擊敗所有Boss',
      icon: <Crown className="w-8 h-8" />,
      rarity: 'legendary',
      category: 'achievement',
      isUnlocked: false,
      requirement: '擊敗所有Boss'
    },

    // Social Badges
    {
      id: 'b9',
      name: '社交達人',
      description: '邀請3位朋友',
      icon: <Heart className="w-8 h-8" />,
      rarity: 'rare',
      category: 'social',
      isUnlocked: false,
      progress: 0,
      target: 3,
      requirement: '邀請3位朋友'
    },

    // Special Badges
    {
      id: 'b10',
      name: '收藏家',
      description: '收集50張不同的卡片',
      icon: <Sparkles className="w-8 h-8" />,
      rarity: 'epic',
      category: 'special',
      isUnlocked: false,
      progress: 15,
      target: 50,
      requirement: '收集50張卡片'
    },
    {
      id: 'b11',
      name: '傳奇獵人',
      description: '收集一張傳奇卡片',
      icon: <Crown className="w-8 h-8" />,
      rarity: 'legendary',
      category: 'special',
      isUnlocked: false,
      requirement: '收集1張傳奇卡片'
    },
    {
      id: 'b12',
      name: '任務完成者',
      description: '完成100個任務',
      icon: <Target className="w-8 h-8" />,
      rarity: 'epic',
      category: 'special',
      isUnlocked: false,
      progress: 35,
      target: 100,
      requirement: '完成100個任務'
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
                請登入以查看你的徽章
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
            <p className="text-muted-foreground">載入徽章中...</p>
          </div>
        </main>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50 dark:bg-gray-900';
      case 'rare': return 'border-blue-400 bg-blue-50 dark:bg-blue-950';
      case 'epic': return 'border-purple-400 bg-purple-50 dark:bg-purple-950';
      case 'legendary': return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950';
      default: return 'border-gray-400';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return '普通';
      case 'rare': return '稀有';
      case 'epic': return '史詩';
      case 'legendary': return '傳奇';
      default: return rarity;
    }
  };

  const unlockedBadges = mockBadges.filter(b => b.isUnlocked);
  const totalBadges = mockBadges.length;

  const filteredBadges = selectedCategory === 'all'
    ? mockBadges
    : mockBadges.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-500" />
                徽章收藏
              </h1>
              <p className="text-muted-foreground mt-1">
                展示你的成就並追蹤進度
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

        {/* Badge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總徽章</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockedBadges.length} / {totalBadges}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((unlockedBadges.length / totalBadges) * 100)}% 完成
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">稀有徽章</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockedBadges.filter(b => b.rarity === 'rare').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">史詩徽章</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockedBadges.filter(b => b.rarity === 'epic').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">傳奇徽章</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockedBadges.filter(b => b.rarity === 'legendary').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badge Categories Tabs */}
        <Tabs defaultValue="all" className="space-y-6" onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="learning">學習</TabsTrigger>
            <TabsTrigger value="achievement">成就</TabsTrigger>
            <TabsTrigger value="social">社交</TabsTrigger>
            <TabsTrigger value="special">特殊</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="space-y-4">
            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBadges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`relative overflow-hidden border-2 ${getRarityColor(badge.rarity)} ${
                    !badge.isUnlocked ? 'opacity-50' : 'hover:shadow-lg transition-shadow'
                  }`}
                >
                  {!badge.isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-4 rounded-full ${
                        badge.isUnlocked
                          ? getRarityColor(badge.rarity)
                          : 'bg-gray-200 dark:bg-gray-800'
                      }`}>
                        <div className={badge.isUnlocked ? 'text-primary' : 'text-gray-400'}>
                          {badge.icon}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <CardTitle className="text-lg">{badge.name}</CardTitle>
                        <Badge className={getRarityBadgeColor(badge.rarity)}>
                          {getRarityText(badge.rarity)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-sm text-center text-muted-foreground">
                      {badge.description}
                    </p>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground text-center mb-2">
                        {badge.requirement}
                      </p>

                      {badge.isUnlocked ? (
                        <div className="flex items-center justify-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <Sparkles className="w-4 h-4" />
                          <span>{badge.unlockedAt}</span>
                        </div>
                      ) : badge.progress !== undefined && badge.target !== undefined ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">進度</span>
                            <span className="font-medium">
                              {badge.progress} / {badge.target}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Lock className="w-4 h-4 mx-auto text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBadges.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-muted-foreground">此類別中沒有徽章</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>如何獲得徽章？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • 完成課程和測驗以解鎖學習徽章
            </p>
            <p className="text-sm text-muted-foreground">
              • 保持連續學習和獲得高分以獲得成就徽章
            </p>
            <p className="text-sm text-muted-foreground">
              • 邀請朋友以獲得社交徽章
            </p>
            <p className="text-sm text-muted-foreground">
              • 參與遊戲化功能以解鎖特殊徽章
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
