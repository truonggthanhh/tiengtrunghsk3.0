-- ============================================
-- GAMIFICATION SYSTEM - DATABASE SCHEMA
-- ============================================
-- Hệ thống điểm số, huy hiệu, và thành tích cho Cantonese app

-- 1. USER POINTS TABLE - Điểm số tổng thể của user
CREATE TABLE IF NOT EXISTS user_points (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  current_streak_days INTEGER DEFAULT 0 NOT NULL,
  longest_streak_days INTEGER DEFAULT 0 NOT NULL,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. POINT TRANSACTIONS TABLE - Lịch sử ghi điểm
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  activity_type TEXT NOT NULL, -- 'lesson_complete', 'exercise_complete', 'daily_login', 'streak_bonus', 'perfect_score'
  reference_id UUID, -- lesson_id, exercise_id, etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ACHIEVEMENTS TABLE - Định nghĩa các thành tích/huy hiệu
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_vi TEXT NOT NULL, -- Tên tiếng Việt
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- Lucide icon name
  requirement_type TEXT NOT NULL, -- 'points', 'lessons_completed', 'streak_days', 'exercises_completed', 'perfect_scores'
  requirement_value INTEGER NOT NULL,
  tier TEXT DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER ACHIEVEMENTS TABLE - Achievements đã mở khóa
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 5. DAILY ACTIVITY TABLE - Tracking hoạt động hàng ngày (cho streak)
CREATE TABLE IF NOT EXISTS daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activities_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);

-- ============================================
-- RLS POLICIES
-- ============================================

-- user_points policies
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points" ON user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON user_points
  FOR UPDATE USING (auth.uid() = user_id);

-- point_transactions policies
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON point_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON point_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- achievements policies (public read)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage achievements" ON achievements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.is_admin = true OR profiles.role = 'admin')
    )
  );

-- user_achievements policies
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- daily_activity policies
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON daily_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON daily_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON daily_activity
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to add points to user
CREATE OR REPLACE FUNCTION add_points_to_user(
  p_user_id UUID,
  p_points INTEGER,
  p_activity_type TEXT,
  p_reference_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_new_total INTEGER;
  v_new_level INTEGER;
BEGIN
  -- Insert transaction
  INSERT INTO point_transactions (user_id, points, activity_type, reference_id, description)
  VALUES (p_user_id, p_points, p_activity_type, p_reference_id, p_description);

  -- Update or insert user_points
  INSERT INTO user_points (user_id, total_points, level)
  VALUES (p_user_id, p_points, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_points.total_points + p_points,
    updated_at = NOW();

  -- Calculate new level (every 1000 points = 1 level)
  SELECT total_points, GREATEST(1, total_points / 1000) INTO v_new_total, v_new_level
  FROM user_points WHERE user_id = p_user_id;

  UPDATE user_points SET level = v_new_level WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  v_last_activity DATE;
  v_current_streak INTEGER := 0;
BEGIN
  -- Get last activity date
  SELECT last_activity_date INTO v_last_activity
  FROM user_points WHERE user_id = p_user_id;

  -- Insert or update daily activity
  INSERT INTO daily_activity (user_id, activity_date, activities_count)
  VALUES (p_user_id, v_today, 1)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET activities_count = daily_activity.activities_count + 1;

  -- Calculate streak
  IF v_last_activity IS NULL THEN
    v_current_streak := 1;
  ELSIF v_last_activity = v_today THEN
    -- Same day, don't change streak
    RETURN;
  ELSIF v_last_activity = v_yesterday THEN
    -- Consecutive day, increment streak
    SELECT current_streak_days + 1 INTO v_current_streak
    FROM user_points WHERE user_id = p_user_id;
  ELSE
    -- Streak broken, reset to 1
    v_current_streak := 1;
  END IF;

  -- Update user_points
  UPDATE user_points
  SET
    current_streak_days = v_current_streak,
    longest_streak_days = GREATEST(longest_streak_days, v_current_streak),
    last_activity_date = v_today,
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Give streak bonus points (10 points per streak day, max 100)
  IF v_current_streak > 1 AND v_current_streak % 7 = 0 THEN
    PERFORM add_points_to_user(
      p_user_id,
      LEAST(v_current_streak * 10, 100),
      'streak_bonus',
      NULL,
      format('Streak bonus: %s ngày liên tiếp', v_current_streak)
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED ACHIEVEMENTS DATA
-- ============================================
INSERT INTO achievements (name, name_vi, description, icon, requirement_type, requirement_value, tier, points_reward) VALUES
  -- Points-based achievements
  ('First Steps', 'Bước Đầu Tiên', 'Đạt 100 điểm', 'Star', 'points', 100, 'bronze', 50),
  ('Getting Started', 'Khởi Đầu', 'Đạt 500 điểm', 'Award', 'points', 500, 'silver', 100),
  ('Rising Star', 'Ngôi Sao Đang Lên', 'Đạt 1000 điểm', 'Sparkles', 'points', 1000, 'gold', 200),
  ('Point Master', 'Bậc Thầy Điểm Số', 'Đạt 5000 điểm', 'Trophy', 'points', 5000, 'platinum', 500),

  -- Lessons-based achievements
  ('Beginner', 'Người Mới Bắt Đầu', 'Hoàn thành 1 bài học', 'BookOpen', 'lessons_completed', 1, 'bronze', 50),
  ('Learner', 'Người Học', 'Hoàn thành 5 bài học', 'GraduationCap', 'lessons_completed', 5, 'silver', 100),
  ('Scholar', 'Học Giả', 'Hoàn thành 10 bài học', 'Book', 'lessons_completed', 10, 'gold', 200),
  ('Master', 'Bậc Thầy', 'Hoàn thành 20 bài học', 'Crown', 'lessons_completed', 20, 'platinum', 500),

  -- Streak-based achievements
  ('Consistency', 'Kiên Trì', 'Học liên tục 3 ngày', 'Flame', 'streak_days', 3, 'bronze', 50),
  ('Dedication', 'Tận Tâm', 'Học liên tục 7 ngày', 'Zap', 'streak_days', 7, 'silver', 150),
  ('Unstoppable', 'Không Thể Cản', 'Học liên tục 30 ngày', 'Rocket', 'streak_days', 30, 'gold', 500),
  ('Legend', 'Huyền Thoại', 'Học liên tục 100 ngày', 'Medal', 'streak_days', 100, 'platinum', 1000),

  -- Perfect score achievements
  ('Perfectionist', 'Người Hoàn Hảo', 'Đạt điểm tuyệt đối trong 1 bài tập', 'Target', 'perfect_scores', 1, 'bronze', 100),
  ('Flawless', 'Không Tì Vết', 'Đạt điểm tuyệt đối trong 5 bài tập', 'CheckCircle2', 'perfect_scores', 5, 'silver', 200),
  ('Perfection Master', 'Bậc Thầy Hoàn Hảo', 'Đạt điểm tuyệt đối trong 10 bài tập', 'Stars', 'perfect_scores', 10, 'gold', 500)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Check that all tables and functions are created
-- 3. Test by inserting a user point record
-- 4. Call functions from your app to add points and update streaks
