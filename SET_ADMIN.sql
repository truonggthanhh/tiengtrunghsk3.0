-- ============================================
-- SET ADMIN SCRIPT - Cấp quyền admin cho user
-- ============================================

-- CÁCH 1: Set admin cho user đầu tiên đăng ký
-- Copy và chạy SQL này trong Supabase SQL Editor

UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
);

-- Verify kết quả
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.is_admin,
  u.email,
  u.created_at
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = TRUE;


-- ============================================
-- CÁCH 2: Set admin cho user theo email cụ thể
-- ============================================

-- Thay 'your-email@example.com' bằng email của bạn
UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'your-email@example.com'
);

-- Verify kết quả
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.is_admin,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'your-email@example.com';


-- ============================================
-- CÁCH 3: Set admin cho nhiều users cùng lúc
-- ============================================

-- Thay các email bên dưới bằng emails thực tế
UPDATE profiles
SET is_admin = TRUE
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN (
    'admin1@example.com',
    'admin2@example.com',
    'admin3@example.com'
  )
);

-- Verify kết quả
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.is_admin,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = TRUE;


-- ============================================
-- CÁCH 4: Set admin cho user theo ID
-- ============================================

-- Nếu bạn biết user ID
UPDATE profiles
SET is_admin = TRUE
WHERE id = 'user-uuid-here';

-- Verify kết quả
SELECT * FROM profiles WHERE id = 'user-uuid-here';


-- ============================================
-- BONUS: View tất cả users và admin status
-- ============================================

SELECT
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  u.created_at as registered_at,
  CASE
    WHEN p.is_admin = TRUE THEN '👑 Admin'
    ELSE '👤 User'
  END as role
FROM profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at ASC;


-- ============================================
-- REMOVE ADMIN: Gỡ quyền admin
-- ============================================

-- Gỡ admin theo email
UPDATE profiles
SET is_admin = FALSE
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'user-email@example.com'
);


-- ============================================
-- HƯỚNG DẪN SỬ DỤNG
-- ============================================

/*
BƯỚC 1: Đăng ký/Đăng nhập account đầu tiên
- Vào http://localhost:5173/login
- Đăng ký bằng email/password hoặc Google
- Ghi nhớ email của bạn

BƯỚC 2: Mở Supabase Dashboard
- Vào https://supabase.com/dashboard
- Chọn project của bạn
- Click "SQL Editor" trong menu trái

BƯỚC 3: Chọn SQL phù hợp
- CÁCH 1: Nếu bạn là user đầu tiên → Dùng CÁCH 1
- CÁCH 2: Nếu biết email → Dùng CÁCH 2 (KHUYẾN NGHỊ)
- CÁCH 3: Nếu muốn set admin cho nhiều users → Dùng CÁCH 3

BƯỚC 4: Copy và paste SQL
- Copy SQL block từ cách bạn chọn
- Paste vào SQL Editor
- Thay email placeholder bằng email thực (nếu dùng CÁCH 2 hoặc 3)
- Click "Run" hoặc press Ctrl+Enter

BƯỚC 5: Verify kết quả
- SQL sẽ tự động chạy SELECT để verify
- Kiểm tra cột "is_admin" = TRUE
- Bạn sẽ thấy role = "👑 Admin"

BƯỚC 6: Test trên website
- Logout và login lại (hoặc F5 refresh page)
- Header sẽ hiển thị button "Quản trị"
- Click vào để truy cập /admin
- Bạn sẽ thấy danh sách tất cả users

✅ DONE! Bạn đã là admin!
*/


-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Q: Tại sao không thấy button "Quản trị"?
-- A: Chạy queries này để debug:

-- 1. Check user có tồn tại không
SELECT * FROM auth.users WHERE email = 'your-email@example.com';

-- 2. Check profile có tồn tại không
SELECT * FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);

-- 3. Check is_admin status
SELECT
  u.email,
  p.is_admin
FROM auth.users u
JOIN profiles p ON u.id = p.id
WHERE u.email = 'your-email@example.com';

-- Nếu profile không tồn tại, tạo manually:
INSERT INTO profiles (id, is_admin)
SELECT id, TRUE FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;


-- ============================================
-- IMPORTANT NOTES
-- ============================================

/*
⚠️ CHÚ Ý:
1. Chỉ cấp admin cho người tin cậy
2. Admin có thể xem và quản lý tất cả users
3. Không thể tự gỡ admin của chính mình trong UI
4. Nên có ít nhất 2 admin accounts (backup)
5. Review admin access thường xuyên

🔒 Bảo mật:
- Không share admin credentials
- Dùng strong passwords
- Enable 2FA nếu có thể
- Log admin actions

📝 Best Practices:
- Set admin ngay sau khi deploy
- Document các admin accounts
- Have backup admin
- Regular security audits
*/
