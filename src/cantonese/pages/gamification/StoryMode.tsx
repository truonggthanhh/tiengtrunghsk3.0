/**
 * Cantonese Story Mode Page
 * Journey through landmarks learning Cantonese
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  Home,
  Loader2,
  Lock,
  BookOpen,
  Sparkles,
  ArrowLeft,
  MapPin,
  Trophy,
  CheckCircle2,
  Star,
  Play,
  Crown
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

interface StoryChapter {
  id: string;
  number: number;
  title: string;
  location: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessons: number;
  completedLessons: number;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}

export default function CantoneseStoryMode() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();

  // Mock story chapters - will be replaced with real API data
  const mockChapters: StoryChapter[] = [
    {
      id: 'c1',
      number: 1,
      title: '香港之旅開始',
      location: '香港國際機場',
      description: '你剛剛抵達香港。學習基本問候語和機場常用詞彙來開始你的冒險。',
      difficulty: 'beginner',
      lessons: 5,
      completedLessons: 5,
      xpReward: 100,
      isUnlocked: true,
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 'c2',
      number: 2,
      title: '探索中環',
      location: '中環商業區',
      description: '探索香港的金融中心，學習商務和購物相關的粵語。',
      difficulty: 'beginner',
      lessons: 8,
      completedLessons: 3,
      xpReward: 150,
      isUnlocked: true,
      isCompleted: false,
      isCurrent: true
    },
    {
      id: 'c3',
      number: 3,
      title: '茶餐廳美食',
      location: '旺角茶餐廳',
      description: '在傳統茶餐廳學習如何用粵語點餐和談論食物。',
      difficulty: 'beginner',
      lessons: 6,
      completedLessons: 0,
      xpReward: 120,
      isUnlocked: true,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'c4',
      number: 4,
      title: '維多利亞港夜景',
      location: '尖沙咀海濱',
      description: '欣賞維港夜景，學習描述風景和表達感受的詞彙。',
      difficulty: 'intermediate',
      lessons: 7,
      completedLessons: 0,
      xpReward: 180,
      isUnlocked: false,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'c5',
      number: 5,
      title: '太平山頂',
      location: '太平山頂',
      description: '登上太平山頂，學習方向指示和交通相關的粵語。',
      difficulty: 'intermediate',
      lessons: 9,
      completedLessons: 0,
      xpReward: 200,
      isUnlocked: false,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'c6',
      number: 6,
      title: '大嶼山寺廟',
      location: '大嶼山天壇大佛',
      description: '參觀佛教聖地，學習文化和宗教相關詞彙。',
      difficulty: 'intermediate',
      lessons: 8,
      completedLessons: 0,
      xpReward: 220,
      isUnlocked: false,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'c7',
      number: 7,
      title: '香港歷史',
      location: '香港歷史博物館',
      description: '了解香港歷史，學習描述過去和歷史事件的語法。',
      difficulty: 'advanced',
      lessons: 10,
      completedLessons: 0,
      xpReward: 300,
      isUnlocked: false,
      isCompleted: false,
      isCurrent: false
    },
    {
      id: 'c8',
      number: 8,
      title: '粵劇文化',
      location: '西九文化區',
      description: '體驗傳統粵劇，掌握高級粵語表達和文化習俗。',
      difficulty: 'advanced',
      lessons: 12,
      completedLessons: 0,
      xpReward: 350,
      isUnlocked: false,
      isCompleted: false,
      isCurrent: false
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
                請登入以開始故事模式
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
            <p className="text-muted-foreground">載入故事模式中...</p>
          </div>
        </main>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '高級';
      default: return difficulty;
    }
  };

  const totalChapters = mockChapters.length;
  const completedChapters = mockChapters.filter(c => c.isCompleted).length;
  const totalLessons = mockChapters.reduce((sum, c) => sum + c.lessons, 0);
  const completedLessons = mockChapters.reduce((sum, c) => sum + c.completedLessons, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-green-500" />
                故事模式
              </h1>
              <p className="text-muted-foreground mt-1">
                透過香港地標學習粵語的旅程
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

        {/* Story Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">章節進度</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedChapters} / {totalChapters}
              </div>
              <Progress value={(completedChapters / totalChapters) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">課程完成</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedLessons} / {totalLessons}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((completedLessons / totalLessons) * 100)}% 完成
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">總獲得經驗值</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockChapters.filter(c => c.isCompleted).reduce((sum, c) => sum + c.xpReward, 0)} XP
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">當前章節</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                第 {mockChapters.find(c => c.isCurrent)?.number || 1} 章
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story Map - Timeline View */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            香港學習之旅
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            {/* Chapters */}
            <div className="space-y-6">
              {mockChapters.map((chapter, index) => (
                <Card
                  key={chapter.id}
                  className={`relative ${
                    chapter.isCurrent
                      ? 'ring-2 ring-primary shadow-lg'
                      : chapter.isCompleted
                      ? 'bg-muted/30'
                      : !chapter.isUnlocked
                      ? 'opacity-50'
                      : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-4 bg-background hidden md:block z-10"
                    style={{
                      borderColor: chapter.isCompleted
                        ? 'rgb(34, 197, 94)'
                        : chapter.isCurrent
                        ? 'rgb(59, 130, 246)'
                        : chapter.isUnlocked
                        ? 'rgb(156, 163, 175)'
                        : 'rgb(209, 213, 219)'
                    }}
                  />

                  <CardHeader className="md:ml-12">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">
                            第 {chapter.number} 章
                          </Badge>
                          <Badge className={getDifficultyColor(chapter.difficulty)}>
                            {getDifficultyText(chapter.difficulty)}
                          </Badge>
                          {chapter.isCompleted && (
                            <Badge className="bg-green-500">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              已完成
                            </Badge>
                          )}
                          {chapter.isCurrent && (
                            <Badge className="bg-blue-500">
                              <Play className="w-3 h-3 mr-1" />
                              進行中
                            </Badge>
                          )}
                        </div>

                        <CardTitle className="text-xl flex items-center gap-2">
                          {chapter.title}
                          {!chapter.isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                        </CardTitle>

                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{chapter.location}</span>
                        </div>

                        <CardDescription className="mt-3">
                          {chapter.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="md:ml-12 space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">課程進度</span>
                        <span className="font-medium">
                          {chapter.completedLessons} / {chapter.lessons}
                        </span>
                      </div>
                      <Progress
                        value={(chapter.completedLessons / chapter.lessons) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-sm">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{chapter.xpReward} XP</span>
                      </div>

                      <Button
                        disabled={!chapter.isUnlocked}
                        variant={chapter.isCurrent ? 'default' : 'outline'}
                      >
                        {chapter.isCompleted ? (
                          <>
                            <Trophy className="mr-2 h-4 w-4" />
                            重新學習
                          </>
                        ) : chapter.isUnlocked ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            {chapter.isCurrent ? '繼續學習' : '開始章節'}
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            尚未解鎖
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>關於故事模式</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • 跟隨故事情節，在真實情境中學習粵語
            </p>
            <p className="text-sm text-muted-foreground">
              • 每個章節聚焦於不同的主題和詞彙
            </p>
            <p className="text-sm text-muted-foreground">
              • 完成章節以解鎖新的地點和挑戰
            </p>
            <p className="text-sm text-muted-foreground">
              • 獲得大量經驗值和特殊獎勵
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
