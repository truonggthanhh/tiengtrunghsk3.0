-- ============================================================================
-- GAMIFICATION SYSTEM - DATABASE SCHEMA (CLEAN VERSION)
-- For Mandarin & Cantonese Learning Platform
-- This version drops existing tables before recreating them
-- ============================================================================

-- ============================================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- ============================================================================

DROP TABLE IF EXISTS user_inventory CASCADE;
DROP TABLE IF EXISTS game_items CASCADE;
DROP TABLE IF EXISTS user_pronunciation_scores CASCADE;
DROP TABLE IF EXISTS pronunciation_targets CASCADE;
DROP TABLE IF EXISTS wheel_spin_history CASCADE;
DROP TABLE IF EXISTS user_wheel_spins CASCADE;
DROP TABLE IF EXISTS wheel_rewards CASCADE;
DROP TABLE IF EXISTS user_story_progress CASCADE;
DROP TABLE IF EXISTS story_chapters CASCADE;
DROP TABLE IF EXISTS boss_battles CASCADE;
DROP TABLE IF EXISTS bosses CASCADE;
DROP TABLE IF EXISTS user_missions CASCADE;
DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS user_cards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS xp_events CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS level_definitions CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_update_user_progress_timestamp ON user_progress;
DROP TRIGGER IF EXISTS trigger_initialize_user_gamification ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_user_progress_timestamp();
DROP FUNCTION IF EXISTS initialize_user_gamification();

-- ============================================================================
-- (1) XP / LEVEL / BADGE SYSTEM
-- ============================================================================

-- Badges Table (MUST be created first because level_definitions references it)
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  icon_url TEXT,
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  unlock_condition JSONB NOT NULL, -- { "type": "streak", "value": 30 }
  language VARCHAR(20), -- 'mandarin', 'cantonese', 'both'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_badges_language ON badges(language);

-- Level Definitions Table
CREATE TABLE level_definitions (
  id SERIAL PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE,
  xp_required INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  badge_reward_id UUID REFERENCES badges(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0 NOT NULL,
  current_level INTEGER DEFAULT 1 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_progress_level ON user_progress(current_level);
CREATE INDEX idx_user_progress_xp ON user_progress(total_xp DESC);

-- XP Events Log (for audit trail)
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'quiz_complete', 'lesson_complete', 'pronunciation', 'boss_win', etc
  xp_earned INTEGER NOT NULL,
  source_id UUID, -- lesson_id, quiz_id, boss_id, etc
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_xp_events_user ON xp_events(user_id, created_at DESC);
CREATE INDEX idx_xp_events_type ON xp_events(event_type);

-- User Badges Table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT false,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id, unlocked_at DESC);

-- ============================================================================
-- (2) CARD COLLECTION SYSTEM
-- ============================================================================

-- Cards Table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_type VARCHAR(50) NOT NULL, -- 'vocabulary', 'character', 'phrase', 'npc'
  rarity VARCHAR(20) NOT NULL DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  language VARCHAR(20) NOT NULL, -- 'mandarin', 'cantonese'

  -- Card Content
  chinese_text VARCHAR(500) NOT NULL,
  pronunciation TEXT, -- pinyin or jyutping
  meaning_vi TEXT,
  image_url TEXT,

  -- Card Stats
  power_level INTEGER DEFAULT 1,

  -- Metadata
  metadata JSONB DEFAULT '{}', -- additional info, voice_url, animation, etc

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cards_type ON cards(card_type);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_language ON cards(language);

-- User Cards (Collection)
CREATE TABLE user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  obtained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50), -- 'quiz_reward', 'boss_win', 'daily_login', 'wheel_spin'
  is_favorite BOOLEAN DEFAULT false,
  power_ups_applied INTEGER DEFAULT 0,

  UNIQUE(user_id, card_id)
);

CREATE INDEX idx_user_cards_user ON user_cards(user_id, obtained_at DESC);
CREATE INDEX idx_user_cards_source ON user_cards(source);

-- ============================================================================
-- (3) MISSIONS SYSTEM
-- ============================================================================

-- Mission Definitions
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  mission_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'newbie', 'special'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  language VARCHAR(20), -- 'mandarin', 'cantonese', 'both'

  -- Condition Logic (flexible JSON)
  condition_config JSONB NOT NULL,

  -- Rewards
  reward_xp INTEGER DEFAULT 0,
  reward_cards INTEGER DEFAULT 0,
  reward_spins INTEGER DEFAULT 0,
  reward_items JSONB DEFAULT '[]',

  -- Activation
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_missions_type ON missions(mission_type, is_active);

