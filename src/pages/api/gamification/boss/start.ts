/**
 * Start Boss Battle API
 * Initialize a new boss battle for the user
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const POST: APIRoute = async ({ request, cookies }) => {
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

    // Parse request body
    const body = await request.json();
    const { boss_id } = body;

    if (!boss_id) {
      return new Response(JSON.stringify({ error: 'boss_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get boss details
    const { data: boss, error: bossError } = await supabase
      .from('bosses')
      .select('*')
      .eq('id', boss_id)
      .single();

    if (bossError || !boss) {
      return new Response(JSON.stringify({ error: 'Boss not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user meets level requirement
    const { data: userProgress } = await supabase
      .from('user_progress')
      .select('current_level')
      .eq('user_id', user.id)
      .single();

    if (userProgress && userProgress.current_level < boss.level_requirement) {
      return new Response(JSON.stringify({
        error: 'Level requirement not met',
        required_level: boss.level_requirement,
        current_level: userProgress.current_level
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if user has an active battle with this boss
    const { data: existingBattle } = await supabase
      .from('boss_battles')
      .select('*')
      .eq('user_id', user.id)
      .eq('boss_id', boss_id)
      .eq('is_completed', false)
      .single();

    if (existingBattle) {
      // Return existing battle
      return new Response(JSON.stringify({
        success: true,
        battle: existingBattle,
        boss,
        message: 'Continuing existing battle'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create new battle
    const { data: battle, error: battleError } = await supabase
      .from('boss_battles')
      .insert({
        user_id: user.id,
        boss_id: boss_id,
        current_hp: boss.hp,
        questions_data: boss.questions,
        is_completed: false
      })
      .select()
      .single();

    if (battleError || !battle) {
      throw new Error('Failed to create boss battle');
    }

    return new Response(JSON.stringify({
      success: true,
      battle,
      boss,
      message: 'Boss battle started'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error starting boss battle:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
