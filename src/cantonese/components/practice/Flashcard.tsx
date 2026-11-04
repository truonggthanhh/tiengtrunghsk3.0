import SaveWordButton from '@/components/learning/SaveWordButton';
import { flashcardSchema, type ExerciseHooks } from '@/cantonese/lib/exercisePayload';
import React from 'react'
import { useSettings } from '../providers/SettingsProvider.shared';
import { motion } from 'framer-motion'
import SpeakerButton from '@/cantonese/components/SpeakerButton' // Import SpeakerButton

export default function Flashcard({data: rawData,hotkeyControls,onAttach}:{data:unknown,onAttach?:(hooks:{getScore:()=>{score:number,total:number},getAnswers:()=>unknown[]})=>void,hotkeyControls?:{setFlip:(f:()=>void)=>void,setPrev:(f:()=>void)=>void,setNext:(f:()=>void)=>void}}){
  const data = React.useMemo(() => flashcardSchema.parse(rawData), [rawData]);
  const [i,setI]=React.useState(0)
  const rawItem=data.items[Math.min(i, data.items.length - 1)] ?? {}
  // Support both old format (front/back) and new format (word/vi)
  const item = {
    word: rawItem.word || rawItem.front,
    jyutping: rawItem.jyutping || rawItem.frontJyutping,
    vi: rawItem.vi || rawItem.back
  }
  const [flipped,setFlipped]=React.useState(false)
  const {showJyutping}=useSettings()
  React.useEffect(() => { setI(0); setFlipped(false); }, [data]);

  React.useEffect(()=>{ onAttach?.({ getScore:()=>({score:0,total:data.items.length}), getAnswers:()=>[] }) },[data,onAttach])

  const prev=React.useCallback(()=>{ setI(v=>{const n=Math.max(0,v-1); if(n!==v)setFlipped(false); return n}) }, [])
  const next=React.useCallback(()=>{ setI(v=>{const n=Math.min(data.items.length-1,v+1); if(n!==v)setFlipped(false); return n}) }, [data.items.length])
  const flip=React.useCallback(()=>setFlipped(f=>!f), [])

  React.useEffect(()=>{
    hotkeyControls?.setFlip(()=>flip)
    hotkeyControls?.setPrev(()=>prev)
    hotkeyControls?.setNext(()=>next)
  },[hotkeyControls,flip,prev,next])

  if (!data.items.length) return <p className="p-6 text-center">Chưa có từ vựng cho bài học này.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">{i+1}/{data.items.length}</span>{item.word && item.vi && <SaveWordButton language="cantonese" hanzi={item.word} pronunciation={item.jyutping} meaning={item.vi} />}</div>
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Lật thẻ từ vựng"
        aria-pressed={flipped}
        onKeyDown={event => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); event.stopPropagation(); flip(); } }}
        onClick={flip}
        className="relative flex min-h-64 w-full items-center justify-center rounded-2xl border bg-primary/5 p-6 text-left text-foreground transition-colors hover:border-primary/40"
        whileTap={{ scale: 0.98 }}
      >
        {!flipped? (
          <div className="text-center">
            <div className="mt-2 break-words text-5xl font-semibold">{item.word}</div>
            {showJyutping && item.jyutping && <div className="mt-1 text-sm text-muted-foreground">{item.jyutping}</div>} {/* Jyutping on front */}
            <div className="mt-2">
              <SpeakerButton text={item.word} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="break-words text-2xl font-semibold">{item.vi}</div>
            {showJyutping && item.jyutping && <div className="mt-1 text-sm text-muted-foreground">{item.jyutping}</div>} {/* Jyutping on back (already there) */}
          </div>
        )}
      </motion.div>
      <div className="mt-6 flex justify-between">
        <button disabled={i===0} onClick={prev} className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-foreground hover:bg-muted transition text-sm disabled:opacity-50">Trước</button>
        <button disabled={i===data.items.length-1} onClick={next} className="inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-foreground hover:bg-muted transition text-sm disabled:opacity-50">Sau</button>
      </div>
    </div>
  )
}