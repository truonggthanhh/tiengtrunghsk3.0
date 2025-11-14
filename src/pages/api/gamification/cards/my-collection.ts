/**
 * My Card Collection API
 * Get user's card collection with filtering and sorting options
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

    // Get query parameters
    const rarity = url.searchParams.get('rarity');
    const sortBy = url.searchParams.get('sort') || 'recent'; // recent, rarity, alphabetical

    // Build query
    let query = supabase
      .from('user_cards')
      .select('*, card:cards(*)')
      .eq('user_id', user.id);

    // Apply rarity filter if provided
    if (rarity) {
      query = query.eq('card.rarity', rarity);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rarity':
        query = query.order('card.rarity', { ascending: false });
        break;
      case 'alphabetical':
        query = query.order('card.vocabulary', { ascending: true });
        break;
      case 'recent':
      default:
        query = query.order('obtained_at', { ascending: false });
        break;
    }

    const { data: userCards, error: cardsError } = await query;

    if (cardsError) {
      throw cardsError;
    }

    // Calculate collection stats
    const totalCards = userCards?.length || 0;
    const uniqueCards = new Set(userCards?.map(uc => uc.card_id)).size;

    // Get rarity breakdown
    const rarityBreakdown = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    userCards?.forEach(uc => {
      if (uc.card && uc.card.rarity) {
        rarityBreakdown[uc.card.rarity as keyof typeof rarityBreakdown]++;
      }
    });

    // Get total available cards
    const { count: totalAvailableCards } = await supabase
      .from('cards')
      .select('id', { count: 'exact', head: true });

    const completionPercentage = totalAvailableCards
      ? Math.round((uniqueCards / totalAvailableCards) * 100)
      : 0;

    return new Response(JSON.stringify({
      success: true,
      cards: userCards || [],
      stats: {
        total_cards: totalCards,
        unique_cards: uniqueCards,
        completion_percentage: completionPercentage,
        rarity_breakdown: rarityBreakdown,
        total_available: totalAvailableCards || 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching card collection:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