-- User Missions (Progress Tracking)
CREATE TABLE user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,

  -- Progress
  progress INTEGER DEFAULT 0,
  target INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,

  -- Reset tracking
  reset_at TIMESTAMP WITH TIME ZONE, -- for daily/weekly missions

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, mission_id, reset_at)
);

CREATE INDEX idx_user_missions_user ON user_missions(user_id, is_completed);
CREATE INDEX idx_user_missions_reset ON user_missions(reset_at);

-- ============================================================================
-- (4) BOSS BATTLE SYSTEM
-- ============================================================================

-- Boss Definitions
CREATE TABLE bosses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  title VARCHAR(200),
  description TEXT,
  language VARCHAR(20) NOT NULL,
  difficulty INTEGER DEFAULT 1,
  hp INTEGER DEFAULT 100,
  level_requirement INTEGER DEFAULT 1,
  questions JSONB NOT NULL,
  reward_xp INTEGER DEFAULT 0,
  reward_card_pack INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bosses_language ON bosses(language, is_active);
CREATE INDEX idx_bosses_difficulty ON bosses(difficulty);

-- Boss Battle Sessions
CREATE TABLE boss_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boss_id UUID NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,

  -- Battle State
  current_hp INTEGER NOT NULL,
  current_question INTEGER DEFAULT 0,
  questions_data JSONB NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  is_won BOOLEAN DEFAULT false,

  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_boss_battles_user ON boss_battles(user_id, is_completed, started_at DESC);

-- ============================================================================
-- (5) STORY MODE / CHAPTERS SYSTEM
-- ============================================================================

-- Story Chapters
CREATE TABLE story_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL UNIQUE,
  code VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  language VARCHAR(20) NOT NULL,
  level_requirement INTEGER DEFAULT 1,
  reward_xp INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_story_chapters_order ON story_chapters(chapter_number);

-- User Chapter Progress
CREATE TABLE user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,

  is_unlocked BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  stars_earned INTEGER DEFAULT 0,

  unlocked_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_user_story_progress_user ON user_story_progress(user_id);

-- ============================================================================
-- (6) LUCKY WHEEL SYSTEM
-- ============================================================================

-- Wheel Rewards Pool
CREATE TABLE wheel_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_type VARCHAR(50) NOT NULL, -- 'xp', 'card_pack', 'extra_spin', 'item'
  reward_value INTEGER NOT NULL,
  reward_label VARCHAR(200) NOT NULL,
  probability DECIMAL(5,2) DEFAULT 10.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wheel_rewards_active ON wheel_rewards(is_active);

-- User Wheel Spins Tracking
CREATE TABLE user_wheel_spins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  spins_available INTEGER DEFAULT 0,
  last_spin_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wheel Spin History
CREATE TABLE wheel_spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES wheel_rewards(id),
  reward_type VARCHAR(50) NOT NULL,
  reward_value INTEGER NOT NULL,
  spun_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wheel_spin_history_user ON wheel_spin_history(user_id, spun_at DESC);

-- ============================================================================
-- (7) PRONUNCIATION SCORING SYSTEM
-- ============================================================================

-- Pronunciation Targets (từ/câu để luyện)
CREATE TABLE pronunciation_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(50) NOT NULL, -- 'word', 'phrase', 'sentence'
  language VARCHAR(20) NOT NULL,

  chinese_text VARCHAR(500) NOT NULL,
  pronunciation TEXT NOT NULL, -- expected pinyin/jyutping
  audio_url TEXT, -- reference audio

  difficulty INTEGER DEFAULT 1,
  category VARCHAR(100), -- 'tones', 'initials', 'finals', 'general'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pronunciation_targets_lang ON pronunciation_targets(language, difficulty);

-- User Pronunciation Scores
CREATE TABLE user_pronunciation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES pronunciation_targets(id),

  score INTEGER NOT NULL, -- 0-100
  attempts INTEGER DEFAULT 1,
  best_score INTEGER NOT NULL,

  feedback JSONB, -- detailed feedback from speech API
  audio_url TEXT, -- user's recording

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_pronunciation_user ON user_pronunciation_scores(user_id, created_at DESC);
CREATE INDEX idx_user_pronunciation_target ON user_pronunciation_scores(target_id, best_score DESC);

