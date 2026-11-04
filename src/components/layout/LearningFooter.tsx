import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart } from 'lucide-react';
import type { LearningLanguage } from '@/lib/auth/navigation';
export default function LearningFooter({ language }: { language: LearningLanguage }) {
  return <footer className="learning-footer"><div className="learning-container flex flex-col justify-between gap-6 py-8 sm:flex-row sm:items-center"><div><Link to={`/${language}`} className="text-xl font-extrabold tracking-tight">haohao<span className="text-primary">.</span></Link><p className="mt-2 text-xs text-muted-foreground">Mỗi ngày một chút. Mỗi chút một bước xa hơn.</p></div><div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground"><Link to={`/${language}/blog`} className="hover:text-primary">Góc đọc</Link><Link to={language === 'mandarin' ? '/cantonese' : '/mandarin'} className="inline-flex items-center gap-1 hover:text-primary">{language === 'mandarin' ? 'Khám phá Quảng Đông' : 'Khám phá tiếng Trung'}<ArrowUpRight className="h-3 w-3" /></Link><span className="inline-flex items-center gap-1">Made with <Heart className="h-3 w-3" /> · {new Date().getFullYear()}</span></div></div></footer>;
}
