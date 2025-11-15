import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Trophy, Star, Target, Award, TrendingUp, Flame } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Animated background - different for light/dark */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:bg-[radial-gradient(ellipse_at_center,_rgba(255,16,240,0.15)_0%,_rgba(0,0,0,1)_100%)]" />

      {/* Chinese pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles - ONLY in dark mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 10px 2px rgba(0,240,255,0.8)'
            }}
          />
        ))}
      </div>

      {/* Theme Toggle - Fixed position top right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="w-full max-w-7xl">

          {/* Header with neon effect */}
          <div className="text-center mb-16 space-y-6">
            {/* Main title with Chinese characters */}
            <div className="relative inline-block">
              <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-wider text-pink-600 dark:text-pink-500 transition-colors">
                <span className="inline-block" style={{
                  textShadow: `
                    0 0 5px rgba(255,16,240,0.3),
                    0 0 10px rgba(255,16,240,0.2)
                  `,
                  filter: 'brightness(1.1)'
                }}>
                  學中文
                </span>
              </h1>

              {/* Glow effect - ONLY in dark mode */}
              <div
                className="hidden dark:block absolute -inset-4 blur-3xl opacity-40 -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(255,16,240,0.6) 0%, transparent 70%)'
                }}
              />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-wide text-cyan-600 dark:text-cyan-400 transition-colors">
              <span style={{
                textShadow: `0 0 5px rgba(0,240,255,0.3), 0 0 10px rgba(0,240,255,0.2)`
              }}>
                HỌC TIẾNG TRUNG
              </span>
            </h2>

            <p className="text-xl md:text-2xl font-medium text-orange-600 dark:text-yellow-400 transition-colors">
              <span style={{
                textShadow: '0 0 8px rgba(255,215,0,0.3)'
              }}>
                Chọn phương ngữ bạn muốn chinh phục
              </span>
            </p>
          </div>

          {/* Language cards with neon borders */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">

            {/* Mandarin Card - Cyan/Purple */}
            <Card
              className="group relative cursor-pointer transition-all duration-500 bg-white/95 dark:bg-black/80 backdrop-blur-md border-2 border-purple-300 dark:border-purple-600 hover:border-cyan-400 dark:hover:border-cyan-400 overflow-hidden shadow-xl dark:shadow-purple-500/30"
              onClick={() => navigate('/mandarin')}
            >
              {/* Neon border effect - ONLY in dark mode */}
              <div
                className="hidden dark:block absolute inset-0 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #8A2BE2, #00F0FF, #8A2BE2)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              {/* Glow effect on hover - ONLY in dark mode */}
              <div
                className="hidden dark:block absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              />

              <CardHeader className="relative z-10 text-center pb-4 pt-8">
                <div className="flex justify-center mb-6">
                  <div className="relative p-6 rounded-full bg-gradient-to-br from-purple-200 to-indigo-300 dark:from-purple-600 dark:to-indigo-700 group-hover:scale-110 transition-transform duration-500 shadow-lg dark:shadow-purple-500/50">
                    <span className="text-6xl">中</span>
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 dark:text-yellow-300 animate-pulse" />
                  </div>
                </div>

                <CardTitle className="text-4xl font-black mb-2 text-cyan-600 dark:text-cyan-400 transition-colors">
                  <span style={{
                    textShadow: '0 0 10px rgba(0,240,255,0.5)'
                  }}>
                    普通话
                  </span>
                </CardTitle>

                <CardDescription className="text-xl font-semibold text-pink-600 dark:text-pink-400 transition-colors">
                  <span style={{
                    textShadow: '0 0 8px rgba(255,16,240,0.4)'
                  }}>
                    TIẾNG TRUNG PHỔ THÔNG
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 px-6 pb-8">
                <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
                  Chuẩn Bắc Kinh • HSK • Msutong
                </p>

                <ul className="space-y-3 text-sm">
                  {[
                    '6 cấp độ HSK (汉语水平考试)',
                    'Giáo trình Msutong tiêu chuẩn',
                    'Luyện viết chữ Hán • Phát âm',
                    'AI Tutor thông minh 🤖'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <Zap className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400 group-hover/item:scale-125 transition-transform" />
                      <span className="text-gray-700 dark:text-gray-200 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full mt-6 text-lg py-7 font-bold border-2 border-cyan-500 dark:border-cyan-400 relative overflow-hidden group/btn bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/40 dark:to-cyan-900/40 text-purple-700 dark:text-white hover:from-purple-200 hover:to-cyan-200 dark:hover:from-purple-800/60 dark:hover:to-cyan-800/60 transition-all shadow-lg dark:shadow-cyan-500/30">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    BẮT ĐẦU HỌC NGAY
                    <Sparkles className="h-5 w-5" />
                  </span>
                </Button>
              </CardContent>
            </Card>

            {/* Cantonese Card - Orange/Pink */}
            <Card
              className="group relative cursor-pointer transition-all duration-500 bg-white/95 dark:bg-black/80 backdrop-blur-md border-2 border-orange-300 dark:border-orange-600 hover:border-pink-400 dark:hover:border-pink-400 overflow-hidden shadow-xl dark:shadow-orange-500/30"
              onClick={() => navigate('/cantonese')}
            >
              {/* Neon border effect - ONLY in dark mode */}
              <div
                className="hidden dark:block absolute inset-0 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #FF6B35, #F7931E, #FF6B35)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              {/* Glow effect on hover - ONLY in dark mode */}
              <div
                className="hidden dark:block absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              />

              <CardHeader className="relative z-10 text-center pb-4 pt-8">
                <div className="flex justify-center mb-6">
                  <div className="relative p-6 rounded-full bg-gradient-to-br from-pink-200 to-orange-300 dark:from-pink-600 dark:to-red-700 group-hover:scale-110 transition-transform duration-500 shadow-lg dark:shadow-pink-500/50">
                    <span className="text-6xl">粵</span>
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 dark:text-yellow-300 animate-pulse" />
                  </div>
                </div>

                <CardTitle className="text-4xl font-black mb-2 text-orange-600 dark:text-orange-400 transition-colors">
                  <span style={{
                    textShadow: '0 0 10px rgba(255,107,53,0.5)'
                  }}>
                    粵語
                  </span>
                </CardTitle>

                <CardDescription className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 transition-colors">
                  <span style={{
                    textShadow: '0 0 8px rgba(255,215,0,0.4)'
                  }}>
                    TIẾNG QUẢNG ĐÔNG
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 px-6 pb-8">
                <p className="text-center text-gray-600 dark:text-gray-300 font-medium">
                  Hong Kong Style • Cantopop • Chợ Lớn
                </p>

                <ul className="space-y-3 text-sm">
                  {[
                    'Bài học cấu trúc từ cơ bản đến nâng cao',
                    'Học qua bài hát Cantopop 🎵',
                    'Luyện phát âm Jyutping chuẩn',
                    'Flashcard & bài tập đa dạng'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group/item">
                      <Zap className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400 group-hover/item:scale-125 transition-transform" />
                      <span className="text-gray-700 dark:text-gray-200 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full mt-6 text-lg py-7 font-bold border-2 border-yellow-500 dark:border-yellow-400 relative overflow-hidden group/btn bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/40 dark:to-orange-900/40 text-orange-700 dark:text-white hover:from-pink-200 hover:to-orange-200 dark:hover:from-pink-800/60 dark:hover:to-orange-800/60 transition-all shadow-lg dark:shadow-yellow-500/30">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    KHÁM PHÁ NGAY
                    <Sparkles className="h-5 w-5" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Gamification Features Section */}
          <div className="my-20">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-vivid text-white px-6 py-3 rounded-full font-bold shadow-pink animate-pulse-glow">
                <Trophy className="h-5 w-5" />
                <span>Hệ thống Gamification</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground dark:text-white">
                Học Vui - Học Hiệu Quả
              </h2>
              <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
                Mở khóa thành tựu, lên level, thu thập badges và hoàn thành nhiệm vụ khi học tập
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <Card className="border-0 bg-gradient-vivid text-white p-6 text-center hover-scale shadow-pink">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-center">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">XP & Levels</h3>
                  <p className="text-sm opacity-90">Nhận XP và lên cấp</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-sunset text-white p-6 text-center hover-scale shadow-orange">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-center">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">Badges</h3>
                  <p className="text-sm opacity-90">Mở khóa huy hiệu</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-colorful text-white p-6 text-center hover-scale shadow-purple">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-center">
                    <Target className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">Missions</h3>
                  <p className="text-sm opacity-90">Hoàn thành nhiệm vụ</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-spring text-white p-6 text-center hover-scale shadow-cyan">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-center">
                    <Flame className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">Streaks</h3>
                  <p className="text-sm opacity-90">Duy trì chuỗi ngày học</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-fire text-white p-6 text-center hover-scale shadow-orange">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-center">
                    <Star className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">Flashcards</h3>
                  <p className="text-sm opacity-90">Thu thập thẻ học</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-ocean text-white p-6 text-center hover-scale shadow-cyan">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-center">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg">Leaderboard</h3>
                  <p className="text-sm opacity-90">Thi đua với bạn bè</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-muted-foreground dark:text-gray-300 text-lg">
                🎮 Học tập trở nên thú vị hơn với hệ thống phần thưởng và theo dõi tiến độ tự động
              </p>
            </div>
          </div>

          {/* Footer with retro text */}
          <div className="text-center space-y-2">
            <p className="text-sm md:text-base font-medium tracking-wide text-cyan-600 dark:text-cyan-400 transition-colors">
              <span style={{
                textShadow: '0 0 5px rgba(0,240,255,0.3)'
              }}>
                兩種語言 • 同樣的漢字 • 不同的發音
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Cả hai ngôn ngữ đều dùng chữ Hán nhưng phát âm và ngữ pháp khác nhau
            </p>
          </div>
        </div>
      </div>

      {/* Scanline effect for retro feel - ONLY in dark mode */}
      <div
        className="hidden dark:block fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px'
        }}
      />
    </div>
  );
};

export default LanguageSelection;
