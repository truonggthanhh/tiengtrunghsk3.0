/**
 * XP Earning Rules for Gamification System
 */

export const XP_REWARDS = {
  // Quiz completion - base 50, bonus for high scores
  quiz_complete: (score: number, total: number): number => {
    const percentage = (score / total) * 100;
    const base = 50;

    if (percentage >= 95) return base + 50; // Perfect bonus
    if (percentage >= 90) return base + 30; // Excellent bonus
    if (percentage >= 80) return base + 20; // Great bonus
    if (percentage >= 70) return base + 10; // Good bonus

    return base;
  },

  // Lesson completion
  lesson_complete: 100,

  // Pronunciation practice - based on score
  pronunciation_practice: (score: number): number => {
    if (score >= 95) return 50; // Perfect
    if (score >= 90) return 40; // Excellent
    if (score >= 80) return 30; // Great
    if (score >= 70) return 25; // Good
    return 15; // Participated
  },

  // Boss battle wins - scales with difficulty
  boss_win: (difficulty: number): number => {
    return 100 + (difficulty * 50); // Level 1 = 150, Level 10 = 600
  },

  // Mission completion
  mission_complete: (type: 'daily' | 'weekly' | 'newbie' | 'special'): number => {
    switch (type) {
      case 'daily': return 50;
      case 'weekly': return 200;
      case 'newbie': return 150;
      case 'special': return 300;
      default: return 30;
    }
  },

  // Daily login
  daily_login: 20,

  // Streak milestones
  streak_milestone: (streak: number): number => {
    if (streak % 100 === 0) return 1000; // 100-day milestone
    if (streak % 30 === 0) return 500;   // Monthly milestone
    if (streak % 7 === 0) return 100;    // Weekly milestone
    return 0;
  },

  // Card collected (first time)
  card_collected: (rarity: 'common' | 'rare' | 'epic' | 'legendary'): number => {
    switch (rarity) {
      case 'legendary': return 100;
      case 'epic': return 50;
      case 'rare': return 25;
      case 'common': return 10;
      default: return 5;
    }
  },

  // Vocabulary mastered
  vocabulary_mastered: 15,

  // Story chapter completed
  chapter_complete: (chapterNumber: number): number => {
    return 100 + (chapterNumber * 20); // Scales with chapter
  }
};

/**
 * Calculate level from total XP
 */
export function calculateLevel(totalXP: number): number {
  // Progressive XP requirement curve
  // Level 1: 0, Level 2: 100, Level 3: 250, Level 4: 500, etc.
  const levels = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 500 },
    { level: 5, xp: 1000 },
    { level: 6, xp: 2000 },
    { level: 7, xp: 4000 },
    { level: 8, xp: 7000 },
    { level: 9, xp: 12000 },
    { level: 10, xp: 20000 },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXP >= levels[i].xp) {
      return levels[i].level;
    }
  }

  return 1; // Default to level 1
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  const levels = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 500 },
    { level: 5, xp: 1000 },
    { level: 6, xp: 2000 },
    { level: 7, xp: 4000 },
    { level: 8, xp: 7000 },
    { level: 9, xp: 12000 },
    { level: 10, xp: 20000 },
  ];

  const nextLevel = currentLevel + 1;
  const levelData = levels.find(l => l.level === nextLevel);

  return levelData?.xp || 99999; // Max level reached
}
