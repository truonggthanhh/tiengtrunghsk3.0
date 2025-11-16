-- ============================================================================
-- FIX USER SIGNUP TRIGGER - Prevent "Database error saving new user"
-- This migration fixes the initialize_user_gamification function to handle
-- errors gracefully and prevent signup failures
-- ============================================================================

-- Drop and recreate the function with proper error handling
DROP FUNCTION IF EXISTS initialize_user_gamification() CASCADE;

CREATE OR REPLACE FUNCTION initialize_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert user progress, but don't fail if there's an error
  BEGIN
    INSERT INTO user_progress (user_id, total_xp, current_level, current_streak, longest_streak, last_activity_date)
    VALUES (NEW.id, 0, 1, 0, 0, CURRENT_DATE)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user signup
    RAISE WARNING 'Failed to initialize gamification for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_initialize_user_gamification ON auth.users;

CREATE TRIGGER trigger_initialize_user_gamification
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION initialize_user_gamification();

-- ============================================================================
-- Ensure user_progress table exists with proper schema
-- ============================================================================

-- Create user_progress table if it doesn't exist
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_progress_level ON user_progress(current_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_xp ON user_progress(total_xp DESC);

-- ============================================================================
-- Enable RLS on user_progress if not already enabled
-- ============================================================================

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;
DROP POLICY IF EXISTS "Service role can manage all progress" ON user_progress;

-- Recreate policies
CREATE POLICY "Users can view their own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Allow service role to insert new user progress
CREATE POLICY "Service role can manage all progress"
ON user_progress FOR ALL
USING (auth.role() = 'service_role');

-- ============================================================================
-- Backfill existing users who don't have progress records
-- ============================================================================

-- Insert progress records for existing users who don't have one
INSERT INTO user_progress (user_id, total_xp, current_level, current_streak, longest_streak, last_activity_date)
SELECT
  id,
  0,
  1,
  0,
  0,
  CURRENT_DATE
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_progress)
ON CONFLICT (user_id) DO NOTHING;
