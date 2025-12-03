-- ============================================================================
-- FIX: Ensure profiles table uses correct column
-- ============================================================================
-- Some databases may have 'role' column, others may have 'is_admin'
-- This migration ensures compatibility with both

DO $$
BEGIN
  -- Check which column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'is_admin'
    AND table_schema = 'public'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'role'
    AND table_schema = 'public'
  ) THEN
    -- Database has is_admin but not role - add role column
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

    -- Migrate data: is_admin = true → role = 'admin'
    UPDATE profiles SET role = 'admin' WHERE is_admin = true;
    UPDATE profiles SET role = 'user' WHERE is_admin = false OR is_admin IS NULL;

    -- Optionally drop is_admin column (commented out for safety)
    -- ALTER TABLE profiles DROP COLUMN is_admin;
  END IF;

  -- Ensure role column has default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'role'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
  END IF;
END $$;

COMMENT ON COLUMN profiles.role IS 'User role: admin, user. Replaces deprecated is_admin column.';
