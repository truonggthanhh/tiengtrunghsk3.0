import React, { useState } from "react";
import Header from "@/components/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckSquare, Shuffle, FileQuestion, Mic, Puzzle, ArrowRight, ChevronRight } from "lucide-react";

const exerciseTypes = [
  {
    title: "Flashcard",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ",
    icon: <BookOpen />,
  },
  {
    title: "Điền từ",
    description: "Điền từ còn thiếu vào chỗ trống",
    icon: <FileQuestion />,
  },
  {
    title: "Trắc nghiệm",
    description: "Chọn đáp án đúng cho câu hỏi",
    icon: <CheckSquare />,
  },
  {
    title: "Sắp xếp câu",
    description: "Sắp xếp các từ thành câu hoàn chỉnh",
    icon: <Shuffle />,
  },
  {
    title: "Chọn phiên âm",
    description: "Chọn pinyin đúng cho chữ Hán",
    icon: <Mic />,
  },
  {
    title: "Chọn nghĩa",
    description: "Chọn nghĩa đúng cho từ vựng",
    icon: <Puzzle />,
  },
];

const Index = () => {
  const [level, setLevel] = useState("1");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        <section className="text-center py-16 md:py-20 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
            Chinh Phục Tiếng Trung Cùng HSK Master
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Nền tảng ôn luyện HSK toàn diện, giúp bạn tự tin vượt qua kỳ thi với điểm số cao nhất.
          </p>
          <Button size="lg">
            Bắt đầu học ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </section>

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Chọn Trình Độ Của Bạn</h2>
            <p className="text-muted-foreground mt-2">Bắt đầu hành trình của bạn bằng cách chọn cấp độ HSK phù hợp.</p>
          </div>
          <Tabs defaultValue="1" onValueChange={setLevel} className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-14 p-2">
              <TabsTrigger value="1" className="text-base">HSK 1</TabsTrigger>
              <TabsTrigger value="2" className="text-base">HSK 2</TabsTrigger>
              <TabsTrigger value="3" className="text-base">HSK 3</TabsTrigger>
              <TabsTrigger value="4" className="text-base">HSK 4</TabsTrigger>
              <TabsTrigger value="5" className="text-base">HSK 5</TabsTrigger>
              <TabsTrigger value="6" className="text-base">HSK 6</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Các Dạng Bài Tập cho HSK {level}
            </h2>
            <p className="text-muted-foreground mt-2">Luyện tập đa dạng để nắm vững kiến thức.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {exerciseTypes.map((exercise) => (
              <Card key={exercise.title} className="flex flex-col text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
                <CardHeader className="items-center flex-grow">
                  <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                    {React.cloneElement(exercise.icon, { className: "w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" })}
                  </div>
                  <CardTitle className="text-xl">{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-primary">
                    Luyện tập
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;