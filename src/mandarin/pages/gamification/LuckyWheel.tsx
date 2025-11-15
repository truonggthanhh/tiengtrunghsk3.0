import React, { useState } from 'react';
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
  value: number;
  color: string;
}

const prizes: Prize[] = [
  { id: '1', name: '+10 XP', value: 10, color: '#f59e0b' },
  { id: '2', name: '+50 XP', value: 50, color: '#10b981' },
  { id: '3', name: '+5 XP', value: 5, color: '#6366f1' },
  { id: '4', name: '+100 XP', value: 100, color: '#ec4899' },
  { id: '5', name: '+20 XP', value: 20, color: '#8b5cf6' },
  { id: '6', name: '+200 XP', value: 200, color: '#f97316' },
  { id: '7', name: '+15 XP', value: 15, color: '#06b6d4' },
  { id: '8', name: '+30 XP', value: 30, color: '#14b8a6' },
];

export default function MandarinLuckyWheel() {
  const { session } = useSession();
  const { addXP } = useGamification();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinsToday, setSpinsToday] = useState(0);

  const handleSpin = () => {
    if (spinning || !canSpin) return;

    setSpinning(true);
    setWonPrize(null);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[prizeIndex];
    const segmentAngle = 360 / prizes.length;
    const targetRotation = 360 * 5 + (360 - (prizeIndex * segmentAngle + segmentAngle / 2));

    setRotation(rotation + targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prize);
      setSpinsToday(prev => prev + 1);

      if (addXP) addXP(prize.value);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (spinsToday + 1 >= 3) setCanSpin(false);
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
              <Button asChild><Link to="/mandarin/login">Đăng nhập ngay</Link></Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const segmentAngle = 360 / prizes.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link to="/mandarin/gamification"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
              <Gift className="w-8 h-8 text-yellow-500" />Vòng Quay May Mắn
            </h1>
            <p className="text-muted-foreground mt-1">Quay để nhận phần thưởng hấp dẫn mỗi ngày!</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card><CardContent className="text-center py-6"><div className="text-3xl font-bold text-primary">{spinsToday}</div><div className="text-sm text-muted-foreground">Lượt quay hôm nay</div></CardContent></Card>
          <Card><CardContent className="text-center py-6"><div className="text-3xl font-bold text-yellow-500">3</div><div className="text-sm text-muted-foreground">Lượt quay tối đa</div></CardContent></Card>
          <Card><CardContent className="text-center py-6"><div className="text-3xl font-bold text-green-500">{3 - spinsToday}</div><div className="text-sm text-muted-foreground">Lượt còn lại</div></CardContent></Card>
        </div>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardContent className="p-8">
            <div className="relative mx-auto" style={{ width: '500px', height: '500px' }}>
              {/* Pointer Triangle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30" style={{ marginTop: '-20px' }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <polygon points="20,40 0,0 40,0" fill="#ef4444" stroke="#991b1b" strokeWidth="2"/>
                </svg>
              </div>

              {/* Wheel SVG */}
              <svg
                className="absolute inset-0"
                width="500"
                height="500"
                viewBox="0 0 500 500"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
              >
                {/* Outer circle border */}
                <circle cx="250" cy="250" r="240" fill="none" stroke="#fbbf24" strokeWidth="8"/>

                {/* Segments */}
                {prizes.map((prize, index) => {
                  const startAngle = (segmentAngle * index - 90) * (Math.PI / 180);
                  const endAngle = (segmentAngle * (index + 1) - 90) * (Math.PI / 180);
                  const x1 = 250 + 230 * Math.cos(startAngle);
                  const y1 = 250 + 230 * Math.sin(startAngle);
                  const x2 = 250 + 230 * Math.cos(endAngle);
                  const y2 = 250 + 230 * Math.sin(endAngle);
                  const midAngle = (startAngle + endAngle) / 2;
                  const textX = 250 + 150 * Math.cos(midAngle);
                  const textY = 250 + 150 * Math.sin(midAngle);

                  return (
                    <g key={prize.id}>
                      <path
                        d={`M 250 250 L ${x1} ${y1} A 230 230 0 0 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="24"
                        fontWeight="bold"
                        transform={`rotate(${segmentAngle * index + segmentAngle / 2}, ${textX}, ${textY})`}
                      >
                        {prize.name}
                      </text>
                    </g>
                  );
                })}

                {/* Center circle */}
                <circle cx="250" cy="250" r="50" fill="white" stroke="#fbbf24" strokeWidth="4"/>
                <text x="250" y="260" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#f59e0b">🎁</text>
              </svg>
            </div>

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
              <p className="text-muted-foreground">Phần thưởng đã được cộng vào tài khoản của bạn!</p>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="w-5 h-5" />Danh sách phần thưởng</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {prizes.map((prize) => (
                <div key={prize.id} className="flex flex-col items-center gap-2 p-4 rounded-lg border-2" style={{ borderColor: prize.color, backgroundColor: `${prize.color}20` }}>
                  <Zap className="w-6 h-6" style={{ color: prize.color }} />
                  <span className="font-bold" style={{ color: prize.color }}>{prize.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 bg-blue-500/10 border-blue-400">
          <CardContent className="py-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-blue-500" />Quy định</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Mỗi ngày bạn được quay tối đa 3 lần</li>
              <li>• Phần thưởng sẽ được cộng vào tài khoản ngay lập tức</li>
              <li>• Lượt quay sẽ được reset vào 00:00 mỗi ngày</li>
              <li>• Chúc bạn may mắn! 🍀</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
