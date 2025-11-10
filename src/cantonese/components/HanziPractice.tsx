"use client"
import React from 'react'
import HanziWriter from 'hanzi-writer'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/cantonese/components/providers/SettingsProvider' // Import useSettings

export default function HanziPractice({ data }: { data: { char: string; hint?: string; jyutping?: string } }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const writerRef = React.useRef<HanziWriter | null>(null)
  const [animationPlayed, setAnimationPlayed] = React.useState(false)
  const [quizActive, setQuizActive] = React.useState(false)
  const { showJyutping } = useSettings() // Use showJyutping from settings

  const char = data?.char || '學'

  const initializeWriter = React.useCallback(() => {
    if (ref.current) {
      ref.current.innerHTML = ''; // Clear previous writer
      const writer = HanziWriter.create(ref.current, char, {
        width: 300,
        height: 300,
        showOutline: true,
        showCharacter: true,
        strokeColor: '#1A1A1A',
        radicalColor: '#D14A41',
        delayBetweenStrokes: 100, // Adjust for better animation speed
        delayBetweenLoops: 1000,
      });
      writerRef.current = writer;
      setAnimationPlayed(false);
      setQuizActive(false);
      return writer;
    }
    return null;
  }, [char]);

  React.useEffect(() => {
    const writer = initializeWriter();
    if (writer) {
      writer.animateCharacter({
        onComplete: () => {
          setAnimationPlayed(true);
        }
      });
    }
    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [char, initializeWriter]);

  const replayGuide = () => {
    if (writerRef.current) {
      setQuizActive(false); // Stop quiz if active
      writerRef.current.animateCharacter({
        onComplete: () => {
          setAnimationPlayed(true);
        }
      });
    }
  };

  const startPractice = () => {
    if (writerRef.current) {
      writerRef.current.quiz();
      setQuizActive(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
      <div className="mb-4 text-center">
        <div className="text-lg font-semibold text-ink">Luyện viết chữ Hán: <span className="font-bold text-2xl text-verm">{char}</span></div>
        {showJyutping && data?.jyutping && (
          <div className="text-sm text-black/70 dark:text-white/70 mt-1">{data.jyutping}</div>
        )}
      </div>
      <div className="flex justify-center">
        <div ref={ref} className="border-2 border-ink/15 rounded-xl p-2 inline-block hanzi-grid-background"/>
      </div>
      <div className="text-sm text-black/60 dark:text-white/60 mt-4 text-center">Gợi ý: {data?.hint || 'Hãy theo dõi hướng đi của từng nét.'}</div>

      {animationPlayed && !quizActive && (
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={replayGuide} variant="outline" className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm">
            Hướng dẫn viết lại
          </Button>
          <Button onClick={startPractice} className="inline-flex items-center gap-2 rounded-2xl bg-verm px-4 py-2 font-semibold text-ink shadow-[0_4px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform text-sm">
            Luyện viết
          </Button>
        </div>
      )}
      {quizActive && (
        <div className="mt-6 text-center text-sm text-ink/70 dark:text-cream/70">
          Đang luyện viết. Hoàn thành các nét để tiếp tục.
        </div>
      )}
    </div>
  )
}