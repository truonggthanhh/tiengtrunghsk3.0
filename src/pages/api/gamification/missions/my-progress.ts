/**
 * My Missions Progress API
 * Get user's active missions and their progress
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ cookies, url }) => {
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

    // Get query parameter for mission type filter
    const missionType = url.searchParams.get('type'); // daily, weekly, newbie

    // Build query
    let query = supabase
      .from('user_missions')
      .select('*, mission:missions(*)')
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Apply mission type filter if provided
    if (missionType) {
      query = query.eq('mission.mission_type', missionType);
    }

    const { data: userMissions, error: missionsError } = await query;

    if (missionsError) {
      throw missionsError;
    }

    // Separate missions by type
    const missions = {
      daily: userMissions?.filter(m => m.mission.mission_type === 'daily') || [],
      weekly: userMissions?.filter(m => m.mission.mission_type === 'weekly') || [],
      newbie: userMissions?.filter(m => m.mission.mission_type === 'newbie') || [],
      all: userMissions || []
    };

    // Calculate completion stats
    const completed = userMissions?.filter(m => m.is_completed).length || 0;
    const total = userMissions?.length || 0;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return new Response(JSON.stringify({
      success: true,
      missions: missionType ? missions[missionType as keyof typeof missions] : missions,
      stats: {
        total,
        completed,
        in_progress: total - completed,
        completion_percentage: completionPercentage
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching mission progress:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
