import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  hanzi: string;
  pinyin: string;
  meaning: string;
  showPinyin?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ hanzi, pinyin, meaning, showPinyin = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flashcard-container w-full h-64 md:h-80 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={cn('flashcard', { 'is-flipped': isFlipped })}>
        <div className="flashcard-face flashcard-front">
          <Card className="w-full h-full flex items-center justify-center border-2 bg-gradient-colorful text-white">
            <CardContent className="p-6 text-center space-y-3">
              <p className="text-6xl md:text-8xl font-bold">{hanzi}</p>
              {showPinyin && (
                <p className="text-2xl md:text-3xl font-medium text-white/90">{pinyin}</p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flashcard-face flashcard-back">
          <Card className="w-full h-full flex items-center justify-center border-2 bg-gradient-sunset text-white">
            <CardContent className="p-6 text-center">
              {showPinyin && (
                <p className="text-3xl md:text-4xl font-semibold mb-4 text-white">{pinyin}</p>
              )}
              <p className="text-2xl md:text-3xl text-white/90">{meaning}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;