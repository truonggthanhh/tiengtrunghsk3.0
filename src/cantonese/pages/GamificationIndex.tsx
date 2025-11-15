import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Trophy, Zap, Swords, ScrollText, Sparkles, Target,
  Award, Gift, Flame, Star, ChevronRight, GamepadIcon
} from 'lucide-react';
import { useGamification } from '@/components/gamification/GamificationProvider';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import CantoneseHeader from '../components/layouts/Header';

const gameFeatures = [
  {
    id: 'boss-battles',
    title: 'Đấu Boss',
    icon: <Swords className="w-12 h-12" />,
    description: 'Thử thách kiến thức Quảng Đông với các trận đấu boss',
    gradient: 'bg-gradient-to-br from-red-500 via-orange-500 to-pink-500',
    path: '/cantonese/gamification/boss-battles',
    badge: 'HOT',
  },
  {
    id: 'card-collection',
    title: 'Sưu Tập Thẻ',
    icon: <Sparkles className="w-12 h-12" />,
    description: 'Thu thập thẻ từ vựng và văn hóa Hong Kong',
    gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500',
    path: '/cantonese/gamification/card-collection',
    badge: 'NEW',
  },
  {
    id: 'lucky-wheel',
    title: 'Vòng Quay May Mắn',
    icon: <Gift className="w-12 h-12" />,
    description: 'Quay để nhận phần thưởng hấp dẫn mỗi ngày',
    gradient: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500',
    path: '/cantonese/gamification/lucky-wheel',
    badge: null,
  },
  {
    id: 'missions',
    title: 'Nhiệm Vụ',
    icon: <Target className="w-12 h-12" />,
    description: 'Hoàn thành nhiệm vụ hàng ngày và hàng tuần',
    gradient: 'bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500',
    path: '/cantonese/gamification/missions',
    badge: null,
  },
  {
    id: 'story-mode',
    title: 'Chế Độ Câu Chuyện',
    icon: <ScrollText className="w-12 h-12" />,
    description: 'Khám phá câu chuyện Hong Kong qua các chương',
    gradient: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500',
    path: '/cantonese/gamification/story-mode',
    badge: null,
  },
  {
    id: 'badges',
    title: 'Huy Hiệu',
    icon: <Award className="w-12 h-12" />,
    description: 'Mở khóa và khoe huy hiệu thành tích của bạn',
    gradient: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500',
    path: '/cantonese/gamification/badges',
    badge: null,
  },
];

const CantoneseGamificationIndex = () => {
  const { userProgress, dashboard, isLoading } = useGamification();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <CantoneseHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <GamepadIcon className="w-16 h-16 text-primary animate-bounce" />
            <Zap className="w-12 h-12 text-yellow-500 animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-pink-500 to-orange-500 bg-clip-text text-transparent">
            🎮 Học Tiếng Quảng Đông Qua Game 🎯
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Biến việc học thành cuộc phiêu lưu Hong Kong! Thu thập thẻ, đấu boss, quay vòng may mắn và còn nhiều hơn nữa.
          </p>

          {!isLoading && userProgress && (
            <div className="flex items-center justify-center gap-6 text-lg font-semibold mt-6">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-vivid text-white rounded-full shadow-lg">
                <Trophy className="w-5 h-5" />
                <span>Level {userProgress.current_level}</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-sunset text-white rounded-full shadow-lg">
                <Star className="w-5 h-5" />
                <span>{userProgress.total_xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-spring text-white rounded-full shadow-lg">
                <Flame className="w-5 h-5" />
                <span>{userProgress.current_streak} ngày</span>
              </div>
            </div>
          )}
        </div>

        {/* Game Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            Các Tính Năng Game
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameFeatures.map((feature) => (
              <Link key={feature.id} to={feature.path}>
                <Card className={`${feature.gradient} border-0 text-white overflow-hidden relative group cursor-pointer hover-scale h-full`}>
                  {feature.badge && (
                    <div className="absolute top-4 right-4 bg-white text-primary px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                      {feature.badge}
                    </div>
                  </div>

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

                  <CardFooter className="relative z-10">
                    <Button variant="secondary" className="w-full font-semibold">
                      Chơi ngay <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Dashboard Section */}
        <section>
          <GamificationDashboard />
        </section>
      </main>
    </div>
  );
};

export default CantoneseGamificationIndex;
