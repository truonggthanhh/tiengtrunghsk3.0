/**
 * Gamification Event Handler - Client Side
 * Central handler for all learning events
 */

import type { LearningEvent, LearningEventResponse } from '@/types/gamification';

/**
 * Record a learning event and update gamification state
 */
export async function recordLearningEvent(
  event: LearningEvent
): Promise<LearningEventResponse> {
  const response = await fetch('/api/gamification/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for auth
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to record learning event');
  }

  return response.json();
}

/**
 * Get user's gamification dashboard data
 */
export async function getGamificationDashboard() {
  const response = await fetch('/api/gamification/dashboard', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch gamification dashboard');
  }

  return response.json();
}

/**
 * Get user's progress
 */
export async function getUserProgress() {
  const response = await fetch('/api/gamification/progress', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user progress');
  }

  return response.json();
}

/**
 * Get user's badges
 */
export async function getUserBadges() {
  const response = await fetch('/api/gamification/badges/my', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch badges');
  }

  return response.json();
}

/**
 * Get all available badges
 */
export async function getAllBadges() {
  const response = await fetch('/api/gamification/badges', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch all badges');
  }

  return response.json();
}

/**
 * Open card pack
 */
export async function openCardPack(source: string, count: number = 1) {
  const response = await fetch('/api/gamification/cards/open-pack', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ source, count }),
  });

  if (!response.ok) {
    throw new Error('Failed to open card pack');
  }

  return response.json();
}

/**
 * Get user's card collection
 */
export async function getMyCardCollection() {
  const response = await fetch('/api/gamification/cards/my-collection', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch card collection');
  }

  return response.json();
}

/**
 * Get active missions
 */
export async function getActiveMissions() {
  const response = await fetch('/api/gamification/missions', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch missions');
  }

  return response.json();
}

/**
 * Get mission progress
 */
export async function getMyMissionProgress() {
  const response = await fetch('/api/gamification/missions/my-progress', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch mission progress');
  }

  return response.json();
}

/**
 * Start boss battle
 */
export async function startBossBattle(bossId: string) {
  const response = await fetch('/api/gamification/boss/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ boss_id: bossId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start boss battle');
  }

  return response.json();
}

/**
 * Submit boss answer
 */
export async function submitBossAnswer(battleId: string, answer: string) {
  const response = await fetch('/api/gamification/boss/answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ battle_id: battleId, answer }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit boss answer');
  }

  return response.json();
}

/**
 * Spin lucky wheel
 */
export async function spinLuckyWheel() {
  const response = await fetch('/api/gamification/wheel/spin', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to spin wheel');
  }

  return response.json();
}

/**
 * Get available wheel spins
 */
export async function getAvailableSpins() {
  const response = await fetch('/api/gamification/wheel/available-spins', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch available spins');
  }

  return response.json();
}

/**
 * Get story chapters
 */
export async function getStoryChapters() {
  const response = await fetch('/api/gamification/story/chapters', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story chapters');
  }

  return response.json();
}

/**
 * Get story progress
 */
export async function getMyStoryProgress() {
  const response = await fetch('/api/gamification/story/my-progress', {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch story progress');
  }

  return response.json();
}
