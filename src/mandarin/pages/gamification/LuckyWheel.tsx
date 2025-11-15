import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gift, Lock, Zap, Star, Trophy, Sparkles } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { useGamification } from '@/components/gamification/GamificationProvider';
import confetti from 'canvas-confetti';

interface Prize {
  id: string;
  name: string;
  type: 'xp' | 'streak' | 'bonus';
  value: number;
  color: string;
  icon: React.ReactNode;
}

const prizes: Prize[] = [
  {
    id: '1',
    name: '+10 XP',
    type: 'xp',
    value: 10,
    color: '#f59e0b',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: '2',
    name: '+50 XP',
    type: 'xp',
    value: 50,
    color: '#10b981',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: '3',
    name: '+5 XP',
    type: 'xp',
    value: 5,
    color: '#6366f1',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: '4',
    name: '+100 XP',
    type: 'xp',
    value: 100,
    color: '#ec4899',
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    id: '5',
    name: '+20 XP',
    type: 'xp',
    value: 20,
    color: '#8b5cf6',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: '6',
    name: '+200 XP',
    type: 'xp',
    value: 200,
    color: '#f97316',
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: '7',
    name: '+15 XP',
    type: 'xp',
    value: 15,
    color: '#06b6d4',
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: '8',
    name: '+30 XP',
    type: 'xp',
    value: 30,
    color: '#14b8a6',
    icon: <Zap className="w-6 h-6" />,
  },
];

export default function MandarinLuckyWheel() {
  const { session } = useSession();
  const { userProgress, addXP } = useGamification();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinsToday, setSpinsToday] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (spinning || !canSpin) return;

    setSpinning(true);
    setWonPrize(null);

    // Random prize selection
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[prizeIndex];

    // Calculate rotation (5 full spins + landing on prize)
    const segmentAngle = 360 / prizes.length;
    const targetRotation = 360 * 5 + (360 - (prizeIndex * segmentAngle + segmentAngle / 2));
    const finalRotation = rotation + targetRotation;

    setRotation(finalRotation);

    // After spin completes
    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prize);
      setSpinsToday(prev => prev + 1);

      // Award prize
      if (prize.type === 'xp' && addXP) {
        addXP(prize.value);
      }

      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Check daily limit
      if (spinsToday + 1 >= 3) {
        setCanSpin(false);
      }
    }, 4000);
  };

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
                Vui lòng đăng nhập để quay vòng may mắn
              </p>
              <Button asChild>
                <Link to="/mandarin/login">Đăng nhập ngay</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/mandarin/gamification">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Gift className="w-8 h-8 text-yellow-500" />
              Vòng Quay May Mắn
            </h1>
            <p className="text-muted-foreground mt-1">
              Quay để nhận phần thưởng hấp dẫn mỗi ngày!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-primary">{spinsToday}</div>
              <div className="text-sm text-muted-foreground">Lượt quay hôm nay</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-yellow-500">3</div>
              <div className="text-sm text-muted-foreground">Lượt quay tối đa</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-green-500">{3 - spinsToday}</div>
              <div className="text-sm text-muted-foreground">Lượt còn lại</div>
            </CardContent>
          </Card>
        </div>

        {/* Wheel Container */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardContent className="p-8">
            <div className="relative mx-auto" style={{ width: '400px', height: '400px' }}>
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-8 h-12 bg-red-500 clip-triangle shadow-lg"></div>
              </div>

              {/* Wheel */}
              <div
                ref={wheelRef}
                className="relative w-full h-full rounded-full shadow-2xl border-8 border-yellow-400"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
              >
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-lg z-10 flex items-center justify-center border-4 border-yellow-400">
                  <Gift className="w-10 h-10 text-yellow-500" />
                </div>

                {/* Segments */}
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index;
                  return (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      <div
                        className="absolute top-0 left-1/2 origin-bottom w-0 h-0"
                        style={{
                          borderLeft: '100px solid transparent',
                          borderRight: '100px solid transparent',
                          borderBottom: `200px solid ${prize.color}`,
                          transform: 'translateX(-50%)',
                        }}
                      >
                        <div
                          className="absolute left-1/2 -translate-x-1/2 text-white font-bold text-center"
                          style={{
                            top: '140px',
                            transform: 'translateX(-50%) rotate(0deg)',
                          }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {prize.icon}
                            <span className="text-sm whitespace-nowrap">{prize.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spin Button */}
            <div className="text-center mt-8">
              <Button
                onClick={handleSpin}
                disabled={spinning || !canSpin}
                size="lg"
                className="text-xl px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {spinning ? 'Đang quay...' : !canSpin ? 'Hết lượt quay hôm nay' : 'QUAY NGAY! 🎰'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prize Won Modal */}
        {wonPrize && (
          <Card className="mt-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500 animate-bounce">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                <span className="text-3xl">Chúc mừng! 🎉</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold mb-2">Bạn đã nhận được:</div>
              <div className="text-4xl font-black text-yellow-600 mb-4">{wonPrize.name}</div>
              <p className="text-muted-foreground">
                Phần thưởng đã được cộng vào tài khoản của bạn!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Prize List */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Danh sách phần thưởng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {prizes.map((prize) => (
                <div
                  key={prize.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2"
                  style={{ borderColor: prize.color, backgroundColor: `${prize.color}20` }}
                >
                  <div style={{ color: prize.color }}>{prize.icon}</div>
                  <span className="font-bold" style={{ color: prize.color }}>
                    {prize.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mt-8 bg-blue-500/10 border-blue-400">
          <CardContent className="py-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Quy định
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Mỗi ngày bạn được quay tối đa 3 lần</li>
              <li>• Phần thưởng sẽ được cộng vào tài khoản ngay lập tức</li>
              <li>• Lượt quay sẽ được reset vào 00:00 mỗi ngày</li>
              <li>• Chúc bạn may mắn! 🍀</li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <style>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
}
