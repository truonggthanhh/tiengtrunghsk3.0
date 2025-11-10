-- ============================================
-- STEP BY STEP FIX - RUN EACH QUERY SEPARATELY
-- ============================================
-- Copy từng query một, paste vào SQL Editor, click Run

-- ============================================
-- BƯỚC 1: Kiểm tra cột hiện tại của bảng profiles
-- ============================================
-- Copy và Run query này TRƯỚC

SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- XEM KẾT QUẢ:
-- Nếu KHÔNG THẤY cột "is_admin" → Chạy BƯỚC 2
-- Nếu THẤY cột "is_admin" → Bỏ qua BƯỚC 2, chạy BƯỚC 3

-- ============================================
-- BƯỚC 2: Thêm cột is_admin (chỉ chạy nếu BƯỚC 1 không thấy cột này)
-- ============================================
-- Copy và Run query này

ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false NOT NULL;

-- KẾT QUẢ MONG ĐỢI: "ALTER TABLE" → Thành công!
-- Nếu lỗi "column already exists" → Không sao, cột đã có rồi

-- ============================================
-- BƯỚC 3: Thêm cột role (nếu chưa có)
-- ============================================

ALTER TABLE profiles ADD COLUMN role text;

-- Nếu lỗi "already exists" → OK, bỏ qua

-- ============================================
-- BƯỚC 4: Thêm cột cantonese_access (nếu chưa có)
-- ============================================

ALTER TABLE profiles ADD COLUMN cantonese_access boolean DEFAULT false;

-- ============================================
-- BƯỚC 5: Thêm cột mandarin_access (nếu chưa có)
-- ============================================

ALTER TABLE profiles ADD COLUMN mandarin_access boolean DEFAULT true;

-- ============================================
-- BƯỚC 6: Sync cột role với is_admin cho tất cả records
-- ============================================

UPDATE profiles
SET role = CASE
    WHEN is_admin = true THEN 'admin'
    ELSE 'user'
END;

-- KẾT QUẢ: "UPDATE X" → X là số dòng đã update

-- ============================================
-- BƯỚC 7: Kiểm tra lại tất cả cột
-- ============================================

SELECT
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('is_admin', 'role', 'cantonese_access', 'mandarin_access')
ORDER BY column_name;

-- PHẢI THẤY 4 DÒNG:
-- cantonese_access | boolean
-- is_admin         | boolean
-- mandarin_access  | boolean
-- role             | text

-- ============================================
-- BƯỚC 8: XEM PROFILE CỦA BẠN
-- ============================================

SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.is_admin,
    p.role,
    p.cantonese_access,
    p.mandarin_access
FROM profiles p
WHERE p.id = auth.uid();

-- PHẢI THẤY: 1 dòng với thông tin của bạn
-- Nếu KHÔNG THẤY GÌ → Profile không tồn tại, chạy BƯỚC 9

-- ============================================
-- BƯỚC 9: Tạo profile nếu chưa có (chỉ chạy nếu BƯỚC 8 không có kết quả)
-- ============================================

INSERT INTO profiles (id, first_name, last_name, is_admin, role)
SELECT
    id,
    COALESCE(raw_user_meta_data->>'first_name', 'User'),
    COALESCE(raw_user_meta_data->>'last_name', ''),
    false,
    'user'
FROM auth.users
WHERE id = auth.uid()
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- BƯỚC 10: SET ADMIN CHO MÌNH
-- ============================================

UPDATE profiles
SET is_admin = true
WHERE id = auth.uid();

-- KẾT QUẢ: "UPDATE 1" → Thành công!

-- ============================================
-- BƯỚC 11: VERIFY - XEM LẠI PROFILE
-- ============================================
-- Query ĐÃ FIX lỗi "ambiguous" bằng cách chỉ rõ table name

SELECT
    u.email,
    p.id,
    p.first_name,
    p.last_name,
    p.is_admin,
    p.role as profile_role,  -- Chỉ rõ lấy role từ profiles
    p.cantonese_access,
    p.mandarin_access,
    CASE
        WHEN p.is_admin = true THEN '✅ ADMIN'
        ELSE '👤 USER'
    END as status
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.id = auth.uid();

-- PHẢI THẤY:
-- email: email của bạn
-- is_admin: true
-- profile_role: admin
-- status: ✅ ADMIN

-- ============================================
-- BƯỚC 12: Tạo function get_my_role
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
-- BƯỚC 13: Test function
-- ============================================

SELECT public.get_my_role() as my_role;

-- PHẢI TRẢ VỀ: admin

-- ============================================
-- BƯỚC 14: Fix RLS Policies
-- ============================================

-- Xóa tất cả policies cũ
DROP POLICY IF EXISTS "allow_select_all" ON profiles;
DROP POLICY IF EXISTS "allow_insert_own" ON profiles;
DROP POLICY IF EXISTS "allow_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Tạo policies mới (đơn giản)
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
USING (auth.uid() = id);

-- ============================================
-- BƯỚC 15: VERIFY POLICIES
-- ============================================

SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- PHẢI THẤY 3 policies:
-- allow_select_all  | SELECT
-- allow_insert_own  | INSERT
-- allow_update_own  | UPDATE

-- ============================================
-- XONG! GHI CHÚ
-- ============================================

/*
SAU KHI CHẠY TẤT CẢ BƯỚC TRÊN:

1. Xóa cache browser (Ctrl+Shift+Delete)
2. Chọn "All time" và "Cookies and other site data"
3. Logout khỏi app
4. Đóng tất cả tab
5. Mở Incognito/Private window
6. Vào lại app: http://localhost:8080/cantonese
7. Đăng nhập
8. Mở Console (F12)
9. Phải thấy:
   [ProfileProvider] ✓ Profile found
   [ProfileProvider] ✓ Final state - Profile: true, Admin: true
10. Profile menu hiển thị với tên bạn
11. Dropdown có "Dashboard"
*/
