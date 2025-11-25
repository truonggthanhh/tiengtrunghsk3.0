import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useSession } from '@/components/SessionContextProvider';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Home, Loader2, TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface ExerciseStats {
  id: string;
  exercise_type: string;
  level: string;
  total_attempts: number;
  correct_answers: number;
  words_mastered: number;
  last_practiced_at: string;
}

const ProfilePage: React.FC = () => {
  const { session, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();
  const { getAllStats } = useProgressTracking();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ExerciseStats[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Memoize returnUrl để tránh tính toán lại khi component re-render do tab switch
  const returnUrl = useMemo(() => {
    return encodeURIComponent(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (!isSessionLoading) {
      if (!session) {
        navigate(`/mandarin/login?returnUrl=${returnUrl}`);
        return;
      }
      loadUserData();
    }
  }, [session, isSessionLoading, navigate, returnUrl]);

  const loadUserData = async () => {
    if (!session?.user) return;

    setIsLoadingData(true);
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();

      setProfile({
        first_name: profileData?.first_name || null,
        last_name: profileData?.last_name || null,
        email: session.user.email || '',
      });

      // Load stats
      const statsData = await getAllStats();
      if (statsData) {
        setStats(statsData as ExerciseStats[]);
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (isSessionLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <p className="ml-3 text-lg">Đang tải...</p>
      </div>
    );
  }

  const totalAttempts = stats.reduce((sum, stat) => sum + stat.total_attempts, 0);
  const totalCorrect = stats.reduce((sum, stat) => sum + stat.correct_answers, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const totalWordsMastered = stats.reduce((sum, stat) => sum + stat.words_mastered, 0);

  const getExerciseTypeName = (type: string) => {
    const names: Record<string, string> = {
      'flashcard': 'Flashcard',
      'pinyin-choice': 'Chọn Pinyin',
      'meaning-choice': 'Chọn Nghĩa',
      'fill-in-the-blank': 'Điền Từ',
      'sentence-choice': 'Điền Từ Vào Câu',
      'sentence-scramble': 'Sắp Xếp Câu',
      'pronunciation': 'Luyện Phát Âm',
      'handwriting-practice': 'Luyện Viết',
      'ai-tutor': 'AI Tutor',
    };
    return names[type] || type;
  };

  const getLevelName = (level: string) => {
    return level.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Profile Header */}
        <Card className="w-full max-w-4xl mx-auto mb-8 border-0 shadow-2xl bg-white/90 backdrop-blur-lg overflow-hidden">
          <div className="bg-gradient-tropical p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                {profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.email}
                </h1>
                <p className="text-white/90">{profile?.email}</p>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-colorful text-white rounded-xl shadow-purple">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalAttempts}</div>
                <div className="text-sm">Lượt luyện tập</div>
              </div>
              <div className="text-center p-4 bg-gradient-sunset text-white rounded-xl shadow-pink">
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{overallAccuracy}%</div>
                <div className="text-sm">Độ chính xác</div>
              </div>
              <div className="text-center p-4 bg-gradient-spring text-white rounded-xl shadow-cyan">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalWordsMastered}</div>
                <div className="text-sm">Từ đã thành thạo</div>
              </div>
              <div className="text-center p-4 bg-gradient-fire text-white rounded-xl shadow-orange">
                <Calendar className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.length}</div>
                <div className="text-sm">Bài tập đã làm</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Stats */}
        <Card className="w-full max-w-4xl mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Chi tiết tiến độ học tập</CardTitle>
            <CardDescription>Xem chi tiết từng loại bài tập bạn đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Bạn chưa hoàn thành bài tập nào</p>
                <Button asChild className="bg-gradient-vivid text-white hover:bg-gradient-vivid/90 border-0">
                  <Link to="/mandarin">Bắt đầu học ngay</Link>
                </Button>
              </div>
            ) : (
              stats.map((stat) => {
                const accuracy = stat.total_attempts > 0
                  ? Math.round((stat.correct_answers / stat.total_attempts) * 100)
                  : 0;

                return (
                  <div key={stat.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">
                          {getExerciseTypeName(stat.exercise_type)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getLevelName(stat.level)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
                        <div className="text-xs text-muted-foreground">Độ chính xác</div>
                      </div>
                    </div>

                    <Progress value={accuracy} className="h-2 mb-3" />

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Lượt làm:</span>{' '}
                        <span className="font-semibold">{stat.total_attempts}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Đúng:</span>{' '}
                        <span className="font-semibold text-green-600">{stat.correct_answers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sai:</span>{' '}
                        <span className="font-semibold text-red-600">
                          {stat.total_attempts - stat.correct_answers}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                      Lần cuối: {new Date(stat.last_practiced_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button asChild className="font-bold bg-gradient-spring text-white hover:bg-gradient-spring/90 border-0 shadow-cyan">
            <Link to="/mandarin">
              <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
