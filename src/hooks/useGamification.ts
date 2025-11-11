import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
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
    queryKey: ['userPoints', userId],
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
    queryKey: ['pointTransactions', userId],
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
    queryKey: ['achievements'],
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
    queryKey: ['userAchievements', userId],
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPoints', userId] });
      queryClient.invalidateQueries({ queryKey: ['pointTransactions', userId] });
      checkAndUnlockAchievements();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPoints', userId] });
      checkAndUnlockAchievements();
    },
  });

  // Check and unlock achievements
  const checkAndUnlockAchievements = async () => {
    if (!userId || !allAchievements || !userPoints) return;

    const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.requirement_type) {
        case 'points':
          shouldUnlock = userPoints.total_points >= achievement.requirement_value;
          break;
        case 'streak_days':
          shouldUnlock = userPoints.current_streak_days >= achievement.requirement_value;
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

          queryClient.invalidateQueries({ queryKey: ['userAchievements', userId] });
        }
      }
    }
  };

  return {
    userPoints,
    transactions,
    allAchievements,
    userAchievements,
    isLoading: isLoadingPoints || isLoadingTransactions || isLoadingAchievements || isLoadingUserAchievements,
    addPoints: addPointsMutation.mutateAsync,
    updateStreak: updateStreakMutation.mutateAsync,
  };
};
