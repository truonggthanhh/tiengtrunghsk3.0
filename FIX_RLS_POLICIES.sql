-- ============================================
-- FIX RLS POLICIES - Sửa lỗi infinite recursion
-- ============================================

/*
LỖI: "infinite recursion detected in policy for relation profiles"

Nguyên nhân: RLS Policy đang tham chiếu đến chính bảng profiles,
tạo ra vòng lặp vô hạn.

Giải pháp: Tạo lại policies đơn giản, không đệ quy.
*/

-- ============================================
-- BƯỚC 1: XÓA TẤT CẢ POLICIES CŨ
-- ============================================

-- Xem tất cả policies hiện tại
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';

-- Xóa tất cả policies cũ (QUAN TRỌNG!)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;

-- Xóa mọi policy còn lại (nếu có tên khác)
-- Chạy lệnh này để xem policy nào còn:
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
-- Sau đó DROP từng cái bằng tay nếu còn

-- ============================================
-- BƯỚC 2: TẠO POLICIES MỚI (ĐÚNG)
-- ============================================

-- Policy 1: Cho phép users đọc profile của chính họ
-- ĐÚNG: Chỉ dùng auth.uid(), KHÔNG query lại profiles
CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Cho phép users cập nhật profile của chính họ
CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Cho phép tự động tạo profile khi đăng ký
CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================
-- BƯỚC 3: VERIFY POLICIES MỚI
-- ============================================

-- Xem lại tất cả policies
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Kết quả mong đợi:
-- 3 policies: profiles_select_own, profiles_update_own, profiles_insert_own
-- Tất cả đều ĐƠN GIẢN, chỉ dùng auth.uid() = id

-- ============================================
-- BƯỚC 4: TEST TRUY CẬP
-- ============================================

-- Test xem có đọc được profile không
SELECT * FROM profiles WHERE id = auth.uid();

-- Nếu thành công → Policies đã OK ✅
-- Nếu vẫn lỗi → Kiểm tra lại RLS có bật không

-- ============================================
-- BƯỚC 5: ĐẢM BẢO RLS ĐƯỢC BẬT
-- ============================================

-- Bật RLS cho bảng profiles (nếu chưa bật)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify RLS đã bật
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';

-- Kết quả mong đợi: rowsecurity = true

-- ============================================
-- QUAN TRỌNG: TẠI SAO POLICIES CŨ BỊ LỖI?
-- ============================================

/*
❌ SAI: Policy này gây infinite recursion

CREATE POLICY "bad_policy"
ON profiles FOR SELECT
USING (
    auth.uid() = id AND
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    LỖI: Đang query profiles TRONG policy của profiles!
);

Khi Postgres kiểm tra policy này:
1. Query profiles → Phải check policy
2. Check policy → Phải query profiles
3. Query profiles → Phải check policy
4. ... (vòng lặp vô hạn) → ERROR!

✅ ĐÚNG: Policy đơn giản, không query lại chính bảng đó

CREATE POLICY "good_policy"
ON profiles FOR SELECT
USING (auth.uid() = id);

Chỉ dùng auth.uid() so sánh trực tiếp với id,
KHÔNG query thêm bất kỳ điều gì từ profiles!
*/

-- ============================================
-- SAU KHI FIX:
-- ============================================

/*
1. ✅ Chạy tất cả SQL ở trên trong Supabase SQL Editor
2. ✅ Verify 3 policies mới đã được tạo
3. ✅ LOGOUT khỏi website
4. ✅ CLEAR browser cache (hoặc dùng Incognito)
5. ✅ LOGIN lại
6. ✅ Mở Console (F12) → Không còn lỗi 500
7. ✅ Admin panel sẽ hoạt động bình thường

Nếu vẫn cần set admin:
- Chạy DEBUG_ADMIN.sql để set is_admin = true
- Profile đã tồn tại, chỉ cần UPDATE is_admin
*/

-- ============================================
-- BONUS: NẾU CẦN ADMIN CÓ QUYỀN ĐẶC BIỆT
-- ============================================

/*
Nếu muốn admin đọc được ALL profiles (không chỉ của mình):

Tạo thêm 1 policy cho admin:
*/

CREATE POLICY "profiles_select_admin"
ON profiles
FOR SELECT
USING (
    -- Admin có thể đọc tất cả profiles
    EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND is_admin = true
    )
);

/*
⚠️ CHÚ Ý: Policy này CŨNG CÓ THỂ gây infinite recursion!

Vì nó query profiles để check is_admin.

Giải pháp tốt hơn: Dùng custom function
*/

-- Tạo function check admin (không gây recursion)
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

-- Sau đó dùng function trong policy
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;

CREATE POLICY "profiles_select_admin"
ON profiles
FOR SELECT
USING (public.is_admin() = true);

/*
Function này sẽ cache kết quả và không gây recursion!
*/

-- ============================================
-- KẾT LUẬN
-- ============================================

/*
QUAN TRỌNG NHẤT:

1. XÓA TẤT CẢ policies cũ
2. TẠO 3 policies đơn giản:
   - profiles_select_own (đọc của mình)
   - profiles_update_own (sửa của mình)
   - profiles_insert_own (tạo của mình)
3. (Tùy chọn) Thêm profiles_select_admin nếu cần

Policies phải ĐƠN GIẢN, không được query lại
chính bảng mà policy đang bảo vệ!
*/
