import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Brain,
  Calendar,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import type { LearningStats, AnalyticsChartData, PracticeSession } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  /** Language to show analytics for */
  language?: 'mandarin' | 'cantonese';
  /** Custom class name */
  className?: string;
}

/**
 * Analytics Dashboard Component
 * Displays comprehensive learning statistics and progress
 * Works for both Mandarin and Cantonese
 */
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  language,
  className
}) => {
  const { loading, getLearningStats, getRecentSessions, getChartData, getWeakSpots } = useAnalytics();

  const [stats, setStats] = useState<LearningStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [chartData, setChartData] = useState<AnalyticsChartData[]>([]);
  const [weakSpots, setWeakSpots] = useState<Array<{ word_id: number; hanzi: string; accuracy: number; attempts: number }>>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [language]);

  const loadData = async () => {
    const [statsData, sessionsData, chartDataResult, weakSpotsData] = await Promise.all([
      getLearningStats(),
      getRecentSessions(10, language),
      getChartData(30, language),
      getWeakSpots(language, 10)
    ]);

    setStats(statsData);
    setRecentSessions(sessionsData);
    setChartData(chartDataResult);
    setWeakSpots(weakSpotsData);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate language-specific stats
  const languageStats = stats ? (
    language === 'mandarin' ? {
      sessions: stats.mandarin_sessions,
      accuracy: stats.mandarin_accuracy,
      wordsLearned: stats.mandarin_words_learned
    } : language === 'cantonese' ? {
      sessions: stats.cantonese_sessions,
      accuracy: stats.cantonese_accuracy,
      wordsLearned: stats.cantonese_words_learned
    } : {
      sessions: stats.total_sessions,
      accuracy: stats.overall_accuracy,
      wordsLearned: (stats.mandarin_words_learned || 0) + (stats.cantonese_words_learned || 0)
    }
  ) : null;

  if (loading && !stats) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-center space-y-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className={cn('w-full', className)}>
        <CardContent className="p-12 text-center space-y-2">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">Chưa có dữ liệu thống kê</h3>
          <p className="text-sm text-muted-foreground">
            Bắt đầu học và luyện tập để xem tiến độ của bạn!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overview Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thời gian học</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.total_practice_time_seconds)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Trung bình {formatDuration(stats.avg_session_duration_seconds)}/buổi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số buổi học</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languageStats?.sessions || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng {stats.total_sessions} buổi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Độ chính xác</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(languageStats?.accuracy || 0).toFixed(1)}%</div>
            <Progress value={languageStats?.accuracy || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ đã học</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languageStats?.wordsLearned || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total_questions_answered} câu hỏi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ</TabsTrigger>
          <TabsTrigger value="weak-spots">Điểm yếu</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Lịch sử luyện tập gần đây
              </CardTitle>
              <CardDescription>10 buổi học gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có buổi học nào
                </p>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {session.session_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.started_at)} • {session.level}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-semibold">
                          {session.correct_answers}/{session.total_questions}
                        </p>
                        <p className={cn(
                          'text-xs font-medium',
                          session.accuracy >= 80 ? 'text-green-600' : session.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                        )}>
                          {session.accuracy.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Biểu đồ tiến độ 30 ngày
              </CardTitle>
              <CardDescription>Theo dõi sự tiến bộ của bạn theo thời gian</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Chưa có dữ liệu biểu đồ. Hãy học thêm!
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Simple bar chart representation */}
                  {chartData.slice(0, 10).map((data, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{data.date}</span>
                        <span className="font-medium">{data.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={data.accuracy} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {data.sessions}
                        </span>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Hiển thị 10 ngày gần nhất
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weak Spots Tab */}
        <TabsContent value="weak-spots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Từ cần ôn tập
              </CardTitle>
              <CardDescription>
                Các từ bạn cần luyện tập thêm để cải thiện
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weakSpots.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Target className="h-12 w-12 mx-auto text-green-600" />
                  <p className="text-sm font-medium">Tuyệt vời!</p>
                  <p className="text-sm text-muted-foreground">
                    Bạn chưa có từ nào cần ôn tập đặc biệt
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {weakSpots.map((word, index) => (
                    <div
                      key={word.word_id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-lg font-semibold">{word.hanzi}</p>
                          <p className="text-xs text-muted-foreground">
                            {word.attempts} lần luyện tập
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className={cn(
                          'text-sm font-semibold',
                          word.accuracy < 50 ? 'text-red-600' : 'text-yellow-600'
                        )}>
                          {word.accuracy.toFixed(1)}%
                        </p>
                        <Progress value={word.accuracy} className="w-24 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
