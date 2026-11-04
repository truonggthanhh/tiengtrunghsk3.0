import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/cantonese/integrations/supabase/client';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider.shared';
import { toast } from 'sonner';

export interface UserPoints {
  user_id: string;
  total_points: number;
  level: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  activity_type: string;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  name_vi: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points_reward: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export const useGamification = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  // Fetch user points
  const { data: userPoints, isLoading: isLoadingPoints } = useQuery<UserPoints>({
    queryKey: ['cantonese', 'userPoints', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      // If no record exists, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_points')
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }

      return data;
    },
    enabled: !!userId,
  });

  // Fetch point transactions (recent 20)
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<PointTransaction[]>({
    queryKey: ['cantonese', 'pointTransactions', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Fetch all achievements
  const { data: allAchievements, isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
    queryKey: ['cantonese', 'achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user's unlocked achievements
  const { data: userAchievements, isLoading: isLoadingUserAchievements } = useQuery<UserAchievement[]>({
    queryKey: ['cantonese', 'userAchievements', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Add points mutation
  const addPointsMutation = useMutation({
    mutationFn: async ({
      points,
      activityType,
      referenceId,
      description,
    }: {
      points: number;
      activityType: string;
      referenceId?: string;
      description?: string;
    }) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('add_points_to_user', {
        p_user_id: userId,
        p_points: points,
        p_activity_type: activityType,
        p_reference_id: referenceId || null,
        p_description: description || null,
      });

      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cantonese', 'userPoints', userId] });
      await queryClient.invalidateQueries({ queryKey: ['cantonese', 'pointTransactions', userId] });
      await checkAndUnlockAchievements();
    },
  });

  // Update streak mutation
  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('update_user_streak', {
        p_user_id: userId,
      });

      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cantonese', 'userPoints', userId] });
      await checkAndUnlockAchievements();
    },
  });

  // Check and unlock achievements
  const checkAndUnlockAchievements = async () => {
    const currentPoints = queryClient.getQueryData<UserPoints>(['cantonese', 'userPoints', userId]) ?? userPoints;
    if (!userId || !allAchievements || !currentPoints) return;

    const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.requirement_type) {
        case 'points':
          shouldUnlock = currentPoints.total_points >= achievement.requirement_value;
          break;
        case 'streak_days':
          shouldUnlock = currentPoints.current_streak_days >= achievement.requirement_value;
          break;
        // Add more cases for lessons_completed, exercises_completed, perfect_scores
        default:
          break;
      }

      if (shouldUnlock) {
        // Unlock achievement
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          });

        if (!error) {
          toast.success(`🏆 Mở khóa thành tích: ${achievement.name_vi}!`, {
            description: achievement.description,
          });

          // Give reward points if any
          if (achievement.points_reward > 0) {
            await addPointsMutation.mutateAsync({
              points: achievement.points_reward,
              activityType: 'achievement_reward',
              referenceId: achievement.id,
              description: `Phần thưởng thành tích: ${achievement.name_vi}`,
            });
          }

          await queryClient.invalidateQueries({ queryKey: ['cantonese', 'userAchievements', userId] });
        }
      }
    }
  };

  return {
    userPoints,
    userProgress: userPoints ? {
      total_xp: userPoints.total_points,
      current_level: userPoints.level,
      current_streak: userPoints.current_streak_days,
      longest_streak: userPoints.longest_streak_days,
    } : null,
    addXP: (points: number) => addPointsMutation.mutate({ points, activityType: 'game_reward' }),
    transactions,
    allAchievements,
    userAchievements,
    isLoading: isLoadingPoints || isLoadingTransactions || isLoadingAchievements || isLoadingUserAchievements,
    addPoints: addPointsMutation.mutateAsync,
    updateStreak: updateStreakMutation.mutateAsync,
  };
};