-- ============================================================================
-- (8) GAMIFICATION ITEMS & INVENTORY
-- ============================================================================

-- Items (streak shields, boosters, etc.)
CREATE TABLE game_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  item_type VARCHAR(50) NOT NULL, -- 'consumable', 'permanent', 'collectible'
  effect_config JSONB, -- what it does
  icon_url TEXT,
  rarity VARCHAR(20) DEFAULT 'common',

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Inventory
CREATE TABLE user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES game_items(id),

  quantity INTEGER DEFAULT 1,
  obtained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(user_id, item_id)
);

CREATE INDEX idx_user_inventory_user ON user_inventory(user_id);

-- ============================================================================
-- SEED DATA - Example Level Definitions
-- ============================================================================

INSERT INTO level_definitions (level_number, xp_required, title, description) VALUES
(1, 0, 'Tân Thủ', 'Bước đầu tiên vào thế giới Hoa ngữ'),
(2, 100, 'Học Đồ', 'Đã nắm được những điều cơ bản'),
(3, 250, 'Tiểu Sư Đệ', 'Bắt đầu tiến bộ rõ rệt'),
(4, 500, 'Trung Sư Đệ', 'Kiến thức ngày càng vững vàng'),
(5, 1000, 'Đại Sư Đệ', 'Đã thành thạo nhiều kỹ năng'),
(6, 2000, 'Cao Thủ', 'Trình độ đáng nể'),
(7, 4000, 'Tôn Sư', 'Bậc thầy ngôn ngữ'),
(8, 7000, 'Tông Sư', 'Đỉnh cao tri thức'),
(9, 12000, 'Đại Tông Sư', 'Huyền thoại sống'),
(10, 20000, 'Hán Hiệp', 'Bất khả chiến bại');

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update user_progress updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_progress_timestamp
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_user_progress_timestamp();

-- Function to initialize user progress on first login
CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress (user_id, total_xp, current_level, current_streak, longest_streak, last_activity_date)
  VALUES (NEW.id, 0, 1, 0, 0, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_initialize_user_gamification
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION initialize_user_gamification();

-- ============================================================================
-- RLS (Row Level Security) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wheel_spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE wheel_spin_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pronunciation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Policies for xp_events
CREATE POLICY "Users can view their own XP events"
ON xp_events FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_badges
CREATE POLICY "Users can view their own badges"
ON user_badges FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_cards
CREATE POLICY "Users can view their own cards"
ON user_cards FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_missions
CREATE POLICY "Users can view their own missions"
ON user_missions FOR SELECT
USING (auth.uid() = user_id);

-- Policies for boss_battles
CREATE POLICY "Users can view their own battles"
ON boss_battles FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_story_progress
CREATE POLICY "Users can view their own story progress"
ON user_story_progress FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_wheel_spins
CREATE POLICY "Users can view their own wheel spins"
ON user_wheel_spins FOR SELECT
USING (auth.uid() = user_id);

-- Policies for wheel_spin_history
CREATE POLICY "Users can view their own spin history"
ON wheel_spin_history FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_pronunciation_scores
CREATE POLICY "Users can view their own pronunciation scores"
ON user_pronunciation_scores FOR SELECT
USING (auth.uid() = user_id);

-- Policies for user_inventory
CREATE POLICY "Users can view their own inventory"
ON user_inventory FOR SELECT
USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_user_missions_completion ON user_missions(user_id, is_completed, mission_id);
CREATE INDEX idx_boss_battles_completion ON boss_battles(user_id, boss_id, is_completed, completed_at DESC);
CREATE INDEX idx_xp_events_source ON xp_events(user_id, event_type, source_id);

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE user_progress IS 'Tracks user XP, level, and streak data';
COMMENT ON TABLE badges IS 'Defines all available badges in the system';
COMMENT ON TABLE cards IS 'Card collection pool - vocabulary/character cards';
COMMENT ON TABLE missions IS 'Mission definitions (daily/weekly/newbie)';
COMMENT ON TABLE bosses IS 'Boss battle definitions';
COMMENT ON TABLE story_chapters IS 'Story mode chapters and progression';
COMMENT ON TABLE wheel_rewards IS 'Lucky wheel reward pool';
COMMENT ON TABLE pronunciation_targets IS 'Targets for pronunciation practice';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
