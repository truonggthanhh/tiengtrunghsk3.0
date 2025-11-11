import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  name: string;
  nameVi: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  unlockedAt?: string;
  pointsReward?: number;
}

const tierColors = {
  bronze: {
    bg: 'bg-gradient-to-br from-amber-700 to-amber-900',
    border: 'border-amber-600',
    text: 'text-amber-100',
    badge: 'bg-amber-800/50 text-amber-100',
  },
  silver: {
    bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
    border: 'border-gray-500',
    text: 'text-gray-100',
    badge: 'bg-gray-500/50 text-gray-100',
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    border: 'border-yellow-500',
    text: 'text-yellow-100',
    badge: 'bg-yellow-500/50 text-yellow-100',
  },
  platinum: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-700',
    border: 'border-purple-600',
    text: 'text-purple-100',
    badge: 'bg-purple-600/50 text-purple-100',
  },
};

const tierLabels = {
  bronze: 'Đồng',
  silver: 'Bạc',
  gold: 'Vàng',
  platinum: 'Bạch Kim',
};

export default function AchievementBadge({
  name,
  nameVi,
  description,
  icon,
  tier,
  unlocked,
  unlockedAt,
  pointsReward,
}: AchievementBadgeProps) {
  // Get icon component dynamically
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Award;
  const colors = tierColors[tier];

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        unlocked
          ? `${colors.bg} ${colors.border} border-2 shadow-lg hover:scale-105 cursor-pointer`
          : 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60 grayscale'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              unlocked ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-300 dark:bg-gray-700'
            )}
          >
            <IconComponent className={cn('w-6 h-6', unlocked ? colors.text : 'text-gray-500')} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={cn(
                  'font-bold text-sm truncate',
                  unlocked ? colors.text : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {nameVi}
              </h3>
              <Badge className={cn('text-xs', unlocked ? colors.badge : 'bg-gray-400 text-gray-700')}>
                {tierLabels[tier]}
              </Badge>
            </div>
            <p
              className={cn(
                'text-xs line-clamp-2',
                unlocked ? 'text-white/90' : 'text-gray-500 dark:text-gray-500'
              )}
            >
              {description}
            </p>
            {unlocked && unlockedAt && (
              <p className="text-xs text-white/70 mt-1">
                Mở khóa: {new Date(unlockedAt).toLocaleDateString('vi-VN')}
              </p>
            )}
            {!unlocked && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                <LucideIcons.Lock className="w-3 h-3" /> Chưa mở khóa
              </p>
            )}
          </div>
        </div>
        {unlocked && pointsReward && pointsReward > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-white/80">
            <LucideIcons.Award className="w-3 h-3" />
            +{pointsReward} điểm
          </div>
        )}
      </div>
      {!unlocked && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      )}
    </Card>
  );
}
