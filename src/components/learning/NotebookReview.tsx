import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SpeakerButton from '@/components/SpeakerButton';
import { reviewChoices, type NotebookWord } from '@/lib/notebook';
import type { LearningLanguage } from '@/lib/auth/navigation';

export default function NotebookReview({ words, language, mode, onAnswer, onExit }: { words: NotebookWord[]; language: LearningLanguage; mode: 'cards' | 'quiz'; onAnswer: (id: string, correct: boolean) => void; onExit: () => void }) {
  const [queue, setQueue] = useState(words);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<NotebookWord[]>([]);
  const lock = useRef(false);
  const current = queue[index];
  const choices = useMemo(() => current ? reviewChoices(current, words) : [], [current, words]);
  function answer(value: boolean) {
    if (lock.current || !current) return;
    lock.current = true; setResult(value); onAnswer(current.id, value);
    if (value) setCorrect(count => count + 1); else setMissed(previous => [...previous, current]);
  }
  function next() {
    if (!lock.current) return;
    lock.current = false; setResult(null); setRevealed(false); setIndex(value => value + 1);
  }
  if (!current) return <section className="space-y-5 rounded-2xl border bg-card p-6 text-center" aria-label="Kết quả ôn tập"><h2 className="text-2xl font-bold">Hoàn thành lượt ôn!</h2><p className="text-lg">Bạn đã nhớ đúng {correct}/{queue.length} từ.</p><p className="text-muted-foreground">{missed.length ? `${missed.length} từ cần ôn thêm. Bạn có thể luyện riêng nhóm này.` : 'Tất cả từ trong lượt này đều đã nhớ tốt.'}</p><div className="flex flex-wrap justify-center gap-3">{missed.length > 0 && <Button onClick={() => { setQueue(missed); setMissed([]); setIndex(0); setCorrect(0); lock.current = false; }}>Ôn lại từ chưa nhớ</Button>}<Button variant="outline" onClick={onExit}>Về sổ từ</Button></div></section>;
  return <section className="mx-auto max-w-2xl space-y-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-8" aria-label="Ôn sổ từ">
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Từ {index + 1}/{queue.length} · {mode === 'cards' ? 'Thẻ ghi nhớ' : 'Chọn nghĩa'}</p><Button variant="ghost" size="sm" onClick={onExit}>Kết thúc lượt ôn</Button></div>
    <Progress value={(index / queue.length) * 100} />
    <div className="space-y-3 py-6 text-center" aria-live="polite"><h2 className="break-words text-5xl font-bold">{current.hanzi}</h2><p className="text-lg text-muted-foreground">{current.pronunciation}</p><SpeakerButton className="bg-primary/10 text-primary hover:bg-primary/20" text={current.hanzi} language={language === 'mandarin' ? 'zh-CN' : 'zh-HK'} /></div>
    {mode === 'cards' ? <div className="space-y-4 text-center">{!revealed ? <Button className="w-full" onClick={() => setRevealed(true)}>Hiện nghĩa</Button> : <><p className="rounded-xl bg-secondary p-4 text-xl">{current.meaning}</p>{result === null && <div className="grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => answer(false)}>Cần ôn lại</Button><Button onClick={() => answer(true)}>Đã nhớ</Button></div>}</>}</div> : <div className="grid gap-3 sm:grid-cols-2">{choices.map(choice => <Button key={choice} variant="outline" disabled={result !== null} className="h-auto min-h-14 whitespace-normal p-4 text-left" onClick={() => answer(choice === current.meaning)}>{choice}</Button>)}</div>}
    {result !== null && <div role="status" className={`space-y-3 rounded-xl border p-4 ${result ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-amber-500/40 bg-amber-500/10'}`}><p className="font-medium">{result ? 'Chính xác, bạn đã nhớ từ này!' : `Hãy ghi nhớ: ${current.meaning}`}</p><Button className="w-full" onClick={next}>{index + 1 === queue.length ? 'Xem kết quả' : 'Từ tiếp theo'}</Button></div>}
  </section>;
}
