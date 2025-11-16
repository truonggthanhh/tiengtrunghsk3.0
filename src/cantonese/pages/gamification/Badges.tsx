import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/cantonese/hooks/useGamification';
import {
  ArrowLeft,
  Award,
  Lock,
  Trophy,
  Target,
  Flame,
  BookOpen,
  Star,
  Crown,
  Zap,
  Heart,
  Sparkles,
  Swords,
  Loader2,
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'learning' | 'streak' | 'boss' | 'collection' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  target: number;
  unlocked: boolean;
  dateUnlocked?: string;
}

const tierColors = {
  bronze: 'from-orange-700 to-orange-900',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-400 to-blue-600',
};

const tierBorders = {
  bronze: 'border-orange-700',
  silver: 'border-gray-500',
  gold: 'border-yellow-500',
  platinum: 'border-cyan-500',
};

export default function CantoneseBadges() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();

  const [achievements, setAchievements] = useState<Achievement[]>([
    // Learning Achievements
    {
      id: 'vocab-10',
      name: 'Người mới bắt đầu',
      description: 'Học 10 từ vựng mới',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'learning',
      tier: 'bronze',
      progress: 0,
      target: 10,
      unlocked: false,
    },
    {
      id: 'vocab-50',
      name: 'Học giả trẻ',
      description: 'Học 50 từ vựng mới',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'learning',
      tier: 'silver',
      progress: 0,
      target: 50,
      unlocked: false,
    },
    {
      id: 'vocab-100',
      name: 'Bậc thầy từ vựng',
      description: 'Học 100 từ vựng mới',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'learning',
      tier: 'gold',
      progress: 0,
      target: 100,
      unlocked: false,
    },
    {
      id: 'vocab-500',
      name: 'Từ điển sống',
      description: 'Học 500 từ vựng mới',
      icon: <BookOpen className="w-6 h-6" />,
      category: 'learning',
      tier: 'platinum',
      progress: 0,
      target: 500,
      unlocked: false,
    },

    // Streak Achievements
    {
      id: 'streak-3',
      name: 'Kiên trì 3 ngày',
      description: 'Học liên tục 3 ngày',
      icon: <Flame className="w-6 h-6" />,
      category: 'streak',
      tier: 'bronze',
      progress: userProgress?.current_streak || 0,
      target: 3,
      unlocked: false,
    },
    {
      id: 'streak-7',
      name: 'Tuần hoàn hảo',
      description: 'Học liên tục 7 ngày',
      icon: <Flame className="w-6 h-6" />,
      category: 'streak',
      tier: 'silver',
      progress: userProgress?.current_streak || 0,
      target: 7,
      unlocked: false,
    },
    {
      id: 'streak-30',
      name: 'Tháng thép',
      description: 'Học liên tục 30 ngày',
      icon: <Flame className="w-6 h-6" />,
      category: 'streak',
      tier: 'gold',
      progress: userProgress?.current_streak || 0,
      target: 30,
      unlocked: false,
    },
    {
      id: 'streak-100',
      name: 'Huyền thoại',
      description: 'Học liên tục 100 ngày',
      icon: <Flame className="w-6 h-6" />,
      category: 'streak',
      tier: 'platinum',
      progress: userProgress?.current_streak || 0,
      target: 100,
      unlocked: false,
    },

    // Boss Battle Achievements
    {
      id: 'boss-1',
      name: 'Sát thủ Boss',
      description: 'Đánh bại Boss đầu tiên',
      icon: <Swords className="w-6 h-6" />,
      category: 'boss',
      tier: 'bronze',
      progress: 0,
      target: 1,
      unlocked: false,
    },
    {
      id: 'boss-5',
      name: 'Thợ săn Boss',
      description: 'Đánh bại 5 Boss',
      icon: <Swords className="w-6 h-6" />,
      category: 'boss',
      tier: 'silver',
      progress: 0,
      target: 5,
      unlocked: false,
    },
    {
      id: 'boss-all',
      name: 'Chúa tể Boss',
      description: 'Đánh bại tất cả Boss',
      icon: <Crown className="w-6 h-6" />,
      category: 'boss',
      tier: 'gold',
      progress: 0,
      target: 4,
      unlocked: false,
    },
    {
      id: 'boss-perfect',
      name: 'Hoàn hảo vô song',
      description: 'Đánh bại Boss mà không mất HP',
      icon: <Trophy className="w-6 h-6" />,
      category: 'boss',
      tier: 'platinum',
      progress: 0,
      target: 1,
      unlocked: false,
    },

    // Collection Achievements
    {
      id: 'card-10',
      name: 'Nhà sưu tập',
      description: 'Thu thập 10 thẻ từ vựng',
      icon: <Star className="w-6 h-6" />,
      category: 'collection',
      tier: 'bronze',
      progress: 0,
      target: 10,
      unlocked: false,
    },
    {
      id: 'card-legendary',
      name: 'May mắn vàng',
      description: 'Mở được thẻ Legendary',
      icon: <Sparkles className="w-6 h-6" />,
      category: 'collection',
      tier: 'gold',
      progress: 0,
      target: 1,
      unlocked: false,
    },

    // XP Achievements
    {
      id: 'xp-1000',
      name: 'Tích lũy XP',
      description: 'Đạt 1000 XP',
      icon: <Zap className="w-6 h-6" />,
      category: 'learning',
      tier: 'silver',
      progress: userProgress?.total_xp || 0,
      target: 1000,
      unlocked: false,
    },
    {
      id: 'level-10',
      name: 'Top 10',
      description: 'Đạt level 10',
      icon: <Trophy className="w-6 h-6" />,
      category: 'learning',
      tier: 'gold',
      progress: userProgress?.current_level || 0,
      target: 10,
      unlocked: false,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Tất cả', icon: <Award className="w-4 h-4" /> },
    { id: 'learning', name: 'Học tập', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'streak', name: 'Streak', icon: <Flame className="w-4 h-4" /> },
    { id: 'boss', name: 'Boss', icon: <Swords className="w-4 h-4" /> },
    { id: 'collection', name: 'Sưu tập', icon: <Star className="w-4 h-4" /> },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

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
                Vui lòng đăng nhập để xem huy hiệu
              </p>
              <Button asChild>
                <Link to="/cantonese/login">Đăng nhập ngay</Link>
              </Button>
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
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/cantonese/gamification">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              Huy Hiệu Thành Tích
            </h1>
            <p className="text-muted-foreground mt-1">
              Mở khóa và khoe huy hiệu thành tích của bạn
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Tiến Độ Tổng Thể
                </CardTitle>
                <CardDescription>
                  {unlockedCount} / {totalCount} huy hiệu đã mở khóa
                </CardDescription>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500">{unlockedCount}</div>
                <div className="text-sm text-muted-foreground">Huy hiệu</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex items-center gap-2"
            >
              {cat.icon}
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => {
            const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
            const isNearComplete = progressPercent >= 75 && !achievement.unlocked;

            return (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden transition-all ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${tierColors[achievement.tier]} text-white border-2 ${tierBorders[achievement.tier]}`
                    : 'opacity-75'
                }`}
              >
                {!achievement.unlocked && (
                  <div className="absolute inset-0 backdrop-blur-[2px] bg-background/40" />
                )}

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-white/20'
                        : 'bg-muted'
                    }`}>
                      {achievement.icon}
                    </div>
                    <Badge variant={achievement.unlocked ? 'secondary' : 'outline'} className={
                      achievement.unlocked ? 'bg-white/20 text-white' : ''
                    }>
                      {achievement.tier.toUpperCase()}
                    </Badge>
                  </div>

                  <CardTitle className={`text-xl ${achievement.unlocked ? 'text-white' : ''}`}>
                    {achievement.name}
                  </CardTitle>
                  <CardDescription className={achievement.unlocked ? 'text-white/80' : ''}>
                    {achievement.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                  {!achievement.unlocked && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tiến độ</span>
                        <span className="font-bold">
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>
                      <Progress
                        value={progressPercent}
                        className={`h-2 ${isNearComplete ? 'animate-pulse' : ''}`}
                      />
                      {isNearComplete && (
                        <p className="text-xs text-amber-600 font-medium mt-2">
                          Gần hoàn thành!
                        </p>
                      )}
                    </div>
                  )}

                  {achievement.unlocked && achievement.dateUnlocked && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Trophy className="w-4 h-4" />
                      <span>Đã mở khóa {achievement.dateUnlocked}</span>
                    </div>
                  )}

                  {achievement.unlocked && !achievement.dateUnlocked && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Trophy className="w-4 h-4" />
                      <span>Đã mở khóa</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <Award className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Không có huy hiệu nào trong danh mục này.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
