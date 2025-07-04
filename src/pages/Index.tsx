import React, { useState, useRef } from "react";
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
import { BookOpen, CheckSquare, Shuffle, FileQuestion, Mic, Puzzle, ArrowRight, ChevronRight, AudioLines, Bot, GraduationCap, BookCopy, PenTool } from "lucide-react";
import HeroIllustration from "@/components/HeroIllustration";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSection from "@/components/TestimonialSection";
import CallToActionSection from "@/components/CallToActionSection";
import { cn } from "@/lib/utils";

const exerciseTypes = [
  {
    slug: "flashcard",
    title: "Flashcard",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ",
    icon: <BookOpen />,
    isAvailable: true,
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
  {
    slug: "fill-in-the-blank",
    title: "Điền từ",
    description: "Điền chữ Hán dựa vào pinyin và nghĩa",
    icon: <FileQuestion />,
    isAvailable: true,
  },
  {
    slug: "sentence-choice",
    title: "Điền từ vào câu",
    description: "Chọn từ đúng để hoàn thành câu",
    icon: <CheckSquare />,
    isAvailable: true,
  },
  {
    slug: "sentence-scramble",
    title: "Sắp xếp câu",
    description: "Sắp xếp các từ thành câu hoàn chỉnh",
    icon: <Shuffle />,
    isAvailable: true,
  },
  {
    slug: "pronunciation",
    title: "Luyện phát âm",
    description: "Luyện phát âm qua nhận dạng giọng nói",
    icon: <AudioLines />,
    isAvailable: true,
  },
  {
    slug: "handwriting-practice",
    title: "Luyện viết chữ Hán",
    description: "Xem thứ tự nét và luyện viết chữ Hán",
    icon: <PenTool />,
    isAvailable: true,
  },
  {
    slug: "ai-tutor",
    title: "Luyện nói cùng Trợ lý ảo",
    description: "Trò chuyện và nhận phản hồi từ AI",
    icon: <Bot />,
    isAvailable: true,
  },
];

const Index = () => {
  const [selectedTopic, setSelectedTopic] = useState<"hsk" | null>(null);
  const [level, setLevel] = useState("1");
  
  const topicSectionRef = useRef<HTMLElement>(null);
  const levelSectionRef = useRef<HTMLElement>(null);

  const handleStartLearningClick = () => {
    topicSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSelectHsk = () => {
    setSelectedTopic('hsk');
    setTimeout(() => {
      levelSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        
        {/* Hero Section */}
        <section className="py-16 md:py-20 mb-16 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium mb-4 backdrop-blur-sm">
                  <Bot className="h-4 w-4 mr-2 text-white" />
                  <span>Đặc biệt: Luyện nói với Trợ lý ảo thông minh</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200 font-sans">
                Chinh Phục Tiếng Trung Cùng TIẾNG TRUNG HAOHAO
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-white/90 mb-8">
                Nền tảng ôn luyện HSK toàn diện, giúp bạn tự tin vượt qua kỳ thi với điểm số cao nhất.
              </p>
              <Button size="lg" onClick={handleStartLearningClick} className="bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-all duration-300 ease-in-out shadow-lg font-bold">
                Bắt đầu học ngay <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* Topic Selection Section */}
        <section ref={topicSectionRef} className="py-16 md:py-20 text-center scroll-mt-20 bg-gradient-to-br from-secondary/50 to-tertiary/20 rounded-xl mb-16 shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Chọn Lộ Trình Học Của Bạn
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Bắt đầu với lộ trình HSK 3.0 tiêu chuẩn hoặc ôn tập theo các giáo trình phổ biến.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer border-primary/30 hover:border-primary rounded-xl" onClick={handleSelectHsk}>
              <CardHeader className="items-center flex-grow">
                <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                  <GraduationCap className="w-10 h-10 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Luyện thi HSK 3.0</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Luyện tập theo cấu trúc HSK 3.0 mới nhất, bao gồm 6 cấp độ từ cơ bản đến nâng cao, giúp bạn chinh phục kỳ thi một cách toàn diện.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="w-full text-primary text-lg font-bold flex items-center justify-center">
                  Chọn lộ trình này <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </CardFooter>
            </Card>

            <Link to="/msutong">
              <Card className="flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer border-primary/30 hover:border-primary rounded-xl">
                <CardHeader className="items-center flex-grow">
                  <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                    <BookCopy className="w-10 h-10 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Giáo trình Msutong</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    Ôn tập từ vựng và ngữ pháp theo từng bài học trong các bộ giáo trình phổ biến như Boya, Hán Ngữ...
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="w-full text-primary text-lg font-bold flex items-center justify-center">
                    Khám phá ngay <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>

        {selectedTopic === 'hsk' && (
          <>
            {/* Feature Section */}
            <FeatureSection />

            {/* HSK Level Selection */}
            <section ref={levelSectionRef} className="mb-16 scroll-mt-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl shadow-md p-8">
              <div className="w-full max-w-4xl mx-auto bg-card border p-6 md:p-10 rounded-2xl shadow-sm">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight">Chọn Trình Độ Của Bạn</h2>
                  <p className="text-muted-foreground mt-2">Bắt đầu hành trình của bạn bằng cách chọn cấp độ HSK phù hợp.</p>
                </div>
                <Tabs defaultValue="1" onValueChange={setLevel} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger value="1" className="text-base h-12 transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">HSK 1</TabsTrigger>
                    <TabsTrigger value="2" className="text-base h-12 transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">HSK 2</TabsTrigger>
                    <TabsTrigger value="3" className="text-base h-12 transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">HSK 3</TabsTrigger>
                    <TabsTrigger value="4" className="text-base h-12 transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">HSK 4</TabsTrigger>
                    <TabsTrigger value="5" className="text-base h-12 transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">HSK 5</TabsTrigger>
                    <TabsTrigger value="6" className="text-base h-12 transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">HSK 6</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </section>

            {/* Exercise Types Section */}
            <section className="mb-16 bg-gradient-to-br from-background to-secondary/30 rounded-xl shadow-md p-8">
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
                      <Card className={cn("flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer border-primary/30 hover:border-primary rounded-xl", !exercise.isAvailable && "opacity-50")}>
                        <CardHeader className="items-center flex-grow">
                          <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                            {React.cloneElement(exercise.icon, { className: "w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" })}
                          </div>
                          <CardTitle className="text-xl">{exercise.title}</CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button variant="secondary" className="w-full font-bold" disabled={!exercise.isAvailable}>
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

            {/* Testimonial Section */}
            <TestimonialSection />

            {/* Call To Action Section */}
            <CallToActionSection onStartClick={() => levelSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
          </>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;