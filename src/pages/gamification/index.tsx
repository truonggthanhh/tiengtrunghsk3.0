/**
 * Gamification Dashboard Page
 * Main hub for all gamification features
 */

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/components/gamification/GamificationProvider';
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
  Lock
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

export default function GamificationDashboard() {
  const { session } = useSession();
  const { userProgress, dashboard, isLoading } = useGamification();

  // Require login
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Yêu cầu đăng nhập</h2>
              <p className="text-muted-foreground mb-6">
                Vui lòng đăng nhập để xem bảng thành tích
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Đang tải bảng thành tích...</p>
          </div>
        </main>
      </div>
    );
  }

  // No progress yet (first time)
  if (!userProgress) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Chào mừng đến với Gamification!</h2>
              <p className="text-muted-foreground mb-6">
                Bắt đầu học để kiếm XP, huy hiệu và phần thưởng!
              </p>
              <Button asChild>
                <Link to="/mandarin">Bắt đầu học ngay</Link>
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Bảng Thành Tích
              </h1>
              <p className="text-muted-foreground mt-1">
                Theo dõi tiến độ học tập và nhận phần thưởng
              </p>
            </div>

            <Button asChild variant="outline">
              <Link to="/mandarin">
                <Home className="mr-2 h-4 w-4" />
                Trang chủ
              </Link>
            </Button>
          </div>
        </div>

        {/* XP & Streak Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <XPProgressBar
              currentLevel={userProgress.current_level}
              currentXP={userProgress.total_xp}
              xpForCurrentLevel={0} // Will be calculated from level_definitions
              xpForNextLevel={100} // Will be calculated from level_definitions
              levelTitle={`Level ${userProgress.current_level}`}
            />
          </div>

          <StreakTracker
            currentStreak={userProgress.current_streak}
            longestStreak={userProgress.longest_streak}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="missions" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Nhiệm vụ</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Huy hiệu</span>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Bộ sưu tập</span>
            </TabsTrigger>
            <TabsTrigger value="story" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Story Mode</span>
            </TabsTrigger>
          </TabsList>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nhiệm vụ hàng ngày</CardTitle>
                <CardDescription>
                  Hoàn thành nhiệm vụ để nhận XP và phần thưởng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockMissions.length > 0 ? (
                  <MissionCards missions={mockMissions} type="daily" />
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Nhiệm vụ sẽ xuất hiện khi bạn bắt đầu học!
                    </p>
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
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards">
            <Card>
              <CardHeader>
                <CardTitle>Bộ sưu tập thẻ</CardTitle>
                <CardDescription>
                  Thu thập thẻ từ vựng khi hoàn thành bài học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Tính năng đang được phát triển...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Story Mode Tab */}
          <TabsContent value="story">
            <Card>
              <CardHeader>
                <CardTitle>Story Mode</CardTitle>
                <CardDescription>
                  Hành trình qua các địa danh học tiếng Trung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Tính năng đang được phát triển...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
