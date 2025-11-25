-- ============================================
-- SRS (Spaced Repetition System) & ANALYTICS - DATABASE SCHEMA
-- ============================================
-- System for tracking vocabulary review and user learning analytics

-- ============================================
-- 1. VOCABULARY REVIEWS TABLE - SRS Tracking
-- ============================================
-- Tracks each word's SRS data per user
CREATE TABLE IF NOT EXISTS vocabulary_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id INTEGER NOT NULL, -- References vocabulary data (hsk*.ts or msutong*.ts)
  word_type TEXT NOT NULL CHECK (word_type IN ('mandarin', 'cantonese')), -- Language type
  level TEXT NOT NULL, -- 'hsk1', 'hsk2', 'so-cap-quyen-1', etc.

  -- SRS Algorithm Data (SM-2 based)
  ease_factor DECIMAL(3,2) DEFAULT 2.5 NOT NULL, -- Difficulty multiplier (1.3 - 2.5+)
  interval_days INTEGER DEFAULT 1 NOT NULL, -- Days until next review
  next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Statistics
  review_count INTEGER DEFAULT 0 NOT NULL, -- Total times reviewed
  correct_count INTEGER DEFAULT 0 NOT NULL, -- Times answered correctly
  incorrect_count INTEGER DEFAULT 0 NOT NULL, -- Times answered incorrectly
  last_reviewed_at TIMESTAMP WITH TIME ZONE, -- Last review timestamp

  -- Additional data
  hanzi TEXT NOT NULL, -- Chinese characters (for quick reference)
  pinyin TEXT, -- Pronunciation (for Mandarin)
  jyutping TEXT, -- Pronunciation (for Cantonese)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, word_id, word_type, level)
);

-- ============================================
-- 2. PRACTICE SESSIONS TABLE - Analytics
-- ============================================
-- Tracks each practice session
CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session Info
  session_type TEXT NOT NULL, -- 'pinyin_choice', 'meaning_choice', 'fill_blank', 'flashcard', 'pronunciation', 'sentence_choice'
  language TEXT NOT NULL CHECK (language IN ('mandarin', 'cantonese')),
  level TEXT NOT NULL, -- 'hsk1', 'so-cap-quyen-1', etc.

  -- Session Results
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  accuracy DECIMAL(5,2), -- Percentage (0-100)

  -- Time tracking
  duration_seconds INTEGER, -- Total time spent
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Additional metadata
  metadata JSONB, -- Store extra data like question_count selection, lesson_ids, etc.

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. SESSION ANSWERS TABLE - Detailed Analytics
-- ============================================
-- Tracks individual answers within each session
CREATE TABLE IF NOT EXISTS session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Question Info
  word_id INTEGER NOT NULL,
  hanzi TEXT NOT NULL,
  pinyin TEXT,
  jyutping TEXT,
  correct_answer TEXT NOT NULL,

  -- User Response
  user_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER, -- Time taken to answer in milliseconds

  -- Context
  question_type TEXT NOT NULL, -- Same as session_type

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. USER LEARNING STATS TABLE - Aggregated Analytics
-- ============================================
-- Cached aggregated statistics for performance
CREATE TABLE IF NOT EXISTS user_learning_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Overall Stats
  total_practice_time_seconds INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  overall_accuracy DECIMAL(5,2) DEFAULT 0,

  -- Mandarin Stats
  mandarin_sessions INTEGER DEFAULT 0,
  mandarin_accuracy DECIMAL(5,2) DEFAULT 0,
  mandarin_words_learned INTEGER DEFAULT 0,

  -- Cantonese Stats
  cantonese_sessions INTEGER DEFAULT 0,
  cantonese_accuracy DECIMAL(5,2) DEFAULT 0,
  cantonese_words_learned INTEGER DEFAULT 0,

  -- Time-based Stats
  avg_session_duration_seconds INTEGER DEFAULT 0,
  last_practice_date TIMESTAMP WITH TIME ZONE,

  -- Weak Spots (JSONB for flexibility)
  weak_word_types JSONB, -- Track which word categories user struggles with

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. PRONUNCIATION PRACTICE TABLE - Speech Recognition Results
-- ============================================
CREATE TABLE IF NOT EXISTS pronunciation_practice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Word Info
  word_id INTEGER NOT NULL,
  hanzi TEXT NOT NULL,
  expected_pronunciation TEXT NOT NULL, -- pinyin or jyutping
  language TEXT NOT NULL CHECK (language IN ('mandarin', 'cantonese')),

  -- Recognition Results
  recognized_text TEXT, -- What the speech API heard
  confidence_score DECIMAL(5,2), -- 0-100
  is_correct BOOLEAN,

  -- Audio Data (optional)
  audio_blob_url TEXT, -- If we store recordings

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================

