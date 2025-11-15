/**
 * Cantonese Missions Page
 * Complete missions to earn XP and rewards
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  Home,
  Loader2,
  Lock,
  Target,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Calendar,
  Clock,
  Star,
  Gift
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  target: number;
  xpReward: number;
  bonusReward?: string;
  isCompleted: boolean;
  expiresIn?: string;
}

export default function CantoneseMissions() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();

  // Mock missions data - will be replaced with real API data
  const mockMissions: Mission[] = [
    // Daily Missions
    {
      id: 'd1',
      title: '完成3個課程',
      description: '完成任何3個粵語課程',
      type: 'daily',
      progress: 1,
      target: 3,
      xpReward: 50,
      isCompleted: false,
      expiresIn: '12小時'
    },
    {
      id: 'd2',
      title: '練習發音',
      description: '練習發音10次',
      type: 'daily',
      progress: 10,
      target: 10,
      xpReward: 30,
      isCompleted: true
    },
    {
      id: 'd3',
      title: '學習新詞彙',
      description: '學習5個新詞彙',
      type: 'daily',
      progress: 3,
      target: 5,
      xpReward: 40,
      isCompleted: false,
      expiresIn: '12小時'
    },
    // Weekly Missions
    {
      id: 'w1',
      title: '連續學習7天',
      description: '連續7天登入並完成至少1個課程',
      type: 'weekly',
      progress: 3,
      target: 7,
      xpReward: 200,
      bonusReward: '1個稀有卡包',
      isCompleted: false,
      expiresIn: '4天'
    },
    {
      id: 'w2',
      title: '完成20個課程',
      description: '本週完成20個課程',
      type: 'weekly',
      progress: 12,
      target: 20,
      xpReward: 150,
      isCompleted: false,
      expiresIn: '4天'
    },
    {
      id: 'w3',
      title: '獲得完美分數',
      description: '在任何測驗中獲得100分5次',
      type: 'weekly',
      progress: 2,
      target: 5,
      xpReward: 180,
      bonusReward: '幸運輪盤次數 x2',
      isCompleted: false,
      expiresIn: '4天'
    },
    // Special Missions
    {
      id: 's1',
      title: '擊敗首個Boss',
      description: '擊敗你的第一個Boss戰',
      type: 'special',
      progress: 0,
      target: 1,
      xpReward: 300,
      bonusReward: '1個史詩卡包',
      isCompleted: false
    },
    {
      id: 's2',
      title: '收集大師',
      description: '收集50張不同的卡片',
      type: 'special',
      progress: 15,
      target: 50,
      xpReward: 500,
      bonusReward: '特殊徽章',
      isCompleted: false
    }
  ];

  const dailyMissions = mockMissions.filter(m => m.type === 'daily');
  const weeklyMissions = mockMissions.filter(m => m.type === 'weekly');
  const specialMissions = mockMissions.filter(m => m.type === 'special');

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
                請登入以查看任務
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
            <p className="text-muted-foreground">載入任務中...</p>
          </div>
        </main>
      </div>
    );
  }

  const MissionCard = ({ mission }: { mission: Mission }) => {
    const progressPercentage = (mission.progress / mission.target) * 100;

    return (
      <Card className={mission.isCompleted ? 'opacity-75 bg-muted/50' : ''}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {mission.title}
                {mission.isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </CardTitle>
              <CardDescription className="mt-2">{mission.description}</CardDescription>
            </div>
            {mission.expiresIn && (
              <Badge variant="outline" className="ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {mission.expiresIn}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">進度</span>
              <span className="font-medium">
                {mission.progress} / {mission.target}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Rewards */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{mission.xpReward} XP</span>
              </div>
              {mission.bonusReward && (
                <div className="flex items-center gap-1 text-sm">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span className="text-muted-foreground">{mission.bonusReward}</span>
                </div>
              )}
            </div>

            <Button
              size="sm"
              disabled={!mission.isCompleted}
              variant={mission.isCompleted ? 'default' : 'outline'}
            >
              {mission.isCompleted ? '領取獎勵' : '進行中'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const completedCount = mockMissions.filter(m => m.isCompleted).length;
  const totalCount = mockMissions.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-500" />
                任務
              </h1>
              <p className="text-muted-foreground mt-1">
                完成任務以獲得經驗值和獎勵
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

        {/* Mission Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總任務</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">每日任務</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyMissions.filter(m => m.isCompleted).length} / {dailyMissions.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本週任務</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyMissions.filter(m => m.isCompleted).length} / {weeklyMissions.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Tabs */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              每日任務
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              每週任務
            </TabsTrigger>
            <TabsTrigger value="special" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              特殊任務
            </TabsTrigger>
          </TabsList>

          {/* Daily Missions */}
          <TabsContent value="daily" className="space-y-4">
            {dailyMissions.length > 0 ? (
              dailyMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground">今天沒有每日任務</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Weekly Missions */}
          <TabsContent value="weekly" className="space-y-4">
            {weeklyMissions.length > 0 ? (
              weeklyMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground">本週沒有任務</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Special Missions */}
          <TabsContent value="special" className="space-y-4">
            {specialMissions.length > 0 ? (
              specialMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground">沒有特殊任務</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
