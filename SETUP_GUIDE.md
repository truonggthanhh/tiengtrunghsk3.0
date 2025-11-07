# Setup Guide - Hướng Dẫn Cài Đặt Hoàn Chỉnh

## 1. Enable Google OAuth Provider

### Bước 1: Mở Supabase Dashboard
1. Truy cập https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Authentication** → **Providers** (menu bên trái)

### Bước 2: Enable Google Provider
1. Tìm **Google** trong danh sách providers
2. Toggle switch để **Enable** Google provider
3. Có 2 lựa chọn:

#### Option A: Sử dụng Google OAuth mặc định của Supabase (Đơn giản nhất)
- Không cần Google Client ID/Secret
- Chỉ cần enable và save
- **KHUYẾN NGHỊ cho development**

#### Option B: Sử dụng Google OAuth tùy chỉnh
Nếu muốn customize, làm theo:
1. Tạo Google OAuth credentials tại: https://console.cloud.google.com/apis/credentials
2. Authorized redirect URIs: `https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback`
3. Copy Client ID và Client Secret vào Supabase
4. Save settings

### Bước 3: Cấu hình Site URL
1. Vẫn trong **Authentication** → **URL Configuration**
2. Thêm các URLs sau:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs (thêm từng dòng):**
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/**
https://your-production-domain.com
https://your-production-domain.com/
https://your-production-domain.com/**
```

3. Click **Save**

---

## 2. Setup Email/Password Authentication (Backup)

Nếu Google OAuth không work ngay, bạn có thể dùng Email/Password:

### Enable Email Provider:
1. Vào **Authentication** → **Providers**
2. Tìm **Email** provider
3. Đảm bảo nó đang **Enabled**
4. **Disable** "Confirm email" để test nhanh hơn (có thể enable lại sau)

Khi đó bạn có thể:
- Đăng ký bằng email/password trực tiếp
- Supabase sẽ gửi confirmation email (nếu enable)

---

## 3. Set Admin Quyền Cho User

### Cách 1: Sử dụng SQL Editor (KHUYẾN NGHỊ)

1. **Đăng ký/đăng nhập user đầu tiên**
   - Vào `/login` và đăng ký account
   - Ghi nhớ email của bạn

2. **Mở SQL Editor trong Supabase**
   - Dashboard → **SQL Editor** → **New Query**

3. **Chạy SQL để set admin**:
```sql
-- Thay 'your-email@example.com' bằng email của bạn
UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'your-email@example.com'
);
```

4. **Verify admin status**:
```sql
-- Check xem đã set admin chưa
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.is_admin,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = TRUE;
```

### Cách 2: Sử dụng Supabase Table Editor

1. Vào **Table Editor** → chọn table `profiles`
2. Tìm row có `id` của user bạn (có thể xem trong auth.users)
3. Click vào cell `is_admin`, chọn `true`
4. Save

### Cách 3: Tự động set admin cho user đầu tiên

Chạy SQL này để tự động set admin cho user đầu tiên:
```sql
-- Set admin cho user đầu tiên đăng ký
UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
);
```

---

## 4. Tạo Profile Trigger (Auto-create profile khi user đăng ký)

**QUAN TRỌNG**: Để profile được tạo tự động khi user đăng ký:

```sql
-- Tạo function để auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, is_admin)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 5. Kiểm Tra Auth Policies

Đảm bảo policies cho profiles table đúng:

```sql
-- Drop existing policies nếu có lỗi
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Tạo lại policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Policy cho INSERT (khi user đăng ký)
CREATE POLICY "Enable insert for authentication"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

## 6. Testing Flow

### Test Authentication:
1. Mở http://localhost:5173/login
2. Thử đăng nhập bằng Google (nếu đã enable)
3. Hoặc đăng ký bằng email/password
4. Sau khi đăng nhập, kiểm tra:
   - Header có hiển thị "Hồ sơ" và "Đăng xuất"
   - Click "Hồ sơ" để vào `/profile`

### Test Admin Access:
1. Đảm bảo đã set `is_admin = TRUE` cho user của bạn
2. Refresh trang (F5) hoặc logout/login lại
3. Header sẽ hiển thị thêm button "Quản trị"
4. Click vào để truy cập `/admin`
5. Tại Admin Panel, bạn sẽ thấy danh sách tất cả users
6. Toggle admin status cho users khác

### Test Progress Tracking:
1. Vào một bài tập (ví dụ: HSK 1 → Flashcard)
2. Làm vài từ
3. Vào `/profile` để xem progress
4. Kiểm tra stats có hiển thị đúng không

---

## 7. Common Issues & Solutions

### Issue 1: "provider is not enabled"
**Solution**: Enable Google provider trong Authentication → Providers

### Issue 2: "Invalid redirect URL"
**Solution**: Thêm redirect URLs trong Authentication → URL Configuration

### Issue 3: Profile không tự động tạo
**Solution**: Chạy SQL trigger ở phần 4

### Issue 4: Không thấy button "Quản trị"
**Solution**:
- Kiểm tra `is_admin = TRUE` trong profiles table
- Logout và login lại
- Clear browser cache

### Issue 5: "Row Level Security" error
**Solution**: Kiểm tra và tạo lại policies ở phần 5

---

## 8. Production Deployment

Khi deploy production:

1. **Update Site URLs**:
   - Thêm production domain vào Redirect URLs
   - Ví dụ: `https://tiengtrunghsk.com`, `https://tiengtrunghsk.com/**`

2. **Enable Email Confirmation**:
   - Vào Authentication → Providers → Email
   - Enable "Confirm email"

3. **Secure Admin**:
   - Đảm bảo chỉ set admin cho trusted users
   - Review admin access logs thường xuyên

4. **Backup Database**:
   - Setup automatic backups trong Supabase
   - Export data định kỳ

---

## Support

Nếu vẫn gặp issues:
1. Check Supabase logs: Dashboard → Logs → Auth logs
2. Check browser console: F12 → Console tab
3. Verify database tables exist: Table Editor
4. Check RLS policies: Authentication → Policies
