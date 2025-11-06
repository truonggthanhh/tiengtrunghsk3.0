import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Route, Monitor, BarChart2 } from 'lucide-react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <Card className="flex flex-col text-center p-6 h-full border-2 border-gray-200 hover:shadow-lg transition-shadow bg-white">
    <CardHeader className="flex flex-col items-center pb-4">
      <div className="mb-4 bg-red-50 p-4 rounded-xl">
        {React.cloneElement(icon as React.ReactElement, { className: "w-10 h-10 text-primary" })}
      </div>
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
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
    <section className="py-20 mb-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Tại Sao Chọn TIẾNG TRUNG HAOHAO?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Chúng tôi mang đến một phương pháp học tiếng Trung hiệu quả và thú vị
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;