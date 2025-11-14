/**
 * XP Progress Bar Component
 * Shows current level, XP, and progress to next level
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface XPProgressBarProps {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  levelTitle?: string;
}

export default function XPProgressBar({
  currentLevel,
  currentXP,
  xpForCurrentLevel,
  xpForNextLevel,
  levelTitle = `Level ${currentLevel}`
}: XPProgressBarProps) {

  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = xpNeededForLevel > 0
    ? Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)
    : 100;

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-purple-300/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Level Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 px-3 py-1 rounded-full border-2 border-yellow-400 shadow-md">
              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                {currentLevel}
              </span>
            </div>
          </div>

          {/* Progress Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {levelTitle}
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </h3>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {xpInCurrentLevel} / {xpNeededForLevel} XP
              </span>
            </div>

            {/* Progress Bar */}
            <Progress
              value={progressPercentage}
              className="h-3 bg-gray-200 dark:bg-gray-700"
            />

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {xpNeededForLevel - xpInCurrentLevel} XP to Level {currentLevel + 1}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
