import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { BookCopy, GraduationCap, ChevronRight, ArrowLeft } from 'lucide-react';
import { exerciseTypes } from '@/data/msutong'; // We will create this file

const textbooks = [
  {
    slug: 'boya',
    name: 'Giáo trình Boya',
    description: 'Bộ giáo trình toàn diện cho người học tiếng Trung ở mọi cấp độ.',
    lessons: 30, // Example number
    icon: <GraduationCap className="w-10 h-10 text-primary transition-colors group-hover:text-primary-foreground" />
  },
  {
    slug: 'hanyu',
    name: 'Giáo trình Hán Ngữ',
    description: 'Bộ giáo trình kinh điển, nền tảng vững chắc cho người mới bắt đầu.',
    lessons: 25, // Example number
    icon: <BookCopy className="w-10 h-10 text-primary transition-colors group-hover:text-primary-foreground" />
  }
];

const MsutongPage = () => {
  const [selectedBook, setSelectedBook] = useState<{ slug: string; name: string; lessons: number } | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const handleBookSelect = (book: any) => {
    setSelectedBook(book);
    setSelectedLesson(null);
  };

  const handleLessonSelect = (lesson: number) => {
    setSelectedLesson(lesson);
  };

  const resetSelection = () => {
    setSelectedBook(null);
    setSelectedLesson(null);
  }

  if (selectedBook && selectedLesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <Button variant="ghost" onClick={() => setSelectedLesson(null)} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại chọn bài
          </Button>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              {selectedBook.name} - Bài {selectedLesson}
            </h2>
            <p className="text-muted-foreground mt-2">Chọn dạng bài tập bạn muốn luyện tập.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {exerciseTypes.map((exercise) => (
              <div key={exercise.slug} className={!exercise.isAvailable ? 'opacity-50' : ''}>
                <Link to={exercise.isAvailable ? `/msutong/${selectedBook.slug}/${selectedLesson}/${exercise.slug}` : '#'} className={!exercise.isAvailable ? 'pointer-events-none' : ''}>
                  <Card className="flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer hover:border-primary">
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
        </main>
      </div>
    );
  }

  if (selectedBook) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          <Button variant="ghost" onClick={resetSelection} className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại chọn giáo trình
          </Button>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Chọn Bài Học - {selectedBook.name}</h2>
            <p className="text-muted-foreground mt-2">Chọn bài học bạn muốn ôn tập.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 max-w-5xl mx-auto">
            {Array.from({ length: selectedBook.lessons }, (_, i) => i + 1).map(lesson => (
              <Button key={lesson} variant="outline" className="h-16 text-lg" onClick={() => handleLessonSelect(lesson)}>
                Bài {lesson}
              </Button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Chọn Giáo Trình
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
            Bắt đầu ôn tập theo giáo trình bạn đang theo học.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {textbooks.map(book => (
              <Card key={book.slug} className="flex flex-col text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out group cursor-pointer hover:border-primary" onClick={() => handleBookSelect(book)}>
                <CardHeader className="items-center flex-grow">
                  <div className="mb-4 bg-primary/10 p-4 rounded-full transition-colors group-hover:bg-primary">
                    {book.icon}
                  </div>
                  <CardTitle className="text-2xl">{book.name}</CardTitle>
                  <CardDescription className="mt-2 text-base">{book.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="w-full text-primary text-lg font-semibold flex items-center justify-center">
                    Chọn giáo trình này <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongPage;