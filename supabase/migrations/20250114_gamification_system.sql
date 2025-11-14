-- ============================================================================
-- GAMIFICATION SYSTEM - DATABASE SCHEMA
-- For Mandarin & Cantonese Learning Platform
-- ============================================================================

-- ============================================================================
-- (1) XP / LEVEL / BADGE SYSTEM
-- ============================================================================

-- Badges Table (MUST be created first because level_definitions references it)
CREATE TABLE IF NOT EXISTS badges (
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
CREATE TABLE IF NOT EXISTS level_definitions (
  id SERIAL PRIMARY KEY,
  level_number INTEGER NOT NULL UNIQUE,
  xp_required INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  badge_reward_id UUID REFERENCES badges(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
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
CREATE TABLE IF NOT EXISTS xp_events (
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
CREATE TABLE IF NOT EXISTS user_badges (
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
CREATE TABLE IF NOT EXISTS cards (
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
CREATE TABLE IF NOT EXISTS user_cards (
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
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  mission_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'newbie', 'special'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  language VARCHAR(20), -- 'mandarin', 'cantonese', 'both'

  -- Condition Logic (flexible JSON)
  condition_config JSONB NOT NULL,
  -- Examples:
  -- { "type": "complete_lessons", "count": 3, "lesson_ids": [] }
  -- { "type": "quiz_count", "count": 20, "min_score": 80 }
  -- { "type": "pronunciation_score", "count": 5, "min_score": 85 }
  -- { "type": "boss_wins", "count": 2 }

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
CREATE TABLE IF NOT EXISTS user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,

  -- Progress
  progress INTEGER DEFAULT 0,
  target INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,

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
CREATE TABLE IF NOT EXISTS bosses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  title VARCHAR(200), -- "Long Vương Hán Ngữ", "Kiếm Khách Quảng Đông"
  description TEXT,
  theme VARCHAR(100), -- 'vocabulary', 'grammar', 'listening', 'mixed'
  language VARCHAR(20) NOT NULL,

  -- Difficulty
  difficulty INTEGER DEFAULT 1, -- 1-10
  question_count INTEGER DEFAULT 15,
  max_errors INTEGER DEFAULT 3,
  time_limit_seconds INTEGER, -- NULL = unlimited

  -- Questions Source
  lesson_ids UUID[] DEFAULT '{}', -- array of lesson IDs
  question_pool_config JSONB, -- custom question selection logic

  -- Rewards
  reward_config JSONB NOT NULL,
  -- { "xp": 500, "cards": 3, "card_rarity": "epic", "badges": ["boss_slayer"], "spins": 2 }

  -- Visual
  image_url TEXT,
  icon_url TEXT,

  is_active BOOLEAN DEFAULT true,
  unlock_condition JSONB, -- { "min_level": 5, "required_lessons": [...] }

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bosses_language ON bosses(language, is_active);
CREATE INDEX idx_bosses_difficulty ON bosses(difficulty);

-- Boss Battle Sessions
CREATE TABLE IF NOT EXISTS boss_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  boss_id UUID NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,

  -- Battle State
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'won', 'lost', 'abandoned'
  current_question_index INTEGER DEFAULT 0,
  questions JSONB NOT NULL, -- array of question objects
  answers JSONB DEFAULT '[]', -- array of user answers
  errors_count INTEGER DEFAULT 0,

  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Rewards (if won)
  rewards_claimed JSONB
);

CREATE INDEX idx_boss_battles_user ON boss_battles(user_id, status, started_at DESC);

-- ============================================================================
-- (5) STORY MODE / CHAPTERS SYSTEM
-- ============================================================================

-- Story Chapters
CREATE TABLE IF NOT EXISTS story_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_number INTEGER NOT NULL UNIQUE,
  code VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  description TEXT,
  story_text TEXT, -- narrative text, kiếm hiệp/HK retro vibe

  -- Visual
  image_url TEXT,
  map_position JSONB, -- { x, y } for map visualization

  -- Content Links
  lesson_ids UUID[] DEFAULT '{}',
  boss_id UUID REFERENCES bosses(id),

  -- Unlock Logic
  unlock_condition JSONB,
  -- { "required_chapters": [1,2], "min_level": 5, "required_missions": [...] }

  -- Rewards
  completion_reward JSONB,

  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_story_chapters_order ON story_chapters(display_order);

-- User Chapter Progress
CREATE TABLE IF NOT EXISTS user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES story_chapters(id) ON DELETE CASCADE,

  is_unlocked BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0,

  unlocked_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_user_story_progress_user ON user_story_progress(user_id);

-- ============================================================================
-- (6) LUCKY WHEEL SYSTEM
-- ============================================================================

-- Wheel Rewards Pool
CREATE TABLE IF NOT EXISTS wheel_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_type VARCHAR(50) NOT NULL, -- 'xp', 'card', 'badge', 'item', 'spin', 'streak_shield'
  reward_value JSONB NOT NULL, -- depends on type
  -- Examples:
  -- { "xp": 100 }
  -- { "cards": 2, "rarity": "rare" }
  -- { "item_id": "streak_shield" }

  rarity VARCHAR(20) DEFAULT 'common',
  weight INTEGER DEFAULT 100, -- for weighted random selection
  icon_url TEXT,
  display_name VARCHAR(200),

  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_wheel_rewards_active ON wheel_rewards(is_active, weight);

-- User Wheel Spins Tracking
CREATE TABLE IF NOT EXISTS user_wheel_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  spins_available INTEGER DEFAULT 1, -- free daily spin
  spins_extra INTEGER DEFAULT 0, -- from missions/rewards
  spins_used INTEGER DEFAULT 0,

  last_spin_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(user_id, date)
);

CREATE INDEX idx_user_wheel_spins_user ON user_wheel_spins(user_id, date DESC);

-- Wheel Spin History
CREATE TABLE IF NOT EXISTS wheel_spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES wheel_rewards(id),
  reward_received JSONB NOT NULL,
  spun_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wheel_spin_history_user ON wheel_spin_history(user_id, spun_at DESC);

-- ============================================================================
-- (7) PRONUNCIATION SCORING SYSTEM
-- ============================================================================

-- Pronunciation Targets (từ/câu để luyện)
CREATE TABLE IF NOT EXISTS pronunciation_targets (
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
CREATE TABLE IF NOT EXISTS user_pronunciation_scores (
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
CREATE TABLE IF NOT EXISTS game_items (
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
CREATE TABLE IF NOT EXISTS user_inventory (
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
(10, 20000, 'Hán Hiệp', 'Bất khả chiến bại')
ON CONFLICT (level_number) DO NOTHING;

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

-- Similar policies for other user-specific tables...
-- (Add more RLS policies as needed for security)

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_user_missions_completion ON user_missions(user_id, is_completed, mission_id);
CREATE INDEX idx_boss_battles_completion ON boss_battles(user_id, boss_id, status, completed_at DESC);
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
