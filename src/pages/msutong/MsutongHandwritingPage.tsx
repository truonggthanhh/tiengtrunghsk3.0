import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import HandwritingPracticeComponent from '@/components/HandwritingPracticeComponent';
import { getVocabularyByMsutong, getFullMsutongVocabularyByLevel } from '@/data';
import { usePinyin } from '@/contexts/PinyinContext';

const MsutongHandwritingPage: React.FC = () => {
  const { showPinyin } = usePinyin();
  const [searchParams] = useSearchParams();
  const level = searchParams.get('level') || 'so-cap';
  const lessonIds = searchParams.get('lessonIds')?.split(',') || [];
  const booksParam = searchParams.get('books') || 'Không rõ';

  const vocabulary = useMemo(() => getVocabularyByMsutong(level, lessonIds), [level, lessonIds]);
  const fullMsutongVocab = useMemo(() => getFullMsutongVocabularyByLevel(level), [level]);

  const lessonsDisplay = lessonIds.map(id => {
    const parts = id.split('-lesson-');
    return `Bài ${parts[1]}`;
  }).join(', ');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <HandwritingPracticeComponent
        vocabulary={vocabulary}
        fullVocabularyForSuggestions={fullMsutongVocab} // Provide all Msutong words for search suggestions
        title={`Luyện viết chữ Hán (Msutong ${booksParam} - ${lessonsDisplay})`}
        description="Xem thứ tự nét và luyện viết các chữ Hán trong bài học đã chọn."
        homeLink="/mandarin/msutong"
      />
    </div>
  );
};

export default MsutongHandwritingPage;