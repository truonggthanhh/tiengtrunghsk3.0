import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Lock } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';

export default function MandarinCardCollection() {
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
                Vui lòng đăng nhập để xem bộ sưu tập thẻ
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
              <Sparkles className="w-8 h-8 text-purple-500" />
              Sưu Tập Thẻ
            </h1>
            <p className="text-muted-foreground mt-1">
              Thu thập và mở khóa các thẻ từ vựng độc đáo
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-300">
          <CardContent className="text-center py-20">
            <Sparkles className="w-20 h-20 text-purple-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-bold mb-3">Sắp ra mắt! ✨</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tính năng Sưu Tập Thẻ đang được phát triển. Bạn sẽ sớm có thể thu thập các thẻ từ vựng đẹp mắt và học một cách thú vị hơn!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
