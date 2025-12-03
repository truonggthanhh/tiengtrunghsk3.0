-- ============================================================================
-- FIX: Remove SECURITY DEFINER from courses_with_legacy view
-- ============================================================================
-- Security Advisor detected that courses_with_legacy view has SECURITY DEFINER
-- This is a security risk as it bypasses RLS and runs with creator's permissions
-- We need to recreate it as SECURITY INVOKER (default)
-- ============================================================================

-- Drop the existing view
DROP VIEW IF EXISTS courses_with_legacy;

-- Recreate view with SECURITY INVOKER (explicit, though it's the default)
CREATE OR REPLACE VIEW courses_with_legacy
WITH (security_invoker = true)
AS
SELECT
  id,
  name,
  slug,
  course_type_legacy,
  language,
  is_free,
  is_active,
  display_order,
  color
FROM courses
ORDER BY language, display_order;

-- Grant permissions
GRANT SELECT ON courses_with_legacy TO authenticated;

-- Add comment
COMMENT ON VIEW courses_with_legacy IS
'View showing all courses with legacy type mappings. Uses SECURITY INVOKER for security compliance.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- To verify this view is no longer SECURITY DEFINER, run:
-- SELECT viewname, viewowner, definition
-- FROM pg_views
-- WHERE viewname = 'courses_with_legacy' AND schemaname = 'public';
-- ============================================================================
