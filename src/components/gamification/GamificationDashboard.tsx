import React from 'react';
import { useGamification } from './GamificationProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Star, Zap, Target, Award, TrendingUp } from 'lucide-react';
import XPProgressBar from './XPProgressBar';
import StreakTracker from './StreakTracker';
import BadgeShowcase from './BadgeShowcase';
import MissionCards from './MissionCards';

const GamificationDashboard = () => {
  const { dashboard, userProgress, isLoading } = useGamification();

  // Don't show dashboard if data is not available
  if (isLoading || !dashboard || !userProgress) {
    return null;
  }

  const stats = [
    {
      title: 'Level',
      value: userProgress.current_level,
      icon: <Trophy className="h-5 w-5" />,
      gradient: 'bg-gradient-vivid',
      shadowColor: 'shadow-pink',
    },
    {
      title: 'Tổng XP',
      value: userProgress.total_xp.toLocaleString(),
      icon: <Star className="h-5 w-5" />,
      gradient: 'bg-gradient-sunset',
      shadowColor: 'shadow-orange',
    },
    {
      title: 'Badges',
      value: dashboard.badges.unlocked.length,
      icon: <Award className="h-5 w-5" />,
      gradient: 'bg-gradient-colorful',
      shadowColor: 'shadow-purple',
    },
    {
      title: 'Nhiệm vụ hoàn thành',
      value: [...(dashboard.missions.daily || []), ...(dashboard.missions.weekly || []), ...(dashboard.missions.newbie || [])].filter(m => m.completed).length,
      icon: <Target className="h-5 w-5" />,
      gradient: 'bg-gradient-spring',
      shadowColor: 'shadow-cyan',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground flex items-center justify-center gap-3">
          <Zap className="h-8 w-8 text-yellow-500" />
          Hành Trình Gamification
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Theo dõi tiến trình học tập, mở khóa thành tựu và hoàn thành nhiệm vụ để nhận thưởng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.gradient} text-white rounded-2xl ${stat.shadowColor} p-6 text-center hover-scale`}
          >
            <div className="flex justify-center mb-3">
              {stat.icon}
            </div>
            <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium opacity-90">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tiến trình Level {userProgress.current_level}
          </CardTitle>
          <CardDescription>
            {userProgress.total_xp.toLocaleString()} / {dashboard.level_info.xp_required.toLocaleString()} XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <XPProgressBar />
        </CardContent>
      </Card>

      {/* Streak Tracker */}
      <StreakTracker />

      {/* Missions */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Nhiệm Vụ
        </h3>
        <MissionCards />
      </div>

      {/* Badge Showcase */}
      <div>
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Bộ Sưu Tập Badge
        </h3>
        <BadgeShowcase />
      </div>
    </div>
  );
};

export default GamificationDashboard;
