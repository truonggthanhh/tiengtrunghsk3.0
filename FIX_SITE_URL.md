# 🎯 FIX GOOGLE OAUTH 404 - SITE URL ISSUE

## ✅ ĐÃ TÌM RA VẤN ĐỀ!

Supabase đang redirect về **domain cũ** `cantonesehaohao.vercel.app` thay vì domain mới `tiengtrunghsk3-0.vercel.app`!

---

## 🔥 NGUYÊN NHÂN

```
Site URL trong Supabase = cantonesehaohao.vercel.app (CŨ)
→ Sau khi Google OAuth xong
→ Supabase redirect về domain cũ
→ Domain cũ không match hoặc không tồn tại
→ 404 ERROR!
```

---

## ✅ FIX NGAY (5 PHÚT)

### 🎯 BƯỚC 1: Fix Cantonese Project

```bash
1. Mở: https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Click: Authentication → URL Configuration
3. Tìm field "Site URL"
4. Hiện tại: https://cantonesehaohao.vercel.app ← XÓA!
5. Đổi thành: https://tiengtrunghsk3-0.vercel.app
6. Scroll xuống "Redirect URLs"
7. XÓA tất cả URLs có cantonesehaohao.vercel.app
8. ADD các URLs mới:
   - https://tiengtrunghsk3-0.vercel.app
   - https://tiengtrunghsk3-0.vercel.app/**
   - https://tiengtrunghsk3-0.vercel.app/cantonese/**
   - https://tiengtrunghsk3-0.vercel.app/cantonese/lessons
   - https://tiengtrunghsk3-0.vercel.app/cantonese/update-password
9. Click "SAVE"
```

### 🎯 BƯỚC 2: Verify Mandarin Project (Có thể cũng sai!)

```bash
1. Mở: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Click: Authentication → URL Configuration
3. Check "Site URL":
   - Phải là: https://tiengtrunghsk3-0.vercel.app
   - KHÔNG PHẢI domain khác!
4. Check "Redirect URLs":
   - https://tiengtrunghsk3-0.vercel.app
   - https://tiengtrunghsk3-0.vercel.app/**
   - https://tiengtrunghsk3-0.vercel.app/mandarin/**
   - https://tiengtrunghsk3-0.vercel.app/mandarin/login
5. Nếu sai → Sửa và Save
```

---

## 🧪 TEST SAU KHI FIX

### Test 1: Verify Callback Redirect
```bash
1. Paste vào browser: https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
2. Enter
3. Expected: Redirect về tiengtrunghsk3-0.vercel.app (KHÔNG PHẢI cantonesehaohao!)
4. Error "invalid_request" là OK (vì thiếu OAuth params)
```

### Test 2: Google Login Flow
```bash
1. Clear cache (Ctrl + Shift + Del)
2. Go to: https://tiengtrunghsk3-0.vercel.app/cantonese/login
3. Click "Continue with Google"
4. Chọn tài khoản Google
5. ✅ Phải redirect về: /cantonese/lessons
6. ✅ User logged in thành công!
7. ✅ KHÔNG CÒN 404!
```

### Test 3: Mandarin Google Login
```bash
1. Go to: https://tiengtrunghsk3-0.vercel.app/mandarin/login
2. Click Google login
3. ✅ Phải redirect về: /mandarin
4. ✅ User logged in thành công!
```

---

## 📋 COMPLETE URL CONFIGURATION

### Cantonese Project (jhjpgdldjunkhdbtopbs):

**Site URL:**
```
https://tiengtrunghsk3-0.vercel.app
```

**Redirect URLs:**
```
https://tiengtrunghsk3-0.vercel.app
https://tiengtrunghsk3-0.vercel.app/**
https://tiengtrunghsk3-0.vercel.app/cantonese/**
https://tiengtrunghsk3-0.vercel.app/cantonese/lessons
https://tiengtrunghsk3-0.vercel.app/cantonese/login
https://tiengtrunghsk3-0.vercel.app/cantonese/update-password
http://localhost:8080
http://localhost:8080/**
```

**❌ XÓA tất cả URLs có:**
```
cantonesehaohao.vercel.app
```

---

### Mandarin Project (piwdypvvskuwbyvgyktn):

**Site URL:**
```
https://tiengtrunghsk3-0.vercel.app
```

**Redirect URLs:**
```
https://tiengtrunghsk3-0.vercel.app
https://tiengtrunghsk3-0.vercel.app/**
https://tiengtrunghsk3-0.vercel.app/mandarin/**
https://tiengtrunghsk3-0.vercel.app/mandarin/login
http://localhost:8080
http://localhost:8080/**
```

---

## 🎯 TẠI SAO LỖI NÀY XẢY RA?

Khi bạn deploy app mới (`tiengtrunghsk3-0.vercel.app`) nhưng:
- ✅ Code đã update
- ✅ Vercel đã deploy
- ❌ **Supabase vẫn giữ config cũ** (cantonesehaohao.vercel.app)

