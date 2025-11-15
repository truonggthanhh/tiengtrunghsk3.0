/**
 * Cantonese Lucky Wheel Page
 * Spin the wheel to win rewards
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  Home,
  Loader2,
  Lock,
  Gift,
  Sparkles,
  ArrowLeft,
  Trophy,
  Ticket,
  Clock,
  Star
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

interface WheelReward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

interface SpinHistory {
  id: string;
  reward: string;
  timestamp: string;
}

export default function CantoneseLuckyWheel() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();
  const [isSpinning, setIsSpinning] = useState(false);
  const [availableSpins, setAvailableSpins] = useState(3);

  // Mock rewards
  const rewards: WheelReward[] = [
    {
      id: '1',
      name: '50 XP',
      description: '獲得50經驗值',
      icon: <Sparkles className="w-6 h-6" />,
      rarity: 'common',
      color: 'bg-gray-500'
    },
    {
      id: '2',
      name: '卡包',
      description: '獲得1個普通卡包',
      icon: <Gift className="w-6 h-6" />,
      rarity: 'common',
      color: 'bg-blue-500'
    },
    {
      id: '3',
      name: '100 XP',
      description: '獲得100經驗值',
      icon: <Sparkles className="w-6 h-6" />,
      rarity: 'rare',
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: '稀有卡包',
      description: '獲得1個稀有卡包',
      icon: <Gift className="w-6 h-6" />,
      rarity: 'rare',
      color: 'bg-purple-500'
    },
    {
      id: '5',
      name: '200 XP',
      description: '獲得200經驗值',
      icon: <Sparkles className="w-6 h-6" />,
      rarity: 'epic',
      color: 'bg-orange-500'
    },
    {
      id: '6',
      name: '史詩卡包',
      description: '獲得1個史詩卡包',
      icon: <Gift className="w-6 h-6" />,
      rarity: 'epic',
      color: 'bg-orange-500'
    },
    {
      id: '7',
      name: '500 XP',
      description: '獲得500經驗值！',
      icon: <Trophy className="w-6 h-6" />,
      rarity: 'legendary',
      color: 'bg-yellow-500'
    },
    {
      id: '8',
      name: '傳奇卡包',
      description: '獲得1個傳奇卡包！',
      icon: <Trophy className="w-6 h-6" />,
      rarity: 'legendary',
      color: 'bg-yellow-500'
    }
  ];

  // Mock spin history
  const mockHistory: SpinHistory[] = [
    {
      id: '1',
      reward: '100 XP',
      timestamp: '2小時前'
    },
    {
      id: '2',
      reward: '卡包',
      timestamp: '昨天'
    },
    {
      id: '3',
      reward: '50 XP',
      timestamp: '2天前'
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
                請登入以轉動幸運輪盤
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
            <p className="text-muted-foreground">載入幸運輪盤中...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleSpin = () => {
    if (availableSpins > 0) {
      setIsSpinning(true);
      setTimeout(() => {
        setIsSpinning(false);
        setAvailableSpins(prev => prev - 1);
        // Show reward notification here
      }, 3000);
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
                <Gift className="w-8 h-8 text-yellow-500" />
                幸運輪盤
              </h1>
              <p className="text-muted-foreground mt-1">
                轉動輪盤贏得驚喜獎勵
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Wheel Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Spins */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>可用轉動次數</CardTitle>
                    <CardDescription>完成任務以獲得更多次數</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-yellow-500" />
                    <span className="text-3xl font-bold">{availableSpins}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Wheel Display */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-12">
                <div className="relative w-full max-w-md mx-auto aspect-square">
                  {/* Wheel Circle */}
                  <div
                    className={`w-full h-full rounded-full border-8 border-primary shadow-2xl ${
                      isSpinning ? 'animate-spin' : ''
                    }`}
                    style={{
                      background: `conic-gradient(
                        from 0deg,
                        ${rewards.map((r, i) => {
                          const start = (i * 360) / rewards.length;
                          const end = ((i + 1) * 360) / rewards.length;
                          return `${r.color} ${start}deg ${end}deg`;
                        }).join(', ')}
                      )`,
                      animationDuration: isSpinning ? '3s' : '0s',
                      animationTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                    }}
                  >
                    {/* Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-background rounded-full w-24 h-24 flex items-center justify-center shadow-lg border-4 border-primary">
                        <Gift className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500" />
                  </div>
                </div>

                {/* Spin Button */}
                <div className="text-center mt-8">
                  <Button
                    size="lg"
                    onClick={handleSpin}
                    disabled={availableSpins === 0 || isSpinning}
                    className="px-12"
                  >
                    {isSpinning ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        轉動中...
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-5 w-5" />
                        {availableSpins > 0 ? '轉動輪盤' : '沒有轉動次數'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How to Get More Spins */}
            <Card>
              <CardHeader>
                <CardTitle>如何獲得更多轉動次數？</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  完成每日任務 - 獲得1次轉動
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  連續登入7天 - 獲得3次轉動
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  擊敗Boss - 獲得2次轉動
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  升級 - 獲得1次轉動
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Possible Rewards */}
            <Card>
              <CardHeader>
                <CardTitle>可能的獎勵</CardTitle>
                <CardDescription>你可以贏得這些獎勵</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <div className={`p-2 rounded-lg ${reward.color} text-white`}>
                      {reward.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Spins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  最近轉動
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockHistory.length > 0 ? (
                  mockHistory.map((spin) => (
                    <div
                      key={spin.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">{spin.reward}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{spin.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    還沒有轉動記錄
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
