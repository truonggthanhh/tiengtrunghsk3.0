"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon, ArrowRight, XCircle, Sparkles } from 'lucide-react';

interface ExerciseNeonCardProps {
  label: string;
  type: string;
  icon: LucideIcon;
  lessonId: string;
  isAvailable: boolean;
  colors: {
    from: string;
    to: string;
    border: string;
    text: string;
    glow: string;
  };
}

export default function ExerciseNeonCard({ label, type, icon: Icon, lessonId, isAvailable, colors }: ExerciseNeonCardProps) {
  // Determine the correct destination URL
  const destination = type.toLowerCase() === 'review'
    ? `/cantonese/review/${lessonId}`
    : `/cantonese/practice/${lessonId}/${type}`;

  if (!isAvailable) {
    return (
      <div className="group relative p-6 md:p-8 rounded-2xl transition-all duration-300 overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-700 opacity-60 grayscale cursor-not-allowed">
        <div className="flex items-center gap-5">
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div className="p-4 rounded-xl bg-gray-200 dark:bg-gray-800">
              <Icon className="h-10 w-10 text-gray-500 dark:text-gray-600" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-xl md:text-2xl font-black tracking-wide text-gray-700 dark:text-gray-400">
              {label}
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
              <XCircle className="h-4 w-4" />
              Chưa có bài tập
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={destination}
      className={`group relative p-6 md:p-8 rounded-2xl transition-all duration-300 overflow-hidden bg-white/95 dark:bg-black/70 backdrop-blur-md border-2 ${colors.border} hover:scale-[1.02] shadow-xl dark:${colors.glow} hover:shadow-2xl`}
    >
      {/* Neon border gradient - ONLY in dark mode */}
      <div
        className="hidden dark:block absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity"
        style={{
          background: `linear-gradient(45deg, currentColor, transparent, currentColor)`,
          padding: '2px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}
      />

      {/* Glow effect on hover - ONLY in dark mode */}
      <div className={`hidden dark:block absolute -inset-1 bg-gradient-to-r ${colors.from} ${colors.to} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-5">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {/* Icon with gradient background */}
          <div className="relative flex-shrink-0">
            <div className={`p-5 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} group-hover:scale-110 transition-transform duration-300 shadow-lg dark:${colors.glow}`}>
              <Icon className={`h-12 w-12 ${colors.text}`} />
            </div>
            <Sparkles className={`absolute -top-1 -right-1 h-5 w-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity animate-pulse`} />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl md:text-2xl font-black tracking-wide text-gray-900 dark:text-white group-hover:${colors.text} transition-colors`}>
              <span style={{ textShadow: '0 0 10px rgba(255,16,240,0.2)' }}>
                {label}
              </span>
            </h3>
          </div>
        </div>

        {/* Arrow with animation */}
        <ArrowRight className={`h-8 w-8 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:translate-x-2 group-hover:${colors.text} group-hover:scale-125`} />
      </div>
    </Link>
  );
}