# 🐛 TROUBLESHOOTING: COURSE ACCESS MANAGEMENT

## Vấn đề 1: Tab "Khóa học" không load users (stuck "Đang tải" hoặc biến mất)

### Triệu chứng:
- Click vào tab "Khóa học" → Hiện "Đang tải..." một lúc
- Sau đó chữ "Đang tải" biến mất nhưng không hiện danh sách users

### Nguyên nhân:
RPC function `get_all_users_with_emails()` chưa được tạo trong Supabase

### Cách fix:

**Bước 1: Mở Supabase SQL Editor**

Mandarin project:
https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn → SQL Editor

Cantonese project:
https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs → SQL Editor

**Bước 2: Chạy SQL function:**

```sql
CREATE OR REPLACE FUNCTION get_all_users_with_emails()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    au.email,
    p.role
  FROM profiles p
  INNER JOIN auth.users au ON au.id = p.id
  ORDER BY au.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Bước 3: Click "Run" hoặc Ctrl+Enter**

**Bước 4: Verify function đã được tạo:**

```sql
-- Test function
SELECT * FROM get_all_users_with_emails();
```

Nếu thành công, bạn sẽ thấy danh sách users với email.

**Bước 5: Refresh trang admin**

- Quay lại admin dashboard
- Hard refresh: Ctrl+Shift+R
- Click tab "Khóa học" lại

---

## Vấn đề 2: Cantonese header không có nút "Quản trị"

### Triệu chứng:
- Login as admin vào trang Cantonese
- Header không có button "Quản trị" (chỉ có UserMenu dropdown)

### Các nguyên nhân có thể:

#### Nguyên nhân 1: User không phải admin

**Kiểm tra:**

```sql
-- Mở Cantonese Supabase SQL Editor
SELECT id, email, role, is_admin
FROM profiles
WHERE email = 'your-email@example.com';
```

**Kỳ vọng:**
- `role` = `'admin'` HOẶC
- `is_admin` = `true`

**Fix:**

```sql
-- Option 1: Set role
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Option 2: Set is_admin (nếu table có cột này)
UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

#### Nguyên nhân 2: Cache cũ

**Fix:**
1. Hard refresh: Ctrl+Shift+R
2. Clear browser cache
3. Logout → Login lại

#### Nguyên nhân 3: Code chưa deploy

**Kiểm tra:**
1. Mở Vercel dashboard
2. Check deployment status
3. Đợi deployment hoàn thành (~ 2-3 phút)

#### Nguyên nhân 4: RPC function `get_my_role()` missing

ProfileProvider dùng RPC để verify admin status. Nếu missing, fallback về `profile.role`.

**Check:**

```sql
-- Test RPC
SELECT get_my_role();
```

**Fix nếu function không tồn tại:**

```sql
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Vấn đề 3: Error message "Error fetching users"

### Triệu chứng:
Tab "Khóa học" hiện error box màu đỏ với message lỗi.

### Debug steps:

**1. Check Console (F12):**

```
Console → Xem error message chi tiết
```

**2. Common errors:**

#### Error: "function get_all_users_with_emails() does not exist"

**Fix:** Chạy SQL function (xem Vấn đề 1 ở trên)

#### Error: "permission denied for table auth.users"

**Fix:** Function cần `SECURITY DEFINER`:

```sql
-- Recreate function với SECURITY DEFINER
CREATE OR REPLACE FUNCTION get_all_users_with_emails()
RETURNS TABLE (...) AS $$
...
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- ← Quan trọng!
```

#### Error: "column profiles.role does not exist"

Database schema khác. Fix:

**Option 1: Add role column:**

```sql
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
```

**Option 2: Use is_admin instead:**

Sửa function:

```sql
CREATE OR REPLACE FUNCTION get_all_users_with_emails()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    au.email,
    CASE
      WHEN p.is_admin = true THEN 'admin'::TEXT
      ELSE 'user'::TEXT
    END as role
  FROM profiles p
  INNER JOIN auth.users au ON au.id = p.id
  ORDER BY au.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Vấn đề 4: Nút "Quản trị" xuất hiện rồi biến mất

### Triệu chứng:
- Nút "Quản trị" hiện lúc đầu
- Sau vài giây biến mất

### Nguyên nhân:
ProfileProvider đang loading → `isAdmin` = `false` tạm thời → sau đó load xong nhưng role không phải admin

### Debug:

**Mở Console (F12) → Filter logs:**

```
[ProfileProvider]
```

**Xem logs:**

```
[ProfileProvider] Starting - Session: ✓ User: your@email.com
[ProfileProvider] ✓ Profile found: { name: "...", is_admin: false, role: "user", computed: "user" }
[ProfileProvider] Admin status from profile: { is_admin: false, role: "user", result: false }
[ProfileProvider] ✓ Final state - Profile: true Admin: false
```

**Nếu `Admin: false` → Check database** (xem Vấn đề 2, Nguyên nhân 1)

---

## Vấn đề 5: Tab "Khóa học" không xuất hiện trong Dashboard

### Cantonese Dashboard:

**Kiểm tra:**
1. Login as admin
2. Vào: `/cantonese/dashboard`
3. Xem sidebar bên trái
4. Có 4 buttons:
   - Quản lý Bài học
   - Quản lý Bài hát
   - Quản lý Người dùng (chỉ admin)
   - 🔐 Khóa học (chỉ admin)

**Nếu không thấy "Khóa học":**
- Verify bạn đang login as admin
- Check Console logs `[ProfileProvider]`
- Verify `isAdmin = true`

### Mandarin Dashboard:

**Kiểm tra:**
1. Login as admin
2. Vào: `/mandarin/admin`
3. Xem tabs ở trên
4. Có 6 tabs:
   - Người dùng
   - 🔐 Khóa học
   - API Key
   - AI Generator
   - Từ vựng
   - Tài liệu

**Nếu không thấy tab:**
- Hard refresh (Ctrl+Shift+R)
- Check deployment status

---

## Quick Checklist

Trước khi báo lỗi, check:

- [ ] Đã chạy SQL function `get_all_users_with_emails()` trong cả 2 Supabase projects
- [ ] Đã set admin role trong database (`role = 'admin'` hoặc `is_admin = true`)
- [ ] Đã hard refresh browser (Ctrl+Shift+R)
- [ ] Đã check Console (F12) xem có error không
- [ ] Vercel deployment đã hoàn thành
- [ ] Đã logout và login lại

---

## Still Not Working?

Nếu sau khi thử tất cả các bước trên vẫn không được:

1. **Copy error message từ Console**
2. **Take screenshot của:**
   - Admin dashboard (tab/button bị thiếu)
   - Console errors
   - SQL query result (SELECT * FROM profiles WHERE ...)
3. **Provide info:**
   - Browser & version
   - Đã làm bước nào rồi
   - Error xuất hiện khi nào

---

## Files liên quan:

- `COURSE_ACCESS_CONTROL_SCHEMA.sql` - SQL schema & functions
- `COURSE_ACCESS_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `src/components/admin/CourseAccessManagement.tsx` - Mandarin admin UI
- `src/cantonese/components/admin/CourseAccessManagement.tsx` - Cantonese admin UI
- `src/cantonese/components/layouts/PageWrapper.tsx` - Cantonese header
- `src/cantonese/components/providers/ProfileProvider.tsx` - Admin role detection

---

**Last updated:** 2025-01-11
**Version:** 2.0
