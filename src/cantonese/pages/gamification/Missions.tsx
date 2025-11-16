import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/cantonese/hooks/useGamification';
import {
  ArrowLeft,
  Target,
  Lock,
  Trophy,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  BookOpen,
  Swords,
  Star,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import confetti from 'canvas-confetti';

interface Mission {
  id: string;
  type: 'daily' | 'weekly';
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
  resetTime?: string; // ISO string
}

export default function CantoneseMissions() {
  const { session } = useSession();
  const { userProgress, isLoading, addXP } = useGamification();

  const [dailyMissions, setDailyMissions] = useState<Mission[]>([
    {
      id: 'daily-1',
      type: 'daily',
      title: 'Học 10 từ vựng mới',
      description: 'Hoàn thành bài học với 10 từ vựng mới',
      icon: <BookOpen className="w-5 h-5" />,
      progress: 0,
      target: 10,
      xpReward: 50,
      completed: false,
      resetTime: getEndOfDay(),
    },
    {
      id: 'daily-2',
      type: 'daily',
      title: 'Chiến thắng 1 Boss',
      description: 'Đánh bại bất kỳ boss nào trong Boss Battles',
      icon: <Swords className="w-5 h-5" />,
      progress: 0,
      target: 1,
      xpReward: 75,
      completed: false,
      resetTime: getEndOfDay(),
    },
    {
      id: 'daily-3',
      type: 'daily',
      title: 'Hoàn thành 5 bài tập',
      description: 'Làm đúng 5 bài tập bất kỳ',
      icon: <Target className="w-5 h-5" />,
      progress: 0,
      target: 5,
      xpReward: 30,
      completed: false,
      resetTime: getEndOfDay(),
    },
    {
      id: 'daily-4',
      type: 'daily',
      title: 'Streak Combo',
      description: 'Duy trì chuỗi học tập hằng ngày',
      icon: <Flame className="w-5 h-5" />,
      progress: userProgress?.current_streak || 0,
      target: 1,
      xpReward: 25,
      completed: false,
      resetTime: getEndOfDay(),
    },
  ]);

  const [weeklyMissions, setWeeklyMissions] = useState<Mission[]>([
    {
      id: 'weekly-1',
      type: 'weekly',
      title: 'Đại gia từ vựng',
      description: 'Học 50 từ vựng mới trong tuần',
      icon: <BookOpen className="w-5 h-5" />,
      progress: 0,
      target: 50,
      xpReward: 300,
      completed: false,
      resetTime: getEndOfWeek(),
    },
    {
      id: 'weekly-2',
      type: 'weekly',
      title: 'Săn Boss',
      description: 'Đánh bại 5 boss khác nhau',
      icon: <Trophy className="w-5 h-5" />,
      progress: 0,
      target: 5,
      xpReward: 400,
      completed: false,
      resetTime: getEndOfWeek(),
    },
    {
      id: 'weekly-3',
      type: 'weekly',
      title: 'Học không ngừng nghỉ',
      description: 'Học 7 ngày liên tục trong tuần',
      icon: <Flame className="w-5 h-5" />,
      progress: 0,
      target: 7,
      xpReward: 500,
      completed: false,
      resetTime: getEndOfWeek(),
    },
    {
      id: 'weekly-4',
      type: 'weekly',
      title: 'Bậc thầy thẻ bài',
      description: 'Thu thập 20 thẻ từ Card Collection',
      icon: <Star className="w-5 h-5" />,
      progress: 0,
      target: 20,
      xpReward: 350,
      completed: false,
      resetTime: getEndOfWeek(),
    },
  ]);

  const handleClaimReward = (mission: Mission) => {
    if (!mission.completed || mission.progress < mission.target) return;

    // Add XP
    if (addXP) {
      addXP(mission.xpReward);
    }

    // Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Update mission
    if (mission.type === 'daily') {
      setDailyMissions(prev => prev.map(m =>
        m.id === mission.id ? { ...m, completed: true } : m
      ));
    } else {
      setWeeklyMissions(prev => prev.map(m =>
        m.id === mission.id ? { ...m, completed: true } : m
      ));
    }
  };

  // Simulate mission progress (in real app, would track from actual user actions)
  useEffect(() => {
    const simulateProgress = () => {
      setDailyMissions(prev => prev.map(m => ({
        ...m,
        progress: Math.min(m.progress + Math.floor(Math.random() * 2), m.target),
      })));
      setWeeklyMissions(prev => prev.map(m => ({
        ...m,
        progress: Math.min(m.progress + Math.floor(Math.random() * 3), m.target),
      })));
    };

    // Simulate every 10 seconds
    const interval = setInterval(simulateProgress, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4 md:p-8 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Yêu cầu đăng nhập</h2>
              <p className="text-muted-foreground mb-6">
                Vui lòng đăng nhập để xem nhiệm vụ
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
        <main className="container mx-auto p-4 md:p-8 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  const renderMissionCard = (mission: Mission) => {
    const progressPercent = (mission.progress / mission.target) * 100;
    const isCompleted = mission.progress >= mission.target;

    return (
      <Card
        key={mission.id}
        className={`relative overflow-hidden transition-all ${
          isCompleted ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500' : ''
        }`}
      >
        {isCompleted && !mission.completed && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 animate-pulse">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Hoàn thành!
            </Badge>
          </div>
        )}

        <CardHeader>
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${
              mission.type === 'daily'
                ? 'bg-blue-500/20 text-blue-500'
                : 'bg-purple-500/20 text-purple-500'
            }`}>
              {mission.icon}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{mission.title}</CardTitle>
              <CardDescription>{mission.description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tiến độ</span>
              <span className="font-bold">
                {mission.progress} / {mission.target}
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-yellow-600">
              <Zap className="w-4 h-4" />
              <span className="font-bold">+{mission.xpReward} XP</span>
            </div>

            {mission.resetTime && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{getTimeRemaining(mission.resetTime)}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            disabled={!isCompleted || mission.completed}
            onClick={() => handleClaimReward(mission)}
            variant={isCompleted && !mission.completed ? 'default' : 'outline'}
          >
            {mission.completed ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Đã nhận thưởng
              </>
            ) : isCompleted ? (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Nhận thưởng
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Chưa hoàn thành
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link to="/cantonese/gamification">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Target className="w-8 h-8 text-green-500" />
                Nhiệm Vụ
              </h1>
              <p className="text-muted-foreground mt-1">
                Hoàn thành nhiệm vụ hàng ngày và hàng tuần để nhận XP
              </p>
            </div>
          </div>

          {userProgress && (
            <Badge variant="outline" className="text-lg px-4 py-2 hidden md:flex">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              {userProgress.total_xp} XP
            </Badge>
          )}
        </div>

        {/* Daily Missions */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Nhiệm vụ hàng ngày</h2>
            <Badge variant="secondary">
              Làm mới sau: {getTimeRemaining(getEndOfDay())}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyMissions.map(renderMissionCard)}
          </div>
        </div>

        {/* Weekly Missions */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Nhiệm vụ hàng tuần</h2>
            <Badge variant="secondary">
              Làm mới sau: {getTimeRemaining(getEndOfWeek())}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weeklyMissions.map(renderMissionCard)}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions
function getEndOfDay(): string {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

function getEndOfWeek(): string {
  const end = new Date();
  const day = end.getDay();
  const diff = 7 - day; // days until Sunday
  end.setDate(end.getDate() + diff);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
}

function getTimeRemaining(isoString: string): string {
  const end = new Date(isoString);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Đã hết hạn';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} ngày`;
  }

  return `${hours}h ${minutes}m`;
}
