# Site URLs Configuration

## Overview
Tài liệu này liệt kê tất cả URLs cần configure trong Supabase để authentication hoạt động đúng.

---

## Development URLs

### Localhost Configuration
Thêm các URLs sau vào **Supabase Dashboard** → **Authentication** → **URL Configuration**:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/**
http://localhost:5173/login
http://localhost:5173/profile
http://localhost:5173/admin
```

---

## Production URLs

### Main Domain
Thay thế `your-domain.com` bằng domain thực tế của bạn:

**Site URL:**
```
https://your-domain.com
```

**Redirect URLs:**
```
https://your-domain.com
https://your-domain.com/
https://your-domain.com/**
https://your-domain.com/login
https://your-domain.com/profile
https://your-domain.com/admin
```

### Subdomain (Nếu có)
Nếu deploy lên subdomain (ví dụ: `app.your-domain.com`):

```
https://app.your-domain.com
https://app.your-domain.com/
https://app.your-domain.com/**
https://app.your-domain.com/login
https://app.your-domain.com/profile
https://app.your-domain.com/admin
```

---

## All Application Routes

### Public Routes (Không cần authentication):
- `/` - Trang chủ
- `/login` - Đăng nhập / Đăng ký
- `/msutong` - Trang Msutong

### Protected Routes (Cần authentication):
- `/profile` - Hồ sơ người dùng
- `/admin` - Admin dashboard (chỉ admin)

### Exercise Routes (Public hoặc Protected tùy config):

#### HSK Routes:
- `/hsk/:level/flashcard` - Flashcard (level: 1-6)
- `/hsk/:level/pinyin-choice` - Chọn Pinyin
- `/hsk/:level/meaning-choice` - Chọn Nghĩa
- `/hsk/:level/fill-in-the-blank` - Điền Từ
- `/hsk/:level/sentence-choice` - Điền Từ Vào Câu
- `/hsk/:level/sentence-scramble` - Sắp Xếp Câu
- `/hsk/:level/pronunciation` - Luyện Phát Âm
- `/hsk/:level/handwriting-practice` - Luyện Viết
- `/hsk/:level/ai-tutor` - AI Tutor

**Ví dụ:**
```
/hsk/1/flashcard
/hsk/2/pinyin-choice
/hsk/3/meaning-choice
```

#### Msutong Routes:
- `/msutong/msutong-flashcard`
- `/msutong/msutong-pinyin-choice`
- `/msutong/msutong-meaning-choice`
- `/msutong/msutong-fill-in-the-blank`
- `/msutong/msutong-pronunciation`
- `/msutong/msutong-sentence-choice`
- `/msutong/msutong-sentence-scramble`
- `/msutong/msutong-reading-comprehension`
- `/msutong/msutong-handwriting-practice`
- `/msutong/msutong-ai-tutor`

---

## Supabase Configuration Steps

### Bước 1: Mở Authentication Settings
1. Vào Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Click **Authentication** trong menu bên trái
4. Click **URL Configuration**

### Bước 2: Configure Site URL
1. Trong field **Site URL**, nhập:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`

### Bước 3: Add Redirect URLs
1. Scroll xuống **Redirect URLs**
2. Click **Add URL**
3. Paste từng URL một (từng dòng)
4. Click **Save** sau khi thêm hết

### Bước 4: Verify Configuration
1. Test login flow trên development
2. Test redirect về trang chủ sau login
3. Test access vào protected routes

---

## Common Deployment Platforms

### Vercel
```
https://your-app.vercel.app
https://your-app.vercel.app/**
```

### Netlify
```
https://your-app.netlify.app
https://your-app.netlify.app/**
```

### Custom Domain với Vercel/Netlify
```
https://your-domain.com
https://your-domain.com/**
```

### GitHub Pages
```
https://username.github.io/repo-name
https://username.github.io/repo-name/**
```

---

## Wildcard Pattern Explanation

`**` là wildcard pattern có nghĩa là "tất cả các paths sau domain".

Ví dụ:
- `https://example.com/**` match:
  - `https://example.com/`
  - `https://example.com/login`
  - `https://example.com/profile`
  - `https://example.com/hsk/1/flashcard`
  - v.v.

---

## Security Best Practices

### 1. HTTPS Only in Production
- Chỉ dùng `https://` URLs trong production
- `http://` chỉ dùng cho localhost development

### 2. Specific Domain
- Không add wildcard domains như `*.com`
- Chỉ add domains bạn control

### 3. Regular Review
- Review redirect URLs thường xuyên
- Remove unused URLs
- Update khi change domain

### 4. Environment Variables
Nếu dùng environment variables:

```bash
# .env.local (Development)
VITE_SITE_URL=http://localhost:5173

# .env.production (Production)
VITE_SITE_URL=https://your-domain.com
```

---

## Testing Authentication Flow

### Test Checklist:

#### ✅ Local Development:
- [ ] Login với Email/Password
- [ ] Login với Google (nếu enabled)
- [ ] Redirect về `/` sau login
- [ ] Access `/profile` khi đã login
- [ ] Access `/admin` khi là admin
- [ ] Logout thành công

#### ✅ Production:
- [ ] Repeat all tests ở trên
- [ ] Test trên nhiều browsers
- [ ] Test trên mobile
- [ ] Verify SSL/HTTPS
- [ ] Check redirect URLs

---

## Troubleshooting

### Issue: "Invalid redirect URL"
**Giải pháp:**
1. Kiểm tra URL đã add vào Supabase chưa
2. Đảm bảo format đúng (có/không có trailing slash)
3. Add cả `/**` wildcard version
4. Clear browser cache và test lại

### Issue: Redirect về wrong URL
**Giải pháp:**
1. Check `redirectTo` parameter trong Auth component
2. Verify Site URL trong Supabase settings
3. Check environment variables

### Issue: Works on localhost but not production
**Giải pháp:**
1. Add production URLs vào Supabase
2. Update environment variables
3. Redeploy application
4. Clear CDN cache (nếu có)

---

## Quick Setup Commands

### Để test nhanh, add tất cả URLs này vào Supabase Redirect URLs:

**Development + Production Combined:**
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/**
https://your-domain.com
https://your-domain.com/
https://your-domain.com/**
```

Thay `your-domain.com` bằng domain thực tế trước khi add!
