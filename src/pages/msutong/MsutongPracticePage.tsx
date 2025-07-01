import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

// Import các component bài tập
import Flashcard from '@/components/Flashcard'; // Giả sử Flashcard có thể tái sử dụng
// Sẽ import các component bài tập khác ở đây khi chúng được tạo
// import PinyinChoice from '@/components/PinyinChoice'; 
// import MeaningChoice from '@/components/MeaningChoice';

import { getVocabularyByMsutong, VocabularyWord } from '@/data';

// Component render Flashcard (ví dụ)
const FlashcardPractice: React.FC<{ vocabulary: VocabularyWord[] }> = ({ vocabulary }) => {
    // Logic của trang Flashcard sẽ được chuyển vào đây
    // Hiện tại chỉ là ví dụ đơn giản
    const [currentIndex, setCurrentIndex] = React.useState(0);
    if (vocabulary.length === 0) return <p>Không có từ vựng cho lựa chọn này.</p>;
    const currentWord = vocabulary[currentIndex];
    return (
        <div>
            <Flashcard 
                key={currentWord.id}
                hanzi={currentWord.hanzi}
                pinyin={currentWord.pinyin}
                meaning={currentWord.meaning}
            />
            <div className="mt-4 flex justify-center gap-4">
                <Button onClick={() => setCurrentIndex(p => (p - 1 + vocabulary.length) % vocabulary.length)}>Từ trước</Button>
                <Button onClick={() => setCurrentIndex(p => (p + 1) % vocabulary.length)}>Từ tiếp theo</Button>
            </div>
        </div>
    );
};


const MsutongPracticePage = () => {
  const [searchParams] = useSearchParams();

  const level = searchParams.get('level') || '';
  const books = searchParams.get('books')?.split(',') || [];
  const lessons = searchParams.get('lessons')?.split(',').map(Number) || [];
  const type = searchParams.get('type');

  const vocabulary = useMemo(() => {
    return getVocabularyByMsutong(level, books, lessons);
  }, [level, books, lessons]);

  const renderExercise = () => {
    switch (type) {
      case 'flashcard':
        return <FlashcardPractice vocabulary={vocabulary} />;
      // Thêm các case khác cho các dạng bài tập khác
      // case 'pinyin-choice':
      //   return <PinyinChoicePractice vocabulary={vocabulary} />;
      default:
        return <p>Dạng bài tập "{type}" chưa được hỗ trợ.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
            {vocabulary.length > 0 ? (
                renderExercise()
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy từ vựng</h2>
                    <p className="text-muted-foreground mb-8">
                        Dữ liệu cho lựa chọn của bạn đang được cập nhật. Vui lòng quay lại sau.
                    </p>
                </div>
            )}
            <div className="text-center mt-8">
                <Button asChild variant="secondary">
                    <Link to="/msutong">
                        <Home className="mr-2 h-4 w-4" /> Chọn lại bài học
                    </Link>
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default MsutongPracticePage;