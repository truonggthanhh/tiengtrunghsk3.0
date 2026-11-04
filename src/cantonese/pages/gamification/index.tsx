/**
 * Cantonese Gamification Dashboard Page
 * Main hub for all gamification features
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/cantonese/hooks/useGamification';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import BadgeShowcase from '@/components/gamification/BadgeShowcase';
import MissionCards from '@/components/gamification/MissionCards';
import StreakTracker from '@/components/gamification/StreakTracker';
import {
  Trophy,
  Target,
  Sparkles,
  Home,
  Loader2,
  Lock,
  Sword,
  Album,
  Gift,
  BookOpen,
  Award,
  Zap,
  ChevronRight,
  Gamepad2
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';

const gameFeatures = [
  {
    id: 'boss-battles',
    title: 'Boss戰',
    icon: <Sword className="w-12 h-12" />,
    description: '挑戰強大Boss測試你的粵語能力',
    gradient: 'bg-gradient-to-br from-red-500 via-orange-500 to-pink-500',
    path: '/cantonese/gamification/boss-battles',
    badge: 'HOT',
  },
  {
    id: 'card-collection',
    title: '卡片收藏',
    icon: <Sparkles className="w-12 h-12" />,
    description: '收集並解鎖獨特的詞彙卡片',
    gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500',
    path: '/cantonese/gamification/card-collection',
    badge: 'NEW',
  },
  {
    id: 'lucky-wheel',
    title: '幸運輪盤',
    icon: <Gift className="w-12 h-12" />,
    description: '每天旋轉以獲得豐富獎勵',
    gradient: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500',
    path: '/cantonese/gamification/lucky-wheel',
    badge: null,
  },
  {
    id: 'missions',
    title: '任務',
    icon: <Target className="w-12 h-12" />,
    description: '完成每日和每週任務',
    gradient: 'bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500',
    path: '/cantonese/gamification/missions',
    badge: null,
  },
  {
    id: 'story-mode',
    title: '故事模式',
    icon: <BookOpen className="w-12 h-12" />,
    description: '通過章節探索粵語故事',
    gradient: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
    path: '/cantonese/gamification/story-mode',
    badge: null,
  },
  {
    id: 'badges',
    title: '徽章',
    icon: <Award className="w-12 h-12" />,
    description: '解鎖並展示你的成就徽章',
    gradient: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500',
    path: '/cantonese/gamification/badges',
    badge: null,
  },
];

export default function CantoneseGamificationDashboard() {
  const { session } = useSession();
  const { userPoints, isLoading } = useGamification();

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
                請登入以查看成就榜
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
            <p className="text-muted-foreground">載入成就榜中...</p>
          </div>
        </main>
      </div>
    );
  }

  // No progress yet (first time)
  if (!userPoints) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">歡迎來到遊戲化系統！</h2>
              <p className="text-muted-foreground mb-6">
                開始學習以賺取經驗值、徽章和獎勵！
              </p>
              <Button asChild>
                <Link to="/cantonese">立即開始學習</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Mock data for now (will be replaced with real data from dashboard)
  const mockBadges = [];
  const mockMissions = [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-16 h-16 text-primary animate-bounce" />
            <Zap className="w-12 h-12 text-yellow-500 animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-pink-500 to-orange-500 bg-clip-text text-transparent">
            🎮 透過遊戲學粵語 🎯
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            將學習變成刺激冒險！收集卡片、挑戰Boss、旋轉幸運輪盤等等。
          </p>

          {!isLoading && userPoints && (
            <div className="flex items-center justify-center gap-6 text-lg font-semibold mt-6 flex-wrap">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-vivid text-white rounded-full shadow-lg">
                <Trophy className="w-5 h-5" />
                <span>等級 {userPoints.level}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-sunset text-white rounded-full shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span>{userPoints.total_points.toLocaleString()} 分</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-spring text-white rounded-full shadow-lg">
                <Zap className="w-5 h-5" />
                <span>{userPoints.current_streak_days} 天連勝</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button asChild variant="outline">
              <Link to="/cantonese">
                <Home className="mr-2 h-4 w-4" />
                返回主頁
              </Link>
            </Button>
          </div>
        </div>

        {/* Game Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            遊戲功能
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameFeatures.map((feature) => (
              <Link key={feature.id} to={feature.path}>
                <Card className={`${feature.gradient} border-0 text-white overflow-hidden relative group cursor-pointer hover-scale h-full`}>
                  {feature.badge && (
                    <div className="absolute top-4 right-4 bg-white text-primary px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                      {feature.badge}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>

                  <CardHeader className="relative z-10 space-y-4">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="text-white/90 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-4">
                    <Button variant="secondary" className="w-full font-semibold">
                      立即遊玩 <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* XP & Streak Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <XPProgressBar
              currentLevel={userPoints.level}
              currentXP={userPoints.total_points}
              xpForCurrentLevel={0}
              xpForNextLevel={100}
              levelTitle={`等級 ${userPoints.level}`}
            />
          </div>

          <StreakTracker
            currentStreak={userPoints.current_streak_days}
            longestStreak={userPoints.longest_streak_days}
          />
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cantonese/gamification/missions">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Target className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm font-medium text-center">任務</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cantonese/gamification/badges">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Award className="w-8 h-8 text-purple-500 mb-2" />
                <p className="text-sm font-medium text-center">徽章</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cantonese/gamification/card-collection">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Album className="w-8 h-8 text-pink-500 mb-2" />
                <p className="text-sm font-medium text-center">卡片收藏</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cantonese/gamification/boss-battles">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Sword className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-sm font-medium text-center">Boss戰</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cantonese/gamification/story-mode">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <BookOpen className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-sm font-medium text-center">故事模式</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cantonese/gamification/lucky-wheel">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Gift className="w-8 h-8 text-yellow-500 mb-2" />
                <p className="text-sm font-medium text-center">幸運輪盤</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="missions" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>任務</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>徽章</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>收藏</span>
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>故事模式</span>
            </TabsTrigger>
          </TabsList>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>每日任務</CardTitle>
                <CardDescription>
                  完成任務以獲得經驗值和獎勵
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockMissions.length > 0 ? (
                  <MissionCards missions={mockMissions} type="daily" />
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      當你開始學習時，任務將會出現！
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/cantonese/gamification/missions">查看所有任務</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <BadgeShowcase
              unlockedBadges={mockBadges}
              lockedBadges={[]}
              showLocked={true}
            />
            <div className="text-center mt-4">
              <Button asChild>
                <Link to="/cantonese/gamification/badges">查看所有徽章</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>卡片收藏</CardTitle>
                <CardDescription>
                  完成課程時收集詞彙卡片
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    開始收集你的卡片！
                  </p>
                  <Button asChild>
                    <Link to="/cantonese/gamification/card-collection">前往收藏</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Story Mode Tab */}
          <TabsContent value="story">
            <Card>
              <CardHeader>
                <CardTitle>故事模式</CardTitle>
                <CardDescription>
                  透過地標學習粵語的旅程
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    開始你的冒險！
                  </p>
                  <Button asChild>
                    <Link to="/cantonese/gamification/story-mode">進入故事模式</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
