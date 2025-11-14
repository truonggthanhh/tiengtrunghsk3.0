/**
 * Gamification Event API
 * Central endpoint for recording learning events and updating XP
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { XP_REWARDS, calculateLevel, getXPForLevel } from '@/lib/gamification/xpRules';
import type { XPEventType, UserProgress } from '@/types/gamification';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get session from cookie
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client with service role for admin operations
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

    // Parse request body
    const body = await request.json();
    const { event_type, metadata } = body;

    if (!event_type) {
      return new Response(JSON.stringify({ error: 'event_type is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate XP reward based on event type
    let xp_earned = 0;

    switch (event_type as XPEventType) {
      case 'quiz_complete':
        if (metadata?.score !== undefined && metadata?.total !== undefined) {
          xp_earned = XP_REWARDS.quiz_complete(metadata.score, metadata.total);
        }
        break;
      case 'lesson_complete':
        xp_earned = XP_REWARDS.lesson_complete;
        break;
      case 'pronunciation_practice':
        xp_earned = XP_REWARDS.pronunciation_practice;
        break;
      case 'boss_win':
        if (metadata?.difficulty !== undefined) {
          xp_earned = XP_REWARDS.boss_win(metadata.difficulty);
        }
        break;
      case 'mission_complete':
        xp_earned = metadata?.xp_reward || XP_REWARDS.mission_complete;
        break;
      case 'daily_login':
        xp_earned = XP_REWARDS.daily_login;
        break;
      case 'streak_milestone':
        if (metadata?.streak !== undefined) {
          xp_earned = XP_REWARDS.streak_milestone(metadata.streak);
        }
        break;
      case 'card_collected':
        xp_earned = XP_REWARDS.card_collected;
        break;
      case 'vocabulary_mastered':
        xp_earned = XP_REWARDS.vocabulary_mastered;
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid event_type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // Get or create user progress
    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let userProgress: UserProgress;

    if (!existingProgress) {
      // Create initial progress for new user
      const { data: newProgress, error: createError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          total_xp: xp_earned,
          current_level: 1,
          current_streak: event_type === 'daily_login' ? 1 : 0,
          longest_streak: event_type === 'daily_login' ? 1 : 0,
          last_activity_date: new Date().toISOString()
        })
        .select()
        .single();

      if (createError || !newProgress) {
        throw new Error('Failed to create user progress');
      }

      userProgress = newProgress;
    } else {
      // Update existing progress
      const newTotalXP = existingProgress.total_xp + xp_earned;
      const newLevel = calculateLevel(newTotalXP);

      // Handle streak logic for daily_login events
      let newStreak = existingProgress.current_streak;
      let newLongestStreak = existingProgress.longest_streak;

      if (event_type === 'daily_login') {
        const lastActivity = existingProgress.last_activity_date
          ? new Date(existingProgress.last_activity_date)
          : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (lastActivity) {
          const lastActivityDate = new Date(lastActivity);
          lastActivityDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === 1) {
            // Consecutive day
            newStreak = existingProgress.current_streak + 1;
          } else if (daysDiff > 1) {
            // Streak broken
            newStreak = 1;
          }
          // If daysDiff === 0, already logged in today, don't change streak
        } else {
          newStreak = 1;
        }

        newLongestStreak = Math.max(newStreak, existingProgress.longest_streak);
      }

      const { data: updatedProgress, error: updateError } = await supabase
        .from('user_progress')
        .update({
          total_xp: newTotalXP,
          current_level: newLevel,
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_activity_date: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError || !updatedProgress) {
        throw new Error('Failed to update user progress');
      }

      userProgress = updatedProgress;
    }

    // Record the XP event
    await supabase
      .from('xp_events')
      .insert({
        user_id: user.id,
        event_type,
        xp_earned,
        metadata: metadata || {}
      });

    // Check for level up
    const leveledUp = existingProgress
      ? userProgress.current_level > existingProgress.current_level
      : false;

    // Check for badge unlocks (simplified - would need more complex logic)
    const newBadges: any[] = [];

    // Update mission progress if applicable
    if (event_type === 'quiz_complete' || event_type === 'lesson_complete') {
      // Update daily/weekly missions that track these activities
      await supabase.rpc('update_mission_progress', {
        p_user_id: user.id,
        p_event_type: event_type,
        p_amount: 1
      }).catch(() => {
        // Mission progress update failed, but don't fail the whole request
        console.error('Failed to update mission progress');
      });
    }

    // Return response with updated progress and rewards
    return new Response(JSON.stringify({
      success: true,
      xp_earned,
      user_progress: userProgress,
      level_up: leveledUp,
      new_level: leveledUp ? userProgress.current_level : null,
      new_badges: newBadges,
      streak_updated: event_type === 'daily_login'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing gamification event:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
