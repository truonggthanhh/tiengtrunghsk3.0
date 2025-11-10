import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Lesson = {
  id: string;
  title: string;
  description: string | null;
};

interface LessonCardProps {
  lesson: Lesson;
  colorClass?: string;
}

const LessonCard = ({ lesson, colorClass = 'jade' }: LessonCardProps) => {
  const baseClasses = `relative flex items-center justify-between p-6 rounded-2xl transition-all duration-300 ease-in-out overflow-hidden
                       bg-white/5 dark:bg-black/20 backdrop-blur-sm border-2 group`;

  const colorStyles = `
    border-${colorClass}/50 shadow-lg shadow-${colorClass}/20
    hover:border-${colorClass} hover:shadow-${colorClass}/40 hover:scale-[1.02]
  `;

  return (
    <Link to={`/cantonese/lessons/${lesson.id}`} className={cn(baseClasses, colorStyles)}>
      <div className="flex items-center gap-5">
        <BookOpen className={cn(`h-10 w-10 text-${colorClass} transition-transform duration-300 group-hover:scale-110`)} style={{ filter: `drop-shadow(0 0 8px currentColor)` }} />
        <div>
          <h3 className="text-xl font-black tracking-wide text-ink dark:text-cream">{lesson.title}</h3>
          {lesson.description && <p className="mt-1 text-sm text-ink/80 dark:text-cream/80 max-w-prose">{lesson.description}</p>}
        </div>
      </div>
      <ArrowRight className="h-8 w-8 text-ink/50 dark:text-cream/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink dark:group-hover:text-cream" />
    </Link>
  );
};

export default LessonCard;