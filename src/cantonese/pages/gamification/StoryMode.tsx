import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/components/gamification/GamificationProvider';
import {
  ArrowLeft,
  ScrollText,
  Lock,
  MapPin,
  Star,
  CheckCircle2,
  BookOpen,
  Map,
  Trophy,
  Loader2,
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

interface Chapter {
  id: string;
  number: number;
  title: string;
  location: string;
  description: string;
  icon: string;
  completedLessons: number;
  totalLessons: number;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export default function CantoneseStoryMode() {
  const { session } = useSession();
  const { userProgress, isLoading } = useGamification();
  const navigate = useNavigate();

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: '1',
      number: 1,
      title: 'Chào mừng đến Bắc Kinh',
      location: '北京 (Beijing)',
      description: 'Bắt đầu hành trình học tiếng Trung tại thủ đô Bắc Kinh. Học các cụm từ chào hỏi và giới thiệu bản thân.',
      icon: '🏛️',
      completedLessons: 0,
      totalLessons: 5,
      xpReward: 100,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '2',
      number: 2,
      title: 'Khám phá Thượng Hải',
      location: '上海 (Shanghai)',
      description: 'Khám phá thành phố hiện đại Thượng Hải. Học từ vựng về mua sắm, ăn uống và di chuyển.',
      icon: '🏙️',
      completedLessons: 0,
      totalLessons: 6,
      xpReward: 150,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '3',
      number: 3,
      title: 'Vạn Lý Trường Thành',
      location: '长城 (Great Wall)',
      description: 'Tham quan kỳ quan thế giới. Học các từ vựng về lịch sử và văn hóa Trung Quốc.',
      icon: '🏰',
      completedLessons: 0,
      totalLessons: 7,
      xpReward: 200,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '4',
      number: 4,
      title: 'Tây An cổ kính',
      location: '西安 (Xi\'an)',
      description: 'Khám phá thành phố cổ đại Tây An. Học về ẩm thực truyền thống và lịch sử nhà Tần.',
      icon: '🗿',
      completedLessons: 0,
      totalLessons: 8,
      xpReward: 250,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: '5',
      number: 5,
      title: 'Thành Đô và gấu trúc',
      location: '成都 (Chengdu)',
      description: 'Ghé thăm Thành Đô, quê hương của gấu trúc. Học từ vựng về động vật và thiên nhiên.',
      icon: '🐼',
      completedLessons: 0,
      totalLessons: 9,
      xpReward: 300,
      isUnlocked: false,
      isCompleted: false,
    },
    {
      id: '6',
      number: 6,
      title: 'Quế Lâm thơ mộng',
      location: '桂林 (Guilin)',
      description: 'Thưởng ngoạn phong cảnh tuyệt đẹp Quế Lâm. Học từ vựng về thiên nhiên và du lịch.',
      icon: '⛰️',
      completedLessons: 0,
      totalLessons: 10,
      xpReward: 350,
      isUnlocked: false,
      isCompleted: false,
    },
    {
      id: '7',
      number: 7,
      title: 'Hồng Kông sôi động',
      location: '香港 (Hong Kong)',
      description: 'Trải nghiệm sự pha trộn văn hóa Đông Tây tại Hồng Kông. Học tiếng Quảng Đông cơ bản.',
      icon: '🌃',
      completedLessons: 0,
      totalLessons: 11,
      xpReward: 400,
      isUnlocked: false,
      isCompleted: false,
    },
    {
      id: '8',
      number: 8,
      title: 'Tử Cấm Thành huyền bí',
      location: '故宫 (Forbidden City)',
      description: 'Khám phá cung điện hoàng gia cổ xưa. Học từ vựng nâng cao về văn hóa và lịch sử.',
      icon: '👑',
      completedLessons: 0,
      totalLessons: 12,
      xpReward: 500,
      isUnlocked: false,
      isCompleted: false,
    },
  ]);

  const handleStartChapter = (chapter: Chapter) => {
    if (!chapter.isUnlocked) return;
    // Navigate to lessons for this chapter
    // navigate(`/cantonese/story/${chapter.id}`);
    alert(`Chương ${chapter.number}: ${chapter.title} - Tính năng bài học đang được phát triển!`);
  };

  const progressPercent = (chapters.filter(c => c.isCompleted).length / chapters.length) * 100;

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
                Vui lòng đăng nhập để khám phá câu chuyện
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
              <ScrollText className="w-8 h-8 text-blue-500" />
              Chế Độ Câu Chuyện
            </h1>
            <p className="text-muted-foreground mt-1">
              Hành trình qua các địa danh nổi tiếng của Trung Quốc
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Tiến Độ Tổng Thể
                </CardTitle>
                <CardDescription>
                  {chapters.filter(c => c.isCompleted).length} / {chapters.length} chương đã hoàn thành
                </CardDescription>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="h-4" />
          </CardContent>
        </Card>

        {/* Chapter Map */}
        <div className="relative">
          {/* Journey Path Visual */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 hidden md:block"
               style={{ transform: 'translateX(-50%)' }} />

          <div className="space-y-12">
            {chapters.map((chapter, index) => {
              const isLeft = index % 2 === 0;
              const progressPercent = (chapter.completedLessons / chapter.totalLessons) * 100;

              return (
                <div
                  key={chapter.id}
                  className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                >
                  {/* Chapter Card */}
                  <Card
                    className={`flex-1 max-w-2xl hover-scale ${
                      chapter.isCompleted
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500'
                        : chapter.isUnlocked
                        ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
                        : 'opacity-60'
                    }`}
                  >
                    {!chapter.isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
                        <Lock className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}

                    {chapter.isCompleted && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="text-6xl">{chapter.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Chương {chapter.number}</Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {chapter.location}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl mb-2">{chapter.title}</CardTitle>
                          <CardDescription className="text-base">
                            {chapter.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            Bài học
                          </span>
                          <span className="font-bold">
                            {chapter.completedLessons} / {chapter.totalLessons}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Star className="w-4 h-4" />
                          <span className="font-bold">+{chapter.xpReward} XP</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {chapter.totalLessons} bài học
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleStartChapter(chapter)}
                        disabled={!chapter.isUnlocked}
                        variant={chapter.isCompleted ? 'outline' : 'default'}
                      >
                        {chapter.isCompleted ? (
                          <>
                            <Trophy className="mr-2 h-4 w-4" />
                            Học lại
                          </>
                        ) : chapter.isUnlocked ? (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Bắt đầu chương
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Chưa mở khóa
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Chapter Number Circle (for desktop) */}
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl shadow-lg">
                    {chapter.number}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Message */}
        <Card className="mt-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-400">
          <CardContent className="text-center py-8">
            <ScrollText className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Thêm chương sắp ra mắt!</h3>
            <p className="text-muted-foreground">
              Hành trình học tiếng Trung của bạn sẽ còn nhiều điều thú vị phía trước...
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
