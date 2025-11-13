import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';

type Lesson = {
  id: string;
  title: string;
  description: string | null;
};

interface LessonCardProps {
  lesson: Lesson;
  colorClass?: string;
}

const LessonCard = ({ lesson }: LessonCardProps) => {
  return (
    <Link
      to={`/cantonese/lessons/${lesson.id}`}
      className="group relative flex items-center justify-between p-6 md:p-8 rounded-2xl transition-all duration-300 overflow-hidden bg-white/95 dark:bg-black/70 backdrop-blur-md border-2 border-pink-300 dark:border-pink-600 hover:border-orange-400 dark:hover:border-orange-400 shadow-xl dark:shadow-pink-500/20 hover:shadow-2xl hover:scale-[1.02]"
    >
      {/* Neon border gradient - ONLY in dark mode */}
      <div
        className="hidden dark:block absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity"
        style={{
          background: 'linear-gradient(45deg, #FF10F0, #FF6B35, #FFD700, #FF10F0)',
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      />

      {/* Glow effect on hover - ONLY in dark mode */}
      <div className="hidden dark:block absolute -inset-1 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-5 flex-1 min-w-0">
        {/* Icon with gradient background */}
        <div className="relative flex-shrink-0">
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-200 to-orange-200 dark:from-pink-900/50 dark:to-orange-900/50 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-pink-500/30">
            <BookOpen className="h-8 w-8 text-pink-600 dark:text-pink-400" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 dark:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl md:text-2xl font-black tracking-wide text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            <span style={{ textShadow: '0 0 8px rgba(255,16,240,0.2)' }}>
              {lesson.title}
            </span>
          </h3>
          {lesson.description && (
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-prose line-clamp-2">
              {lesson.description}
            </p>
          )}
        </div>
      </div>

      {/* Arrow with animation */}
      <ArrowRight className="relative z-10 h-8 w-8 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:translate-x-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:scale-125" />
    </Link>
  );
};

export default LessonCard;