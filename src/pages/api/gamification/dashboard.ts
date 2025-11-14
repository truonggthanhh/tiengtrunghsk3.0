/**
 * Gamification Dashboard API
 * Get complete dashboard data including progress, badges, missions, cards, story, etc.
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import type { GamificationDashboard } from '@/types/gamification';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    // Get session from cookie
    const accessToken = cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch user progress
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (progressError && progressError.code !== 'PGRST116') {
      throw progressError;
    }

    if (!userProgress) {
      // User hasn't started any activities yet
      return new Response(JSON.stringify({ dashboard: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch level definitions
    const { data: currentLevelInfo } = await supabase
      .from('level_definitions')
      .select('*')
      .eq('level', userProgress.current_level)
      .single();

    const { data: nextLevelInfo } = await supabase
      .from('level_definitions')
      .select('*')
      .eq('level', userProgress.current_level + 1)
      .single();

    // Fetch user badges
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', user.id);

    // Fetch all available badges
    const { data: allBadges } = await supabase
      .from('badges')
      .select('*');

    // Fetch user missions
    const { data: userMissions } = await supabase
      .from('user_missions')
      .select('*, mission:missions(*)')
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Separate missions by type
    const dailyMissions = userMissions?.filter(m => m.mission.mission_type === 'daily') || [];
    const weeklyMissions = userMissions?.filter(m => m.mission.mission_type === 'weekly') || [];
    const newbieMissions = userMissions?.filter(m => m.mission.mission_type === 'newbie') || [];

    // Fetch user cards
    const { data: userCards } = await supabase
      .from('user_cards')
      .select('*, card:cards(*)')
      .eq('user_id', user.id);

    const totalCards = userCards?.length || 0;
    const uniqueCards = new Set(userCards?.map(uc => uc.card_id)).size;

    // Get total available cards to calculate completion percentage
    const { count: totalAvailableCards } = await supabase
      .from('cards')
      .select('id', { count: 'exact', head: true });

    const collectionCompletionPercentage = totalAvailableCards
      ? Math.round((uniqueCards / totalAvailableCards) * 100)
      : 0;

    // Fetch story progress
    const { data: storyProgress } = await supabase
      .from('user_story_progress')
      .select('*, chapter:story_chapters(*)')
      .eq('user_id', user.id)
      .order('chapter_number', { ascending: false });

    const currentChapter = storyProgress?.find(sp => sp.is_completed === false) || null;
    const unlockedChapters = storyProgress?.filter(sp => sp.is_unlocked) || [];

    // Get total chapters to calculate completion
    const { count: totalChapters } = await supabase
      .from('story_chapters')
      .select('id', { count: 'exact', head: true });

    const completedChapters = storyProgress?.filter(sp => sp.is_completed).length || 0;
    const storyCompletionPercentage = totalChapters
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

    // Fetch wheel spins
    const { data: wheelData } = await supabase
      .from('user_wheel_spins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const spinsAvailable = wheelData?.spins_available || 0;
    const lastSpinDate = wheelData?.last_spin_date || null;

    // Calculate XP to next level
    const xpToNextLevel = nextLevelInfo
      ? nextLevelInfo.xp_required - userProgress.total_xp
      : 0;

    // Build dashboard object
    const dashboard: GamificationDashboard = {
      user_progress: userProgress,
      level_info: currentLevelInfo || {
        level: userProgress.current_level,
        xp_required: 0,
        title: `Level ${userProgress.current_level}`,
        rewards: {},
        created_at: new Date().toISOString()
      },
      next_level_info: nextLevelInfo || null,
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
        total_collected: totalCards,
        unique_cards: uniqueCards,
        collection_completion_percentage: collectionCompletionPercentage,
        recent_cards: userCards?.slice(0, 10) || []
      },
      story: {
        current_chapter: currentChapter,
        unlocked_chapters: unlockedChapters,
        completion_percentage: storyCompletionPercentage
      },
      wheel: {
        spins_available: spinsAvailable,
        last_spin_date: lastSpinDate
      }
    };

    return new Response(JSON.stringify({ dashboard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
