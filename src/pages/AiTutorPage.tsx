import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, Bot, Wand2 } from 'lucide-react';

const AiTutorPage = () => {
  const { level } = useParams<{ level: string }>();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex justify-center items-center gap-4 mb-4">
              <Bot className="w-12 h-12 text-primary" />
              <Wand2 className="w-8 h-8 text-primary/70" />
            </div>
            <CardTitle className="text-3xl font-bold">Luyện nói cùng Trợ lý ảo</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Tính năng đang được phát triển
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Đây sẽ là nơi bạn có thể luyện nói trực tiếp với một trợ lý ảo thông minh. Trợ lý sẽ trò chuyện với bạn bằng tiếng Trung theo đúng trình độ HSK {level} bạn đã chọn.
            </p>
            <p className="text-muted-foreground">
              Khi bạn nói sai ngữ pháp, dùng từ chưa chuẩn hoặc phát âm chưa chính xác, trợ lý sẽ ngay lập tức phân tích, giải thích lỗi sai và gợi ý cho bạn cách nói đúng.
            </p>
            <p className="font-semibold text-primary mt-6">
              Hãy chờ đón tính năng đột phá này trong thời gian sớm nhất nhé!
            </p>
            <Button asChild variant="secondary" className="mt-6">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" /> Quay lại trang chủ
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AiTutorPage;