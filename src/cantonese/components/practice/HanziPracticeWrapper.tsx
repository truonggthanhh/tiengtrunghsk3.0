"use client"
import React from 'react'
import HanziPractice from '@/cantonese/components/HanziPractice'
import { motion } from 'framer-motion'
import { Home, CheckCircle2 } from 'lucide-react'

type HanziWriteItem = {
  char?: string;
  character?: string;
  hint?: string;
  meaning?: string;
  jyutping?: string;
  strokes?: number;
};

export default function HanziPracticeWrapper({ data, hotkeyControls, onAttach }: {
  data: { description?: string; items: HanziWriteItem[] },
  hotkeyControls?: { setPrev: (f: () => void) => void, setNext: (f: () => void) => void },
  onAttach?: (h: any) => void
}) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)
  const [completedIndices, setCompletedIndices] = React.useState<Set<number>>(new Set())

  // Normalize data - support both char and character fields
  const normalizedItems = React.useMemo(() => {
    return data.items.map(item => ({
      char: item.char || item.character || '',
      hint: item.hint || item.meaning,
      jyutping: item.jyutping,
      meaning: item.meaning,
      strokes: item.strokes
    }));
  }, [data.items]);

  React.useEffect(() => {
    if (onAttach) {
      onAttach({
        getScore: () => ({ score: completedIndices.size, total: normalizedItems.length }),
        getAnswers: () => Array.from(completedIndices)
      })
    }
  }, [completedIndices, normalizedItems.length, onAttach])

  const handleCharacterComplete = (index: number) => {
    setCompletedIndices(prev => new Set([...prev, index]))
  }

  const handleBack = () => {
    setSelectedIndex(null)
  }

  // Show character list
  if (selectedIndex === null) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink dark:text-cream mb-2">Luyện viết chữ Hán</h2>
          <p className="text-sm text-ink/70 dark:text-cream/70">
            Chọn chữ Hán để bắt đầu luyện viết • Đã hoàn thành: {completedIndices.size}/{normalizedItems.length}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {normalizedItems.map((item, idx) => {
            const isCompleted = completedIndices.has(idx)
            return (
              <motion.button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all
                  ${isCompleted
                    ? 'border-jade bg-jade/10 dark:bg-jade/20'
                    : 'border-ink/10 bg-white dark:bg-black/20 hover:border-purple-300 dark:hover:border-purple-600'
                  }
                  shadow-lg hover:shadow-xl hover:-translate-y-1
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCompleted && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="h-5 w-5 text-jade" />
                  </div>
                )}

                <div className="text-4xl font-bold text-center mb-2 text-ink dark:text-cream">
                  {item.char}
                </div>

                {item.jyutping && (
                  <div className="text-xs text-center text-ink/60 dark:text-cream/60 mb-1">
                    {item.jyutping}
                  </div>
                )}

                {item.meaning && (
                  <div className="text-xs text-center text-ink/50 dark:text-cream/50">
                    {item.meaning}
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
          <p className="text-sm text-center text-ink/70 dark:text-cream/70">
            💡 Mẹo: Nhấp vào từng chữ để luyện viết theo thứ tự nét chuẩn
          </p>
        </div>
      </div>
    )
  }

  // Show practice for selected character
  const selectedItem = normalizedItems[selectedIndex]

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-300 dark:border-purple-600 bg-white/90 dark:bg-black/70 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all shadow-md text-sm font-medium"
        >
          <Home className="h-4 w-4" /> Quay lại danh sách
        </button>

        <div className="text-sm text-ink/70 dark:text-cream/70">
          {selectedIndex + 1}/{normalizedItems.length}
        </div>
      </div>

      <HanziPractice
        data={selectedItem}
        onComplete={() => handleCharacterComplete(selectedIndex)}
      />

      <div className="mt-6 flex justify-between gap-3">
        <button
          disabled={selectedIndex === 0}
          onClick={() => setSelectedIndex(selectedIndex - 1)}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/20 bg-white dark:bg-black/20 text-ink dark:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          ← Chữ trước
        </button>

        <button
          disabled={selectedIndex === normalizedItems.length - 1}
          onClick={() => setSelectedIndex(selectedIndex + 1)}
          className="flex-1 px-4 py-3 rounded-xl border-2 border-ink/20 bg-white dark:bg-black/20 text-ink dark:text-cream hover:bg-black/5 dark:hover:bg-white/5 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Chữ sau →
        </button>
      </div>
    </div>
  )
}