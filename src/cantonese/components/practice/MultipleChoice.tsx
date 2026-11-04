import { multipleChoiceSchema, type ExerciseHooks } from '@/cantonese/lib/exercisePayload';
import React from 'react'
import JyutpingText from '@/cantonese/components/JyutpingText'
import { cn } from '@/lib/utils'

// Helper function to check if text contains Chinese characters
const containsChinese = (text: string): boolean => {
  return /[\u4e00-\u9fff]/.test(text);
};

export default function MultipleChoice({data: rawData,hotkeyControls, onAttach, showAnswers}:{data:unknown,hotkeyControls?:{setPick:React.Dispatch<React.SetStateAction<(i:number)=>void>>}, onAttach?:(h:ExerciseHooks)=>void, showAnswers?: boolean}){
  const data = React.useMemo(() => multipleChoiceSchema.parse(rawData), [rawData]);
  const [picked,setPicked]=React.useState<number[]>([]);

  React.useEffect(() => {
    if (data?.items) {
      setPicked(Array(data.items.length).fill(-1));
    }
  }, [data.items]);
  
  const score=data.items.reduce((s,it,idx:number)=> s + (picked[idx]===it.correct ? 1 : 0), 0)
  
  React.useEffect(()=>{ 
    if(onAttach){
      onAttach({ 
        getScore:()=>({score,total:data.items.length}),
        getAnswers:()=>picked
      }) 
    }
  },[picked,data,onAttach, score])

  const pick = React.useCallback((idx:number, i:number)=>{ setPicked(previous => { const p=[...previous]; p[idx]=i; return p; }); }, [])
  React.useEffect(()=>{ hotkeyControls?.setPick(()=>(i:number)=>{
    const idx = picked.findIndex(v=>v===-1); if(idx>-1) pick(idx,i)
  })},[picked, hotkeyControls, pick])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {data.items.map((it,idx:number)=>(
        <div key={idx} className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
          <div className="mb-3 text-sm text-ink/70 dark:text-cream/70">Câu {idx + 1}</div>
          <JyutpingText jyutping={containsChinese(it.question) ? it.questionJyutping : undefined} className="mb-4 font-semibold text-lg" tag="div">
            {it.question}
          </JyutpingText>
          <div className="grid gap-3">
            {it.choices.map((c:string,i:number)=> {
              const isPicked = picked[idx] === i;
              const isCorrect = it.correct === i;
              const isWrongPick = isPicked && !isCorrect;

              return (
                <label 
                  key={i} 
                  className={cn(
                    "p-3 rounded-xl border-2 flex items-center gap-3 transition-colors",
                    showAnswers ?
                      (isCorrect ? 'bg-jade/20 border-jade text-jade font-semibold' :
                       isWrongPick ? 'bg-verm/20 border-verm text-verm font-semibold' :
                       'border-ink/15 bg-cream dark:bg-black/10') :
                      (isPicked ? 'bg-verm/20 border-verm' : 'border-ink/15 bg-cream dark:bg-black/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer')
                  )}
                >
                  <input type="radio" name={`q-${idx}`} className="hidden" checked={isPicked} onChange={()=>!showAnswers && pick(idx,i)} disabled={showAnswers}/>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    showAnswers && isCorrect ? 'bg-jade text-cream' :
                    showAnswers && isWrongPick ? 'bg-verm text-cream' :
                    isPicked ? 'bg-verm text-cream' : 
                    'bg-ink/10 dark:bg-white/10 text-ink/70 dark:text-cream/70'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <JyutpingText jyutping={containsChinese(c) ? it.choicesJyutping?.[i] : undefined} tag="span">{c}</JyutpingText>
                </label>
              )
            })}
          </div>
        </div>
      ))}
      {showAnswers === undefined && <div className="font-semibold text-ink dark:text-cream mt-6">Điểm: {score}/{data.items.length}</div>}
    </div>
  )
}