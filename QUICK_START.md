# ⚡ Quick Start Guide - Hướng Dẫn Nhanh

## 🚀 Setup trong 5 phút

### Bước 1: Enable Google OAuth (Tùy chọn) ⏱️ 2 phút

1. Mở Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project → **Authentication** → **Providers**
3. Tìm **Google** → Toggle **Enable**
4. Click **Save**

❌ **Nếu Google báo lỗi:** Không sao! Bạn có thể dùng Email/Password

---

### Bước 2: Configure Site URLs ⏱️ 1 phút

1. Vẫn trong **Authentication** → **URL Configuration**
2. Copy-paste vào:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs (Add từng dòng):**
```
http://localhost:5173
http://localhost:5173/**
```

3. Click **Save**

---

### Bước 3: Đăng ký Account Đầu Tiên ⏱️ 1 phút

1. Mở http://localhost:5173/login
2. Chọn **Sign Up** (tab phía dưới)
3. Nhập:
   - Email: `your-email@example.com`
   - Password: `yourpassword123` (tối thiểu 6 ký tự)
4. Click **Đăng ký**
5. ✅ Bạn sẽ được redirect về trang chủ!

---

### Bước 4: Set Admin Quyền ⏱️ 1 phút

1. Mở Supabase → **SQL Editor** → **New Query**
2. Copy-paste SQL này:

```sql
-- Thay 'your-email@example.com' bằng email bạn vừa đăng ký
UPDATE profiles
SET is_admin = TRUE
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'your-email@example.com'
);

-- Verify
SELECT u.email, p.is_admin
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'your-email@example.com';
```

3. Thay `your-email@example.com` bằng email của bạn
4. Click **Run** (hoặc Ctrl+Enter)
5. Kiểm tra kết quả: `is_admin` = `true` ✅

---

### Bước 5: Test Admin Access ⏱️ 30 giây

1. Quay lại website (F5 refresh)
2. Header sẽ hiển thị **"Quản trị"** button
3. Click vào → Bạn sẽ thấy Admin Dashboard
4. 🎉 **DONE!** Bạn đã là admin!

---

## 📋 Testing Checklist

- [ ] Login bằng Email/Password ✅
- [ ] Login bằng Google (nếu enabled) ✅
- [ ] Click **"Hồ sơ"** → Xem profile page ✅
- [ ] Click **"Quản trị"** → Xem admin dashboard ✅
- [ ] Vào bài tập HSK → Làm vài flashcards ✅
- [ ] Quay lại **"Hồ sơ"** → Xem progress tracking ✅

---

## 🔥 Ready to Use Features

### ✅ Đã hoàn thành:
- 🎨 **Colorful UI** với 7 gradients đẹp mắt
- 🔤 **Pinyin Toggle** trong Header
- 👤 **User Authentication** (Email/Password + Google)
- 📊 **Progress Tracking** tự động
- 👥 **Admin Panel** quản lý users
- 📈 **Profile Page** xem tiến độ học tập

### 🎯 Các tính năng sẵn sàng:
- Flashcard với colorful gradients
- 9 loại bài tập cho HSK 1-6
- Msutong textbook exercises
- AI Tutor, Handwriting Practice
- Pronunciation practice

---

## ❓ Gặp vấn đề?

### Issue: Google login báo lỗi
**Fix:** Dùng Email/Password authentication

### Issue: Không thấy button "Quản trị"
**Fix:**
1. Check SQL đã chạy thành công chưa
2. Logout và login lại
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: Profile page trống không có data
**Fix:** Làm vài bài tập trước, progress sẽ tự động lưu

---

## 📚 Chi tiết hơn?

Xem các docs khác:
- **SETUP_GUIDE.md** - Hướng dẫn setup chi tiết
- **DATABASE_SETUP.md** - Database schema
- **SET_ADMIN.sql** - SQL scripts đầy đủ
- **SITE_URLS.md** - URLs configuration

---

## 🚀 Production Deployment

Khi deploy production:

1. **Update Site URLs trong Supabase**:
   - Thêm production domain
   - Example: `https://your-domain.com`

2. **Enable Email Confirmation**:
   - Authentication → Providers → Email
   - Enable "Confirm email"

3. **Secure Admin Access**:
   - Chỉ set admin cho trusted users
   - Regular security review

4. **Test thoroughly**:
   - Test trên nhiều browsers
   - Test trên mobile
   - Verify SSL/HTTPS

---

## 💡 Tips

1. **Pinyin Toggle**: Click button ở Header để bật/tắt pinyin
2. **Profile**: Click "Hồ sơ" để xem tiến độ
3. **Admin**: Quản lý users, toggle admin status
4. **Progress**: Tự động lưu khi làm bài tập
5. **Colorful**: Mỗi bài tập có gradient riêng!

---

**🎉 Happy Learning Chinese! 学中文快乐！**
