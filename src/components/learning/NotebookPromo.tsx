import { Link } from 'react-router-dom';
import { BookMarked, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LearningLanguage } from '@/lib/auth/navigation';

export default function NotebookPromo({ language }: { language: LearningLanguage }) {
  return <section className="relative z-10 mx-auto my-6 max-w-6xl px-4"><div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><BookMarked className="mt-1 h-6 w-6 shrink-0 text-primary" /><div><h2 className="text-lg font-bold">Từ mới hôm nay, nhớ lâu ngày mai</h2><p className="mt-1 text-sm text-muted-foreground">Lưu từ yêu thích, luyện chọn nghĩa và ôn riêng những từ chưa nhớ.</p></div></div><Button asChild className="shrink-0"><Link to={`/${language}/notebook`}>Mở sổ từ cá nhân<ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div></section>;
}
