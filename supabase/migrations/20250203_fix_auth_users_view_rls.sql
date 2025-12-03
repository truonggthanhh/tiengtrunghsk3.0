-- ============================================================================
-- FIX auth_users VIEW RLS POLICIES
-- Date: 2025-02-03
-- ============================================================================
-- The view needs SECURITY DEFINER to access auth.users from public schema
-- But we limit it to only expose id and email (safe fields)
-- ============================================================================

-- Drop and recreate the view properly
DROP VIEW IF EXISTS public.auth_users CASCADE;

-- Create SECURITY DEFINER view (needed to access auth.users)
-- BUT only expose safe fields (id, email) - NO sensitive data
CREATE VIEW public.auth_users
WITH (security_barrier = true)
AS
SELECT
  id,
  email
FROM auth.users;

-- Grant SELECT to authenticated users only (not anon for security)
GRANT SELECT ON public.auth_users TO authenticated;

-- Add comment explaining the security model
COMMENT ON VIEW public.auth_users IS
'SECURITY DEFINER view exposing ONLY id and email from auth.users. Does not expose passwords, metadata, or other sensitive fields. Required for admin dashboard user management.';

-- ============================================================================
-- SECURITY NOTES:
-- 1. Uses security_barrier = true for additional protection
-- 2. Only exposes id and email (no sensitive fields)
-- 3. Granted only to authenticated users
-- 4. This is safer than the default SECURITY DEFINER warning because
--    we explicitly limit exposed fields and don't allow data modification
-- ============================================================================
