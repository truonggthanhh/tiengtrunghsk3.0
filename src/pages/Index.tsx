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
import { BookOpen, CheckSquare, Shuffle, FileQuestion, Mic, Puzzle, ArrowRight, ChevronRight, AudioLines, Bot, GraduationCap, BookCopy, PenTool, Music, Gamepad2, Zap, Trophy, Heart, BarChart3, Sparkles, Globe } from "lucide-react";
import HeroIllustration from "@/components/HeroIllustration";
import FeatureSection from "@/components/FeatureSection";
import TestimonialSection from "@/components/TestimonialSection";
import CallToActionSection from "@/components/CallToActionSection";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/SessionContextProvider";
import GamificationDashboard from "@/components/gamification/GamificationDashboard";

const exerciseTypes = [
  {
    slug: "flashcard",
    title: "Flashcard",
    description: "Ôn tập từ vựng qua thẻ ghi nhớ",
    icon: <BookOpen />,
    isAvailable: true,
    gradient: "bg-gradient-colorful",
    shadowColor: "shadow-purple",
  },
  {
    slug: "pinyin-choice",
    title: "Chọn phiên âm",
    description: "Chọn pinyin đúng cho chữ Hán",
    icon: <Mic />,
    isAvailable: true,
    gradient: "bg-gradient-sunset",
    shadowColor: "shadow-pink",
  },
  {
    slug: "meaning-choice",
    title: "Chọn nghĩa",
    description: "Chọn nghĩa đúng cho từ vựng",
    icon: <Puzzle />,
    isAvailable: true,
    gradient: "bg-gradient-spring",
    shadowColor: "shadow-cyan",
  },
  {
    slug: "fill-in-the-blank",
    title: "Điền từ",
    description: "Điền chữ Hán dựa vào pinyin và nghĩa",
    icon: <FileQuestion />,
    isAvailable: true,
    gradient: "bg-gradient-fire",
    shadowColor: "shadow-orange",
  },
  {
    slug: "sentence-choice",
    title: "Điền từ vào câu",
    description: "Chọn từ đúng để hoàn thành câu",
    icon: <CheckSquare />,
    isAvailable: true,
    gradient: "bg-gradient-ocean",
    shadowColor: "shadow-cyan",
  },
  {
    slug: "sentence-scramble",
    title: "Sắp xếp câu",
    description: "Sắp xếp các từ thành câu hoàn chỉnh",
    icon: <Shuffle />,
    isAvailable: true,
    gradient: "bg-gradient-vivid",
    shadowColor: "shadow-pink",
  },
  {
    slug: "pronunciation",
    title: "Luyện phát âm",
    description: "Luyện phát âm qua nhận dạng giọng nói",
    icon: <AudioLines />,
    isAvailable: true,
    gradient: "bg-gradient-tropical",
    shadowColor: "shadow-purple",
  },
  {
    slug: "enhanced-pronunciation",
    title: "Luyện phát âm với AI",
    description: "Phát âm với SRS và chấm điểm tự động",
    icon: <Sparkles />,
    isAvailable: true,
    gradient: "bg-gradient-sunset",
    shadowColor: "shadow-pink",
  },
  {
    slug: "handwriting-practice",
    title: "Luyện viết chữ Hán",
    description: "Xem thứ tự nét và luyện viết chữ Hán",
    icon: <PenTool />,
    isAvailable: true,
    gradient: "bg-gradient-colorful",
    shadowColor: "shadow-purple",
  },
  {
    slug: "ai-tutor",
    title: "Luyện nói cùng Trợ lý ảo",
    description: "Trò chuyện và nhận phản hồi từ AI",
    icon: <Bot />,
    isAvailable: true,
    gradient: "bg-gradient-sunset",
    shadowColor: "shadow-orange",
  },
];

