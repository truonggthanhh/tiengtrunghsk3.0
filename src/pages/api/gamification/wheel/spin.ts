/**
 * Lucky Wheel Spin API
 * Spin the lucky wheel and award random rewards
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

    // Get user's wheel spins
    const { data: userSpins, error: spinsError } = await supabase
      .from('user_wheel_spins')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (spinsError && spinsError.code !== 'PGRST116') {
      throw spinsError;
    }

    // Check if user has spins available
    if (!userSpins || userSpins.spins_available <= 0) {
      return new Response(JSON.stringify({ error: 'No spins available' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get all wheel rewards
    const { data: allRewards, error: rewardsError } = await supabase
      .from('wheel_rewards')
      .select('*')
      .eq('is_active', true);

    if (rewardsError || !allRewards || allRewards.length === 0) {
      throw new Error('No wheel rewards available');
    }

    // Select random reward based on probability weights
    const totalWeight = allRewards.reduce((sum, r) => sum + r.probability, 0);
    let random = Math.random() * totalWeight;

    let selectedReward = allRewards[0];
    for (const reward of allRewards) {
      random -= reward.probability;
      if (random <= 0) {
        selectedReward = reward;
        break;
      }
    }

    // Deduct spin
    const { error: updateSpinError } = await supabase
      .from('user_wheel_spins')
      .update({
        spins_available: userSpins.spins_available - 1,
        last_spin_date: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateSpinError) {
      throw new Error('Failed to update spins');
    }

    // Record spin history
    await supabase
      .from('wheel_spin_history')
      .insert({
        user_id: user.id,
        reward_id: selectedReward.id,
        reward_type: selectedReward.reward_type,
        reward_value: selectedReward.reward_value
      });

    // Award the reward
    let awardedReward: any = {
      type: selectedReward.reward_type,
      value: selectedReward.reward_value,
      label: selectedReward.reward_label
    };

    switch (selectedReward.reward_type) {
      case 'xp':
        // Award XP
        await fetch(`${new URL(request.url).origin}/api/gamification/event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `sb-access-token=${accessToken}`
          },
          body: JSON.stringify({
            event_type: 'daily_login', // Generic event for bonus XP
            metadata: { source: 'wheel', xp_bonus: selectedReward.reward_value }
          })
        }).catch(err => console.error('Failed to award XP:', err));
        break;

      case 'card_pack':
        // Award card pack
        const cardPackResponse = await fetch(`${new URL(request.url).origin}/api/gamification/cards/open-pack`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `sb-access-token=${accessToken}`
          },
          body: JSON.stringify({
            source: 'wheel_reward',
            pack_size: selectedReward.reward_value
          })
        }).catch(err => {
          console.error('Failed to open card pack:', err);
          return null;
        });

        if (cardPackResponse && cardPackResponse.ok) {
          const cardData = await cardPackResponse.json();
          awardedReward.cards = cardData.cards;
        }
        break;

      case 'extra_spin':
        // Award extra spin
        await supabase
          .from('user_wheel_spins')
          .update({
            spins_available: userSpins.spins_available + selectedReward.reward_value - 1 // -1 because we already deducted one
          })
          .eq('user_id', user.id);
        break;

      case 'item':
        // Award item to inventory (if implemented)
        break;
    }

    return new Response(JSON.stringify({
      success: true,
      reward: awardedReward,
      spins_remaining: Math.max(0, userSpins.spins_available - 1)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error spinning wheel:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
