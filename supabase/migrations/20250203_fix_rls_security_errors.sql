-- ============================================================================
-- FIX SUPABASE SECURITY ADVISOR ERRORS
-- Date: 2025-02-03
-- ============================================================================
-- This migration fixes critical security errors reported by Supabase:
-- 1. RLS not enabled on public lookup tables
-- 2. auth_users view exposing sensitive user data (Cantonese DB only)
-- ============================================================================

-- ============================================================================
-- PART 1: DROP DANGEROUS auth_users VIEW (if exists)
-- ============================================================================
-- This view exposes auth.users data which is a critical security vulnerability
-- Drop it completely as it's not needed and poses security risk

DROP VIEW IF EXISTS public.auth_users CASCADE;

-- ============================================================================
-- PART 2: ENABLE RLS ON LOOKUP/REFERENCE TABLES
-- ============================================================================
-- These are read-only reference tables that should allow public SELECT access
-- but restrict INSERT/UPDATE/DELETE to service role only

-- Gamification System Tables
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE wheel_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 3: CREATE RLS POLICIES FOR LOOKUP TABLES
-- ============================================================================
-- These tables contain reference data that all users should be able to read
-- but only service role can modify

-- Policy for badges table
CREATE POLICY "Allow public read access to badges"
ON badges FOR SELECT
TO public
USING (true);

-- Policy for level_definitions table
CREATE POLICY "Allow public read access to level definitions"
ON level_definitions FOR SELECT
TO public
USING (true);

-- Policy for cards table
CREATE POLICY "Allow public read access to cards"
ON cards FOR SELECT
TO public
USING (true);

-- Policy for missions table
CREATE POLICY "Allow public read access to missions"
ON missions FOR SELECT
TO public
USING (true);

-- Policy for bosses table
CREATE POLICY "Allow public read access to bosses"
ON bosses FOR SELECT
TO public
USING (true);

-- Policy for story_chapters table
CREATE POLICY "Allow public read access to story chapters"
ON story_chapters FOR SELECT
TO public
USING (true);

-- Policy for wheel_rewards table
CREATE POLICY "Allow public read access to wheel rewards"
ON wheel_rewards FOR SELECT
TO public
USING (true);

-- Policy for pronunciation_targets table
CREATE POLICY "Allow public read access to pronunciation targets"
ON pronunciation_targets FOR SELECT
TO public
USING (true);

-- Policy for game_items table
CREATE POLICY "Allow public read access to game items"
ON game_items FOR SELECT
TO public
USING (true);

-- ============================================================================
-- PART 4: COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "Allow public read access to badges" ON badges
IS 'Public read-only access for badge definitions. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to level definitions" ON level_definitions
IS 'Public read-only access for level progression data. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to cards" ON cards
IS 'Public read-only access for card collection pool. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to missions" ON missions
IS 'Public read-only access for mission definitions. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to bosses" ON bosses
IS 'Public read-only access for boss battle definitions. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to story chapters" ON story_chapters
IS 'Public read-only access for story mode chapters. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to wheel rewards" ON wheel_rewards
IS 'Public read-only access for lucky wheel rewards pool. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to pronunciation targets" ON pronunciation_targets
IS 'Public read-only access for pronunciation practice targets. Modifications restricted to service role.';

COMMENT ON POLICY "Allow public read access to game items" ON game_items
IS 'Public read-only access for game items catalog. Modifications restricted to service role.';

-- ============================================================================
-- SECURITY NOTES:
-- ============================================================================
-- 1. All lookup tables now have RLS enabled with public SELECT access
-- 2. INSERT/UPDATE/DELETE operations are implicitly restricted to service_role
--    (no policies defined for these operations)
-- 3. The dangerous auth_users view has been removed completely
-- 4. User-specific tables (user_progress, user_cards, etc.) already have
--    proper RLS policies from previous migrations
-- ============================================================================
