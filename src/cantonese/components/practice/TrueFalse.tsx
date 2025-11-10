"use client"
import React from 'react'
import JyutpingText from '@/cantonese/components/JyutpingText'
import { cn } from '@/lib/utils'

export default function TrueFalse({data, onAttach, showAnswers}:{data:any, onAttach?:(h:any)=>void, showAnswers?: boolean}){
  const [picked,setPicked]=React.useState<number[]>([]);

  React.useEffect(() => {
    if (data?.items) {
      setPicked(Array(data.items.length).fill(-1));
    }
  }, [data.items]);
  
  const score=data.items.reduce((s:any,it:any,idx:number)=> s + (picked[idx]=== (it.answer?1:0) ? 1 : 0), 0)
  
  React.useEffect(()=>{ 
    if(onAttach){
      onAttach({ 
        getScore:()=>({score,total:data.items.length}),
        getAnswers:()=>picked
      }) 
    }
  },[picked,data,onAttach, score])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {data.items.map((it:any,idx:number)=>(
        <div key={idx} className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
          <div className="mb-3 text-sm text-ink/70 dark:text-cream/70">Câu {idx + 1}</div>
          <JyutpingText jyutping={it.statementJyutping} className="mb-4 text-lg font-medium">
            {it.statement}
          </JyutpingText>
          <div className="flex gap-3">
            {[{l:'Đúng',v:1},{l:'Sai',v:0}].map(opt=>{
              const isPicked = picked[idx] === opt.v;
              const isCorrectAnswer = it.answer ? 1 : 0;
              const isCorrectPick = isPicked && isCorrectAnswer === opt.v;
              const isWrongPick = isPicked && isCorrectAnswer !== opt.v;

              return (
                <button 
                  key={opt.v} 
                  onClick={()=>{ if(!showAnswers) { const p=[...picked]; p[idx]=opt.v; setPicked(p) } }} 
                  disabled={showAnswers}
                  className={cn(
                    'px-5 py-2 rounded-xl border-2 transition-colors font-semibold',
                    showAnswers ?
                      (isCorrectAnswer === opt.v ? 'bg-jade text-cream border-jade' :
                       isWrongPick ? 'bg-verm text-cream border-verm' :
                       'bg-cream dark:bg-black/10 border-ink/15 text-ink') :
                      (isPicked ? 'bg-verm text-cream border-verm shadow-[0_4px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1' : 'bg-cream dark:bg-black/10 border-ink/15 text-ink hover:bg-black/5 dark:hover:bg-white/5')
                  )}
                >
                  {opt.l}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {showAnswers === undefined && <div className="font-semibold text-ink dark:text-cream mt-6">Điểm: {score}/{data.items.length}</div>}
    </div>
  )
}