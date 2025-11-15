/**
 * Cantonese Card Collection Page
 * Collect and manage vocabulary cards
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  Home,
  Loader2,
  Lock,
  Album,
  Sparkles,
  ArrowLeft,
  Package,
  Star,
  Trophy,
  Filter
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

interface VocabCard {
  id: string;
  traditional: string;
  simplified: string;
  jyutping: string;
  meaning: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isCollected: boolean;
}

export default function CantoneseCardCollection() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  // Mock card data - will be replaced with real API data
  const mockCards: VocabCard[] = [
    {
      id: '1',
      traditional: '你好',
      simplified: '你好',
      jyutping: 'nei5 hou2',
      meaning: 'Hello',
      rarity: 'common',
      isCollected: true
    },
    {
      id: '2',
      traditional: '多謝',
      simplified: '多谢',
      jyutping: 'do1 ze6',
      meaning: 'Thank you',
      rarity: 'common',
      isCollected: true
    },
    {
      id: '3',
      traditional: '廣東話',
      simplified: '广东话',
      jyutping: 'gwong2 dung1 waa2',
      meaning: 'Cantonese',
      rarity: 'rare',
      isCollected: false
    },
    {
      id: '4',
      traditional: '語言',
      simplified: '语言',
      jyutping: 'jyu5 jin4',
      meaning: 'Language',
      rarity: 'epic',
      isCollected: false
    },
    {
      id: '5',
      traditional: '學習',
      simplified: '学习',
      jyutping: 'hok6 zaap6',
      meaning: 'To study/learn',
      rarity: 'legendary',
      isCollected: false
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
                請登入以查看你的卡片收藏
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
            <p className="text-muted-foreground">載入收藏中...</p>
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

  const collectedCards = mockCards.filter(c => c.isCollected);
  const totalCards = mockCards.length;

  const filteredCards = selectedRarity === 'all'
    ? mockCards
    : mockCards.filter(c => c.rarity === selectedRarity);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Album className="w-8 h-8 text-pink-500" />
                卡片收藏
              </h1>
              <p className="text-muted-foreground mt-1">
                收集詞彙卡片並建立你的粵語知識庫
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

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">收集進度</CardTitle>
              <Album className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collectedCards.length} / {totalCards}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((collectedCards.length / totalCards) * 100)}% 完成
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">稀有卡片</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collectedCards.filter(c => c.rarity === 'rare').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">史詩卡片</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {collectedCards.filter(c => c.rarity === 'epic').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">可用卡包</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <Button size="sm" className="w-full mt-2">
                <Package className="mr-2 h-4 w-4" />
                開啟卡包
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="space-y-6" onValueChange={setSelectedRarity}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="common">普通</TabsTrigger>
            <TabsTrigger value="rare">稀有</TabsTrigger>
            <TabsTrigger value="epic">史詩</TabsTrigger>
            <TabsTrigger value="legendary">傳奇</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedRarity} className="space-y-4">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className={`relative overflow-hidden border-2 ${getRarityColor(card.rarity)} ${!card.isCollected ? 'opacity-40' : 'hover:shadow-lg transition-shadow'}`}
                >
                  {!card.isCollected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <Lock className="w-12 h-12 text-white" />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl">{card.traditional}</CardTitle>
                      <Badge className={getRarityBadgeColor(card.rarity)}>
                        {getRarityText(card.rarity)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">簡體</p>
                      <p className="text-lg font-medium">{card.simplified}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">粵拼</p>
                      <p className="font-mono text-sm">{card.jyutping}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">意思</p>
                      <p>{card.meaning}</p>
                    </div>
                  </CardContent>

                  {card.isCollected && (
                    <CardFooter>
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Sparkles className="w-4 h-4" />
                        <span>已收集</span>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <Album className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-muted-foreground">此類別中沒有卡片</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>如何獲得卡片？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • 完成課程和測驗以獲得卡包
            </p>
            <p className="text-sm text-muted-foreground">
              • 擊敗Boss以獲得稀有卡片
            </p>
            <p className="text-sm text-muted-foreground">
              • 完成每日任務以獲得獎勵卡包
            </p>
            <p className="text-sm text-muted-foreground">
              • 收集所有卡片以解鎖特殊徽章
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
