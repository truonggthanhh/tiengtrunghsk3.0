-- ============================================================================
-- FIX FUNCTION SEARCH PATH - SAFE VERSION
-- Date: 2025-02-03
-- ============================================================================
-- This version checks if each function exists before altering it
-- Works for both HSK and Cantonese databases
-- ============================================================================

DO $$
DECLARE
  func_record RECORD;
BEGIN
  -- Loop through all functions in public schema
  FOR func_record IN
    SELECT
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN (
      -- Common functions
      'update_user_progress_timestamp',
      'initialize_user_gamification',
      'update_blog_posts_updated_at',
      'update_blog_comments_updated_at',
      'get_post_comment_count',
      'increment_comment_likes',
      'increment_blog_post_view_count',
      'update_courses_updated_at',
      'check_course_access',
      'unlock_course_for_user',
      'lock_course_for_user',
      'bulk_unlock_courses',
      'initialize_user_course_access',
      'get_user_course_access',
      'get_all_users_with_emails',
      'add_points_to_user',
      'update_user_streak',
      'update_srs_review',
      'get_due_reviews',
      'update_learning_stats',
      'trigger_update_learning_stats',
      -- HSK specific
      'handle_new_user',
      'update_dictionary_updated_at',
      'search_dictionary',
      'get_dictionary_stats',
      'sync_role_from_is_admin',
      'get_my_role',
      -- Cantonese specific
      'update_updated_at_column',
      'update_lesson_order',
      'get_all_lessons',
      'delete_lesson_and_dependents',
      'set_user_lesson_access'
    )
  LOOP
    -- Alter each function to set search_path
    EXECUTE format(
      'ALTER FUNCTION public.%I(%s) SET search_path = public, pg_catalog',
      func_record.function_name,
      func_record.args
    );

    RAISE NOTICE 'Fixed search_path for function: %(%)', func_record.function_name, func_record.args;
  END LOOP;

  RAISE NOTICE 'All functions have been updated with search_path!';
END $$;

-- Add comment
COMMENT ON SCHEMA public IS
'Public schema with search_path set on all functions to prevent schema poisoning attacks';
