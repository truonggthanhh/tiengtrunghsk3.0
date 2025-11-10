"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseNeonCardProps {
  label: string;
  type: string;
  icon: LucideIcon;
  lessonId: string;
  isAvailable: boolean;
  colors: {
    accentColor: string; // e.g., 'jade', 'verm', 'neonCyan'
  };
}

export default function ExerciseNeonCard({ label, type, icon: Icon, lessonId, isAvailable, colors }: ExerciseNeonCardProps) {
  const colorClass = colors.accentColor; // e.g., 'jade'

  // Dynamically construct Tailwind classes. The JIT compiler will pick these up.
  const baseClasses = `relative flex items-center justify-between p-6 rounded-2xl transition-all duration-300 ease-in-out overflow-hidden
                       bg-white/5 dark:bg-black/20 backdrop-blur-sm border-2`;

  const availableClasses = `
    border-${colorClass}/50 shadow-lg shadow-${colorClass}/20
    hover:border-${colorClass} hover:shadow-${colorClass}/40 hover:scale-[1.02]
    cursor-pointer group
  `;

  const unavailableClasses = `border-ink/10 opacity-60 grayscale cursor-not-allowed`;

  const textAndIconColor = isAvailable ? `text-${colorClass}` : 'text-ink/70';

  // Determine the correct destination URL
  const destination = type.toLowerCase() === 'review'
    ? `/review/${lessonId}`
    : `/practice/${lessonId}/${type}`;

  return (
    <Link
      to={isAvailable ? destination : '#'}
      className={cn(baseClasses, isAvailable ? availableClasses : unavailableClasses)}
      onClick={(e) => {
        if (!isAvailable) e.preventDefault();
      }}
    >
      <div className="flex items-center gap-5">
        <Icon className={cn("h-10 w-10 transition-transform duration-300 group-hover:scale-110", textAndIconColor)} style={{ filter: `drop-shadow(0 0 8px currentColor)` }} />
        <div>
          <div className="text-2xl font-black tracking-wide text-ink dark:text-cream">{label}</div>
          {!isAvailable && (
            <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-verm">
              <XCircle className="h-4 w-4" />
              Chưa có bài tập
            </div>
          )}
        </div>
      </div>
      {isAvailable && (
        <ArrowRight className="h-8 w-8 text-ink/50 dark:text-cream/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink dark:group-hover:text-cream" />
      )}
    </Link>
  );
}