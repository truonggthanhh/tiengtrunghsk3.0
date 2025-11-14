/**
 * Card Collection System - Rarity & Selection Logic
 */

import type { CardRarity, CardSource } from '@/types/gamification';

export interface RarityWeight {
  rarity: CardRarity;
  weight: number;
}

/**
 * Rarity distribution by source
 * Higher weight = more likely to appear
 */
export const CARD_RARITY_WEIGHTS: Record<CardSource, RarityWeight[]> = {
  quiz_reward: [
    { rarity: 'common', weight: 70 },
    { rarity: 'rare', weight: 25 },
    { rarity: 'epic', weight: 4 },
    { rarity: 'legendary', weight: 1 }
  ],
  boss_win: [
    { rarity: 'common', weight: 30 },
    { rarity: 'rare', weight: 40 },
    { rarity: 'epic', weight: 25 },
    { rarity: 'legendary', weight: 5 }
  ],
  wheel_spin: [
    { rarity: 'common', weight: 50 },
    { rarity: 'rare', weight: 35 },
    { rarity: 'epic', weight: 12 },
    { rarity: 'legendary', weight: 3 }
  ],
  daily_login: [
    { rarity: 'common', weight: 80 },
    { rarity: 'rare', weight: 18 },
    { rarity: 'epic', weight: 2 },
    { rarity: 'legendary', weight: 0 }
  ],
  mission_complete: [
    { rarity: 'common', weight: 60 },
    { rarity: 'rare', weight: 30 },
    { rarity: 'epic', weight: 9 },
    { rarity: 'legendary', weight: 1 }
  ],
  level_up: [
    { rarity: 'common', weight: 40 },
    { rarity: 'rare', weight: 35 },
    { rarity: 'epic', weight: 20 },
    { rarity: 'legendary', weight: 5 }
  ]
};

/**
 * Select card rarity based on weighted random
 */
export function selectRarityByWeight(source: CardSource): CardRarity {
  const weights = CARD_RARITY_WEIGHTS[source];
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const { rarity, weight } of weights) {
    cumulativeWeight += weight;
    if (random <= cumulativeWeight) {
      return rarity;
    }
  }

  return 'common'; // fallback
}

/**
 * Get rarity color for UI
 */
export function getRarityColor(rarity: CardRarity): string {
  switch (rarity) {
    case 'legendary': return 'from-yellow-400 to-orange-500';
    case 'epic': return 'from-purple-400 to-pink-500';
    case 'rare': return 'from-blue-400 to-cyan-500';
    case 'common': return 'from-gray-400 to-gray-500';
    default: return 'from-gray-300 to-gray-400';
  }
}

/**
 * Get rarity display name
 */
export function getRarityName(rarity: CardRarity): string {
  switch (rarity) {
    case 'legendary': return 'Huyền Thoại';
    case 'epic': return 'Sử Thi';
    case 'rare': return 'Hiếm';
    case 'common': return 'Thường';
    default: return rarity;
  }
}

/**
 * Shuffle array utility
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
