/**
 * Open Card Pack API
 * Opens a card pack and returns random cards based on rarity weights
 */

import type { APIRoute } from '@/types/api-route';
import { createClient } from '@supabase/supabase-js';
import { selectRarityByWeight } from '@/lib/gamification/cardSystem';
import type { CardSource } from '@/types/gamification';

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
    const { source = 'quiz_reward', pack_size = 3 } = body;

    // Validate source
    const validSources: CardSource[] = ['quiz_reward', 'boss_win', 'mission_complete', 'wheel_spin', 'daily_login', 'level_up'];
    if (!validSources.includes(source as CardSource)) {
      return new Response(JSON.stringify({ error: 'Invalid card source' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!Number.isSafeInteger(pack_size) || pack_size < 1 || pack_size > 100) {
      return new Response(JSON.stringify({ error: 'pack_size must be an integer from 1 to 100' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate cards based on rarity weights
    const cards = [];

    for (let i = 0; i < pack_size; i++) {
      const rarity = selectRarityByWeight(source as CardSource);

      // Get a random card of this rarity
      const { data: queriedCards, error: cardError } = await supabase
        .from('cards')
        .select('*')
        .eq('rarity', rarity)
        .limit(10);

      let availableCards = queriedCards;
      if (cardError) throw cardError;
      if (!availableCards?.length) {
        const { data: fallbackCards, error: fallbackError } = await supabase
          .from('cards').select('*').eq('rarity', 'common').limit(10);
        if (fallbackError) throw fallbackError;
        availableCards = fallbackCards;
      }
      if (!availableCards?.length) throw new Error('No cards available');

      // Select random card from available cards
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];

      // Add card to user's collection
      const { data: userCard, error: insertError } = await supabase
        .from('user_cards')
        .insert({
          user_id: user.id,
          card_id: randomCard.id,
          source
        })
        .select('*, card:cards(*)')
        .single();

      if (insertError) throw insertError;
      if (!userCard) throw new Error('Failed to save card');
      cards.push(userCard);
    }

    return new Response(JSON.stringify({
      success: true,
      cards,
      pack_size
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error opening card pack:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
