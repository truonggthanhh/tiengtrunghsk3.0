import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { BookCopy, ChevronRight, ArrowLeft, BookOpen, Mic, Puzzle, FileQuestion, CheckSquare, Shuffle, AudioLines, Bot, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const levels = [
  { slug: 'so-cap', name: 'Sơ cấp' },
  { slug: 'trung-cap', name: 'Trung cấp' },
  { slug: 'cao-cap', name: 'Cao cấp' },
];

const books = [
  { slug: 'quyen-1', name: 'Quyển 1' },
  { slug: 'quyen-2', name: 'Quyển 2' },
  { slug: 'quyen-3', name: 'Quyển 3' },
  { slug: 'quyen-4', name: 'Quyển 4' },
];

const exerciseTypes = [
    { slug: "flashcard", title: "Flashcard", description: "Ôn tập từ vựng qua thẻ ghi nhớ", icon: <BookOpen />, isAvailable: true },
    { slug: "pinyin-choice", title: "Chọn phiên âm", description: "Chọn pinyin đúng cho chữ Hán", icon: <Mic />, isAvailable: true },
    { slug: "meaning-choice", title: "Chọn nghĩa", description: "Chọn nghĩa đúng cho từ vựng", icon: <Puzzle />, isAvailable: true },
    { slug: "fill-in-the-blank", title: "Điền từ", description: "Điền chữ Hán dựa vào pinyin và nghĩa", icon: <FileQuestion />, isAvailable: true },
    { slug: "pronunciation", title: "Luyện phát âm", description: "Luyện phát âm qua nhận dạng giọng nói", icon: <AudioLines />, isAvailable: true },
    { slug: "sentence-choice", title: "Điền từ vào câu", description: "Chọn từ đúng để hoàn thành câu", icon: <CheckSquare />, isAvailable: true },
    { slug: "sentence-scramble", title: "Sắp xếp câu", description: "Sắp xếp các từ thành câu hoàn chỉnh", icon: <Shuffle />, isAvailable: true },
    { slug: "ai-tutor", title: "Luyện nói cùng AI", description: "Trò chuyện và nhận phản hồi từ AI", icon: <Bot />, isAvailable: true },
];

const MsutongPage = () => {
  const [step, setStep] = useState<'level' | 'book' | 'lesson' | 'exercise'>('level');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);

  const handleLevelSelect = (levelSlug: string) => {
    setSelectedLevel(levelSlug);
    setStep('book');
  };

  const handleBookToggle = (bookSlug: string) => {
    setSelectedBooks(prev =>
      prev.includes(bookSlug)
        ? prev.filter(b => b !== bookSlug)
        : [...prev, bookSlug]
    );
  };

  const lessonsToDisplay = useMemo(() => {
    if (selectedBooks.length === 0) return [];
    
    const allLessons: { id: string; lesson: number; bookSlug: string; bookName: string }[] = [];
    
    selectedBooks.forEach(bookSlug => {
      const bookInfo = books.find(b => b.slug === bookSlug);
      if (bookInfo) {
        // Generate lessons 1-10 for each selected book
        for (let i = 1; i <= 10; i++) {
          allLessons.push({
            id: `${bookSlug}-lesson-${i}`, // ID format: 'quyen-X-lesson-Y'
            lesson: i, // Lesson number within the book (1-10)
            bookSlug: bookSlug,
            bookName: bookInfo.name,
          });
        }
      }
    });
    // Sort by book number then lesson number for consistent display
    return allLessons.sort((a, b) => {
      const bookNumA = parseInt(a.bookSlug.replace('quyen-', ''));
      const bookNumB = parseInt(b.bookSlug.replace('quyen-', ''));
      if (bookNumA !== bookNumB) {
        return bookNumA - bookNumB;
      }
      return a.lesson - b.lesson;
    });
  }, [selectedBooks]);

  const handleLessonToggle = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const selectionSummary = useMemo(() => {
    const levelName = levels.find(l => l.slug === selectedLevel)?.name;
    const bookNames = selectedBooks.map(slug => books.find(b => b.slug === slug)?.name).join(', ');
    return `Đã chọn: ${levelName} > ${bookNames} > (${selectedLessons.length} bài)`;
  }, [selectedLevel, selectedBooks, selectedLessons]);

  const practiceUrlParams = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedLevel) params.append('level', selectedLevel);
    if (selectedLessons.length > 0) params.append('lessonIds', selectedLessons.join(','));
    // Also pass selected books for AI Tutor context if needed
    if (selectedBooks.length > 0) params.append('books', selectedBooks.map(slug => books.find(b => b.slug === slug)?.name).join(', '));
    return params.toString();
  }, [selectedLevel, selectedLessons, selectedBooks]);

  const renderStep = () => {
    switch (step) {
      case 'level':
        return (
          <div className="text-center py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Chọn Cấp Độ</h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">Bắt đầu bằng việc chọn cấp độ bạn muốn ôn tập.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {levels.map(level => (
                <Card key={level.slug} className="flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer border-primary/30 hover:border-primary rounded-xl" onClick={() => handleLevelSelect(level.slug)}>
                  <CardHeader className="items-center flex-grow justify-center">
                    <CardTitle className="text-2xl">{level.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="secondary" className="hover:bg-accent hover:text-accent-foreground transition-colors font-bold">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" /> Quay về trang chủ
                </Link>
              </Button>
            </div>
          </div>
        );
      
      case 'book':
        return (
          <div className="w-full max-w-4xl mx-auto bg-card p-6 md:p-10 rounded-xl shadow-lg border border-primary/20">
            <Button variant="secondary" onClick={() => setStep('level')} className="mb-8 font-bold hover:bg-secondary/80 transition-colors"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Chọn Quyển</h2>
              <p className="text-muted-foreground mt-2">Bạn có thể chọn một hoặc nhiều quyển.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {books.map(book => (
                <Label
                  key={book.slug}
                  htmlFor={book.slug}
                  onClick={() => handleBookToggle(book.slug)}
                  className={cn(
                    "flex h-full w-full cursor-pointer items-center justify-center rounded-lg border p-4 text-lg font-medium transition-colors hover:shadow-md",
                    selectedBooks.includes(book.slug) ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50"
                  )}
                >
                  {book.name}
                </Label>
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => setStep('lesson')} disabled={selectedBooks.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Tiếp tục <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );

      case 'lesson':
        return (
          <div className="w-full max-w-5xl mx-auto bg-card p-6 md:p-10 rounded-xl shadow-lg border border-primary/20">
            <Button variant="secondary" onClick={() => setStep('book')} className="mb-8 font-bold hover:bg-secondary/80 transition-colors"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Chọn Bài Học</h2>
              <p className="text-muted-foreground mt-2">Bạn có thể chọn một hoặc nhiều bài.</p>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-4 max-w-5xl mx-auto mb-8">
              {lessonsToDisplay.map(lesson => (
                <Label
                  key={lesson.id}
                  htmlFor={`lesson-${lesson.id}`}
                  onClick={() => handleLessonToggle(lesson.id)}
                  className={cn(
                    "flex flex-col h-16 w-full cursor-pointer items-center justify-center rounded-lg border p-2 text-base font-medium transition-colors hover:shadow-md",
                    selectedLessons.includes(lesson.id) ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/50"
                  )}
                >
                  <span>Bài {lesson.lesson}</span>
                  {selectedBooks.length > 1 && <span className="text-xs text-muted-foreground">({lesson.bookName.replace('Quyển ', 'Q')})</span>}
                </Label>
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => setStep('exercise')} disabled={selectedLessons.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] transition-all font-bold">Tiếp tục <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        );

      case 'exercise':
        return (
          <div className="w-full max-w-5xl mx-auto bg-card p-6 md:p-10 rounded-xl shadow-lg border border-primary/20">
            <Button variant="secondary" onClick={() => setStep('lesson')} className="mb-8 font-bold hover:bg-secondary/80 transition-colors"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Chọn Dạng Bài Tập</h2>
              <p className="text-muted-foreground mt-2">{selectionSummary}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exerciseTypes.map((exercise) => (
                <Link 
                  key={exercise.slug} 
                  to={exercise.isAvailable ? `/msutong/msutong-${exercise.slug}?${practiceUrlParams}` : '#'}
                  className={cn(!exercise.isAvailable && "pointer-events-none")}
                >
                  <Card className={cn("flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer border-primary/30 hover:border-primary rounded-xl", !exercise.isAvailable && "opacity-50")}>
                    <CardHeader className="items-center flex-grow">
                      <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                        {React.cloneElement(exercise.icon, { className: "w-8 h-8 text-primary transition-colors group-hover:text-primary-foreground" })}
                      </div>
                      <CardTitle className="text-xl">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="secondary" className="w-full font-bold" disabled={!exercise.isAvailable}>
                        {exercise.isAvailable ? 'Luyện tập' : 'Sắp ra mắt'}
                        {exercise.isAvailable && <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-tertiary/10 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        {renderStep()}
      </main>
    </div>
  );
};

export default MsutongPage;