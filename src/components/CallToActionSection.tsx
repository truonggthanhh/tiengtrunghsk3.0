import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface CallToActionSectionProps {
  onStartClick: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onStartClick }) => {
  return (
    <section className="py-16 md:py-20 mb-16">
      <div className="container mx-auto px-4 md:px-8">
        <Card className="relative text-center p-8 md:p-16 bg-gradient-to-br from-primary via-accent to-tertiary border-2 border-primary/30 shadow-2xl overflow-hidden group">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>

          <CardHeader className="pb-6 relative z-10 animate-in fade-in slide-in-from-top duration-700">
            <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-6 backdrop-blur-sm border border-white/30 shadow-lg animate-bounce">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-lg">
              Sẵn Sàng Chinh Phục HSK?
            </CardTitle>
            <CardDescription className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md">
              Bắt đầu hành trình học tiếng Trung của bạn ngay hôm nay với các bài tập được thiết kế chuyên biệt, giúp bạn đạt được mục tiêu HSK một cách hiệu quả nhất
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 animate-in fade-in slide-in-from-bottom duration-700">
            <Button
              size="lg"
              className="mt-4 bg-white text-primary hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-2xl font-bold text-lg px-10 py-7"
              onClick={onStartClick}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Bắt đầu học ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CallToActionSection;