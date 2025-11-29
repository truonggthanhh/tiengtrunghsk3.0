"use client"
import React from 'react'
import { useSettings } from '@/cantonese/components/providers/SettingsProvider'
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function shuffle<T>(arr:T[]):T[]{ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }

type WordItem = { word: string; jyutping: string; id: string; };

function SortableItem({ item, showJyutping }: { item: WordItem; showJyutping: boolean; }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.7 : 1,
    marginRight: '8px', 
    marginBottom: '8px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 rounded-xl border-2 border-ink/15 bg-cream dark:bg-black/10 text-center text-ink cursor-grab active:cursor-grabbing"
    >
      <div className="font-semibold">{item.word}</div>
      {showJyutping && item.jyutping && <div className="text-xs opacity-70 font-normal mt-0.5">{item.jyutping}</div>}
    </div>
  );
}

export default function Reorder({data, onAttach, showAnswers}:{data:any, onAttach?:(h:any)=>void, showAnswers?: boolean}){
  const { showJyutping } = useSettings();

  // Normalize data to support both old (words/solution) and new (shuffled/correct) formats
  const normalizedData = React.useMemo(() => {
    if (!data?.items) return { items: [] };

    return {
      ...data,
      items: data.items.map((item: any) => {
        // If item already has words/solution, use it
        if (item.words && item.solution) {
          return item;
        }

        // Otherwise, convert from shuffled/correct format
        return {
          words: item.shuffled || [],
          wordsJyutping: item.shuffledJyutping || [],
          solution: item.correct || [],
          solutionJyutping: item.correctJyutping || [],
          translation: item.translation
        };
      })
    };
  }, [data]);

  const [answers, setAnswers] = React.useState<WordItem[][]>(() => {
    if (!normalizedData?.items) return [];
    return normalizedData.items.map((it: any, itemIdx: number) => {
      const combined = it.words.map((word: string, i: number) => ({
        word,
        jyutping: it.wordsJyutping?.[i] || '',
        id: `${itemIdx}-${i}-${word}`
      }));
      return shuffle(combined);
    });
  });

  React.useEffect(() => {
    if (normalizedData?.items) {
      setAnswers(normalizedData.items.map((it: any, itemIdx: number) => {
        const combined = it.words.map((word: string, i: number) => ({
          word,
          jyutping: it.wordsJyutping?.[i] || '',
          id: `${itemIdx}-${i}-${word}`
        }));
        return shuffle(combined);
      }));
    }
  }, [normalizedData.items]);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent, questionIndex: number) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setAnswers((prevAnswers) => {
        const currentQuestionAnswers = [...prevAnswers[questionIndex]];
        const oldIndex = currentQuestionAnswers.findIndex(item => item.id === active.id);
        const newIndex = currentQuestionAnswers.findIndex(item => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return prevAnswers;

        const newOrder = arrayMove(currentQuestionAnswers, oldIndex, newIndex);
        
        const updatedAllAnswers = [...prevAnswers];
        updatedAllAnswers[questionIndex] = newOrder;
        return updatedAllAnswers;
      });
    }
  }

  function isCorrect(idx:number){
    if (!answers[idx] || !normalizedData.items[idx]) return false;
    return answers[idx].map(item => item.word).join(' ') === normalizedData.items[idx].solution.join(' ');
  }

  const score = normalizedData.items.reduce((s:any,_:any,idx:number)=> s + (isCorrect(idx)?1:0), 0)

  React.useEffect(()=>{
    if(onAttach){
      onAttach({
        getScore:()=>({score,total:normalizedData.items.length}),
        getAnswers:()=>answers.map(ans => ans.map(item => item.word))
      })
    }
  },[answers,normalizedData,onAttach, score])

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      {normalizedData.items.map((item:any,idx:number)=>(
        <div key={idx} className="p-6 bg-white dark:bg-black/20 rounded-2xl border border-ink/10 shadow-[0_10px_0_#d7c8b6]">
          <div className="mb-3 text-sm text-ink/70 dark:text-cream/70">Câu {idx + 1}</div>
          <div className="text-lg font-medium text-ink mb-4">Sắp xếp thành câu đúng nghĩa:</div>
          {item.translation && (
            <div className="mb-4 text-sm text-ink/70 dark:text-cream/70 italic">"{item.translation}"</div>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={!showAnswers ? (event) => handleDragEnd(event, idx) : undefined}
          >
            <SortableContext
              items={answers[idx]?.map(item => item.id) || []}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-2">
                {answers[idx]?.map((item)=> (
                  <SortableItem key={item.id} item={item} showJyutping={showJyutping} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {showAnswers ? (
            <div className={`mt-4 text-sm font-semibold ${isCorrect(idx) ? 'text-jade' : 'text-verm'}`}>
              {isCorrect(idx) ? '✅ Bạn đã sắp xếp đúng!' : '❌ Sắp xếp chưa đúng.'}
              {!isCorrect(idx) && (
                <div className="mt-1 font-normal text-ink/80">Đáp án đúng: <span className="font-semibold text-jade">{normalizedData.items[idx].solution.join(' ')}</span></div>
              )}
            </div>
          ) : (
            <div className="mt-4 text-sm text-ink/70 dark:text-cream/70">
              Kéo và thả các từ để sắp xếp
            </div>
          )}
        </div>
      ))}
      {showAnswers === undefined && <div className="font-semibold text-ink dark:text-cream mt-6">Điểm: {score}/{normalizedData.items.length}</div>}
    </div>
  )
}