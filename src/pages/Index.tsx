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
        
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 mb-16 bg-gradient-to-br from-primary via-primary to-accent rounded-2xl shadow-2xl text-white overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 md:px-8">
            <div className="text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-flex items-center rounded-full bg-white/20 px-5 py-2 text-sm font-medium backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
                <Bot className="h-5 w-5 mr-2 text-white animate-bounce" />
                <span>Đặc biệt: Luyện nói với Trợ lý ảo thông minh</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-100 drop-shadow-lg">
                  Chinh Phục
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-yellow-200 drop-shadow-lg animate-in slide-in-from-right duration-1000">
                  Tiếng Trung
                </span>
                <span className="block text-white/95 drop-shadow-lg">
                  Cùng HAOHAO
                </span>
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md">
                Nền tảng ôn luyện HSK toàn diện với AI, giúp bạn tự tin vượt qua kỳ thi với điểm số cao nhất.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={handleStartLearningClick}
                  className="bg-white text-primary hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-2xl font-bold text-lg px-8 py-6 group"
                >
                  Bắt đầu học ngay
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            <div className="hidden lg:block animate-in fade-in slide-in-from-right duration-1000">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <HeroIllustration />
              </div>
            </div>
          </div>
        </section>

        {/* Dictionary Search Section */}
        <section className="py-16 md:py-20 mb-16">
          <DictionarySearch />
        </section>

        {/* Topic Selection Section */}
        <section ref={topicSectionRef} className="relative py-16 md:py-20 text-center scroll-mt-20 bg-gradient-to-br from-secondary/50 to-tertiary/20 rounded-2xl mb-16 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
          <div className="relative z-10 px-4">
            <div className="mb-12 animate-in fade-in slide-in-from-top duration-500">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Chọn Lộ Trình Học Của Bạn
              </h2>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                Bắt đầu với lộ trình HSK 3.0 tiêu chuẩn hoặc ôn tập theo các giáo trình phổ biến
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card
                className="relative flex flex-col text-center h-full hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-out group cursor-pointer border-2 border-primary/30 hover:border-primary rounded-2xl overflow-hidden bg-gradient-to-br from-card to-primary/5 animate-in fade-in slide-in-from-left duration-700"
                onClick={handleSelectHsk}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <CardHeader className="items-center flex-grow relative z-10">
                  <div className="mb-6 bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                    <GraduationCap className="w-12 h-12 text-primary transition-all duration-300 group-hover:text-accent" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold mb-3">Luyện thi HSK 3.0</CardTitle>
                  <CardDescription className="mt-2 text-base md:text-lg leading-relaxed">
                    Luyện tập theo cấu trúc HSK 3.0 mới nhất, bao gồm 6 cấp độ từ cơ bản đến nâng cao, giúp bạn chinh phục kỳ thi một cách toàn diện.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="w-full text-primary text-lg font-bold flex items-center justify-center group-hover:text-accent transition-colors">
                    Chọn lộ trình này
                    <ChevronRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
                  </div>
                </CardFooter>
              </Card>

              <Link to="/msutong">
                <Card className="relative flex flex-col text-center h-full hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-out group cursor-pointer border-2 border-primary/30 hover:border-accent rounded-2xl overflow-hidden bg-gradient-to-br from-card to-accent/5 animate-in fade-in slide-in-from-right duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <CardHeader className="items-center flex-grow relative z-10">
                    <div className="mb-6 bg-gradient-to-br from-accent/20 to-accent/10 p-6 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                      <BookCopy className="w-12 h-12 text-accent transition-all duration-300 group-hover:text-primary" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold mb-3">Giáo trình Msutong</CardTitle>
                    <CardDescription className="mt-2 text-base md:text-lg leading-relaxed">
                      Ôn tập từ vựng và ngữ pháp theo từng bài học trong các bộ giáo trình phổ biến như Boya, Hán Ngữ...
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="w-full text-accent text-lg font-bold flex items-center justify-center group-hover:text-primary transition-colors">
                      Khám phá ngay
                      <ChevronRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
                    </div>
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
            <section className="mb-16 bg-gradient-to-br from-background via-secondary/20 to-primary/10 rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px]" />
              <div className="relative z-10">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-500">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
                    Các Dạng Bài Tập cho HSK {level}
                  </h2>
                  <p className="text-muted-foreground text-lg mt-2">Luyện tập đa dạng để nắm vững kiến thức</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {exerciseTypes.map((exercise, index) => (
                    <div
                      key={exercise.slug}
                      className={cn(!exercise.isAvailable && 'opacity-50', 'animate-in fade-in slide-in-from-bottom-4 duration-500')}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Link to={exercise.isAvailable ? `/hsk/${level}/${exercise.slug}` : '#'} className={!exercise.isAvailable ? 'pointer-events-none' : ''}>
                        <Card className={cn(
                          "relative flex flex-col text-center h-full hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 ease-out group cursor-pointer border-2 rounded-2xl overflow-hidden bg-gradient-to-br from-card to-primary/5",
                          exercise.isAvailable ? "border-primary/30 hover:border-primary" : "border-muted/30"
                        )}>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <CardHeader className="items-center flex-grow relative z-10 p-6">
                            <div className="mb-4 bg-gradient-to-br from-primary/20 to-primary/10 p-5 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                              {React.cloneElement(exercise.icon, { className: "w-10 h-10 text-primary transition-all duration-300" })}
                            </div>
                            <CardTitle className="text-xl md:text-2xl font-bold mb-2">{exercise.title}</CardTitle>
                            <CardDescription className="text-base leading-relaxed">{exercise.description}</CardDescription>
                          </CardHeader>
                          <CardFooter className="relative z-10">
                            <Button
                              variant="secondary"
                              className="w-full font-bold text-base py-5 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                              disabled={!exercise.isAvailable}
                            >
                              {exercise.isAvailable ? 'Luyện tập' : 'Sắp ra mắt'}
                              {exercise.isAvailable && <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />}
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
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