-- vocabulary_reviews indexes
CREATE INDEX IF NOT EXISTS idx_vocabulary_reviews_user_id ON vocabulary_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_reviews_next_review ON vocabulary_reviews(user_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_vocabulary_reviews_word_type ON vocabulary_reviews(word_type, level);

-- practice_sessions indexes
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_created_at ON practice_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_language ON practice_sessions(language);

-- session_answers indexes
CREATE INDEX IF NOT EXISTS idx_session_answers_session_id ON session_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_session_answers_user_id ON session_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_session_answers_word_id ON session_answers(word_id);

-- pronunciation_practice indexes
CREATE INDEX IF NOT EXISTS idx_pronunciation_user_id ON pronunciation_practice(user_id);
CREATE INDEX IF NOT EXISTS idx_pronunciation_created_at ON pronunciation_practice(created_at DESC);

-- ============================================
-- RLS POLICIES
-- ============================================

-- vocabulary_reviews policies
ALTER TABLE vocabulary_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary reviews" ON vocabulary_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary reviews" ON vocabulary_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary reviews" ON vocabulary_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- practice_sessions policies
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own practice sessions" ON practice_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own practice sessions" ON practice_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions" ON practice_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- session_answers policies
ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session answers" ON session_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own session answers" ON session_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_learning_stats policies
ALTER TABLE user_learning_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning stats" ON user_learning_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning stats" ON user_learning_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning stats" ON user_learning_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- pronunciation_practice policies
ALTER TABLE pronunciation_practice ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pronunciation practice" ON pronunciation_practice
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pronunciation practice" ON pronunciation_practice
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update SRS data after review
CREATE OR REPLACE FUNCTION update_srs_review(
  p_user_id UUID,
  p_word_id INTEGER,
  p_word_type TEXT,
  p_level TEXT,
  p_hanzi TEXT,
  p_pinyin TEXT,
  p_jyutping TEXT,
  p_is_correct BOOLEAN,
  p_quality INTEGER -- 0-5 rating (0=complete blackout, 5=perfect)
)
RETURNS void AS $$
DECLARE
  v_current_ease DECIMAL(3,2);
  v_current_interval INTEGER;
  v_current_review_count INTEGER;
  v_new_ease DECIMAL(3,2);
  v_new_interval INTEGER;
BEGIN
  -- Get current SRS data or create new record
  SELECT ease_factor, interval_days, review_count
  INTO v_current_ease, v_current_interval, v_current_review_count
  FROM vocabulary_reviews
  WHERE user_id = p_user_id
    AND word_id = p_word_id
    AND word_type = p_word_type
    AND level = p_level;

  -- If no record exists, create one with defaults
  IF NOT FOUND THEN
    v_current_ease := 2.5;
    v_current_interval := 1;
    v_current_review_count := 0;
  END IF;

  -- SM-2 Algorithm calculation
  -- New ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  v_new_ease := v_current_ease + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02));

  -- Ease factor must be at least 1.3
  IF v_new_ease < 1.3 THEN
    v_new_ease := 1.3;
  END IF;

  -- Calculate new interval based on quality
  IF p_quality < 3 THEN
    -- Failed review, reset to 1 day
    v_new_interval := 1;
  ELSE
    -- Successful review
    IF v_current_review_count = 0 THEN
      v_new_interval := 1;
    ELSIF v_current_review_count = 1 THEN
      v_new_interval := 6;
    ELSE
      v_new_interval := ROUND(v_current_interval * v_new_ease);
    END IF;
  END IF;

  -- Upsert the review record
  INSERT INTO vocabulary_reviews (
    user_id, word_id, word_type, level, hanzi, pinyin, jyutping,
    ease_factor, interval_days, next_review_date,
    review_count, correct_count, incorrect_count, last_reviewed_at, updated_at
  )
  VALUES (
    p_user_id, p_word_id, p_word_type, p_level, p_hanzi, p_pinyin, p_jyutping,
    v_new_ease, v_new_interval, NOW() + (v_new_interval || ' days')::INTERVAL,
    1,
    CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    NOW(), NOW()
  )
  ON CONFLICT (user_id, word_id, word_type, level)
  DO UPDATE SET
    ease_factor = v_new_ease,
    interval_days = v_new_interval,
    next_review_date = NOW() + (v_new_interval || ' days')::INTERVAL,
    review_count = vocabulary_reviews.review_count + 1,
    correct_count = vocabulary_reviews.correct_count + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    incorrect_count = vocabulary_reviews.incorrect_count + CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    last_reviewed_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get due reviews for a user
