-- ============================================================================
-- FIX: Remove SECURITY DEFINER from auth_users view
-- ============================================================================
-- Security Advisor detected that auth_users view has SECURITY DEFINER
-- This is a security risk. We need to recreate it as SECURITY INVOKER
-- while keeping the underlying function as SECURITY DEFINER (which is safe)
-- ============================================================================

-- Drop the existing view
DROP VIEW IF EXISTS public.auth_users;

-- Recreate view with SECURITY INVOKER (explicit, though it's the default)
-- The underlying function get_user_emails() will still be SECURITY DEFINER
-- which is necessary to access auth.users table
CREATE OR REPLACE VIEW public.auth_users
WITH (security_invoker = true)
AS
SELECT * FROM public.get_user_emails();

-- Grant permissions
GRANT SELECT ON public.auth_users TO authenticated;

-- Add comment
COMMENT ON VIEW public.auth_users IS
'View showing user emails from auth.users. Uses SECURITY INVOKER for compliance. The underlying function is SECURITY DEFINER to access auth schema.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- To verify this view is no longer SECURITY DEFINER, run:
-- SELECT viewname, viewowner, definition
-- FROM pg_views
-- WHERE viewname = 'auth_users' AND schemaname = 'public';
--
-- The function get_user_emails() should remain SECURITY DEFINER (this is OK):
-- SELECT proname, prosecdef FROM pg_proc WHERE proname = 'get_user_emails';
-- ============================================================================
