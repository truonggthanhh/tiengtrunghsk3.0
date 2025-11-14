"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon, ArrowRight, XCircle } from 'lucide-react';

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
      <div className="p-5 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 opacity-60">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
            <Icon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex-1">
            <div className="text-base font-semibold text-gray-600 dark:text-gray-400">
              {label}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-red-500 dark:text-red-400">
              <XCircle className="h-3 w-3" />
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
      className={`group block p-5 rounded-lg border-2 ${colors.border} bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Simple icon with solid color background */}
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.from} ${colors.to} group-hover:scale-105 transition-transform`}>
            <Icon className="h-6 w-6 text-white" />
          </div>

          {/* Clean text */}
          <div className="flex-1">
            <h3 className={`text-base md:text-lg font-bold ${colors.text} group-hover:underline`}>
              {label}
            </h3>
          </div>
        </div>

        {/* Simple arrow */}
        <ArrowRight className={`h-5 w-5 ${colors.text} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
      </div>
    </Link>
  );
}