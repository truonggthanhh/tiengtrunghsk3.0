import { useState } from 'react';
import { ArrowUpRight, Eye, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpeakerButton from '@/components/SpeakerButton';
import SaveWordButton from '@/components/learning/SaveWordButton';
import type { LearningLanguage } from '@/lib/auth/navigation';

const phrases = {
  mandarin: [
    { hanzi: '慢慢来', pronunciation: 'màn màn lái', meaning: 'Cứ từ từ thôi', note: 'Một lời nhắc nhẹ: tiến bộ đến từ những bước nhỏ.' },
    { hanzi: '加油', pronunciation: 'jiā yóu', meaning: 'Cố lên!', note: 'Một lời động viên quen thuộc dành cho bạn bè và chính mình.' },
    { hanzi: '好久不见', pronunciation: 'hǎo jiǔ bú jiàn', meaning: 'Lâu rồi không gặp', note: 'Câu chào dành cho một người bạn đã lâu chưa gặp.' },
  ],
  cantonese: [
    { hanzi: '慢慢嚟', pronunciation: 'maan6 maan6 lai4', meaning: 'Cứ từ từ thôi', note: 'Một lời nhắc bằng tiếng Quảng: học theo nhịp của bạn.' },
    { hanzi: '唔該', pronunciation: 'm4 goi1', meaning: 'Cảm ơn / làm ơn', note: 'Dùng khi ai đó giúp bạn một việc hoặc khi nhờ giúp đỡ.' },
    { hanzi: '早晨', pronunciation: 'zou2 san4', meaning: 'Chào buổi sáng', note: 'Bắt đầu ngày mới bằng một lời chào thật gần gũi.' },
  ],
};
export default function PhraseCard({ language }: { language: LearningLanguage }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const phrase = phrases[language][index];
  return <section className="phrase-card" aria-label="Một câu nhỏ hôm nay">
    <div className="flex items-center justify-between gap-2 text-xs font-semibold"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />MỘT CÂU NHỎ HÔM NAY</span><span className="phrase-card-tag">{language === 'mandarin' ? '普通话' : '粵語'}</span></div>
    <div className="phrase-card-paper"><span className="phrase-stamp" aria-hidden="true">{language === 'mandarin' ? '學' : '粵'}</span><p lang={language === 'mandarin' ? 'zh-CN' : 'zh-HK'} className="phrase-hanzi" aria-live="polite">{phrase.hanzi}</p><p className="text-base tracking-wide text-muted-foreground">{phrase.pronunciation}</p><div className="mt-7 min-h-16">{revealed ? <p role="status" className="text-xl font-semibold">{phrase.meaning}</p> : <Button variant="outline" className="h-auto max-w-full whitespace-normal rounded-full border-dashed px-3 py-2 text-xs" onClick={() => setRevealed(true)}><Eye />Đoán nghĩa rồi chạm để xem</Button>}</div></div>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">{phrase.note}</p>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-4"><div className="flex items-center gap-2"><SpeakerButton className="bg-primary/10 text-primary hover:bg-primary/20" text={phrase.hanzi} language={language === 'mandarin' ? 'zh-CN' : 'zh-HK'} /><SaveWordButton language={language} {...phrase} /></div><Button variant="ghost" size="icon" className="rounded-full" aria-label="Đổi câu gợi ý" onClick={() => { setIndex(value => (value + 1) % phrases[language].length); setRevealed(false); }}><RotateCw /></Button></div>
    <span className="phrase-card-corner" aria-hidden="true"><ArrowUpRight className="h-6 w-6" /></span>
  </section>;
}
