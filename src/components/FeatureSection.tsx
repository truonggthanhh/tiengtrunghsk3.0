import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Route, Monitor, BarChart2 } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <Card className="flex flex-col items-center text-center p-6 h-full">
    <CardHeader className="pb-4">
      <div className="mb-4 bg-primary/10 p-4 rounded-full">
        {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8 text-primary" })}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground">{description}</p>
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
    <section className="py-16 md:py-20 bg-gradient-to-br from-secondary/50 to-accent/50 rounded-lg mb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Tại Sao Chọn TIẾNG TRUNG HAOHAO?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Chúng tôi mang đến một phương pháp học tiếng Trung hiệu quả và thú vị, giúp bạn đạt được mục tiêu HSK của mình.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;