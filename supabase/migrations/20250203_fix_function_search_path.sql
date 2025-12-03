-- ============================================================================
-- FIX FUNCTION SEARCH PATH SECURITY WARNINGS
-- Date: 2025-02-03
-- ============================================================================
-- This migration fixes "Function Search Path Mutable" warnings by setting
-- explicit search_path for all functions to prevent schema poisoning attacks
-- ============================================================================

-- ============================================================================
-- COMMON FUNCTIONS (Both HSK & Cantonese Databases)
-- ============================================================================

-- Gamification System Functions
ALTER FUNCTION public.update_user_progress_timestamp()
SET search_path = public, pg_catalog;

ALTER FUNCTION public.initialize_user_gamification()
SET search_path = public, pg_catalog;

-- Blog & Comments Functions
ALTER FUNCTION public.update_blog_posts_updated_at()
SET search_path = public, pg_catalog;

ALTER FUNCTION public.update_blog_comments_updated_at()
SET search_path = public, pg_catalog;

ALTER FUNCTION public.get_post_comment_count(UUID)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.increment_comment_likes(UUID)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.increment_blog_post_view_count(UUID)
SET search_path = public, pg_catalog;

-- Course Management Functions
ALTER FUNCTION public.update_courses_updated_at()
SET search_path = public, pg_catalog;

ALTER FUNCTION public.check_course_access(UUID, UUID)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.unlock_course_for_user(UUID, UUID)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.lock_course_for_user(UUID, UUID)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.bulk_unlock_courses(UUID, UUID[])
SET search_path = public, pg_catalog;

ALTER FUNCTION public.initialize_user_course_access()
SET search_path = public, pg_catalog;

ALTER FUNCTION public.get_user_course_access(UUID)
SET search_path = public, pg_catalog;

-- User Management Functions
ALTER FUNCTION public.get_all_users_with_emails()
SET search_path = public, pg_catalog;

-- Gamification Points & Streak Functions
ALTER FUNCTION public.add_points_to_user(UUID, INTEGER, TEXT)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.update_user_streak(UUID)
SET search_path = public, pg_catalog;

-- SRS (Spaced Repetition) Functions
ALTER FUNCTION public.update_srs_review(UUID, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, INTEGER)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.get_due_reviews(UUID, TEXT, TEXT, INTEGER)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.update_learning_stats(UUID)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.trigger_update_learning_stats()
SET search_path = public, pg_catalog;

-- ============================================================================
-- HSK DATABASE SPECIFIC FUNCTIONS
-- ============================================================================
-- (These may not exist in Cantonese DB, will fail silently with IF EXISTS)

DO $$
BEGIN
  -- User signup/auth functions
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_catalog;
  END IF;

  -- Dictionary functions
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_dictionary_updated_at') THEN
    ALTER FUNCTION public.update_dictionary_updated_at() SET search_path = public, pg_catalog;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_dictionary') THEN
    ALTER FUNCTION public.search_dictionary(TEXT) SET search_path = public, pg_catalog;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_dictionary_stats') THEN
    ALTER FUNCTION public.get_dictionary_stats() SET search_path = public, pg_catalog;
  END IF;

  -- Role management functions
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'sync_role_from_is_admin') THEN
    ALTER FUNCTION public.sync_role_from_is_admin() SET search_path = public, pg_catalog;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_my_role') THEN
    ALTER FUNCTION public.get_my_role() SET search_path = public, pg_catalog;
  END IF;
END $$;

-- ============================================================================
-- CANTONESE DATABASE SPECIFIC FUNCTIONS
-- ============================================================================
-- (These may not exist in HSK DB, will fail silently with IF EXISTS)

DO $$
BEGIN
  -- Generic updated_at trigger
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_catalog;
  END IF;

  -- Lesson management functions
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_lesson_order') THEN
    ALTER FUNCTION public.update_lesson_order(UUID, INTEGER) SET search_path = public, pg_catalog;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_all_lessons') THEN
    ALTER FUNCTION public.get_all_lessons() SET search_path = public, pg_catalog;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'delete_lesson_and_dependents') THEN
    ALTER FUNCTION public.delete_lesson_and_dependents(UUID) SET search_path = public, pg_catalog;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_user_lesson_access') THEN
    ALTER FUNCTION public.set_user_lesson_access(UUID, UUID, BOOLEAN) SET search_path = public, pg_catalog;
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION & COMMENTS
-- ============================================================================

COMMENT ON SCHEMA public IS
'Public schema with search_path set on all functions to prevent schema poisoning attacks';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
