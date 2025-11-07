# Database Setup Instructions for Progress Tracking

## Overview
This document outlines the database schema needed to track user progress in the TIẾNG TRUNG HAOHAO application.

## Required Tables

### 1. `profiles` Table (Should Already Exist)
This table stores user profile information.

```sql
-- Profiles table should already exist from Supabase Auth setup
-- If not, create it:
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

### 2. `user_progress` Table
This table tracks user progress for each exercise.

```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_type TEXT NOT NULL, -- 'flashcard', 'pinyin-choice', 'meaning-choice', etc.
  level TEXT NOT NULL, -- 'hsk-1', 'hsk-2', 'msutong-so-cap-1', etc.
  vocabulary_id TEXT NOT NULL, -- ID of the vocabulary item
  is_correct BOOLEAN NOT NULL,
  attempts INTEGER DEFAULT 1,
  last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Create a unique constraint to prevent duplicate progress entries
  UNIQUE(user_id, exercise_type, level, vocabulary_id)
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_exercise_type ON user_progress(exercise_type);
CREATE INDEX idx_user_progress_level ON user_progress(level);
```

### 3. `user_exercise_stats` Table
This table stores aggregated statistics for each exercise type and level.

```sql
CREATE TABLE user_exercise_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_type TEXT NOT NULL,
  level TEXT NOT NULL,
  total_attempts INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  words_mastered INTEGER DEFAULT 0, -- Words with >80% accuracy
  total_time_spent INTEGER DEFAULT 0, -- In seconds
  last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, exercise_type, level)
);

-- Enable Row Level Security
ALTER TABLE user_exercise_stats ENABLE ROW LEVEL SECURITY;

-- Policies for user_exercise_stats
CREATE POLICY "Users can view their own stats"
  ON user_exercise_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON user_exercise_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON user_exercise_stats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stats"
  ON user_exercise_stats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create indexes
CREATE INDEX idx_user_exercise_stats_user_id ON user_exercise_stats(user_id);
CREATE INDEX idx_user_exercise_stats_exercise_type ON user_exercise_stats(exercise_type);
CREATE INDEX idx_user_exercise_stats_level ON user_exercise_stats(level);
```

### 4. Create a view for auth_users to be joinable with profiles
```sql
-- This view is needed for the admin dashboard to display user emails
CREATE OR REPLACE VIEW public.auth_users AS
SELECT id, email
FROM auth.users;

-- Grant select permission
GRANT SELECT ON public.auth_users TO authenticated;
```

## Setup Instructions

1. **Login to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Navigate to your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Create a new query

3. **Run the SQL Scripts**
   - Copy and paste each SQL block above
   - Run them one by one in order
   - Verify that tables are created successfully

4. **Verify Setup**
   - Navigate to "Table Editor" in Supabase dashboard
   - Check that all tables exist: `profiles`, `user_progress`, `user_exercise_stats`
   - Verify that Row Level Security is enabled
   - Check that policies are created

## Testing

After setup, test the following:

1. **Authentication**: Users should be able to sign up/login
2. **Profile Creation**: Profile should be created automatically when user signs up
3. **Progress Tracking**: Progress should be saved when completing exercises
4. **Admin Access**: Admin users should see all users and their progress
5. **User Privacy**: Users should only see their own progress

## Troubleshooting

- **Permission Errors**: Make sure Row Level Security policies are set up correctly
- **Missing Tables**: Re-run the SQL scripts
- **Auth Issues**: Check that auth.users table exists and has data
- **Admin Access**: Verify that user has `is_admin = TRUE` in profiles table
