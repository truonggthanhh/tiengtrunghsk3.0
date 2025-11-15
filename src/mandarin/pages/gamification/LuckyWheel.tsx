import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Gift, Lock } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

export default function MandarinLuckyWheel() {
  const { session } = useSession();

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
      <main className="container mx-auto px-4 py-8 max-w-7xl">
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
              Quay để nhận phần thưởng hấp dẫn mỗi ngày
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-yellow-400/10 to-orange-500/10 border-yellow-400">
          <CardContent className="text-center py-20">
            <Gift className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
            <h3 className="text-3xl font-bold mb-3">Sắp ra mắt! 🎁</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vòng Quay May Mắn đang được phát triển. Sớm bạn sẽ có cơ hội quay vòng mỗi ngày để nhận các phần thưởng giá trị!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
