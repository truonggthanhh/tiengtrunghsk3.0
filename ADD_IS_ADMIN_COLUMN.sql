-- ============================================
-- ADD is_admin COLUMN TO profiles TABLE
-- ============================================
-- This script adds the missing is_admin column

-- ============================================
-- STEP 1: Check current table structure
-- ============================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Add is_admin column if it doesn't exist
-- ============================================
DO $$
BEGIN
    -- Check and add is_admin column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
        RAISE NOTICE 'Added is_admin column';
    ELSE
        RAISE NOTICE 'is_admin column already exists';
    END IF;

    -- Check and add role column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role text;
        RAISE NOTICE 'Added role column';
    ELSE
        RAISE NOTICE 'role column already exists';
    END IF;

    -- Check and add cantonese_access column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'cantonese_access'
    ) THEN
        ALTER TABLE profiles ADD COLUMN cantonese_access boolean DEFAULT false;
        RAISE NOTICE 'Added cantonese_access column';
    ELSE
        RAISE NOTICE 'cantonese_access column already exists';
    END IF;

    -- Check and add mandarin_access column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'mandarin_access'
    ) THEN
        ALTER TABLE profiles ADD COLUMN mandarin_access boolean DEFAULT true;
        RAISE NOTICE 'Added mandarin_access column';
    ELSE
        RAISE NOTICE 'mandarin_access column already exists';
    END IF;
END $$;

-- ============================================
-- STEP 3: Sync role column with is_admin
-- ============================================
UPDATE profiles
SET role = CASE
    WHEN is_admin = true THEN 'admin'
    ELSE 'user'
END
WHERE role IS NULL OR role = '';

-- ============================================
-- STEP 4: Create trigger to keep role synced with is_admin
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
-- STEP 5: Enable RLS (if not already enabled)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 6: Drop and recreate simple policies
-- ============================================

-- Drop all existing policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Create simple policies
CREATE POLICY "allow_select_all"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "allow_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 7: Create get_my_role function
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT CASE
        WHEN COALESCE((SELECT is_admin FROM profiles WHERE id = auth.uid()), false) = true
        THEN 'admin'::text
        ELSE 'user'::text
    END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;

-- ============================================
-- STEP 8: Verify everything
-- ============================================

-- Check columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('is_admin', 'role', 'cantonese_access', 'mandarin_access')
ORDER BY ordinal_position;

-- Check your profile
SELECT
    u.email,
    p.id,
    p.first_name,
    p.last_name,
    p.is_admin,
    p.role,
    CASE
        WHEN p.is_admin = true THEN '✅ ADMIN'
        ELSE '👤 USER'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.id = auth.uid();

-- Test get_my_role function
SELECT public.get_my_role() as my_role;

-- ============================================
-- INSTRUCTIONS
-- ============================================

/*
📋 CHẠY SCRIPT NÀY:

1. Copy TOÀN BỘ file này
2. Mở Supabase Dashboard → SQL Editor
3. Paste và click "Run"
4. Xem kết quả:
   ✓ "Added is_admin column" (hoặc "already exists")
   ✓ Thấy 4 columns: is_admin, role, cantonese_access, mandarin_access
   ✓ Thấy profile của bạn với status
   ✓ my_role trả về 'user' hoặc 'admin'

5. Nếu muốn làm admin:

   UPDATE profiles SET is_admin = true WHERE id = auth.uid();

6. Sau đó:
   - Xóa cache browser (Ctrl+Shift+Delete)
   - Logout và login lại
   - Profile menu sẽ hiện ra!
*/
