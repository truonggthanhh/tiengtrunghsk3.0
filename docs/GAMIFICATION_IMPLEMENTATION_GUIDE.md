# 🎮 GAMIFICATION SYSTEM - IMPLEMENTATION GUIDE

**Complete guide for implementing gamification for Mandarin & Cantonese learning platform**

---

## 📚 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [XP / Level / Badge System](#1-xp--level--badge-system)
3. [Card Collection System](#2-card-collection-system)
4. [Missions System](#3-missions-system)
5. [Boss Battle System](#4-boss-battle-system)
6. [Story Mode System](#5-story-mode-system)
7. [Lucky Wheel System](#6-lucky-wheel-system)
8. [Pronunciation Scoring](#7-pronunciation-scoring-system)
9. [Mini Games](#8-mini-games)
10. [API Endpoints Reference](#api-endpoints-reference)
11. [UI/UX Recommendations](#uiux-recommendations)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Core Flow

```
User Action (Quiz/Lesson/etc)
  → Emit LearningEvent
  → XP System processes event
  → Missions System checks progress
  → Badge System checks conditions
  → Return updated state to frontend
```

### Central Event Handler

All learning activities should emit events through a central handler:

```typescript
// src/lib/gamification/eventHandler.ts

import { supabase } from '@/integrations/supabase/client';
import type { LearningEvent, LearningEventResponse } from '@/types/gamification';

export async function recordLearningEvent(
  event: LearningEvent
): Promise<LearningEventResponse> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Call backend API
  const response = await fetch('/api/gamification/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });

  return response.json();
}
```

---

## 1️⃣ XP / LEVEL / BADGE SYSTEM

### XP Earning Rules

```typescript
// src/lib/gamification/xpRules.ts

export const XP_REWARDS = {
  quiz_complete: (score: number, total: number) => {
    const percentage = (score / total) * 100;
    const base = 50;
    if (percentage >= 90) return base + 30; // Perfect bonus
    if (percentage >= 70) return base + 10;
    return base;
  },

  lesson_complete: 100,
  pronunciation_practice: (score: number) => {
    if (score >= 90) return 40;
    if (score >= 70) return 25;
    return 15;
  },

  boss_win: (difficulty: number) => 100 + (difficulty * 50),
  mission_complete: (type: string) => {
    if (type === 'daily') return 50;
    if (type === 'weekly') return 200;
    if (type === 'newbie') return 150;
    return 30;
  },

  daily_login: 20,
  streak_milestone: (streak: number) => {
    if (streak % 30 === 0) return 500; // Monthly milestone
    if (streak % 7 === 0) return 100; // Weekly milestone
    return 0;
  }
};
```

### Backend Handler

```typescript
// src/pages/api/gamification/event.ts (Next.js API Route)

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { XP_REWARDS } from '@/lib/gamification/xpRules';
import type { LearningEvent, LearningEventResponse } from '@/types/gamification';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LearningEventResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server
  );

  // Get authenticated user
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const event: LearningEvent = req.body;

  try {
    // 1. Calculate XP
    let xp_earned = 0;
    switch (event.event_type) {
      case 'quiz_complete':
        xp_earned = XP_REWARDS.quiz_complete(
          event.metadata?.score || 0,
          event.metadata?.total || 1
        );
        break;
      case 'lesson_complete':
        xp_earned = XP_REWARDS.lesson_complete;
        break;
      case 'boss_win':
        xp_earned = XP_REWARDS.boss_win(event.metadata?.difficulty || 1);
        break;
      // ... handle other event types
      default:
        xp_earned = 10; // default XP
    }

    // 2. Record XP event
    const { error: eventError } = await supabase
      .from('xp_events')
      .insert({
        user_id: user.id,
        event_type: event.event_type,
        xp_earned,
        source_id: event.source_id,
        metadata: event.metadata || {}
      });

    if (eventError) throw eventError;

    // 3. Update user progress
    const { data: currentProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!currentProgress) {
      // Initialize if not exists
      await supabase.from('user_progress').insert({
        user_id: user.id,
        total_xp: xp_earned,
        current_level: 1
      });
    }

    const new_total_xp = (currentProgress?.total_xp || 0) + xp_earned;

    // 4. Check for level up
    const { data: levels } = await supabase
      .from('level_definitions')
      .select('*')
      .lte('xp_required', new_total_xp)
      .order('level_number', { ascending: false })
      .limit(1);

    const new_level = levels?.[0]?.level_number || 1;
    const level_before = currentProgress?.current_level || 1;
    const level_up = new_level > level_before;

    // 5. Update progress
    await supabase
      .from('user_progress')
      .update({
        total_xp: new_total_xp,
        current_level: new_level,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    // 6. Check for badge unlocks
    const badges_unlocked = await checkAndUnlockBadges(supabase, user.id, {
      total_xp: new_total_xp,
      current_level: new_level,
      event_type: event.event_type
    });

    // 7. Update missions
    const missions_updated = await updateMissionProgress(supabase, user.id, event);

    // 8. Return response
    return res.status(200).json({
      xp_earned,
      total_xp: new_total_xp,
      level_before,
      level_after: new_level,
      level_up,
      badges_unlocked,
      missions_updated
    });

  } catch (error) {
    console.error('Error processing learning event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper: Check and unlock badges
async function checkAndUnlockBadges(supabase: any, userId: string, context: any) {
  const { data: allBadges } = await supabase
    .from('badges')
    .select('*')
    .eq('is_active', true);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);

  const unlockedBadgeIds = new Set(userBadges?.map(b => b.badge_id) || []);
  const newlyUnlocked = [];

  for (const badge of allBadges || []) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    const condition = badge.unlock_condition;
    let shouldUnlock = false;

    switch (condition.type) {
      case 'xp_total':
        shouldUnlock = context.total_xp >= condition.value;
        break;
      case 'level_reached':
        shouldUnlock = context.current_level >= condition.value;
        break;
      // ... handle other condition types
    }

    if (shouldUnlock) {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_id: badge.id
      });
      newlyUnlocked.push(badge);
    }
  }

  return newlyUnlocked;
}

// Helper: Update mission progress
async function updateMissionProgress(supabase: any, userId: string, event: LearningEvent) {
  // Implementation in Missions section below
  return [];
}
```

### Frontend Integration

```typescript
// Example: When user completes a quiz
async function onQuizComplete(score: number, total: number) {
  try {
    const result = await recordLearningEvent({
      event_type: 'quiz_complete',
      source_id: quizId,
      metadata: { score, total }
    });

    // Show XP gained animation
    showXPAnimation(result.xp_earned);

    // Show level up modal if applicable
    if (result.level_up) {
      showLevelUpModal(result.level_after);
    }

    // Show newly unlocked badges
    if (result.badges_unlocked.length > 0) {
      showBadgeUnlockModal(result.badges_unlocked);
    }

  } catch (error) {
    console.error('Failed to record event:', error);
  }
}
```

---

## 2️⃣ CARD COLLECTION SYSTEM

### Card Rarity Distribution

```typescript
// src/lib/gamification/cardSystem.ts

export interface RarityWeight {
  rarity: CardRarity;
  weight: number;
}

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
```

### API: Open Card Pack

```typescript
// src/pages/api/gamification/cards/open-pack.ts

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { source, count = 1 }: OpenCardPackRequest = req.body;
  const supabase = createClient(...);
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const cards = [];

    for (let i = 0; i < count; i++) {
      // 1. Determine rarity
      const rarity = selectRarityByWeight(source);

      // 2. Select random card from pool
      const { data: candidateCards } = await supabase
        .from('cards')
        .select('*')
        .eq('rarity', rarity)
        .limit(50); // get pool

      if (!candidateCards || candidateCards.length === 0) continue;

      const randomCard = candidateCards[Math.floor(Math.random() * candidateCards.length)];

      // 3. Add to user collection (upsert to avoid duplicates)
      const { error } = await supabase
        .from('user_cards')
        .upsert({
          user_id: user.id,
          card_id: randomCard.id,
          source,
          obtained_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,card_id',
          ignoreDuplicates: true
        });

      if (!error) {
        cards.push(randomCard);
      }
    }

    // 4. Get user stats
    const { count: totalCollected } = await supabase
      .from('user_cards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    return res.status(200).json({
      cards,
      total_cards_collected: totalCollected || 0,
      new_cards: cards.length
    });

  } catch (error) {
    console.error('Error opening card pack:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## 3️⃣ MISSIONS SYSTEM

### Mission Configuration Examples

```typescript
// Seed data for missions table

const DAILY_MISSIONS = [
  {
    code: 'daily_vocab_10',
    mission_type: 'daily',
    title: 'Học 10 từ mới',
    description: 'Hoàn thành ít nhất 10 câu hỏi từ vựng',
    language: 'both',
    condition_config: { type: 'quiz_count', count: 10 },
    reward_xp: 50,
    reward_cards: 1,
    reward_spins: 0
  },
  {
    code: 'daily_pronunciation_5',
    mission_type: 'daily',
    title: 'Luyện phát âm 5 phút',
    description: 'Luyện phát âm ít nhất 5 từ/câu',
    language: 'both',
    condition_config: { type: 'pronunciation_score', count: 5, min_score: 70 },
    reward_xp: 40,
    reward_cards: 1,
    reward_spins: 1
  },
  // ... more missions
];

const WEEKLY_MISSIONS = [
  {
    code: 'weekly_lessons_5',
    mission_type: 'weekly',
    title: 'Hoàn thành 5 bài học',
    description: 'Hoàn thành ít nhất 5 bài học trong tuần',
    language: 'both',
    condition_config: { type: 'complete_lessons', count: 5 },
    reward_xp: 200,
    reward_cards: 3,
    reward_spins: 2
  },
  {
    code: 'weekly_boss_3',
    mission_type: 'weekly',
    title: 'Chiến thắng 3 Boss',
    description: 'Đánh bại 3 boss bất kỳ trong tuần',
    language: 'both',
    condition_config: { type: 'boss_wins', count: 3 },
    reward_xp: 300,
    reward_cards: 5,
    reward_spins: 3
  }
];
```

### Mission Progress Update

```typescript
// src/lib/gamification/missionsEngine.ts

export async function updateMissionProgress(
  supabase: any,
  userId: string,
  event: LearningEvent
): Promise<string[]> {

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const thisWeekStart = getWeekStart(now);

  // Get active missions
  const { data: activeMissions } = await supabase
    .from('missions')
    .select('*')
    .eq('is_active', true)
    .in('mission_type', ['daily', 'weekly', 'newbie']);

  if (!activeMissions) return [];

  const updated = [];

  for (const mission of activeMissions) {
    // Check if event matches mission condition
    const shouldUpdate = doesEventMatchMission(event, mission.condition_config);
    if (!shouldUpdate) continue;

    // Calculate increment based on event
    const increment = calculateMissionIncrement(event, mission.condition_config);
    if (increment === 0) continue;

    // Get or create user mission progress
    let resetAt = null;
    if (mission.mission_type === 'daily') resetAt = today;
    if (mission.mission_type === 'weekly') resetAt = thisWeekStart;

    const { data: existingProgress } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
      .eq('mission_id', mission.id)
      .eq('reset_at', resetAt)
      .maybeSingle();

    if (!existingProgress) {
      // Create new progress
      const target = extractTargetFromCondition(mission.condition_config);
      await supabase.from('user_missions').insert({
        user_id: userId,
        mission_id: mission.id,
        progress: increment,
        target,
        reset_at: resetAt
      });
      updated.push(mission.id);
      continue;
    }

    // Update existing progress
    const newProgress = existingProgress.progress + increment;
    const isCompleted = newProgress >= existingProgress.target;

    await supabase
      .from('user_missions')
      .update({
        progress: Math.min(newProgress, existingProgress.target),
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProgress.id);

    // If just completed, give rewards
    if (isCompleted && !existingProgress.is_completed) {
      await grantMissionRewards(supabase, userId, mission);
    }

    updated.push(mission.id);
  }

  return updated;
}

function doesEventMatchMission(event: LearningEvent, condition: any): boolean {
  switch (condition.type) {
    case 'quiz_count':
      return event.event_type === 'quiz_complete';
    case 'complete_lessons':
      return event.event_type === 'lesson_complete';
    case 'pronunciation_score':
      return event.event_type === 'pronunciation_practice';
    case 'boss_wins':
      return event.event_type === 'boss_win';
    // ... handle other types
    default:
      return false;
  }
}

function calculateMissionIncrement(event: LearningEvent, condition: any): number {
  switch (condition.type) {
    case 'quiz_count':
      return 1; // each quiz counts as 1
    case 'complete_lessons':
      return 1; // each lesson counts as 1
    case 'pronunciation_score':
      if (event.metadata?.score >= (condition.min_score || 0)) {
        return 1;
      }
      return 0;
    case 'boss_wins':
      return 1;
    default:
      return 0;
  }
}

function extractTargetFromCondition(condition: any): number {
  return condition.count || condition.value || 1;
}

async function grantMissionRewards(supabase: any, userId: string, mission: any) {
  // Grant XP
  if (mission.reward_xp > 0) {
    await supabase.from('xp_events').insert({
      user_id: userId,
      event_type: 'mission_complete',
      xp_earned: mission.reward_xp,
      source_id: mission.id,
      metadata: { mission_code: mission.code }
    });
  }

  // Grant cards
  if (mission.reward_cards > 0) {
    // Call card pack opening logic
  }

  // Grant spins
  if (mission.reward_spins > 0) {
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('user_wheel_spins')
      .upsert({
        user_id: userId,
        date: today,
        spins_extra: supabase.raw('spins_extra + ' + mission.reward_spins)
      }, {
        onConflict: 'user_id,date'
      });
  }
}
```

---

## 4️⃣ BOSS BATTLE SYSTEM

### Boss Question Generation

```typescript
// src/lib/gamification/bossQuestions.ts

export async function generateBossQuestions(
  supabase: any,
  boss: Boss
): Promise<BossQuestion[]> {

  const questions: BossQuestion[] = [];

  // Fetch vocabulary/content from linked lessons
  if (boss.lesson_ids && boss.lesson_ids.length > 0) {
    const { data: vocabularyData } = await supabase
      .from('vocabulary')
      .select('*')
      .in('lesson_id', boss.lesson_ids)
      .limit(100);

    // Generate questions from vocabulary
    const vocabPool = shuffleArray(vocabularyData || []);

    for (let i = 0; i < boss.question_count && i < vocabPool.length; i++) {
      const vocab = vocabPool[i];

      // Generate multiple choice question
      questions.push({
        id: `q_${i}`,
        type: 'multiple_choice',
        question_text: `Nghĩa của "${vocab.chinese}" là gì?`,
        options: await generateMultipleChoiceOptions(supabase, vocab),
        correct_answer: vocab.meaning_vi,
        difficulty: vocab.hsk_level || 1
      });
    }
  }

  return shuffleArray(questions).slice(0, boss.question_count);
}

async function generateMultipleChoiceOptions(
  supabase: any,
  correctVocab: any
): Promise<string[]> {
  // Get 3 random wrong answers
  const { data: wrongOptions } = await supabase
    .from('vocabulary')
    .select('meaning_vi')
    .neq('id', correctVocab.id)
    .limit(3);

  const options = [
    correctVocab.meaning_vi,
    ...(wrongOptions?.map(v => v.meaning_vi) || [])
  ];

  return shuffleArray(options);
}
```

### API: Start Boss Battle

```typescript
// src/pages/api/gamification/boss/start.ts

export default async function handler(req, res) {
  const { boss_id }: StartBossBattleRequest = req.body;
  const supabase = createClient(...);
  const { data: { user } } = await supabase.auth.getUser(...);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // 1. Get boss info
    const { data: boss } = await supabase
      .from('bosses')
      .select('*')
      .eq('id', boss_id)
      .single();

    if (!boss) return res.status(404).json({ error: 'Boss not found' });

    // 2. Check unlock conditions
    if (boss.unlock_condition) {
      const hasAccess = await checkBossUnlockCondition(supabase, user.id, boss.unlock_condition);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Boss locked' });
      }
    }

    // 3. Generate questions
    const questions = await generateBossQuestions(supabase, boss);

    // 4. Create battle session
    const { data: battle } = await supabase
      .from('boss_battles')
      .insert({
        user_id: user.id,
        boss_id: boss.id,
        status: 'in_progress',
        current_question_index: 0,
        questions,
        answers: [],
        errors_count: 0
      })
      .select()
      .single();

    return res.status(200).json({
      battle,
      first_question: questions[0]
    });

  } catch (error) {
    console.error('Error starting boss battle:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### API: Submit Boss Answer

```typescript
// src/pages/api/gamification/boss/answer.ts

export default async function handler(req, res) {
  const { battle_id, answer }: SubmitBossAnswerRequest = req.body;
  const supabase = createClient(...);
  const { data: { user } } = await supabase.auth.getUser(...);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // 1. Get battle
    const { data: battle } = await supabase
      .from('boss_battles')
      .select('*, bosses(*)')
      .eq('id', battle_id)
      .eq('user_id', user.id)
      .single();

    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    if (battle.status !== 'in_progress') {
      return res.status(400).json({ error: 'Battle already completed' });
    }

    // 2. Check answer
    const currentQuestion = battle.questions[battle.current_question_index];
    const is_correct = answer === currentQuestion.correct_answer;

    // 3. Update battle state
    const new_answers = [...battle.answers, {
      question_id: currentQuestion.id,
      user_answer: answer,
      is_correct
    }];

    const new_errors = is_correct ? battle.errors_count : battle.errors_count + 1;
    const next_index = battle.current_question_index + 1;

    // 4. Check win/lose conditions
    let new_status = 'in_progress';
    let battle_result = null;

    // Lost: too many errors
    if (new_errors >= battle.bosses.max_errors) {
      new_status = 'lost';
      battle_result = {
        status: 'lost',
        rewards: null
      };
    }
    // Won: all questions answered
    else if (next_index >= battle.questions.length) {
      new_status = 'won';

      // Grant rewards
      const rewards = await grantBossRewards(supabase, user.id, battle.bosses);
      battle_result = {
        status: 'won',
        rewards
      };
    }

    // 5. Update battle
    await supabase
      .from('boss_battles')
      .update({
        answers: new_answers,
        errors_count: new_errors,
        current_question_index: next_index,
        status: new_status,
        completed_at: new_status !== 'in_progress' ? new Date().toISOString() : null,
        rewards_claimed: battle_result?.rewards || null
      })
      .eq('id', battle_id);

    // 6. Return response
    return res.status(200).json({
      is_correct,
      correct_answer: currentQuestion.correct_answer,
      battle_status: new_status,
      next_question: next_index < battle.questions.length ? battle.questions[next_index] : undefined,
      battle_result
    });

  } catch (error) {
    console.error('Error submitting boss answer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function grantBossRewards(supabase: any, userId: string, boss: Boss) {
  const rewards = {
    xp: boss.reward_config.xp || 0,
    cards: [],
    badges: []
  };

  // Grant XP
  if (rewards.xp > 0) {
    await supabase.from('xp_events').insert({
      user_id: userId,
      event_type: 'boss_win',
      xp_earned: rewards.xp,
      source_id: boss.id,
      metadata: { boss_name: boss.name, difficulty: boss.difficulty }
    });
  }

  // Grant cards
  if (boss.reward_config.cards > 0) {
    // Open card pack logic
    // rewards.cards = ...
  }

  // Grant badges
  // ... check and unlock boss-related badges

  return rewards;
}
```

---

## 5️⃣ STORY MODE SYSTEM

### Chapter Unlock Check

```typescript
// src/lib/gamification/storyMode.ts

export async function checkChapterUnlock(
  supabase: any,
  userId: string,
  chapter: StoryChapter
): Promise<boolean> {

  if (!chapter.unlock_condition) return true; // No condition = always unlocked

  const condition = chapter.unlock_condition;

  // Check required chapters
  if (condition.required_chapters && condition.required_chapters.length > 0) {
    const { data: completedChapters } = await supabase
      .from('user_story_progress')
      .select('chapter_id')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .in('chapter_id', condition.required_chapters);

    if (!completedChapters || completedChapters.length < condition.required_chapters.length) {
      return false;
    }
  }

  // Check minimum level
  if (condition.min_level) {
    const { data: progress } = await supabase
      .from('user_progress')
      .select('current_level')
      .eq('user_id', userId)
      .single();

    if (!progress || progress.current_level < condition.min_level) {
      return false;
    }
  }

  // Check required missions
  if (condition.required_missions && condition.required_missions.length > 0) {
    const { data: completedMissions } = await supabase
      .from('user_missions')
      .select('mission_id')
      .eq('user_id', userId)
      .eq('is_completed', true)
      .in('mission_id', condition.required_missions);

    if (!completedMissions || completedMissions.length < condition.required_missions.length) {
      return false;
    }
  }

  return true;
}

export async function calculateChapterProgress(
  supabase: any,
  userId: string,
  chapter: StoryChapter
): Promise<number> {

  let total = 0;
  let completed = 0;

  // Count completed lessons
  if (chapter.lesson_ids && chapter.lesson_ids.length > 0) {
    total += chapter.lesson_ids.length;

    // Check which lessons user has completed
    // (assume you have a user_lesson_progress table)
    const { count } = await supabase
      .from('user_lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('lesson_id', chapter.lesson_ids)
      .eq('is_completed', true);

    completed += count || 0;
  }

  // Check boss completion
  if (chapter.boss_id) {
    total += 1;

    const { data: bossWin } = await supabase
      .from('boss_battles')
      .select('id')
      .eq('user_id', userId)
      .eq('boss_id', chapter.boss_id)
      .eq('status', 'won')
      .limit(1)
      .maybeSingle();

    if (bossWin) {
      completed += 1;
    }
  }

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
```

---

## 6️⃣ LUCKY WHEEL SYSTEM

### Weighted Random Selection

```typescript
// src/lib/gamification/luckyWheel.ts

export function selectWheelReward(rewards: WheelReward[]): WheelReward {
  const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const reward of rewards) {
    cumulative += reward.weight;
    if (random <= cumulative) {
      return reward;
    }
  }

  return rewards[0]; // fallback
}
```

### API: Spin Wheel

```typescript
// src/pages/api/gamification/wheel/spin.ts

export default async function handler(req, res) {
  const supabase = createClient(...);
  const { data: { user } } = await supabase.auth.getUser(...);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const today = new Date().toISOString().split('T')[0];

    // 1. Check available spins
    const { data: spinData } = await supabase
      .from('user_wheel_spins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (!spinData) {
      // Initialize today's spins
      await supabase.from('user_wheel_spins').insert({
        user_id: user.id,
        date: today,
        spins_available: 1,
        spins_extra: 0,
        spins_used: 0
      });
    }

    const totalAvailable = (spinData?.spins_available || 1) + (spinData?.spins_extra || 0);
    const used = spinData?.spins_used || 0;

    if (used >= totalAvailable) {
      return res.status(400).json({ error: 'No spins available today' });
    }

    // 2. Get reward pool
    const { data: rewards } = await supabase
      .from('wheel_rewards')
      .select('*')
      .eq('is_active', true);

    if (!rewards || rewards.length === 0) {
      return res.status(500).json({ error: 'No rewards available' });
    }

    // 3. Select reward
    const selectedReward = selectWheelReward(rewards);

    // 4. Grant reward
    const rewardClaimed = await grantWheelReward(supabase, user.id, selectedReward);

    // 5. Update spin count
    await supabase
      .from('user_wheel_spins')
      .update({
        spins_used: used + 1,
        last_spin_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('date', today);

    // 6. Record history
    await supabase.from('wheel_spin_history').insert({
      user_id: user.id,
      reward_id: selectedReward.id,
      reward_received: rewardClaimed
    });

    return res.status(200).json({
      reward: selectedReward,
      reward_claimed: rewardClaimed,
      spins_remaining: totalAvailable - used - 1
    });

  } catch (error) {
    console.error('Error spinning wheel:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function grantWheelReward(supabase: any, userId: string, reward: WheelReward) {
  const value = reward.reward_value;

  switch (reward.reward_type) {
    case 'xp':
      await supabase.from('xp_events').insert({
        user_id: userId,
        event_type: 'wheel_spin',
        xp_earned: value.xp || 0,
        source_id: reward.id
      });
      return { type: 'xp', amount: value.xp };

    case 'card':
      // Open card pack
      return { type: 'card', count: value.cards || 1 };

    case 'item':
      // Grant item to inventory
      return { type: 'item', item_id: value.item_id };

    // ... handle other reward types

    default:
      return value;
  }
}
```

---

## 🎯 API ENDPOINTS REFERENCE

### Base URL: `/api/gamification`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/event` | Record learning event (XP, missions, badges) |
| GET | `/progress` | Get user progress dashboard |
| GET | `/badges` | Get all badges |
| GET | `/badges/my` | Get user's badges |
| POST | `/cards/open-pack` | Open card pack |
| GET | `/cards/my-collection` | Get user's card collection |
| GET | `/missions` | Get active missions |
| GET | `/missions/my-progress` | Get user's mission progress |
| POST | `/boss/start` | Start boss battle |
| POST | `/boss/answer` | Submit boss answer |
| GET | `/story/chapters` | Get all story chapters |
| GET | `/story/my-progress` | Get user's story progress |
| POST | `/wheel/spin` | Spin lucky wheel |
| GET | `/wheel/available-spins` | Get available spins |

---

## 🎨 UI/UX RECOMMENDATIONS

### Gamification Dashboard Layout

```tsx
// src/pages/gamification/DashboardPage.tsx

export default function GamificationDashboard() {
  return (
    <div className="container mx-auto p-6">
      {/* Top Section: Level & XP */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-6 p-6">
          <Avatar size="xl" level={userProgress.current_level} />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{levelInfo.title}</h2>
            <ProgressBar
              current={userProgress.total_xp - levelInfo.xp_required}
              max={nextLevel.xp_required - levelInfo.xp_required}
              label={`${xpToNextLevel} XP to next level`}
            />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{userProgress.current_level}</div>
            <div className="text-sm text-muted">Level</div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missions */}
        <MissionsCard missions={missions} />

        {/* Badges */}
        <BadgesCard badges={badges} />

        {/* Card Collection */}
        <CardCollectionCard stats={cardStats} />

        {/* Story Progress */}
        <StoryModeCard progress={storyProgress} />

        {/* Lucky Wheel */}
        <LuckyWheelCard spinsAvailable={wheelSpins} />

        {/* Boss Battles */}
        <BossBattlesCard bosses={availableBosses} />
      </div>
    </div>
  );
}
```

### Animations & Effects

- **XP Gain**: Flying +XP numbers animation
- **Level Up**: Full-screen celebration modal with confetti
- **Badge Unlock**: Shiny badge reveal animation
- **Card Opening**: Flip card animation with rarity glow
- **Wheel Spin**: Rotating wheel with smooth stop
- **Boss Battle**: Health bar decrease, hit effects

---

## ✅ NEXT STEPS

1. **Run Migration**: Execute the SQL migration file
2. **Implement API Routes**: Create Next.js API routes for each endpoint
3. **Build UI Components**: Create React components for dashboard
4. **Test Flow**: Test complete flow from quiz → XP → level up
5. **Add More Bosses/Missions**: Populate database with content
6. **Polish Animations**: Add smooth transitions and celebrations

---

**Ready to bring gamification to life! 🎮✨**