→ OAuth flow redirect về domain cũ → 404!

---

## 🔍 CÁCH KIỂM TRA

### Check Site URL trong Supabase:

```bash
Authentication → URL Configuration

Site URL:
┌─────────────────────────────────────────────┐
│ https://cantonesehaohao.vercel.app      ❌  │ ← CŨ, SAI!
└─────────────────────────────────────────────┘

Đổi thành:
┌─────────────────────────────────────────────┐
│ https://tiengtrunghsk3-0.vercel.app      ✅ │ ← MỚI, ĐÚNG!
└─────────────────────────────────────────────┘
```

---

## 💡 BONUS: Nếu có nhiều domains

Nếu bạn muốn support cả domain cũ VÀ mới:

```bash
Redirect URLs (add cả 2):
- https://cantonesehaohao.vercel.app/**
- https://tiengtrunghsk3-0.vercel.app/**

Nhưng Site URL chỉ có 1:
- https://tiengtrunghsk3-0.vercel.app (domain chính)
```

→ OAuth sẽ redirect về Site URL (domain mới)

---

## ⚠️ QUAN TRỌNG

### Site URL vs Redirect URLs

**Site URL:**
- URL chính của app
- Default redirect sau OAuth
- CHỈ CÓ 1 URL

**Redirect URLs:**
- Danh sách URLs cho phép redirect
- Có thể có nhiều URLs (wildcards)
- Dùng để validate redirects

**Trong trường hợp này:**
- Site URL CŨ → Supabase redirect về domain cũ → 404
- Fix: Đổi Site URL về domain mới

---

## 📊 Flow Đúng vs Sai

### ❌ Flow SAI (trước khi fix):
```
User tại: tiengtrunghsk3-0.vercel.app/cantonese/login
  ↓
Click Google login
  ↓
Google OAuth
  ↓
Supabase callback: jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
  ↓
Supabase xử lý → Check Site URL
  ↓
Redirect về: cantonesehaohao.vercel.app ← DOMAIN CŨ!
  ↓
404 ERROR (domain cũ không tồn tại/không match)
```

### ✅ Flow ĐÚNG (sau khi fix):
```
User tại: tiengtrunghsk3-0.vercel.app/cantonese/login
  ↓
Click Google login
  ↓
Google OAuth
  ↓
Supabase callback: jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
  ↓
Supabase xử lý → Check Site URL
  ↓
Redirect về: tiengtrunghsk3-0.vercel.app/cantonese/lessons ✅
  ↓
SUCCESS! User logged in
```

---

## 🧹 CLEANUP (Optional)

Nếu không dùng domain cũ nữa:

### Vercel:
```bash
1. Vercel dashboard → cantonesehaohao project
2. Settings → Domains
3. Remove domain hoặc delete project (nếu không dùng)
```

### Supabase:
```bash
Đã xóa trong Redirect URLs rồi → OK!
```

---

## 📋 CHECKLIST

Fix theo thứ tự:

### Cantonese Project:
```
[ ] Vào: https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
[ ] Authentication → URL Configuration
[ ] Site URL = https://tiengtrunghsk3-0.vercel.app ✅
[ ] XÓA tất cả cantonesehaohao.vercel.app URLs
[ ] ADD tiengtrunghsk3-0.vercel.app/** URLs
[ ] SAVE
```

### Mandarin Project:
```
[ ] Vào: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
[ ] Authentication → URL Configuration
[ ] Site URL = https://tiengtrunghsk3-0.vercel.app ✅
[ ] Redirect URLs đúng (không có domain cũ)
[ ] SAVE
```

### Testing:
```
[ ] Clear browser cache
[ ] Test Cantonese Google login → Success
[ ] Test Mandarin Google login → Success
[ ] Verify redirect về domain mới
[ ] ✅ NO MORE 404!
```

---

## 🎯 TL;DR

**Vấn đề:** Supabase Site URL = domain cũ → redirect về domain cũ → 404

**Fix:**
1. Supabase → Authentication → URL Configuration
2. Site URL đổi từ `cantonesehaohao.vercel.app` → `tiengtrunghsk3-0.vercel.app`
3. Xóa tất cả URLs cũ trong Redirect URLs
4. Add URLs mới với domain mới
5. Save → Test → Success! ✅

**Thời gian:** 5 phút

**Kết quả:** Google OAuth hoạt động mượt mà cho cả 2 apps! 🎉

---

## ✅ Expected Result

Sau khi fix:

```bash
✅ Google login redirect đúng domain
✅ User logged in thành công
✅ Không còn 404 error
✅ Không còn redirect về cantonesehaohao.vercel.app
✅ Flow mượt mà từ đầu đến cuối
```

---

**Hãy fix Site URL ngay và test lại! 99% sẽ hoạt động! 🚀**
