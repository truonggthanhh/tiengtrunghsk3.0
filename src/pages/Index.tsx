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
import DictionarySearch from "@/components/DictionarySearch"; // Import the new component
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
        
        {/* Hero Section - Clean Professional Style */}
        <section className="relative py-20 md:py-32 mb-20 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium backdrop-blur-sm border border-white/20">
                <Bot className="h-4 w-4 mr-2" />
                <span>Học tiếng Trung với công nghệ AI hiện đại</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Nền Tảng Học Tiếng Trung<br />
                và Luyện Thi HSK
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Phương pháp học hiệu quả, lộ trình rõ ràng, giúp bạn chinh phục HSK một cách tự tin
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleStartLearningClick}
                  className="bg-white text-primary hover:bg-gray-50 font-bold text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all"
                >
                  Bắt đầu học ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-20 -mt-10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">6</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">Cấp độ HSK</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5000+</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">Từ vựng</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">9</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">Dạng bài tập</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">Miễn phí</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dictionary Search Section */}
        <section className="py-16 md:py-20 mb-16">
          <DictionarySearch />
        </section>

        {/* Topic Selection Section - Clean Design */}
        <section ref={topicSectionRef} className="py-20 text-center scroll-mt-20 mb-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Chọn Lộ Trình Học Của Bạn
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Bắt đầu với lộ trình HSK 3.0 tiêu chuẩn hoặc ôn tập theo các giáo trình phổ biến
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="flex flex-col text-center h-full hover:shadow-xl transition-shadow cursor-pointer border-2 border-gray-200 hover:border-primary bg-white p-8"
                onClick={handleSelectHsk}
              >
                <CardHeader className="items-center flex-grow space-y-4 pb-6">
                  <div className="bg-red-50 p-6 rounded-2xl">
                    <GraduationCap className="w-16 h-16 text-primary" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold">Luyện thi HSK 3.0</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Luyện tập theo cấu trúc HSK 3.0 mới nhất, bao gồm 6 cấp độ từ cơ bản đến nâng cao
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-12">
                    Chọn lộ trình này
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>

              <Link to="/msutong" className="block">
                <Card className="flex flex-col text-center h-full hover:shadow-xl transition-shadow cursor-pointer border-2 border-gray-200 hover:border-accent bg-white p-8">
                  <CardHeader className="items-center flex-grow space-y-4 pb-6">
                    <div className="bg-cyan-50 p-6 rounded-2xl">
                      <BookCopy className="w-16 h-16 text-accent" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold">Giáo trình Msutong</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Ôn tập từ vựng và ngữ pháp theo từng bài học trong các bộ giáo trình phổ biến
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-4">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl h-12">
                      Khám phá ngay
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {selectedTopic === 'hsk' && (
          <>
            {/* Feature Section */}
            <FeatureSection />

            {/* HSK Level Selection - Clean Tabs */}
            <section ref={levelSectionRef} className="mb-20 scroll-mt-20">
              <div className="w-full max-w-5xl mx-auto bg-white border-2 border-gray-200 p-8 md:p-10 rounded-2xl shadow-lg">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Chọn Trình Độ Của Bạn</h2>
                  <p className="text-muted-foreground mt-3 text-base">Bắt đầu hành trình của bạn bằng cách chọn cấp độ HSK phù hợp</p>
                </div>
                <Tabs defaultValue="1" onValueChange={setLevel} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-3 bg-gray-100 p-2 rounded-xl">
                    <TabsTrigger value="1" className="text-base h-11 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-semibold">HSK 1</TabsTrigger>
                    <TabsTrigger value="2" className="text-base h-11 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-semibold">HSK 2</TabsTrigger>
                    <TabsTrigger value="3" className="text-base h-11 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-semibold">HSK 3</TabsTrigger>
                    <TabsTrigger value="4" className="text-base h-11 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-semibold">HSK 4</TabsTrigger>
                    <TabsTrigger value="5" className="text-base h-11 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-semibold">HSK 5</TabsTrigger>
                    <TabsTrigger value="6" className="text-base h-11 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-semibold">HSK 6</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </section>

            {/* Exercise Types Section - Clean Grid */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                  Các Dạng Bài Tập cho HSK {level}
                </h2>
                <p className="text-muted-foreground text-lg">Luyện tập đa dạng để nắm vững kiến thức</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {exerciseTypes.map((exercise) => (
                  <Link
                    key={exercise.slug}
                    to={exercise.isAvailable ? `/hsk/${level}/${exercise.slug}` : '#'}
                    className={!exercise.isAvailable ? 'pointer-events-none' : ''}
                  >
                    <Card className={cn(
                      "flex flex-col text-center h-full hover:shadow-xl transition-shadow cursor-pointer border-2 bg-white p-6",
                      exercise.isAvailable ? "border-gray-200 hover:border-primary" : "border-gray-200 opacity-60"
                    )}>
                      <CardHeader className="items-center flex-grow space-y-4 pb-4">
                        <div className="bg-red-50 p-4 rounded-xl">
                          {React.cloneElement(exercise.icon, { className: "w-10 h-10 text-primary" })}
                        </div>
                        <CardTitle className="text-xl font-bold">{exercise.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{exercise.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-4">
                        <Button
                          variant={exercise.isAvailable ? "default" : "secondary"}
                          className={cn(
                            "w-full font-semibold rounded-xl h-11",
                            exercise.isAvailable && "bg-primary hover:bg-primary/90"
                          )}
                          disabled={!exercise.isAvailable}
                        >
                          {exercise.isAvailable ? 'Bắt đầu luyện tập' : 'Sắp ra mắt'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
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