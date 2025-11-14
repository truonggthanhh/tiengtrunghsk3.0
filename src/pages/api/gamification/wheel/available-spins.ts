/**
 * Available Spins API
 * Get user's available wheel spins
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

    // Get user's wheel spins
    const { data: userSpins, error: spinsError } = await supabase
      .from('user_wheel_spins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (spinsError && spinsError.code !== 'PGRST116') {
      throw spinsError;
    }

    // If no record exists, create one with 0 spins
    if (!userSpins) {
      const { data: newSpins, error: createError } = await supabase
        .from('user_wheel_spins')
        .insert({
          user_id: user.id,
          spins_available: 0,
          last_spin_date: null
        })
        .select()
        .single();

      if (createError || !newSpins) {
        throw new Error('Failed to create user spins record');
      }

      return new Response(JSON.stringify({
        spins_available: 0,
        last_spin_date: null
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      spins_available: userSpins.spins_available,
      last_spin_date: userSpins.last_spin_date
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching available spins:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
