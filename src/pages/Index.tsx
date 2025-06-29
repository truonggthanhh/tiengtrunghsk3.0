import { useState } from "react";
import Header from "@/components/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckSquare, Shuffle, FileQuestion, Mic, Puzzle } from "lucide-react";

const exerciseTypes = [
  {
    title: "Flashcard",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ",
    icon: <BookOpen className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    title: "Điền từ",
    description: "Điền từ còn thiếu vào chỗ trống",
    icon: <FileQuestion className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    title: "Trắc nghiệm",
    description: "Chọn đáp án đúng cho câu hỏi",
    icon: <CheckSquare className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    title: "Sắp xếp câu",
    description: "Sắp xếp các từ thành câu hoàn chỉnh",
    icon: <Shuffle className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    title: "Chọn phiên âm",
    description: "Chọn pinyin đúng cho chữ Hán",
    icon: <Mic className="w-8 h-8 mb-2 text-primary" />,
  },
  {
    title: "Chọn nghĩa",
    description: "Chọn nghĩa đúng cho từ vựng",
    icon: <Puzzle className="w-8 h-8 mb-2 text-primary" />,
  },
];

const Index = () => {
  const [level, setLevel] = useState("1");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Chọn trình độ HSK
          </h2>
          <Tabs defaultValue="1" onValueChange={setLevel} className="w-full max-w-2xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="1">HSK 1</TabsTrigger>
              <TabsTrigger value="2">HSK 2</TabsTrigger>
              <TabsTrigger value="3">HSK 3</TabsTrigger>
              <TabsTrigger value="4">HSK 4</TabsTrigger>
              <TabsTrigger value="5">HSK 5</TabsTrigger>
              <TabsTrigger value="6">HSK 6</TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <section>
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
            Chọn dạng bài tập cho HSK {level}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exerciseTypes.map((exercise) => (
              <Card key={exercise.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="items-center text-center">
                  {exercise.icon}
                  <CardTitle>{exercise.title}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
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