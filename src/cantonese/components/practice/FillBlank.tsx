"use client"
import React from 'react'
import JyutpingText from '@/cantonese/components/JyutpingText'
import { cn } from '@/lib/utils'

export default function FillBlank({data, onAttach, showAnswers}:{data:any, onAttach?:(h:any)=>void, showAnswers?: boolean}){
  const [answers,setAnswers]=React.useState<string[]>([]);

  React.useEffect(() => {
    if (data?.items) {
      setAnswers(Array(data.items.length).fill(''));
    }
  }, [data.items]);

  function setVal(idx:number,val:string){ 
    const a=[...answers]; 
    a[idx]=val; 
    setAnswers(a) 
  }
  
  const score = data.items.reduce((s:any,it:any,idx:number)=> s + ((answers[idx] || '').trim().toLowerCase()===it.answer.toLowerCase() ? 1 : 0), 0)
  
  React.useEffect(()=>{ 
    if(onAttach){
      onAttach({ 
        getScore:()=>({score,total:data.items.length}),
        getAnswers:()=>answers
      }) 
    }
  },[answers,data,onAttach, score])

  const isCorrect = (idx: number) => (answers[idx] || '').trim().toLowerCase() === data.items[idx].answer.toLowerCase();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {data.items.map((it:any,idx:number)=>(
        <div key={idx} className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
          <div className="mb-3 text-sm text-ink/70 dark:text-cream/70">Câu {idx + 1}</div>
          <div className="mb-4 flex items-start gap-1 flex-wrap text-lg font-medium">
            <JyutpingText jyutping={it.sentenceBeforeJyutping} tag="span">{it.sentenceBefore}</JyutpingText>
            <span className="px-2 underline self-center text-verm font-bold">____</span>
            <JyutpingText jyutping={it.sentenceAfterJyutping} tag="span">{it.sentenceAfter}</JyutpingText>
          </div>
          <input 
            className={cn(
              "w-full border-2 rounded-xl p-3 bg-cream dark:bg-black/10 text-ink focus:border-jade focus:ring-2 focus:ring-jade/50 outline-none transition-colors",
              showAnswers && isCorrect(idx) && "border-jade bg-jade/10",
              showAnswers && !isCorrect(idx) && "border-verm bg-verm/10"
            )}
            placeholder="Điền từ vào đây" 
            value={answers[idx] || ''}
            onChange={e=>setVal(idx,e.target.value)} 
            readOnly={showAnswers}
          />
          {showAnswers && !isCorrect(idx) && (
            <div className="mt-2 text-sm text-jade">Đáp án đúng: <span className="font-semibold">{it.answer}</span></div>
          )}
          {it.hint && <div className="text-xs text-black/60 dark:text-white/60 mt-2">Gợi ý: {it.hint}</div>}
        </div>
      ))}
      {showAnswers === undefined && <div className="font-semibold text-ink dark:text-cream mt-6">Điểm: {score}/{data.items.length}</div>}
    </div>
  )
}