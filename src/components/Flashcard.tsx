import SaveWordButton from '@/components/learning/SaveWordButton';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SpeakerButton from '@/components/SpeakerButton';

interface FlashcardProps {
  hanzi: string;
  pinyin: string;
  meaning: string;
  showPinyin?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({ hanzi, pinyin, meaning, showPinyin = true }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => { setIsFlipped(false); }, [hanzi, pinyin, meaning]);
  const handleToggle = () => setIsFlipped(value => !value);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <>
    <div className="mb-3 flex justify-end"><SaveWordButton language="mandarin" hanzi={hanzi} pronunciation={pinyin} meaning={meaning} /></div>
    <div
      className="flashcard-container w-full h-64 md:h-80 cursor-pointer"
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Thẻ từ ${hanzi}. Nhấn Enter hoặc dấu cách để lật thẻ.`}
      aria-pressed={isFlipped}
    >
      <div className={cn('flashcard', { 'is-flipped': isFlipped })}>
        <div className="flashcard-face flashcard-front" aria-hidden={isFlipped}>
          <Card className="w-full h-full flex items-center justify-center border bg-primary/5 text-foreground relative rounded-2xl">
            <CardContent className="p-6 text-center space-y-3">
              <p className={cn('break-words font-semibold', hanzi.length > 12 ? 'text-xl md:text-3xl' : hanzi.length > 5 ? 'text-3xl md:text-5xl' : 'text-5xl md:text-7xl')}>{hanzi}</p>
              {/* Speaker Button */}
              <div className="mt-4 flex justify-center">
                {!isFlipped && <SpeakerButton className="bg-primary/10 text-primary hover:bg-primary/20" text={hanzi} language="zh-CN" />}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flashcard-face flashcard-back" aria-hidden={!isFlipped}>
          <Card className="w-full h-full flex items-center justify-center border bg-card text-foreground relative rounded-2xl">
            <CardContent className="max-h-full overflow-y-auto p-6 text-center">
              {showPinyin && (
                <p className="text-2xl md:text-3xl font-semibold mb-4 text-primary">{pinyin}</p>
              )}
              <p className="break-words text-2xl md:text-3xl text-foreground">{meaning}</p>
              {/* Speaker Button */}
              <div className="mt-4 flex justify-center">
                {isFlipped && <SpeakerButton className="bg-primary/10 text-primary hover:bg-primary/20" text={hanzi} language="zh-CN" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
};

export default Flashcard;