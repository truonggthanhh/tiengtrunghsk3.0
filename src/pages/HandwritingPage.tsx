import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import HandwritingPracticeComponent from '@/components/HandwritingPracticeComponent';
import { getVocabularyByLevel } from '@/data';

const HandwritingPage: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const vocabulary = useMemo(() => getVocabularyByLevel(level || '1'), [level]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <HandwritingPracticeComponent
        vocabulary={vocabulary}
        fullVocabularyForSuggestions={getVocabularyByLevel('6')} // Provide all HSK words for search suggestions
        title={`Luyện viết chữ Hán HSK ${level}`}
        description="Xem thứ tự nét và luyện viết các chữ Hán trong cấp độ này."
        homeLink="/mandarin"
      />
    </div>
  );
};

export default HandwritingPage;