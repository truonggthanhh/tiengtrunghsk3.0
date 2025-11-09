-- ============================================
-- FORCE FIX: Xóa TẤT CẢ policies và tạo lại từ đầu
-- ============================================

-- ============================================
-- BƯỚC 1: XEM TẤT CẢ POLICIES HIỆN TẠI
-- ============================================

SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual::text as using_expression,
    with_check::text as with_check_expression
FROM pg_policies
WHERE tablename IN ('profiles', 'user_exercise_stats')
ORDER BY tablename, policyname;

-- QUAN TRỌNG: Sao chép kết quả này và kiểm tra xem có policies nào không!

-- ============================================
-- BƯỚC 2: XÓA TOÀN BỘ POLICIES (TỰ ĐỘNG)
-- ============================================

-- Script này sẽ TỰ ĐỘNG xóa tất cả policies của bảng profiles
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Xóa tất cả policies của bảng profiles
    FOR policy_record IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_record.policyname);
        RAISE NOTICE 'Đã xóa policy: %', policy_record.policyname;
    END LOOP;

    -- Xóa tất cả policies của bảng user_exercise_stats (nếu có)
    FOR policy_record IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'user_exercise_stats'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_exercise_stats', policy_record.policyname);
        RAISE NOTICE 'Đã xóa policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Verify: Kiểm tra lại xem còn policy nào không
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
-- Kết quả phải RỖNG (0 rows)

-- ============================================
-- BƯỚC 3: TẠO POLICIES MỚI CHO PROFILES
-- ============================================

-- Policy 1: Đọc profile của chính mình
CREATE POLICY "profiles_select_own"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Cập nhật profile của chính mình
CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Insert profile khi đăng ký
CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ============================================
-- BƯỚC 4: TẠO POLICIES MỚI CHO USER_EXERCISE_STATS
-- ============================================

-- Policy 1: Đọc stats của chính mình
CREATE POLICY "user_exercise_stats_select_own"
ON user_exercise_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Insert stats của chính mình
CREATE POLICY "user_exercise_stats_insert_own"
ON user_exercise_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Update stats của chính mình
CREATE POLICY "user_exercise_stats_update_own"
ON user_exercise_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Delete stats của chính mình
CREATE POLICY "user_exercise_stats_delete_own"
ON user_exercise_stats
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- BƯỚC 5: VERIFY TẤT CẢ POLICIES MỚI
-- ============================================

-- Xem lại tất cả policies
SELECT
    tablename,
    policyname,
    cmd,
    roles,
    CASE
        WHEN qual::text LIKE '%auth.uid()%' THEN '✅ OK - Dùng auth.uid()'
        WHEN qual::text LIKE '%SELECT%profiles%' THEN '❌ DANGER - Query profiles'
        ELSE '⚠️ Cần kiểm tra'
    END as safety_check
FROM pg_policies
WHERE tablename IN ('profiles', 'user_exercise_stats')
ORDER BY tablename, policyname;

-- Kết quả mong đợi:
-- - profiles có 3 policies
-- - user_exercise_stats có 4 policies
-- - Tất cả đều "✅ OK - Dùng auth.uid()"

-- ============================================
-- BƯỚC 6: TEST TRUY CẬP
-- ============================================

-- Test đọc profile
SELECT id, is_admin FROM profiles WHERE id = auth.uid();

-- Nếu không lỗi → Policies đã OK! ✅

-- ============================================
-- BƯỚC 7: SET ADMIN CHO EMAIL CỦA BẠN
-- ============================================

-- Tạo/update profile với is_admin = true
INSERT INTO profiles (id, is_admin, first_name, last_name)
SELECT
    id,
    TRUE as is_admin,
    COALESCE(raw_user_meta_data->>'first_name', 'Admin') as first_name,
    COALESCE(raw_user_meta_data->>'last_name', 'User') as last_name
FROM auth.users
WHERE email = 'disneychanelmovie@gmail.com'
ON CONFLICT (id)
DO UPDATE SET
    is_admin = TRUE,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);

-- ============================================
-- BƯỚC 8: VERIFY ADMIN STATUS
-- ============================================

SELECT
    u.email,
    u.id,
    p.is_admin,
    p.first_name,
    p.last_name,
    CASE
        WHEN p.is_admin = TRUE THEN '✅ BẠN LÀ ADMIN'
        ELSE '❌ CHƯA PHẢI ADMIN'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'disneychanelmovie@gmail.com';

-- Kết quả phải hiển thị: status = '✅ BẠN LÀ ADMIN'

-- ============================================
-- HƯỚNG DẪN THỰC HIỆN
-- ============================================

/*
📋 CHECKLIST - Làm ĐÚNG THỨ TỰ:

1. ✅ Mở Supabase Dashboard → SQL Editor
2. ✅ Copy toàn bộ file này
3. ✅ Paste vào SQL Editor
4. ✅ Chọn tất cả (Ctrl+A)
5. ✅ Nhấn RUN (hoặc Ctrl+Enter)
6. ✅ Đợi script chạy xong (khoảng 5-10 giây)
7. ✅ Kiểm tra kết quả cuối cùng:
   - BƯỚC 5 phải thấy policies mới với "✅ OK"
   - BƯỚC 8 phải thấy "✅ BẠN LÀ ADMIN"

SAU KHI CHẠY SQL:

8. ✅ LOGOUT khỏi website
9. ✅ Đóng TẤT CẢ tabs của website
10. ✅ Mở INCOGNITO/PRIVATE MODE
11. ✅ Vào lại website và LOGIN
12. ✅ Mở F12 Console
13. ✅ KHÔNG CÒN LỖI 500!
14. ✅ Thấy nút "Quản trị" trong header!

NẾU VẪN LỖI:
- Chụp màn hình kết quả của BƯỚC 5
- Chụp màn hình kết quả của BƯỚC 8
- Gửi cho tôi để debug tiếp
*/

-- ============================================
-- TẠI SAO SCRIPT NÀY SẼ HOẠT ĐỘNG?
-- ============================================

/*
Script này khác với script trước ở chỗ:

1. ✅ Dùng DO block để XÓA TỰ ĐỘNG tất cả policies
   → Không cần phải DROP thủ công từng cái

2. ✅ Xóa cả policies của user_exercise_stats
   → Bảng này cũng có thể gây infinite recursion

3. ✅ Chỉ định TO authenticated trong mọi policy
   → Rõ ràng hơn, tránh nhầm lẫn

4. ✅ Thêm safety check để verify
   → Đảm bảo không có policy nào query lại profiles

5. ✅ Insert profile với metadata từ auth.users
   → Tự động lấy first_name, last_name nếu có

Policies mới ĐƠN GIẢN, chỉ dùng:
- auth.uid() = id (cho profiles)
- auth.uid() = user_id (cho user_exercise_stats)

KHÔNG BAO GIỜ query lại chính bảng đó!
*/
