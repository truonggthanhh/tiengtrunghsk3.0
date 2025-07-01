import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Home, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MsutongPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">Giáo trình Msutong</CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                    Tính năng đang được xây dựng!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-8">
                    Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn các bài ôn tập theo từng bài học của các giáo trình phổ biến. Vui lòng quay lại sau nhé!
                </p>
                <Button asChild>
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

export default MsutongPage;