CREATE OR REPLACE FUNCTION get_due_reviews(
  p_user_id UUID,
  p_word_type TEXT,
  p_level TEXT,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  word_id INTEGER,
  hanzi TEXT,
  pinyin TEXT,
  jyutping TEXT,
  ease_factor DECIMAL(3,2),
  review_count INTEGER,
  next_review_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    vr.word_id,
    vr.hanzi,
    vr.pinyin,
    vr.jyutping,
    vr.ease_factor,
    vr.review_count,
    vr.next_review_date
  FROM vocabulary_reviews vr
  WHERE vr.user_id = p_user_id
    AND vr.word_type = p_word_type
    AND vr.level = p_level
    AND vr.next_review_date <= NOW()
  ORDER BY vr.next_review_date ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update aggregated learning stats
CREATE OR REPLACE FUNCTION update_learning_stats(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_total_time INTEGER;
  v_total_sessions INTEGER;
  v_total_questions INTEGER;
  v_total_correct INTEGER;
  v_overall_accuracy DECIMAL(5,2);
BEGIN
  -- Calculate aggregated statistics
  SELECT
    COALESCE(SUM(duration_seconds), 0),
    COUNT(*),
    COALESCE(SUM(total_questions), 0),
    COALESCE(SUM(correct_answers), 0)
  INTO v_total_time, v_total_sessions, v_total_questions, v_total_correct
  FROM practice_sessions
  WHERE user_id = p_user_id;

  -- Calculate accuracy
  IF v_total_questions > 0 THEN
    v_overall_accuracy := (v_total_correct::DECIMAL / v_total_questions) * 100;
  ELSE
    v_overall_accuracy := 0;
  END IF;

  -- Upsert learning stats
  INSERT INTO user_learning_stats (
    user_id,
    total_practice_time_seconds,
    total_sessions,
    total_questions_answered,
    total_correct_answers,
    overall_accuracy,
    last_practice_date,
    updated_at
  )
  VALUES (
    p_user_id,
    v_total_time,
    v_total_sessions,
    v_total_questions,
    v_total_correct,
    v_overall_accuracy,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_practice_time_seconds = v_total_time,
    total_sessions = v_total_sessions,
    total_questions_answered = v_total_questions,
    total_correct_answers = v_total_correct,
    overall_accuracy = v_overall_accuracy,
    last_practice_date = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update learning stats after session completion
CREATE OR REPLACE FUNCTION trigger_update_learning_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when session is completed
  IF NEW.completed_at IS NOT NULL AND (OLD.completed_at IS NULL OR OLD.completed_at != NEW.completed_at) THEN
    PERFORM update_learning_stats(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_session_complete
  AFTER UPDATE ON practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_learning_stats();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE vocabulary_reviews IS 'Tracks SRS (Spaced Repetition) data for each vocabulary word per user';
COMMENT ON TABLE practice_sessions IS 'Records each practice session with overall results';
COMMENT ON TABLE session_answers IS 'Stores individual answer data for detailed analytics';
COMMENT ON TABLE user_learning_stats IS 'Cached aggregated learning statistics for dashboard performance';
COMMENT ON TABLE pronunciation_practice IS 'Tracks pronunciation practice attempts and speech recognition results';

COMMENT ON FUNCTION update_srs_review IS 'Updates SRS data using SM-2 algorithm after each review';
COMMENT ON FUNCTION get_due_reviews IS 'Returns vocabulary words that are due for review';
COMMENT ON FUNCTION update_learning_stats IS 'Recalculates and updates aggregated learning statistics';
