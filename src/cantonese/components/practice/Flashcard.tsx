"use client"
import React from 'react'
import { useSettings } from '../providers/SettingsProvider'
import { motion } from 'framer-motion'
import SpeakerButton from '@/cantonese/components/SpeakerButton' // Import SpeakerButton

export default function Flashcard({data,hotkeyControls}:{data:any,hotkeyControls?:{setFlip:(f:()=>void)=>void,setPrev:(f:()=>void)=>void,setNext:(f:()=>void)=>void}}){
  const [i,setI]=React.useState(0)
  const rawItem=data.items[i]
  // Support both old format (front/back) and new format (word/vi)
  const item = {
    word: rawItem.word || rawItem.front,
    jyutping: rawItem.jyutping || rawItem.frontJyutping,
    vi: rawItem.vi || rawItem.back
  }
  const [flipped,setFlipped]=React.useState(false)
  const {showJyutping}=useSettings()

  React.useEffect(()=>{ (window as any).__getScore={ getScore:()=>({score:0,total:data.items.length}) } },[data])

  const prev=()=>{ setI(v=>{const n=Math.max(0,v-1); if(n!==v)setFlipped(false); return n}) }
  const next=()=>{ setI(v=>{const n=Math.min(data.items.length-1,v+1); if(n!==v)setFlipped(false); return n}) }
  const flip=()=>setFlipped(f=>!f)

  React.useEffect(()=>{
    hotkeyControls?.setFlip(()=>flip)
    hotkeyControls?.setPrev(()=>prev)
    hotkeyControls?.setNext(()=>next)
  },[hotkeyControls,i])

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="mb-3 text-sm text-ink/70 dark:text-cream/70">{i+1}/{data.items.length}</div>
      <motion.button
        onClick={flip}
        className="relative w-full rounded-3xl border-2 border-ink/10 bg-white dark:bg-black/20 p-6 text-left text-ink shadow-[0_20px_0_#d7c8b6] transition-all duration-200 ease-in-out transform hover:-translate-y-1 active:translate-y-0"
        whileTap={{ scale: 0.98 }}
      >
        {!flipped? (
          <div className="text-center">
            <div className="mt-2 text-4xl font-extrabold">{item.word}</div>
            {showJyutping && item.jyutping && <div className="mt-1 text-sm text-black/70 dark:text-white/70">{item.jyutping}</div>} {/* Jyutping on front */}
            <div className="mt-2">
              <SpeakerButton text={item.word} />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-xl font-extrabold">{item.vi}</div>
            {showJyutping && item.jyutping && <div className="mt-1 text-sm text-black/70 dark:text-white/70">{item.jyutping}</div>} {/* Jyutping on back (already there) */}
          </div>
        )}
      </motion.button>
      <div className="mt-6 flex justify-between">
        <button disabled={i===0} onClick={prev} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm disabled:opacity-50">Trước</button>
        <button disabled={i===data.items.length-1} onClick={next} className="inline-flex items-center gap-2 rounded-2xl border border-ink/20 px-4 py-2 text-ink hover:bg-black/5 dark:hover:bg-white/5 transition text-sm disabled:opacity-50">Sau</button>
      </div>
    </div>
  )
}