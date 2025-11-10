"use client"
import React from 'react'
import HanziPractice from '@/cantonese/components/HanziPractice'

type HanziWriteItem = { char: string; hint?: string };

export default function HanziPracticeWrapper({ data, hotkeyControls }: { data: { description: string; items: HanziWriteItem[] }, hotkeyControls?: { setPrev: (f: () => void) => void, setNext: (f: () => void) => void } }) {
  const [i, setI] = React.useState(0)
  const item = data.items[i]

  const prev = () => { setI(v => Math.max(0, v - 1)) }
  const next = () => { setI(v => Math.min(data.items.length - 1, v + 1)) }

  React.useEffect(() => {
    hotkeyControls?.setPrev(() => prev)
    hotkeyControls?.setNext(() => next)
  }, [hotkeyControls, i])

  // This component doesn't have a "score" in the traditional sense for the wrapper,
  // but the underlying HanziPractice might. For now, we'll provide a dummy score.
  React.useEffect(() => { (window as any).__getScore = { getScore: () => ({ score: 0, total: data.items.length }) } }, [data])


  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-3 text-sm">{i + 1}/{data.items.length}</div>
      <HanziPractice data={item} />
      <div className="mt-3 flex justify-between">
        <button disabled={i === 0} onClick={prev} className="px-3 py-2 rounded bg-black/5 dark:bg-white/10 disabled:opacity-50">Trước</button>
        <button disabled={i === data.items.length - 1} onClick={next} className="px-3 py-2 rounded bg-black/5 dark:bg-white/10 disabled:opacity-50">Sau</button>
      </div>
    </div>
  )
}