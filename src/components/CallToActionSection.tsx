import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface CallToActionSectionProps {
  onStartClick: () => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onStartClick }) => {
  return (
    <section className="py-20 mb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative text-center p-12 md:p-20 bg-primary text-white rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Sẵn Sàng Chinh Phục HSK?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Bắt đầu hành trình học tiếng Trung của bạn ngay hôm nay với các bài tập được thiết kế chuyên biệt
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-50 font-bold text-lg px-10 py-7 rounded-full shadow-xl"
                onClick={onStartClick}
              >
                Bắt đầu học ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;