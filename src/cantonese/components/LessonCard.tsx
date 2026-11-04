import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen } from 'lucide-react';
interface Props { lesson: { id: string; title: string; description: string | null }; index: number; }
export default function LessonCard({ lesson, index }: Props) {
  return <Link to={`/cantonese/lessons/${lesson.id}`} className="library-lesson group"><span className="library-lesson-number">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0 flex-1"><span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-primary"><BookOpen className="h-3 w-3" />BÀI HỌC</span><h2 className="mt-2 break-words text-base font-bold leading-6">{lesson.title}</h2><p className="mt-2 line-clamp-2 text-xs leading-6 text-muted-foreground">{lesson.description || 'Mở bài học để khám phá nội dung và các hoạt động luyện tập.'}</p></div><ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>;
}
