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
        <Card className="text-center p-8 md:p-12 bg-gradient-to-br from-primary/20 to-tertiary/20 border-primary/20 shadow-lg">
          <CardHeader className="pb-6">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Sẵn Sàng Chinh Phục HSK?
            </CardTitle>
            <CardDescription className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Bắt đầu hành trình học tiếng Trung của bạn ngay hôm nay với các bài tập được thiết kế chuyên biệt, giúp bạn đạt được mục tiêu HSK một cách hiệu quả nhất.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="mt-4" onClick={onStartClick}>
              Bắt đầu học ngay
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CallToActionSection;