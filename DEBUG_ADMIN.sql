-- ============================================
-- DEBUG ADMIN STATUS
-- Kiểm tra trạng thái admin của account
-- ============================================

-- BƯỚC 1: Kiểm tra user có tồn tại không
SELECT
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE email = 'disneychanelmovie@gmail.com';

-- Nếu thấy kết quả → User tồn tại ✅
-- Nếu không có kết quả → Email sai hoặc chưa đăng ký ❌

-- ============================================

-- BƯỚC 2: Kiểm tra profile có tồn tại không
SELECT
    p.*
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'disneychanelmovie@gmail.com';

-- Nếu thấy kết quả → Profile tồn tại ✅
-- Nếu không có kết quả → Profile chưa được tạo ❌ (xem BƯỚC 3)

-- ============================================

-- BƯỚC 3: Nếu profile chưa tồn tại, TẠO profile và set admin
-- (Chỉ chạy nếu BƯỚC 2 không có kết quả)

INSERT INTO profiles (id, is_admin)
SELECT id, TRUE
FROM auth.users
WHERE email = 'disneychanelmovie@gmail.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = TRUE;

-- Sau khi chạy, verify lại với BƯỚC 2

-- ============================================

-- BƯỚC 4: Nếu profile đã tồn tại, chỉ cần UPDATE is_admin
-- (Chỉ chạy nếu BƯỚC 2 có kết quả nhưng is_admin = false)

UPDATE profiles
SET is_admin = TRUE
WHERE id = (
    SELECT id FROM auth.users
    WHERE email = 'disneychanelmovie@gmail.com'
);

-- ============================================

-- BƯỚC 5: Verify kết quả cuối cùng
SELECT
    u.email,
    u.id,
    p.is_admin,
    p.first_name,
    p.last_name,
    u.created_at,
    CASE
        WHEN p.is_admin = TRUE THEN '✅ ADMIN'
        ELSE '❌ NOT ADMIN'
    END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'disneychanelmovie@gmail.com';

-- Kết quả mong đợi:
-- email: disneychanelmovie@gmail.com
-- is_admin: true
-- status: ✅ ADMIN

-- ============================================

-- BƯỚC 6: Kiểm tra RLS Policies cho bảng profiles
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- Cần có policy cho phép user đọc is_admin của chính mình
-- Ví dụ: (auth.uid() = id) cho SELECT

-- ============================================
-- TROUBLESHOOTING CHECKLIST
-- ============================================

/*
✅ Các bước cần làm sau khi chạy SQL:

1. Chạy BƯỚC 1 → Verify user tồn tại
2. Chạy BƯỚC 2 → Check profile tồn tại
3. Nếu BƯỚC 2 không có kết quả → Chạy BƯỚC 3
4. Nếu BƯỚC 2 có kết quả nhưng is_admin=false → Chạy BƯỚC 4
5. Chạy BƯỚC 5 → Verify is_admin = true
6. **LOGOUT khỏi website**
7. **ĐÓNG tất cả tabs**
8. **CLEAR browser cache** (hoặc dùng Incognito mode)
9. **LOGIN lại**
10. Kiểm tra header → Phải thấy nút "Quản trị"

Nếu vẫn không thấy:
- Chạy BƯỚC 6 để check RLS policies
- Mở DevTools Console (F12) → Tab Console
- Refresh trang → Xem có lỗi không
- Copy lỗi và gửi cho tôi

QUAN TRỌNG:
- Phải LOGOUT và LOGIN lại mới có hiệu lực
- Session cũ không tự động update
- Browser cache có thể giữ state cũ
*/
