/**
 * ============================================================================
 * GAMIFICATION SYSTEM - TYPESCRIPT TYPES
 * For Mandarin & Cantonese Learning Platform
 * ============================================================================
 */

// ============================================================================
// (1) XP / LEVEL / BADGE SYSTEM
// ============================================================================

export interface LevelDefinition {
  id: number;
  level_number: number;
  xp_required: number;
  title: string;
  description: string | null;
  badge_reward_id: string | null;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export type XPEventType =
  | 'quiz_complete'
  | 'lesson_complete'
  | 'pronunciation_practice'
  | 'boss_win'
  | 'mission_complete'
  | 'daily_login'
  | 'streak_milestone'
  | 'card_collected'
  | 'vocabulary_mastered';

export interface XPEvent {
  id: string;
  user_id: string;
  event_type: XPEventType;
  xp_earned: number;
  source_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Language = 'mandarin' | 'cantonese' | 'both';

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  rarity: BadgeRarity;
  unlock_condition: BadgeUnlockCondition;
  language: Language | null;
  created_at: string;
}

export type BadgeUnlockCondition =
  | { type: 'streak'; value: number }
  | { type: 'xp_total'; value: number }
  | { type: 'level_reached'; value: number }
  | { type: 'lessons_completed'; count: number; language?: Language }
  | { type: 'quizzes_completed'; count: number; min_score?: number }
  | { type: 'boss_wins'; count: number }
  | { type: 'cards_collected'; count: number; rarity?: BadgeRarity }
  | { type: 'pronunciation_perfect'; count: number; min_score: number };

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
  is_favorite: boolean;
}

// ============================================================================
// (2) CARD COLLECTION SYSTEM
// ============================================================================

export type CardType = 'vocabulary' | 'character' | 'phrase' | 'npc';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  card_type: CardType;
  rarity: CardRarity;
  language: Language;

  // Content
  chinese_text: string;
  pronunciation: string | null;
  meaning_vi: string | null;
  image_url: string | null;

  // Stats
  power_level: number;

  // Metadata
  metadata: {
    voice_url?: string;
    animation?: string;
    character_story?: string;
    example_sentence?: string;
  };

  created_at: string;
}

export type CardSource =
  | 'quiz_reward'
  | 'boss_win'
  | 'daily_login'
  | 'wheel_spin'
  | 'mission_complete'
  | 'level_up';

export interface UserCard {
  id: string;
  user_id: string;
  card_id: string;
  obtained_at: string;
  source: CardSource;
  is_favorite: boolean;
  power_ups_applied: number;

  // Joined data
  card?: Card;
}

// Card Pack Opening
export interface CardPackResult {
  cards: Card[];
  pack_source: CardSource;
  rarity_breakdown: Record<CardRarity, number>;
}

// ============================================================================
// (3) MISSIONS SYSTEM
// ============================================================================

export type MissionType = 'daily' | 'weekly' | 'newbie' | 'special';

export type MissionConditionConfig =
  | { type: 'complete_lessons'; count: number; lesson_ids?: string[] }
  | { type: 'quiz_count'; count: number; min_score?: number }
  | { type: 'pronunciation_score'; count: number; min_score: number }
  | { type: 'boss_wins'; count: number; boss_ids?: string[] }
  | { type: 'cards_collect'; count: number; rarity?: CardRarity }
  | { type: 'streak_maintain'; days: number }
  | { type: 'vocabulary_practice'; count: number; language?: Language }
  | { type: 'listening_time'; minutes: number };

export interface Mission {
  id: string;
  code: string;
  mission_type: MissionType;
  title: string;
  description: string | null;
  language: Language | null;

  // Condition
  condition_config: MissionConditionConfig;

  // Rewards
  reward_xp: number;
  reward_cards: number;
  reward_spins: number;
  reward_items: string[]; // array of item IDs

  // Display
  is_active: boolean;
  display_order: number;

  created_at: string;
}

export interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;

  // Progress
  progress: number;
  target: number;
  is_completed: boolean;
  completed_at: string | null;

  // Reset tracking
  reset_at: string | null;

  created_at: string;
  updated_at: string;

  // Joined data
  mission?: Mission;
}

// ============================================================================
// (4) BOSS BATTLE SYSTEM
// ============================================================================

export type BossTheme = 'vocabulary' | 'grammar' | 'listening' | 'mixed';
export type BossBattleStatus = 'in_progress' | 'won' | 'lost' | 'abandoned';

export interface Boss {
  id: string;
  code: string;
  name: string;
  title: string | null;
  description: string | null;
  theme: BossTheme;
  language: Language;

  // Difficulty
  difficulty: number; // 1-10
  question_count: number;
  max_errors: number;
  time_limit_seconds: number | null;

  // Questions
  lesson_ids: string[];
  question_pool_config: any | null;

  // Rewards
  reward_config: {
    xp: number;
    cards: number;
    card_rarity?: CardRarity;
    badges?: string[];
    spins?: number;
    items?: string[];
  };

  // Visual
  image_url: string | null;
  icon_url: string | null;

  is_active: boolean;
  unlock_condition: any | null;

  created_at: string;
}

export interface BossQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'pronunciation' | 'listening';
  question_text: string;
  options?: string[];
  correct_answer: string;
  difficulty: number;
}

export interface BossBattle {
  id: string;
  user_id: string;
  boss_id: string;

  // State
  status: BossBattleStatus;
  current_question_index: number;
  questions: BossQuestion[];
  answers: Array<{ question_id: string; user_answer: string; is_correct: boolean }>;
  errors_count: number;

  started_at: string;
  completed_at: string | null;

  // Rewards
  rewards_claimed: any | null;

  // Joined data
  boss?: Boss;
}

// ============================================================================
// (5) STORY MODE / CHAPTERS SYSTEM
// ============================================================================

export interface StoryChapter {
  id: string;
  chapter_number: number;
  code: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  story_text: string | null;

  // Visual
  image_url: string | null;
  map_position: { x: number; y: number } | null;

  // Content
  lesson_ids: string[];
  boss_id: string | null;

  // Unlock
  unlock_condition: {
    required_chapters?: number[];
    min_level?: number;
    required_missions?: string[];
  } | null;

  // Rewards
  completion_reward: {
    xp?: number;
    cards?: number;
    badges?: string[];
    items?: string[];
  } | null;

  is_active: boolean;
  display_order: number;

  created_at: string;
}

export interface UserStoryProgress {
  id: string;
  user_id: string;
  chapter_id: string;

  is_unlocked: boolean;
  is_completed: boolean;
  completion_percentage: number;

  unlocked_at: string | null;
  completed_at: string | null;

  // Joined data
  chapter?: StoryChapter;
}

// ============================================================================
// (6) LUCKY WHEEL SYSTEM
// ============================================================================

export type WheelRewardType =
  | 'xp'
  | 'card'
  | 'badge'
  | 'item'
  | 'spin'
  | 'streak_shield';

export interface WheelReward {
  id: string;
  reward_type: WheelRewardType;
  reward_value: any;
  // Examples:
  // { xp: 100 }
  // { cards: 2, rarity: 'rare' }
  // { item_id: 'streak_shield' }

  rarity: CardRarity;
  weight: number;
  icon_url: string | null;
  display_name: string | null;

  is_active: boolean;
}

export interface UserWheelSpins {
  id: string;
  user_id: string;
  date: string;

  spins_available: number;
  spins_extra: number;
  spins_used: number;

  last_spin_at: string | null;
}

export interface WheelSpinHistory {
  id: string;
  user_id: string;
  reward_id: string;
  reward_received: any;
  spun_at: string;

  // Joined data
  reward?: WheelReward;
}

// ============================================================================
// (7) PRONUNCIATION SCORING SYSTEM
// ============================================================================

export type PronunciationTargetType = 'word' | 'phrase' | 'sentence';
export type PronunciationCategory =
  | 'tones'
  | 'initials'
  | 'finals'
  | 'general';

