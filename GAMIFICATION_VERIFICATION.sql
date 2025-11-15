-- ============================================================================
-- GAMIFICATION SYSTEM VERIFICATION QUERIES
-- Run these to verify all migrations completed successfully
-- ============================================================================

-- ============================================================================
-- 1. VERIFY ALL TABLES EXIST
-- ============================================================================
SELECT
  table_name,
  'EXISTS ✓' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'level_definitions',
    'user_progress',
    'badges',
    'user_badges',
    'cards',
    'user_cards',
    'missions',
    'user_missions',
    'bosses',
    'boss_battles',
    'story_chapters',
    'user_story_progress',
    'wheel_rewards',
    'user_wheel_spins',
    'wheel_spin_history',
    'pronunciation_targets',
    'user_pronunciation_scores',
    'game_items',
    'user_inventory',
    'xp_events'
  )
ORDER BY table_name;

-- Expected: 20 tables

-- ============================================================================
-- 2. VERIFY LEVEL DEFINITIONS (Should have 10 levels)
-- ============================================================================
SELECT
  level_number,
  xp_required,
  title,
  description
FROM level_definitions
ORDER BY level_number;

-- Expected: 10 rows (Tân Thủ → Hán Hiệp)

-- ============================================================================
-- 3. VERIFY BADGES
-- ============================================================================
SELECT
  rarity,
  COUNT(*) as count
FROM badges
GROUP BY rarity
ORDER BY
  CASE rarity
    WHEN 'common' THEN 1
    WHEN 'rare' THEN 2
    WHEN 'epic' THEN 3
    WHEN 'legendary' THEN 4
  END;

-- Should have badges across different rarities

-- ============================================================================
-- 4. VERIFY CARDS (Should have 66 total: 33 Mandarin + 33 Cantonese)
-- ============================================================================
SELECT
  language,
  rarity,
  COUNT(*) as count
FROM cards
GROUP BY language, rarity
ORDER BY language,
  CASE rarity
    WHEN 'common' THEN 1
    WHEN 'rare' THEN 2
    WHEN 'epic' THEN 3
    WHEN 'legendary' THEN 4
  END;

-- Expected:
-- mandarin  | common    | 15
-- mandarin  | rare      | 10
-- mandarin  | epic      | 5
-- mandarin  | legendary | 3
-- cantonese | common    | 15
-- cantonese | rare      | 10
-- cantonese | epic      | 5
-- cantonese | legendary | 3

-- ============================================================================
-- 5. VERIFY MISSIONS
-- ============================================================================
SELECT
  mission_type,
  COUNT(*) as count
FROM missions
WHERE is_active = true
GROUP BY mission_type
ORDER BY mission_type;

-- Should have: daily, weekly, newbie missions

-- ============================================================================
-- 6. VERIFY BOSSES
-- ============================================================================
SELECT
  language,
  difficulty,
  name,
  level_requirement,
  reward_xp
FROM bosses
WHERE is_active = true
ORDER BY language, difficulty;

-- Should have bosses for both languages

-- ============================================================================
-- 7. VERIFY WHEEL REWARDS
-- ============================================================================
SELECT
  reward_type,
  COUNT(*) as count,
  SUM(probability) as total_probability
FROM wheel_rewards
WHERE is_active = true
GROUP BY reward_type
ORDER BY reward_type;

-- Total probability should be ~100

-- ============================================================================
-- 8. VERIFY RLS POLICIES
-- ============================================================================
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'user_progress',
    'user_badges',
    'user_cards',
    'user_missions',
    'boss_battles',
    'user_story_progress',
    'user_wheel_spins',
    'wheel_spin_history',
    'user_pronunciation_scores',
    'user_inventory'
  )
ORDER BY tablename, cmd;

-- Should have SELECT policies for all user-specific tables

-- ============================================================================
-- 9. VERIFY FUNCTIONS EXIST
-- ============================================================================
SELECT
  routine_name,
  'EXISTS ✓' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'update_user_progress_timestamp',
    'initialize_user_gamification'
  )
ORDER BY routine_name;

-- Expected: 2 functions

-- ============================================================================
-- 10. VERIFY TRIGGERS
-- ============================================================================
SELECT
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN (
    'user_progress',
    'users'
  )
ORDER BY event_object_table, trigger_name;

-- Expected triggers on user_progress and auth.users

-- ============================================================================
-- 11. SUMMARY COUNTS
-- ============================================================================
SELECT
  'Levels' as item,
  COUNT(*)::text as count,
  '10 expected' as expected
FROM level_definitions
UNION ALL
SELECT
  'Badges',
  COUNT(*)::text,
  'Multiple' as expected
FROM badges
UNION ALL
SELECT
  'Cards',
  COUNT(*)::text,
  '66 expected (33 per language)'
FROM cards
UNION ALL
SELECT
  'Missions',
  COUNT(*)::text,
  'Multiple'
FROM missions
WHERE is_active = true
UNION ALL
SELECT
  'Bosses',
  COUNT(*)::text,
  'Multiple'
FROM bosses
WHERE is_active = true
UNION ALL
SELECT
  'Wheel Rewards',
  COUNT(*)::text,
  'Multiple'
FROM wheel_rewards
WHERE is_active = true;

-- ============================================================================
-- 12. CHECK FOR DUPLICATES (Should return nothing)
-- ============================================================================
SELECT
  'Duplicate Cards' as issue,
  chinese_text,
  language,
  COUNT(*) as count
FROM cards
GROUP BY chinese_text, language
HAVING COUNT(*) > 1;

-- Should return 0 rows

-- ============================================================================
-- ✅ ALL CHECKS COMPLETE
-- ============================================================================
-- If all queries above return expected results, gamification system is ready!
