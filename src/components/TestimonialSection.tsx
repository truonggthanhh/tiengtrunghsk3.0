import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialItemProps {
  quote: string;
  author: string;
  title: string;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({ quote, author, title }) => (
  <Card className="flex flex-col p-6 h-full">
    <CardHeader className="pb-4">
      <Quote className="w-8 h-8 text-primary mb-3" />
      <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
      <CardDescription className="text-muted-foreground italic">"{quote}"</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex items-end">
      <p className="font-medium text-primary">- {author}</p>
    </CardContent>
  </Card>
);

const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Ứng dụng này thực sự tuyệt vời! Flashcard giúp tôi nhớ từ vựng nhanh hơn, và các bài tập điền từ rất hữu ích để củng cố kiến thức.",
      author: "Nguyễn Thị Lan Anh",
      title: "Học HSK 3 dễ dàng hơn bao giờ hết!",
    },
    {
      quote: "Giao diện thân thiện, dễ sử dụng và lộ trình học rõ ràng theo từng cấp độ HSK. Tôi đã cải thiện đáng kể khả năng tiếng Trung của mình.",
      author: "Trần Văn Hùng",
      title: "Tiến bộ rõ rệt sau 2 tháng!",
    },
    {
      quote: "Tôi rất thích các dạng bài tập đa dạng, đặc biệt là phần chọn nghĩa và điền từ vào câu. Nó giúp tôi hiểu sâu hơn về cách dùng từ.",
      author: "Lê Minh Thư",
      title: "Bài tập phong phú, hiệu quả!",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-background to-secondary/30 rounded-lg mb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Học Viên Nói Gì Về Chúng Tôi?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Những câu chuyện thành công từ cộng đồng học viên của TIẾNG TRUNG HAOHAO.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialItem key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;