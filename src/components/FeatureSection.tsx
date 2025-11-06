import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Route, Monitor, BarChart2 } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <Card className="relative flex flex-col text-center p-6 h-full border-2 border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden bg-gradient-to-br from-card to-primary/5">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    <CardHeader className="flex flex-col items-center pb-4 relative z-10">
      <div className="mb-4 bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
        {React.cloneElement(icon as React.ReactElement, { className: "w-10 h-10 text-primary transition-all duration-300" })}
      </div>
      <CardTitle className="text-xl md:text-2xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow relative z-10">
      <p className="text-muted-foreground text-base leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <BookOpenText />,
      title: "Học tập đa dạng",
      description: "Nhiều dạng bài tập từ flashcard đến điền từ, giúp bạn ôn luyện toàn diện.",
    },
    {
      icon: <Route />,
      title: "Lộ trình rõ ràng",
      description: "Học theo từng cấp độ HSK, từ cơ bản đến nâng cao, có hệ thống.",
    },
    {
      icon: <Monitor />,
      title: "Giao diện thân thiện",
      description: "Thiết kế hiện đại, dễ sử dụng trên mọi thiết bị, tối ưu trải nghiệm.",
    },
    {
      icon: <BarChart2 />,
      title: "Theo dõi tiến độ",
      description: "Xem lại kết quả học tập, biết được điểm mạnh và điểm cần cải thiện.",
    },
  ];

  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-secondary/50 via-accent/30 to-primary/20 rounded-2xl mb-16 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:25px_25px]" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Tại Sao Chọn TIẾNG TRUNG HAOHAO?
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Chúng tôi mang đến một phương pháp học tiếng Trung hiệu quả và thú vị, giúp bạn đạt được mục tiêu HSK của mình
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureItem {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;