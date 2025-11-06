import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface TestimonialItemProps {
  quote: string;
  author: string;
  title: string;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({ quote, author, title }) => (
  <Card className="relative flex flex-col p-6 h-full border-2 border-primary/20 hover:border-accent/50 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden bg-gradient-to-br from-card to-accent/5">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    <CardHeader className="pb-4 relative z-10">
      <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-3 rounded-full w-fit transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 mb-3">
        <Quote className="w-8 h-8 text-accent transition-all duration-300" />
      </div>
      <CardTitle className="text-lg md:text-xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
        {title}
      </CardTitle>
      <CardDescription className="text-muted-foreground italic text-base leading-relaxed">
        "{quote}"
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex items-end relative z-10">
      <p className="font-bold text-accent group-hover:text-primary transition-colors">— {author}</p>
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
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-background via-secondary/20 to-accent/10 rounded-2xl mb-16 shadow-xl overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5 bg-[size:25px_25px]" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Học Viên Nói Gì Về Chúng Tôi?
          </h2>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Những câu chuyện thành công từ cộng đồng học viên của TIẾNG TRUNG HAOHAO
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TestimonialItem {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;