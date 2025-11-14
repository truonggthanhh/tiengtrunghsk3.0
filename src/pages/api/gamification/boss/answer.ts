/**
 * Boss Answer Submission API
 * Submit answer to boss question and update battle state
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
    const { battle_id, question_index, answer, is_correct } = body;

    if (!battle_id || question_index === undefined || !answer || is_correct === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get battle details
    const { data: battle, error: battleError } = await supabase
      .from('boss_battles')
      .select('*, boss:bosses(*)')
      .eq('id', battle_id)
      .eq('user_id', user.id)
      .single();

    if (battleError || !battle) {
      return new Response(JSON.stringify({ error: 'Battle not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (battle.is_completed) {
      return new Response(JSON.stringify({ error: 'Battle already completed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calculate damage
    const damage = is_correct ? 10 : 0; // Deal 10 damage for correct answer
    const newHP = Math.max(0, battle.current_hp - damage);
    const isBossDefeated = newHP === 0;

    // Update battle state
    const updateData: any = {
      current_hp: newHP,
      current_question: question_index + 1
    };

    if (isBossDefeated) {
      updateData.is_completed = true;
      updateData.is_won = true;
      updateData.completed_at = new Date().toISOString();
    }

    const { data: updatedBattle, error: updateError } = await supabase
      .from('boss_battles')
      .update(updateData)
      .eq('id', battle_id)
      .select('*, boss:bosses(*)')
      .single();

    if (updateError || !updatedBattle) {
      throw new Error('Failed to update battle');
    }

    // If boss defeated, award rewards
    let rewards = null;
    if (isBossDefeated && battle.boss) {
      // Award XP
      const xpReward = battle.boss.reward_xp || 0;

      // Update user XP via event endpoint
      await fetch(`${url.origin}/api/gamification/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `sb-access-token=${accessToken}`
        },
        body: JSON.stringify({
          event_type: 'boss_win',
          metadata: {
            difficulty: battle.boss.difficulty,
            boss_id: battle.boss.id
          }
        })
      }).catch(err => console.error('Failed to record boss win event:', err));

      // Award card pack if specified
      let cards = null;
      if (battle.boss.reward_card_pack && battle.boss.reward_card_pack > 0) {
        const cardPackResponse = await fetch(`${url.origin}/api/gamification/cards/open-pack`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `sb-access-token=${accessToken}`
          },
          body: JSON.stringify({
            source: 'boss_win',
            pack_size: battle.boss.reward_card_pack
          })
        }).catch(err => {
          console.error('Failed to open card pack:', err);
          return null;
        });

        if (cardPackResponse && cardPackResponse.ok) {
          const cardData = await cardPackResponse.json();
          cards = cardData.cards;
        }
      }

      rewards = {
        xp: xpReward,
        cards,
        badge: null // Could check for boss-specific badges here
      };
    }

    return new Response(JSON.stringify({
      success: true,
      battle: updatedBattle,
      is_correct,
      damage,
      new_hp: newHP,
      boss_defeated: isBossDefeated,
      rewards
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error submitting boss answer:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
