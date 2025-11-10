-- ============================================
-- FIX PROFILE AND AUTHENTICATION ISSUES V2
-- ============================================
-- This script works with is_admin (boolean) column

-- ============================================
-- STEP 1: Create get_my_role RPC function (compatible with is_admin)
-- ============================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT CASE
        WHEN COALESCE((SELECT is_admin FROM profiles WHERE id = auth.uid()), false) = true
        THEN 'admin'::text
        ELSE 'user'::text
    END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

COMMENT ON FUNCTION public.get_my_role() IS 'Returns the role of the currently authenticated user (admin or user) based on is_admin column';

-- ============================================
-- STEP 2: Verify and fix profiles table structure
-- ============================================

DO $$
BEGIN
    -- Ensure is_admin column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
    END IF;

    -- Ensure cantonese_access and mandarin_access columns exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'cantonese_access'
    ) THEN
        ALTER TABLE profiles ADD COLUMN cantonese_access boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'mandarin_access'
    ) THEN
        ALTER TABLE profiles ADD COLUMN mandarin_access boolean DEFAULT true;
    END IF;

    -- Add role column for compatibility (maps from is_admin)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role text;
    END IF;
END $$;

-- Update role column based on is_admin (for existing records)
UPDATE profiles
SET role = CASE
    WHEN is_admin = true THEN 'admin'
    ELSE 'user'
END
WHERE role IS NULL OR role = '';

-- ============================================
-- STEP 3: Ensure RLS is enabled and policies are correct
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies that might cause issues
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow all authenticated users to read all profiles (needed for admin dashboard)
CREATE POLICY "profiles_select_all"
ON profiles
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- STEP 4: Create helper function for admin check
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT COALESCE(
        (SELECT is_admin FROM profiles WHERE id = auth.uid()),
        false
    );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- STEP 5: Ensure lessons table has proper RLS
-- ============================================

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "lessons_select_all" ON lessons;
DROP POLICY IF EXISTS "lessons_insert_admin" ON lessons;
DROP POLICY IF EXISTS "lessons_update_admin" ON lessons;
DROP POLICY IF EXISTS "lessons_delete_admin" ON lessons;

-- Allow all authenticated users to read lessons
CREATE POLICY "lessons_select_all"
ON lessons
FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert/update/delete lessons
CREATE POLICY "lessons_insert_admin"
ON lessons
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "lessons_update_admin"
ON lessons
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "lessons_delete_admin"
ON lessons
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================
-- STEP 6: Ensure user_lesson_access table exists and has proper RLS
-- ============================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_lesson_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_lesson_access ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "user_lesson_access_select_own" ON user_lesson_access;
DROP POLICY IF EXISTS "user_lesson_access_insert_admin" ON user_lesson_access;
DROP POLICY IF EXISTS "user_lesson_access_delete_admin" ON user_lesson_access;
DROP POLICY IF EXISTS "user_lesson_access_select_all" ON user_lesson_access;

-- Users can see their own lesson access
CREATE POLICY "user_lesson_access_select_own"
ON user_lesson_access
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Admins can see all lesson access (for dashboard)
CREATE POLICY "user_lesson_access_select_all"
ON user_lesson_access
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Admins can manage lesson access
CREATE POLICY "user_lesson_access_insert_admin"
ON user_lesson_access
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "user_lesson_access_delete_admin"
ON user_lesson_access
FOR DELETE
TO authenticated
USING (public.is_admin());

-- ============================================
-- STEP 7: Create or update the set_user_lesson_access RPC function
-- ============================================

CREATE OR REPLACE FUNCTION public.set_user_lesson_access(
    user_id_in UUID,
    lesson_ids_in UUID[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only admins can call this
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Only admins can manage user lesson access';
    END IF;

    -- Delete existing access for this user
    DELETE FROM user_lesson_access WHERE user_id = user_id_in;

    -- Insert new access entries
    IF lesson_ids_in IS NOT NULL AND array_length(lesson_ids_in, 1) > 0 THEN
        INSERT INTO user_lesson_access (user_id, lesson_id)
        SELECT user_id_in, unnest(lesson_ids_in);
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_user_lesson_access(UUID, UUID[]) TO authenticated;

-- ============================================
-- STEP 8: Create trigger to keep role column in sync with is_admin
-- ============================================

CREATE OR REPLACE FUNCTION sync_role_from_is_admin()
RETURNS TRIGGER AS $$
BEGIN
    NEW.role = CASE
        WHEN NEW.is_admin = true THEN 'admin'
        ELSE 'user'
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_role_trigger ON profiles;

CREATE TRIGGER sync_role_trigger
    BEFORE INSERT OR UPDATE OF is_admin ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_role_from_is_admin();

-- ============================================
-- STEP 9: Verify everything is working
-- ============================================

-- Test: Check if policies exist
SELECT
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'lessons', 'user_lesson_access')
ORDER BY tablename, policyname;

-- Test: Check if functions exist
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('get_my_role', 'is_admin', 'set_user_lesson_access', 'sync_role_from_is_admin');

-- Test: Check table structure
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('is_admin', 'role', 'cantonese_access', 'mandarin_access')
ORDER BY ordinal_position;

-- ============================================
-- STEP 10: Test the get_my_role function
-- ============================================

-- This should return 'user' or 'admin' depending on your current user
SELECT public.get_my_role() as my_role;

-- View your profile
SELECT
    id,
    first_name,
    last_name,
    is_admin,
    role,
    cantonese_access,
    mandarin_access
FROM profiles
WHERE id = auth.uid();

-- ============================================
-- INSTRUCTIONS
-- ============================================

/*
📋 HOW TO RUN THIS SCRIPT:

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste this entire file
3. Click "Run" or press Ctrl+Enter
4. Wait for completion (should take 5-10 seconds)
5. Check the output of STEP 9 to verify:
   - All policies are created
   - All functions exist
   - All columns exist

AFTER RUNNING:
1. Clear browser cache or use Incognito mode
2. Go to your app and try to login
3. Open browser console (F12) for debugging logs
4. Profile menu should now appear after login
5. Admin dashboard should work for admin users

TO SET YOURSELF AS ADMIN:
Run this query (replace with your email):

UPDATE profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');

-- Verify it worked:
SELECT u.email, p.is_admin, p.role
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'your@email.com';

IF STILL NOT WORKING:
- Check browser console for specific errors
- Run: SELECT * FROM profiles WHERE id = auth.uid();
- If empty, signup again or create profile manually
*/
