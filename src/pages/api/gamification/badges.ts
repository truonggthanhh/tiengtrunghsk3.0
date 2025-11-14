/**
 * Badges API
 * Get all available badges
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const GET: APIRoute = async ({ url }) => {
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get query parameters
    const rarity = url.searchParams.get('rarity');
    const category = url.searchParams.get('category');

    // Build query
    let query = supabase
      .from('badges')
      .select('*')
      .order('rarity', { ascending: false })
      .order('name', { ascending: true });

    // Apply filters if provided
    if (rarity) {
      query = query.eq('rarity', rarity);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data: badges, error: badgesError } = await query;

    if (badgesError) {
      throw badgesError;
    }

    // Get rarity breakdown
    const rarityBreakdown = {
      common: badges?.filter(b => b.rarity === 'common').length || 0,
      rare: badges?.filter(b => b.rarity === 'rare').length || 0,
      epic: badges?.filter(b => b.rarity === 'epic').length || 0,
      legendary: badges?.filter(b => b.rarity === 'legendary').length || 0
    };

    return new Response(JSON.stringify({
      success: true,
      badges: badges || [],
      stats: {
        total: badges?.length || 0,
        rarity_breakdown: rarityBreakdown
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching badges:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
