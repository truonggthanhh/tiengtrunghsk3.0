/**
 * Streak Tracker Component
 * Displays current streak and longest streak
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakTracker({ currentStreak, longestStreak }: StreakTrackerProps) {

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-300/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          {/* Current Streak */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-white" />
              </div>
              {currentStreak > 0 && (
                <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-900 rounded-full w-7 h-7 flex items-center justify-center border-2 border-orange-400 shadow-md">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {currentStreak}
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStreak} ngày
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chuỗi hiện tại
              </p>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="flex items-center gap-3 pl-6 border-l border-gray-300 dark:border-gray-700">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {longestStreak} ngày
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Kỷ lục
              </p>
            </div>
          </div>
        </div>

        {/* Streak message */}
        {currentStreak > 0 && (
          <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-900">
            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
              {currentStreak >= 30 && "🔥 Bạn đang cháy! Tiếp tục phát huy!"}
              {currentStreak >= 7 && currentStreak < 30 && "💪 Tuyệt vời! Hãy giữ vững phong độ!"}
              {currentStreak > 0 && currentStreak < 7 && "👍 Khởi đầu tốt! Học mỗi ngày nhé!"}
            </p>
          </div>
        )}

        {currentStreak === 0 && (
          <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-900">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Học hôm nay để bắt đầu chuỗi của bạn! 🚀
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
