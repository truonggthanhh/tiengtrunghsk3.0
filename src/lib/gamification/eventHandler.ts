/**
 * Gamification Event Handler - Client Side
 * Central handler for all learning events using Supabase client
 */

import type { LearningEvent, LearningEventResponse, UserProgress, GamificationDashboard } from '@/types/gamification';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get user's progress from Supabase
 */
export async function getUserProgress(): Promise<UserProgress | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // If user_progress doesn't exist yet, create it
    if (error.code === 'PGRST116') {
      const { data: newProgress, error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          total_xp: 0,
          current_level: 1,
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return newProgress;
    }
    throw error;
  }

  return data;
}

/**
 * Get user's gamification dashboard data
 */
export async function getGamificationDashboard(): Promise<GamificationDashboard | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get user progress
  const userProgress = await getUserProgress();
  if (!userProgress) return null;

  // Get level info
  const { data: levelInfo } = await supabase
    .from('level_definitions')
    .select('*')
    .eq('level_number', userProgress.current_level)
    .single();

  // Get next level info
  const { data: nextLevelInfo } = await supabase
    .from('level_definitions')
    .select('*')
    .eq('level_number', userProgress.current_level + 1)
    .single();

  // Get user badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badges(*)
    `)
    .eq('user_id', user.id);

  // Get all available badges
  const { data: allBadges } = await supabase
    .from('badges')
    .select('*');

  // Get user missions
  const { data: userMissions } = await supabase
    .from('user_missions')
    .select(`
      *,
      mission:missions(*)
    `)
    .eq('user_id', user.id);

  // Get user cards
  const { data: userCards } = await supabase
    .from('user_cards')
    .select(`
      *,
      card:cards(*)
    `)
    .eq('user_id', user.id);

  // Get total unique cards
  const { count: totalCards } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  // Get user story progress
  const { data: storyProgress } = await supabase
    .from('user_story_progress')
    .select('*')
    .eq('user_id', user.id);

  // Get wheel spins
  const { data: wheelSpins } = await supabase
    .from('user_wheel_spins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const xpToNextLevel = nextLevelInfo ? nextLevelInfo.xp_required - userProgress.total_xp : 0;

  // Group missions by type
  const dailyMissions = (userMissions || []).filter((um: any) => um.mission?.mission_type === 'daily');
  const weeklyMissions = (userMissions || []).filter((um: any) => um.mission?.mission_type === 'weekly');
  const newbieMissions = (userMissions || []).filter((um: any) => um.mission?.mission_type === 'newbie');

  return {
    user_progress: userProgress,
    level_info: levelInfo || { id: 1, level_number: 1, xp_required: 100, title: 'Newbie', description: null, badge_reward_id: null, created_at: new Date().toISOString() },
    next_level_info: nextLevelInfo,
    xp_to_next_level: xpToNextLevel,
    badges: {
      total: allBadges?.length || 0,
      unlocked: userBadges || [],
      available: allBadges || []
    },
    missions: {
      daily: dailyMissions,
      weekly: weeklyMissions,
      newbie: newbieMissions
    },
    cards: {
      total_collected: userCards?.length || 0,
      unique_cards: new Set(userCards?.map((uc: any) => uc.card_id)).size || 0,
      collection_completion_percentage: totalCards ? ((userCards?.length || 0) / totalCards) * 100 : 0,
      recent_cards: (userCards || []).slice(0, 10)
    },
    story: {
      current_chapter: null,
      unlocked_chapters: storyProgress || [],
      completion_percentage: 0
    },
    wheel: {
      spins_available: wheelSpins?.spins_available || 0,
      last_spin_date: wheelSpins?.last_spin_date || null
    }
  };
}

/**
 * Record a learning event and update gamification state
 */
export async function recordLearningEvent(
  event: LearningEvent
): Promise<LearningEventResponse> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Calculate XP earned based on event type and performance
  let xpEarned = 0;

  switch (event.event_type) {
    case 'quiz_complete':
      const scorePercentage = event.correct_count / event.total_count;
      xpEarned = Math.floor(event.total_count * 10 * scorePercentage);
      break;
    case 'lesson_complete':
      xpEarned = 50;
      break;
    case 'daily_login':
      xpEarned = 10;
      break;
    case 'streak_milestone':
      xpEarned = 100;
      break;
    default:
      xpEarned = 10;
  }

  // Insert XP event
  const { error: eventError } = await supabase
    .from('xp_events')
    .insert({
      user_id: user.id,
      event_type: event.event_type,
      xp_earned: xpEarned,
      source_id: event.source_id,
      metadata: event.metadata || {}
    });

  if (eventError) throw eventError;

  // Update user progress
  const userProgress = await getUserProgress();
  if (!userProgress) throw new Error('Failed to get user progress');

  const newTotalXp = userProgress.total_xp + xpEarned;

  // Calculate new level
  const { data: levels } = await supabase
    .from('level_definitions')
    .select('*')
    .lte('xp_required', newTotalXp)
    .order('level_number', { ascending: false })
    .limit(1);

  const newLevel = levels?.[0]?.level_number || 1;
  const leveledUp = newLevel > userProgress.current_level;

  // Update user progress
  const { error: updateError } = await supabase
    .from('user_progress')
    .update({
      total_xp: newTotalXp,
      current_level: newLevel,
      last_activity_date: new Date().toISOString().split('T')[0]
    })
    .eq('user_id', user.id);

  if (updateError) throw updateError;

  return {
    xp_gained: xpEarned,
    new_total_xp: newTotalXp,
    level_up: leveledUp,
    new_level: newLevel,
    badges_unlocked: [],
    cards_earned: []
  };
}

/**
 * Get user's badges
 */
export async function getUserBadges() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      *,
      badge:badges(*)
    `)
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

/**
 * Get all available badges
 */
export async function getAllBadges() {
  const { data, error } = await supabase
    .from('badges')
    .select('*');

  if (error) throw error;
  return data;
}

/**
 * Open card pack
 */
export async function openCardPack(source: string, count: number = 1) {
  // TODO: Implement card pack opening logic
  throw new Error('Card pack opening not yet implemented');
}

/**
 * Get user's card collection
 */
export async function getMyCardCollection() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_cards')
    .select(`
      *,
      card:cards(*)
    `)
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

/**
 * Get active missions
 */
export async function getActiveMissions() {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data;
}

/**
 * Get mission progress
 */
export async function getMyMissionProgress() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_missions')
    .select(`
      *,
      mission:missions(*)
    `)
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}

/**
 * Start boss battle
 */
export async function startBossBattle(bossId: string) {
  // TODO: Implement boss battle logic
  throw new Error('Boss battles not yet implemented');
}

/**
 * Submit boss answer
 */
export async function submitBossAnswer(battleId: string, answer: string) {
  // TODO: Implement boss answer submission
  throw new Error('Boss battles not yet implemented');
}

/**
 * Spin lucky wheel
 */
export async function spinLuckyWheel() {
  // TODO: Implement lucky wheel spin
  throw new Error('Lucky wheel not yet implemented');
}

/**
 * Get available wheel spins
 */
export async function getAvailableSpins() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_wheel_spins')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get story chapters
 */
export async function getStoryChapters() {
  const { data, error } = await supabase
    .from('story_chapters')
    .select('*')
    .order('chapter_number', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get story progress
 */
export async function getMyStoryProgress() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('user_story_progress')
    .select(`
      *,
      chapter:story_chapters(*)
    `)
    .eq('user_id', user.id);

  if (error) throw error;
  return data;
}
