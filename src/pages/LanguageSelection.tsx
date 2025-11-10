import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Languages, BookOpen, GraduationCap } from 'lucide-react';

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Languages className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Chào mừng đến với nền tảng học tiếng Trung
          </h1>
          <p className="text-xl text-muted-foreground">
            Chọn ngôn ngữ bạn muốn học
          </p>
        </div>

        {/* Language Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mandarin Card */}
          <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-primary"
            onClick={() => navigate('/mandarin')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 transition-all">
                  <GraduationCap className="h-16 w-16 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Tiếng Trung Phổ Thông</CardTitle>
              <CardDescription className="text-lg mt-2">普通话 • Mandarin Chinese</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Học tiếng Trung chuẩn Bắc Kinh với các cấp độ HSK và giáo trình Msutong
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>6 cấp độ HSK (Hán Ngữ Thủy Bình Khảo Thí)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Giáo trình Msutong (4 quyển sơ cấp)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Luyện viết chữ Hán, phát âm, ngữ pháp</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>AI Tutor hỗ trợ học tập cá nhân hóa</span>
                </li>
              </ul>
              <Button
                className="w-full mt-6 text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                Bắt đầu học Tiếng Trung
              </Button>
            </CardContent>
          </Card>

          {/* Cantonese Card */}
          <Card
            className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 hover:border-secondary"
            onClick={() => navigate('/cantonese')}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 group-hover:from-orange-600 group-hover:to-red-700 transition-all">
                  <BookOpen className="h-16 w-16 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Tiếng Quảng Đông</CardTitle>
              <CardDescription className="text-lg mt-2">粵語 • Cantonese</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Học tiếng Quảng Đông với các bài học cấu trúc và bài hát Cantopop
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Bài học từ cơ bản đến nâng cao</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Học qua bài hát Cantopop phổ biến</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Luyện tập phát âm Jyutping</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Flashcard và bài tập đa dạng</span>
                </li>
              </ul>
              <Button
                className="w-full mt-6 text-lg py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                size="lg"
              >
                Bắt đầu học Tiếng Quảng Đông
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>Cả hai ngôn ngữ đều sử dụng chữ Hán nhưng có phát âm và ngữ pháp khác nhau</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
