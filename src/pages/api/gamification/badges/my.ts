/**
 * My Badges API
 * Get user's unlocked badges
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

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

    // Get user's badges
    const { data: userBadges, error: badgesError } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    if (badgesError) {
      throw badgesError;
    }

    // Get all available badges to calculate unlocked percentage
    const { count: totalBadges } = await supabase
      .from('badges')
      .select('id', { count: 'exact', head: true });

    const unlockedCount = userBadges?.length || 0;
    const unlockPercentage = totalBadges
      ? Math.round((unlockedCount / totalBadges) * 100)
      : 0;

    // Get rarity breakdown
    const rarityBreakdown = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    userBadges?.forEach(ub => {
      if (ub.badge && ub.badge.rarity) {
        rarityBreakdown[ub.badge.rarity as keyof typeof rarityBreakdown]++;
      }
    });

    return new Response(JSON.stringify({
      success: true,
      badges: userBadges || [],
      stats: {
        unlocked: unlockedCount,
        total: totalBadges || 0,
        unlock_percentage: unlockPercentage,
        rarity_breakdown: rarityBreakdown
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching user badges:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
