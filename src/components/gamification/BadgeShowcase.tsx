/**
 * Badge Showcase Component
 * Displays user's unlocked badges
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Lock } from 'lucide-react';
import type { Badge as BadgeType, UserBadge } from '@/types/gamification';

interface BadgeShowcaseProps {
  unlockedBadges: (UserBadge & { badge: BadgeType })[];
  lockedBadges?: BadgeType[];
  showLocked?: boolean;
}

export default function BadgeShowcase({
  unlockedBadges,
  lockedBadges = [],
  showLocked = true
}: BadgeShowcaseProps) {

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Huy Hiệu
        </CardTitle>
        <CardDescription>
          Đã mở khóa {unlockedBadges.length} / {unlockedBadges.length + lockedBadges.length} huy hiệu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Unlocked Badges */}
          {unlockedBadges.map((userBadge) => (
            <div
              key={userBadge.id}
              className="relative group cursor-pointer"
            >
              <div className={`aspect-square rounded-xl bg-gradient-to-br ${getRarityColor(userBadge.badge.rarity)} p-1 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-3">
                  {userBadge.badge.icon_url ? (
                    <img
                      src={userBadge.badge.icon_url}
                      alt={userBadge.badge.name}
                      className="w-12 h-12 object-contain mb-2"
                    />
                  ) : (
                    <Award className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-2" />
                  )}
                  <p className="text-xs font-semibold text-center line-clamp-2">
                    {userBadge.badge.name}
                  </p>
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl max-w-xs">
                  <p className="font-bold mb-1">{userBadge.badge.name}</p>
                  <p className="text-gray-300">{userBadge.badge.description}</p>
                  <Badge className="mt-1 text-[10px]" variant="outline">
                    {userBadge.badge.rarity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {/* Locked Badges (optional) */}
          {showLocked && lockedBadges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className="relative group cursor-pointer opacity-50"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 p-1 shadow-md">
                <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-3">
                  <Lock className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-xs font-semibold text-center text-gray-500 line-clamp-2">
                    ???
                  </p>
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-xl max-w-xs">
                  <p className="font-bold mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {badge.name}
                  </p>
                  <p className="text-gray-300 text-[10px]">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {unlockedBadges.length === 0 && (
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có huy hiệu nào. Tiếp tục học để mở khóa!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
