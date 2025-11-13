import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap } from 'lucide-react';

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated background with Chinese patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,16,240,0.15)_0%,_rgba(0,0,0,1)_100%)]" />

      {/* Chinese pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Main content */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="w-full max-w-7xl">

          {/* Header with neon effect */}
          <div className="text-center mb-16 space-y-6">
            {/* Main title with Chinese characters */}
            <div className="relative inline-block">
              <h1
                className="text-6xl md:text-8xl font-black mb-4 tracking-wider"
                style={{
                  color: '#FF10F0',
                  textShadow: `
                    0 0 10px rgba(255,16,240,0.8),
                    0 0 20px rgba(255,16,240,0.6),
                    0 0 30px rgba(255,16,240,0.4),
                    0 0 40px rgba(255,16,240,0.2),
                    0 0 70px rgba(255,16,240,0.1),
                    0 0 80px rgba(255,16,240,0.05)
                  `,
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              >
                學中文
              </h1>
              <div
                className="absolute -inset-4 blur-3xl opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(255,16,240,0.6) 0%, transparent 70%)'
                }}
              />
            </div>

            <h2
              className="text-3xl md:text-5xl font-bold tracking-wide"
              style={{
                color: '#00F0FF',
                textShadow: `
                  0 0 10px rgba(0,240,255,0.8),
                  0 0 20px rgba(0,240,255,0.5),
                  0 0 30px rgba(0,240,255,0.3)
                `
              }}
            >
              HỌC TIẾNG TRUNG
            </h2>

            <p
              className="text-xl md:text-2xl font-medium"
              style={{
                color: '#FFD700',
                textShadow: '0 0 10px rgba(255,215,0,0.5)'
              }}
            >
              Chọn phương ngữ bạn muốn chinh phục
            </p>
          </div>

          {/* Language cards with neon borders */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">

            {/* Mandarin Card - Cyan/Purple neon */}
            <Card
              className="group relative cursor-pointer transition-all duration-500 bg-black/80 backdrop-blur-md border-0 overflow-hidden"
              onClick={() => navigate('/mandarin')}
              style={{
                boxShadow: `
                  0 0 20px rgba(138,43,226,0.4),
                  inset 0 0 20px rgba(138,43,226,0.1)
                `
              }}
            >
              {/* Neon border effect */}
              <div
                className="absolute inset-0 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #8A2BE2, #00F0FF, #8A2BE2)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              {/* Glow effect on hover */}
              <div
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              />

              <CardHeader className="relative z-10 text-center pb-4 pt-8">
                <div className="flex justify-center mb-6">
                  <div
                    className="relative p-6 rounded-full group-hover:scale-110 transition-transform duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 0 30px rgba(102,126,234,0.6), 0 0 60px rgba(118,75,162,0.3)'
                    }}
                  >
                    <span className="text-6xl">中</span>
                    <Sparkles
                      className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))'
                      }}
                    />
                  </div>
                </div>

                <CardTitle
                  className="text-4xl font-black mb-2"
                  style={{
                    color: '#00F0FF',
                    textShadow: '0 0 10px rgba(0,240,255,0.8)'
                  }}
                >
                  普通话
                </CardTitle>

                <CardDescription
                  className="text-xl font-semibold"
                  style={{
                    color: '#FF10F0',
                    textShadow: '0 0 8px rgba(255,16,240,0.6)'
                  }}
                >
                  TIẾNG TRUNG PHỔ THÔNG
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 px-6 pb-8">
                <p className="text-center text-gray-300 font-medium">
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
                      <Zap
                        className="h-5 w-5 mt-0.5 flex-shrink-0 group-hover/item:scale-125 transition-transform"
                        style={{
                          color: '#FFD700',
                          filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))'
                        }}
                      />
                      <span className="text-gray-200 group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6 text-lg py-7 font-bold border-2 relative overflow-hidden group/btn"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderColor: '#00F0FF',
                    boxShadow: '0 0 20px rgba(0,240,255,0.4)',
                    color: 'white'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    BẮT ĐẦU HỌC NGAY
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </Button>
              </CardContent>
            </Card>

            {/* Cantonese Card - Orange/Red neon */}
            <Card
              className="group relative cursor-pointer transition-all duration-500 bg-black/80 backdrop-blur-md border-0 overflow-hidden"
              onClick={() => navigate('/cantonese')}
              style={{
                boxShadow: `
                  0 0 20px rgba(255,51,102,0.4),
                  inset 0 0 20px rgba(255,51,102,0.1)
                `
              }}
            >
              {/* Neon border effect */}
              <div
                className="absolute inset-0 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #FF6B35, #F7931E, #FF6B35)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              />

              {/* Glow effect on hover */}
              <div
                className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              />

              <CardHeader className="relative z-10 text-center pb-4 pt-8">
                <div className="flex justify-center mb-6">
                  <div
                    className="relative p-6 rounded-full group-hover:scale-110 transition-transform duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      boxShadow: '0 0 30px rgba(240,147,251,0.6), 0 0 60px rgba(245,87,108,0.3)'
                    }}
                  >
                    <span className="text-6xl">粵</span>
                    <Sparkles
                      className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))',
                        animationDelay: '0.5s'
                      }}
                    />
                  </div>
                </div>

                <CardTitle
                  className="text-4xl font-black mb-2"
                  style={{
                    color: '#FF6B35',
                    textShadow: '0 0 10px rgba(255,107,53,0.8)'
                  }}
                >
                  粵語
                </CardTitle>

                <CardDescription
                  className="text-xl font-semibold"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 8px rgba(255,215,0,0.6)'
                  }}
                >
                  TIẾNG QUẢNG ĐÔNG
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 px-6 pb-8">
                <p className="text-center text-gray-300 font-medium">
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
                      <Zap
                        className="h-5 w-5 mt-0.5 flex-shrink-0 group-hover/item:scale-125 transition-transform"
                        style={{
                          color: '#FFD700',
                          filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))'
                        }}
                      />
                      <span className="text-gray-200 group-hover/item:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-6 text-lg py-7 font-bold border-2 relative overflow-hidden group/btn"
                  style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderColor: '#FFD700',
                    boxShadow: '0 0 20px rgba(255,215,0,0.4)',
                    color: 'white'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    KHÁM PHÁ NGAY
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer with retro text */}
          <div className="text-center space-y-2">
            <p
              className="text-sm md:text-base font-medium tracking-wide"
              style={{
                color: '#00F0FF',
                textShadow: '0 0 5px rgba(0,240,255,0.5)'
              }}
            >
              兩種語言 • 同樣的漢字 • 不同的發音
            </p>
            <p className="text-gray-400 text-sm">
              Cả hai ngôn ngữ đều dùng chữ Hán nhưng phát âm và ngữ pháp khác nhau
            </p>
          </div>
        </div>
      </div>

      {/* Scanline effect for retro feel */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px'
        }}
      />
    </div>
  );
};

export default LanguageSelection;
