/**
 * Mission Cards Component
 * Displays daily/weekly/newbie missions with progress
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle2, Clock, Gift } from 'lucide-react';
import type { UserMission, Mission } from '@/types/gamification';

interface MissionCardsProps {
  missions: (UserMission & { mission: Mission })[];
  type?: 'daily' | 'weekly' | 'newbie' | 'all';
}

export default function MissionCards({ missions, type = 'all' }: MissionCardsProps) {

  const filteredMissions = type === 'all'
    ? missions
    : missions.filter(m => m.mission.mission_type === type);

  const getMissionTypeColor = (missionType: string) => {
    switch (missionType) {
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-purple-500';
      case 'newbie': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMissionTypeLabel = (missionType: string) => {
    switch (missionType) {
      case 'daily': return 'Hàng ngày';
      case 'weekly': return 'Hàng tuần';
      case 'newbie': return 'Tân thủ';
      default: return missionType;
    }
  };

  return (
    <div className="space-y-4">
      {filteredMissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Không có nhiệm vụ nào
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredMissions.map((userMission) => {
          const progress = Math.min(100, Math.round((userMission.progress / userMission.target) * 100));
          const isCompleted = userMission.is_completed;

          return (
            <Card
              key={userMission.id}
              className={`transition-all ${isCompleted ? 'opacity-75 bg-green-50 dark:bg-green-900/20' : 'hover:shadow-lg'}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                      <span className={isCompleted ? 'line-through text-gray-500' : ''}>
                        {userMission.mission.title}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {userMission.mission.description}
                    </CardDescription>
                  </div>

                  <Badge className={`${getMissionTypeColor(userMission.mission.mission_type)} text-white flex-shrink-0`}>
                    {getMissionTypeLabel(userMission.mission.mission_type)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Tiến độ</span>
                    <span className="font-medium">
                      {userMission.progress} / {userMission.target}
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className={`h-2 ${isCompleted ? 'bg-green-200 dark:bg-green-900' : ''}`}
                  />
                </div>

                {/* Rewards */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <Gift className="w-4 h-4" />
                    <span className="font-medium">
                      {userMission.mission.reward_xp} XP
                    </span>
                  </div>

                  {userMission.mission.reward_cards > 0 && (
                    <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400">
                      <span className="font-medium">
                        {userMission.mission.reward_cards} thẻ
                      </span>
                    </div>
                  )}

                  {userMission.mission.reward_spins > 0 && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <span className="font-medium">
                        {userMission.mission.reward_spins} lượt quay
                      </span>
                    </div>
                  )}
                </div>

                {/* Reset info for daily/weekly */}
                {(userMission.mission.mission_type === 'daily' || userMission.mission.mission_type === 'weekly') && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>
                      Làm mới {userMission.mission.mission_type === 'daily' ? 'hàng ngày' : 'hàng tuần'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
