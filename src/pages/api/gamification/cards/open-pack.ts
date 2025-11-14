/**
 * Open Card Pack API
 * Opens a card pack and returns random cards based on rarity weights
 */

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { selectRarityByWeight, type CardSource } from '@/lib/gamification/cardSystem';

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
    const validSources: CardSource[] = ['quiz_reward', 'boss_win', 'mission_reward', 'wheel_reward', 'purchase'];
    if (!validSources.includes(source as CardSource)) {
      return new Response(JSON.stringify({ error: 'Invalid card source' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate cards based on rarity weights
    const cards = [];

    for (let i = 0; i < pack_size; i++) {
      const rarity = selectRarityByWeight(source as CardSource);

      // Get a random card of this rarity
      const { data: availableCards, error: cardError } = await supabase
        .from('cards')
        .select('*')
        .eq('rarity', rarity)
        .limit(10);

      if (cardError || !availableCards || availableCards.length === 0) {
        // Fallback to common if no cards found
        const { data: fallbackCards } = await supabase
          .from('cards')
          .select('*')
          .eq('rarity', 'common')
          .limit(10);

        if (fallbackCards && fallbackCards.length > 0) {
          const randomCard = fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
          cards.push(randomCard);
        }
        continue;
      }

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

      if (!insertError && userCard) {
        cards.push(userCard);
      } else {
        // Still return the card info even if insertion failed
        cards.push({ card: randomCard });
      }
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
