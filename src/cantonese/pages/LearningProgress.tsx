import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, BarChart2, TrendingUp, Award, Flame, Calendar, Trophy, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGamification } from '@/cantonese/hooks/useGamification';
import AchievementBadge from '@/cantonese/components/AchievementBadge';
import { ScrollArea } from '@/components/ui/scroll-area';

const LearningProgressPage = () => {
  const {
    userPoints,
    transactions,
    allAchievements,
    userAchievements,
    isLoading,
    updateStreak,
  } = useGamification();

  const updatedForUser = useRef<string | null>(null);
  // Update streak once per signed-in user without a mutation/refetch loop.
  useEffect(() => {
    if (userPoints && updatedForUser.current !== userPoints.user_id) {
      updatedForUser.current = userPoints.user_id;
      updateStreak().catch(console.error);
    }
  }, [userPoints, updateStreak]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const level = userPoints?.level || 1;
  const totalPoints = userPoints?.total_points || 0;
  const currentStreak = userPoints?.current_streak_days || 0;
  const longestStreak = userPoints?.longest_streak_days || 0;

  // Calculate progress to next level
  const currentLevelPoints = (level - 1) * 1000;
  const nextLevelPoints = level * 1000;
  const progressToNextLevel = ((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const unlockedAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex gap-3 mb-6">
        <Link
          to="/cantonese"
          className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink dark:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition text-sm"
        >
          <Home className="h-4 w-4" /> Trang chủ
        </Link>
        <Link
          to="/cantonese/lessons"
          className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink dark:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Quay về bài học
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black text-ink dark:text-cream flex items-center gap-3">
          <BarChart2 className="h-8 w-8 text-jade" /> Quá trình học tập
        </h1>
        <p className="text-ink/70 dark:text-cream/70 mt-2">
          Theo dõi tiến độ, điểm số và thành tích của bạn
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Level Card */}
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-0">Level</Badge>
            </div>
            <div className="text-4xl font-black mb-1">{level}</div>
            <p className="text-sm text-white/80">Cấp độ hiện tại</p>
            <Progress value={progressToNextLevel} className="mt-3 h-2 bg-white/20" />
            <p className="text-xs text-white/70 mt-1">
              {totalPoints - currentLevelPoints} / {nextLevelPoints - currentLevelPoints} điểm
            </p>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-0">Điểm</Badge>
            </div>
            <div className="text-4xl font-black mb-1">{totalPoints.toLocaleString()}</div>
            <p className="text-sm text-white/80">Tổng điểm tích lũy</p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-500 to-red-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-0">Chuỗi</Badge>
            </div>
            <div className="text-4xl font-black mb-1">{currentStreak}</div>
            <p className="text-sm text-white/80">Ngày liên tiếp</p>
            <p className="text-xs text-white/70 mt-2">Tốt nhất: {longestStreak} ngày 🔥</p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-0">Huy hiệu</Badge>
            </div>
            <div className="text-4xl font-black mb-1">
              {userAchievements?.length || 0}
            </div>
            <p className="text-sm text-white/80">Thành tích đạt được</p>
            <p className="text-xs text-white/70 mt-2">
              / {allAchievements?.length || 0} tổng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed info */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Thành tích
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Lịch sử
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="bg-white dark:bg-black/20 border border-ink/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-jade" /> Bộ sưu tập thành tích
              </CardTitle>
              <CardDescription>
                {userAchievements?.length || 0} / {allAchievements?.length || 0} thành tích đã mở khóa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAchievements?.map((achievement) => {
                  const userAchievement = userAchievements?.find(
                    (ua) => ua.achievement_id === achievement.id
                  );
                  return (
                    <AchievementBadge
                      key={achievement.id}
                      name={achievement.name}
                      nameVi={achievement.name_vi}
                      description={achievement.description}
                      icon={achievement.icon}
                      tier={achievement.tier}
                      unlocked={unlockedAchievementIds.has(achievement.id)}
                      unlockedAt={userAchievement?.unlocked_at}
                      pointsReward={achievement.points_reward}
                    />
                  );
                })}
              </div>
              {(!allAchievements || allAchievements.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Chưa có thành tích nào. Hãy hoàn thành bài học để mở khóa!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="bg-white dark:bg-black/20 border border-ink/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-jade" /> Lịch sử điểm số
              </CardTitle>
              <CardDescription>20 hoạt động gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {transactions?.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-ink/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.points > 0
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}
                        >
                          {transaction.points > 0 ? (
                            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-ink dark:text-cream">
                            {transaction.description || transaction.activity_type}
                          </p>
                          <p className="text-xs text-ink/60 dark:text-cream/60">
                            {new Date(transaction.created_at).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`font-bold text-lg ${
                          transaction.points > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.points > 0 ? '+' : ''}
                        {transaction.points}
                      </div>
                    </div>
                  ))}
                  {(!transactions || transactions.length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Chưa có hoạt động nào. Bắt đầu học để ghi điểm!</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Motivational Banner */}
      <Card className="mt-6 bg-gradient-to-r from-jade to-cyan-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Flame className="h-12 w-12 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-1">
                {currentStreak > 0
                  ? `Tuyệt vời! Bạn đang học ${currentStreak} ngày liên tiếp! 🔥`
                  : 'Bắt đầu chuỗi ngày học của bạn ngay hôm nay!'}
              </h3>
              <p className="text-sm text-white/90">
                {currentStreak >= 7
                  ? 'Hãy duy trì phong độ để đạt được nhiều thành tích hơn!'
                  : 'Học mỗi ngày để xây dựng thói quen và đạt điểm thưởng chuỗi!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningProgressPage;
