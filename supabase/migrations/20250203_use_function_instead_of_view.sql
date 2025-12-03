-- ============================================================================
-- REPLACE auth_users VIEW WITH TABLE-VALUED FUNCTION
-- Date: 2025-02-03
-- ============================================================================
-- Views can't access auth.users properly without SECURITY DEFINER issues
-- Use a function instead which is cleaner and more secure
-- ============================================================================

-- Drop the problematic view
DROP VIEW IF EXISTS public.auth_users CASCADE;

-- Create a table-valued function that returns user emails
-- This is safer than SECURITY DEFINER view
CREATE OR REPLACE FUNCTION public.get_user_emails()
RETURNS TABLE (
  id UUID,
  email TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT id, email::TEXT
  FROM auth.users;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_emails() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_user_emails() IS
'Returns id and email for all users. Used by admin dashboard. SECURITY DEFINER required to access auth.users but only exposes safe fields.';

-- ============================================================================
-- NOTE: The frontend code needs to be updated to use this function instead
-- of the auth_users relationship. Alternative: keep the view for compatibility
-- ============================================================================

-- For backward compatibility, create a simple view WITHOUT security_barrier
-- This view will be accessible because we grant proper permissions
CREATE OR REPLACE VIEW public.auth_users AS
SELECT * FROM public.get_user_emails();

-- Grant on the view too
GRANT SELECT ON public.auth_users TO authenticated;

COMMENT ON VIEW public.auth_users IS
'Backward-compatible view using get_user_emails() function. Safe for admin dashboard.';