export interface PronunciationTarget {
  id: string;
  target_type: PronunciationTargetType;
  language: Language;

  chinese_text: string;
  pronunciation: string;
  audio_url: string | null;

  difficulty: number;
  category: PronunciationCategory | null;

  created_at: string;
}

export interface UserPronunciationScore {
  id: string;
  user_id: string;
  target_id: string;

  score: number; // 0-100
  attempts: number;
  best_score: number;

  feedback: {
    overall_score: number;
    tone_accuracy?: number;
    pronunciation_issues?: string[];
    suggestions?: string[];
  } | null;

  audio_url: string | null;

  created_at: string;

  // Joined data
  target?: PronunciationTarget;
}

// ============================================================================
// (8) GAME ITEMS & INVENTORY
// ============================================================================

export type ItemType = 'consumable' | 'permanent' | 'collectible';

export interface GameItem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  item_type: ItemType;
  effect_config: any; // depends on item type
  icon_url: string | null;
  rarity: CardRarity;

  is_active: boolean;
  created_at: string;
}

export interface UserInventory {
  id: string;
  user_id: string;
  item_id: string;

  quantity: number;
  obtained_at: string;
  last_used_at: string | null;

  // Joined data
  item?: GameItem;
}

// ============================================================================
// API REQUEST / RESPONSE TYPES
// ============================================================================

// Event submission (for XP tracking)
export interface LearningEvent {
  event_type: XPEventType;
  source_id?: string;
  metadata?: Record<string, any>;
}

export interface LearningEventResponse {
  xp_earned: number;
  total_xp: number;
  level_before: number;
  level_after: number;
  level_up: boolean;
  badges_unlocked: Badge[];
  missions_updated: string[]; // mission IDs
}

// Card pack opening
export interface OpenCardPackRequest {
  source: CardSource;
  count?: number;
}

export interface OpenCardPackResponse {
  cards: Card[];
  total_cards_collected: number;
  new_cards: number;
}

// Boss battle
export interface StartBossBattleRequest {
  boss_id: string;
}

export interface StartBossBattleResponse {
  battle: BossBattle;
  first_question: BossQuestion;
}

export interface SubmitBossAnswerRequest {
  battle_id: string;
  answer: string;
}

export interface SubmitBossAnswerResponse {
  is_correct: boolean;
  correct_answer: string;
  battle_status: BossBattleStatus;
  next_question?: BossQuestion;
  battle_result?: {
    status: BossBattleStatus;
    rewards: any;
  };
}

// Wheel spin
export interface SpinWheelRequest {
  // No body needed, uses session user
}

export interface SpinWheelResponse {
  reward: WheelReward;
  reward_claimed: any;
  spins_remaining: number;
}

// Mission progress update
export interface UpdateMissionProgressRequest {
  event: LearningEvent;
}

export interface UpdateMissionProgressResponse {
  missions_updated: Array<{
    mission_id: string;
    progress: number;
    is_completed: boolean;
  }>;
  missions_completed: string[];
}

// ============================================================================
// GAMIFICATION DASHBOARD DATA
// ============================================================================

export interface GamificationDashboard {
  user_progress: UserProgress;
  level_info: LevelDefinition;
  next_level_info: LevelDefinition | null;
  xp_to_next_level: number;

  badges: {
    total: number;
    unlocked: UserBadge[];
    available: Badge[];
  };

  missions: {
    daily: UserMission[];
    weekly: UserMission[];
    newbie: UserMission[];
  };

  cards: {
    total_collected: number;
    unique_cards: number;
    collection_completion_percentage: number;
    recent_cards: UserCard[];
  };

  story: {
    current_chapter: UserStoryProgress | null;
    unlocked_chapters: UserStoryProgress[];
    completion_percentage: number;
  };

  wheel: {
    spins_available: number;
    last_spin_date: string | null;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface GamificationError {
  code: string;
  message: string;
  details?: any;
}
