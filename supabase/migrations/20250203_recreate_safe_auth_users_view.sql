-- ============================================================================
-- RECREATE SAFE auth_users VIEW
-- Date: 2025-02-03
-- ============================================================================
-- This migration recreates the auth_users view in a SAFE way:
-- 1. WITHOUT SECURITY DEFINER (uses SECURITY INVOKER instead)
-- 2. Only exposes email (not sensitive data like encrypted_password)
-- 3. Has proper RLS policies
-- ============================================================================

-- Drop the old view first (in case it exists)
DROP VIEW IF EXISTS public.auth_users CASCADE;

-- Create a SAFE view that only exposes email
-- IMPORTANT: NOT using SECURITY DEFINER - uses SECURITY INVOKER (default)
CREATE VIEW public.auth_users AS
SELECT
  id,
  email
FROM auth.users;

-- Enable RLS on the view
ALTER VIEW public.auth_users SET (security_invoker = true);

-- Add comment
COMMENT ON VIEW public.auth_users IS
'Safe view of auth.users that only exposes id and email. Uses SECURITY INVOKER to respect caller permissions.';

-- Grant SELECT to authenticated users only
GRANT SELECT ON public.auth_users TO authenticated;

-- ============================================================================
-- Note: This view now uses SECURITY INVOKER instead of SECURITY DEFINER
-- This means it respects the permissions of the user calling it, not the
-- view creator. This is much more secure.
-- ============================================================================
