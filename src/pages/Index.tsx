import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import HeroIllustration from "@/components/HeroIllustration";

const exerciseTypes = [
  {
    slug: "flashcard",
    title: "Flashcard",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ",
    icon: <BookOpen />,
    isAvailable: true,
  },
  {
    slug: "fill-in-the-blank",
    title: "Điền từ",
    description: "Điền từ còn thiếu vào chỗ trống",
    icon: <FileQuestion />,
    isAvailable: true,
  },
  {
    slug: "multiple-choice",
    title: "Trắc nghiệm",
    description: "Chọn đáp án đúng cho câu hỏi",
    icon: <CheckSquare />,
    isAvailable: false,
  },
  {
    slug: "sentence-scramble",
    title: "Sắp xếp câu",
    description: "Sắp xếp các từ thành câu hoàn chỉnh",
    icon: <Shuffle />,
    isAvailable: false,
  },
  {
    slug: "pinyin-choice",
    title: "Chọn phiên âm",
    description: "Chọn pinyin đúng cho chữ Hán",
    icon: <Mic />,
    isAvailable: true,
  },
  {
    slug: "meaning-choice",
    title: "Chọn nghĩa",
    description: "Chọn nghĩa đúng cho từ vựng",
    icon: <Puzzle />,
    isAvailable: true,
  },
];

const Index = () => {
  const [level, setLevel] = useState("1");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        <section className="py-16 md:py-20 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
                Chinh Phục Tiếng Trung Cùng TIẾNG TRUNG HAOHAO
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-muted-foreground mb-8">
                Nền tảng ôn luyện HSK toàn diện, giúp bạn tự tin vượt qua kỳ thi với điểm số cao nhất.
              </p>
              <Button size="lg" asChild>
                <Link to={`/hsk/${level}/flashcard`}>
                  Bắt đầu học ngay <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
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
              <div key={exercise.slug} className={!exercise.isAvailable ? 'opacity-50' : ''}>
                <Link to={exercise.isAvailable ? `/hsk/${level}/${exercise.slug}` : '#'} className={!exercise.isAvailable ? 'pointer-events-none' : ''}>
                  <Card className="flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer">
                    <CardHeader className="items-center flex-grow">
                      <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                        {React.cloneElement(exercise.icon, { className: "w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" })}
                      </div>
                      <CardTitle className="text-xl">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-primary" disabled={!exercise.isAvailable}>
                        {exercise.isAvailable ? 'Luyện tập' : 'Sắp ra mắt'}
                        {exercise.isAvailable && <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;