const Index = () => {
  const { session } = useSession();
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
        {/* Back to Main Language Selection */}
        <div className="mb-6">
          <Button asChild variant="outline" className="font-bold">
            <Link to="/">
              <Globe className="mr-2 h-4 w-4" /> Chọn ngôn ngữ khác
            </Link>
          </Button>
        </div>

        {/* Hero Section - Colorful Animated Gradient */}
        <section className="relative py-20 md:py-32 mb-20 bg-gradient-tropical animate-gradient text-white overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center rounded-full bg-white/20 px-6 py-2.5 text-sm font-medium backdrop-blur-md border border-white/30 animate-pulse-glow">
                <Bot className="h-4 w-4 mr-2" />
                <span>Học tiếng Trung với công nghệ AI hiện đại</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
                Nền Tảng Học Tiếng Trung<br />
                và Luyện Thi HSK
              </h1>

              <p className="text-xl md:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                Phương pháp học hiệu quả, lộ trình rõ ràng, giúp bạn chinh phục HSK một cách tự tin
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={handleStartLearningClick}
                  className="bg-white text-purple-600 hover:bg-gray-50 font-bold text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-purple hover:scale-105 transition-all"
                >
                  Bắt đầu học ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section - Colorful Cards */}
        <section className="mb-20 -mt-10">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-gradient-colorful text-white rounded-2xl shadow-purple p-6 md:p-8 text-center hover-scale">
                <div className="text-4xl md:text-5xl font-bold mb-2">6</div>
                <div className="text-sm md:text-base font-medium">Cấp độ HSK</div>
              </div>
              <div className="bg-gradient-sunset text-white rounded-2xl shadow-pink p-6 md:p-8 text-center hover-scale">
                <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
                <div className="text-sm md:text-base font-medium">Từ vựng</div>
              </div>
              <div className="bg-gradient-spring text-white rounded-2xl shadow-cyan p-6 md:p-8 text-center hover-scale">
                <div className="text-4xl md:text-5xl font-bold mb-2">9</div>
                <div className="text-sm md:text-base font-medium">Dạng bài tập</div>
              </div>
              <div className="bg-gradient-fire text-white rounded-2xl shadow-orange p-6 md:p-8 text-center hover-scale">
                <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
                <div className="text-sm md:text-base font-medium">Miễn phí</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gamification Call-to-Action - Prominent Section */}
        <section className="mb-20">
          <div className="max-w-5xl mx-auto">
            <Link to="/mandarin/gamification">
              <Card className="flex flex-col text-center cursor-pointer border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white p-10 md:p-14 hover-scale shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 px-4 py-2 rounded-bl-3xl text-sm font-bold shadow-lg z-10 animate-bounce">
                  MỚI! 🎮
                </div>
                <CardHeader className="items-center space-y-6 relative z-10">
                  <div className="flex gap-4 items-center justify-center">
                    <Gamepad2 className="w-20 h-20 text-white animate-bounce" />
                    <Zap className="w-16 h-16 text-yellow-300 animate-pulse" />
                    <Trophy className="w-20 h-20 text-white animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                  <CardTitle className="text-4xl md:text-5xl font-bold text-white">
                    🎮 Học Tiếng Trung Qua Game! 🏆
                  </CardTitle>
                  <CardDescription className="text-xl md:text-2xl leading-relaxed text-white/95 max-w-3xl">
                    Đấu boss, sưu tập thẻ, quay vòng may mắn, hoàn thành nhiệm vụ và còn nhiều hơn nữa!
                    Thu thập XP, lên level và mở khóa huy hiệu đặc biệt.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-6 relative z-10 flex flex-col gap-4">
                  <Button className="bg-white text-purple-600 hover:bg-gray-50 font-bold rounded-2xl h-14 px-12 shadow-xl text-xl">
                    Khám phá ngay <ChevronRight className="ml-2 h-6 w-6" />
                  </Button>
                  <div className="flex gap-4 flex-wrap justify-center text-sm">
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">⚔️ Đấu Boss</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">✨ Sưu Tập Thẻ</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">🎁 Vòng May Mắn</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">🎯 Nhiệm Vụ</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">📚 Câu Chuyện</span>
                    <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">🏅 Huy Hiệu</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>

        {/* Songs Section */}
        <section className="py-16 md:py-20 mb-16">
          <div className="max-w-4xl mx-auto">
            <Link to="/mandarin/songs">
              <Card className="flex flex-col text-center cursor-pointer border-0 bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 text-white p-8 hover-scale shadow-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <CardHeader className="items-center space-y-4 relative z-10">
                  <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm animate-float">
                    <Music className="w-16 h-16 text-white" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-white">🎤 Học qua Bài Hát 🎵</CardTitle>
                  <CardDescription className="text-lg leading-relaxed text-white/90 max-w-2xl">
                    Học tiếng Trung qua các bài hát Mandopop với lời bài hát đồng bộ theo nhịp nhạc YouTube
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 relative z-10 flex justify-center">
                  <Button className="bg-white text-red-600 hover:bg-gray-50 font-semibold rounded-xl h-12 px-8 shadow-lg text-lg">
                    Khám phá ngay <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="py-16 md:py-20 mb-16">
          <div className="max-w-4xl mx-auto">
            <Link to="/mandarin/analytics">
              <Card className="flex flex-col text-center cursor-pointer border-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-8 hover-scale shadow-xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="absolute top-0 right-0 bg-green-400 text-purple-900 px-4 py-2 rounded-bl-3xl text-sm font-bold shadow-lg z-10">
                  MỚI! 📊
                </div>
                <CardHeader className="items-center space-y-4 relative z-10">
                  <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm animate-float">
                    <BarChart3 className="w-16 h-16 text-white" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-white">📊 Thống Kê Học Tập</CardTitle>
                  <CardDescription className="text-lg leading-relaxed text-white/90 max-w-2xl">
                    Xem chi tiết tiến độ học tập, điểm yếu cần cải thiện, và phân tích hiệu quả với SRS thông minh
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 relative z-10 flex justify-center">
                  <Button className="bg-white text-indigo-600 hover:bg-gray-50 font-semibold rounded-xl h-12 px-8 shadow-lg text-lg">
                    Xem thống kê <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
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
                className="flex flex-col text-center h-full cursor-pointer border-0 bg-gradient-vivid text-white p-8 hover-scale shadow-pink overflow-hidden relative group"
                onClick={handleSelectHsk}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <CardHeader className="items-center flex-grow space-y-4 pb-6 relative z-10">
                  <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm animate-float">
                    <GraduationCap className="w-16 h-16 text-white" />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white">Luyện thi HSK 3.0</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-white/90">
                    Luyện tập theo cấu trúc HSK 3.0 mới nhất, bao gồm 6 cấp độ từ cơ bản đến nâng cao
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4 relative z-10">
                  <Button className="w-full bg-white text-pink-600 hover:bg-gray-50 font-semibold rounded-xl h-12 shadow-lg">
                    Chọn lộ trình này
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardFooter>
              </Card>

              <Link to="/mandarin/msutong" className="block">
                <Card className="flex flex-col text-center h-full cursor-pointer border-0 bg-gradient-ocean text-white p-8 hover-scale shadow-cyan overflow-hidden relative group">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <CardHeader className="items-center flex-grow space-y-4 pb-6 relative z-10">
                    <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm animate-float" style={{animationDelay: '0.5s'}}>
                      <BookCopy className="w-16 h-16 text-white" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-white">Giáo trình Msutong</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-white/90">
                      Ôn tập từ vựng và ngữ pháp theo từng bài học trong các bộ giáo trình phổ biến
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-4 relative z-10">
                    <Button className="w-full bg-white text-cyan-600 hover:bg-gray-50 font-semibold rounded-xl h-12 shadow-lg">
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
              {!session?.user?.id ? (
                <div className="max-w-md mx-auto">
                  <div className="bg-white dark:bg-gray-900 border-2 border-primary/30 p-8 rounded-2xl shadow-xl text-center">
                    <div className="mb-4">
                      <svg className="mx-auto h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      Yêu cầu đăng nhập
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Vui lòng đăng nhập để truy cập bài tập HSK
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/mandarin/login">
                        Đăng nhập ngay
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exerciseTypes.map((exercise, index) => (
                    <Link
                      key={exercise.slug}
                      to={exercise.isAvailable ? `/mandarin/hsk/${level}/${exercise.slug}` : '#'}
                      className={!exercise.isAvailable ? 'pointer-events-none' : ''}
                    >
                      <Card className={cn(
                        "flex flex-col text-center h-full cursor-pointer border-0 text-white p-6 hover-scale overflow-hidden relative group",
                        exercise.isAvailable ? `${exercise.gradient} ${exercise.shadowColor}` : "bg-gray-300 opacity-60"
                      )}>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        <CardHeader className="items-center flex-grow space-y-4 pb-4 relative z-10">
                          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm animate-float" style={{animationDelay: `${index * 0.1}s`}}>
                            {React.cloneElement(exercise.icon, { className: "w-10 h-10 text-white" })}
                          </div>
                          <CardTitle className="text-xl font-bold text-white">{exercise.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed text-white/90">{exercise.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-4 relative z-10">
                          <Button
                            variant={exercise.isAvailable ? "default" : "secondary"}
                            className={cn(
                              "w-full font-semibold rounded-xl h-11 shadow-lg",
                              exercise.isAvailable && "bg-white text-purple-600 hover:bg-gray-50"
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
              )}
            </section>

            {/* Testimonial Section */}
            <TestimonialSection />

            {/* Call To Action Section */}
            <CallToActionSection onStartClick={() => levelSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t-4 border-purple-300 dark:border-purple-500/30">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-3xl p-8 backdrop-blur-md border-2 border-purple-400 dark:border-purple-500 bg-white/90 dark:bg-black/70 shadow-xl dark:shadow-purple-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl border-4 border-cyan-400 dark:border-cyan-500 grid place-items-center bg-gradient-to-br from-purple-400 to-cyan-400 dark:from-purple-500 dark:to-cyan-500 shadow-lg">
                  <span className="text-4xl font-black">中</span>
                </div>
                <div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    學中文 • HỌC TIẾNG TRUNG
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    普通话 HSK • Msutong
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <div className="text-gray-700 dark:text-gray-300 font-semibold">
                  © {new Date().getFullYear()} • Made with <Heart className="inline h-4 w-4 text-red-500" /> by TiengTrungHSK
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  學習中文 • Chinh phục HSK 🎯
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <MadeWithDyad />
    </div>
  );
};

export default Index;