# 🎯 GOOGLE OAUTH - JAVASCRIPT ORIGINS vs REDIRECT URIs

## ⚡ Quick Answer

**Authorized JavaScript origins** KHÔNG ảnh hưởng đến OAuth callback 404!

Nhưng để chắc chắn, hãy làm theo checklist cuối cùng này.

---

## 📚 Giải Thích

### "Authorized JavaScript origins" là gì?

**Dùng cho:** Client-side authentication (JavaScript SDK, gRPC-web)
- Khi bạn dùng Google Sign-In button trực tiếp từ JavaScript
- Khi dùng `gapi.auth2` hoặc Google Identity Services

**Ví dụ flow:**
```
User clicks button
→ JavaScript SDK xử lý
→ Popup Google login
→ Token trả về trực tiếp cho browser
```

### "Authorized redirect URIs" là gì?

**Dùng cho:** Server-side OAuth flow (Supabase Auth)
- Khi OAuth flow đi qua server (Supabase)
- Supabase nhận code từ Google
- Supabase exchange code → access token

**Ví dụ flow:**
```
User clicks button
→ Redirect to Google
→ Google redirects to Supabase callback
→ Supabase xử lý
→ Redirect về app
```

### App của bạn đang dùng gì?

**Bạn đang dùng Supabase Auth = Server-side flow**

```tsx
<Auth
  supabaseClient={supabase}
  providers={['google']}
  ...
/>
```

→ **Chỉ cần "Authorized redirect URIs" là đủ!**

→ JavaScript origins KHÔNG ảnh hưởng đến lỗi 404 callback!

---

## ✅ NHƯNG... Hãy thử add thêm để chắc chắn!

Có thể Google có internal check nào đó, nên thử add:

```bash
1. Google Cloud Console → Credentials
2. Click vào OAuth 2.0 Client ID
3. "Authorized JavaScript origins"
4. Click "+ ADD URI"
5. Add: https://tiengtrunghsk3-0.vercel.app
6. (Đã có rồi → OK!)
7. Click "SAVE"
```

**Đã đúng rồi!** ✅

---

## 🔍 VẬY LỖI THỰC SỰ LÀ GÌ?

Nếu JavaScript origins đã đúng mà vẫn 404, thì vấn đề nằm ở:

### Issue 1: Redirect URIs chưa propagate

Google Cloud cần **5-10 phút** (không phải 2-3 phút!) để propagate changes.

**Giải pháp:**
```bash
1. Đợi thêm 10 phút sau khi Save
2. Clear browser cache (Ctrl + Shift + Del)
3. Thử incognito mode
4. Thử browser khác
```

---

### Issue 2: Redirect URIs vẫn sai (Check lại!)

**Hãy copy CHÍNH XÁC từ Supabase:**

#### Bước 1: Lấy từ Supabase Mandarin
```bash
1. https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Authentication → Providers → Google
3. Tìm text: "Callback URL (for OAuth)"
4. Click icon COPY (đừng gõ tay!)
5. Paste vào notepad

→ Should be: https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
```

#### Bước 2: Lấy từ Supabase Cantonese
```bash
1. https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Authentication → Providers → Google
3. Click icon COPY callback URL
4. Paste vào notepad

→ Should be: https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
```

#### Bước 3: Add vào Google (từ notepad)
```bash
1. Google Cloud Console → OAuth Client
2. "Authorized redirect URIs"
3. Paste URL 1 từ notepad (không gõ tay!)
4. "+ ADD URI"
5. Paste URL 2 từ notepad
6. SAVE
7. Đợi 10 phút
```

---

### Issue 3: Client ID/Secret không đúng

**Verify lại:**

```bash
1. Google Cloud Console → OAuth Client
2. Copy Client ID (click icon copy)
3. Copy Client secret (click "show" → copy)

4. Supabase Mandarin → Google Provider
   → Paste Client ID (xóa cũ, paste mới)
   → Paste Client Secret
   → SAVE

5. Supabase Cantonese → Google Provider
   → Paste CÙNG Client ID
   → Paste CÙNG Client Secret
   → SAVE
```

**⚠️ QUAN TRỌNG:**
- Dùng CÙNG Client ID/Secret cho cả 2 Supabase projects
- Vì đang dùng cùng 1 OAuth Client trong Google

---

### Issue 4: OAuth Consent Screen

Check status:

```bash
Google Cloud Console → OAuth consent screen

1. Publishing status:
   ✅ "In production" → OK
   ⚠️ "Testing" → Phải add test users!

2. Nếu "Testing":
   → Scroll xuống "Test users"
   → Click "+ ADD USERS"
   → Add email bạn dùng để login
   → SAVE
   → Đợi 5 phút
```

---

## 🧪 TEST CUỐI CÙNG

Làm theo thứ tự:

### Test 1: Verify Supabase Callback Live
```bash
1. Copy: https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
2. Paste vào browser
3. Enter

Expected:
✅ "invalid_request" hoặc Supabase error page
❌ 404 → Supabase URL sai hoặc project có vấn đề
```

### Test 2: Clear Everything
```bash
1. Clear browser cache (Ctrl + Shift + Del)
   - Cookies
   - Cached images
   - Site data
2. Close ALL tabs
3. Close browser
4. Đợi 30 giây
5. Open browser lại
6. Thử incognito mode
```

### Test 3: Test Flow
```bash
1. Go to: https://tiengtrunghsk3-0.vercel.app/mandarin/login
2. F12 → Network tab → Check "Preserve log"
3. Click "Continue with Google"
4. Observe redirect:
   - Có redirect đến accounts.google.com? ✅
   - Có hiện Google login form? ✅
   - Nhập password
   - Có redirect về xxx.supabase.co? (check Network tab)
   - URL nào hiện lỗi 404? → Copy URL đó
```

---

## 📋 FINAL CHECKLIST

Hãy check lại TẤT CẢ (từng dòng):

### Google Cloud Console:
```bash
[ ] OAuth Client type = "Web application"
[ ] Authorized JavaScript origins:
    - https://tiengtrunghsk3-0.vercel.app ✅
    - http://localhost:5173 ✅
[ ] Authorized redirect URIs:
    - https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
    - https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
[ ] URLs không có trailing slash
[ ] URLs copied từ Supabase (không gõ tay)
[ ] Đã Save
[ ] Đợi 10 phút sau khi save
```

### OAuth Consent Screen:
```bash
[ ] Publishing status = "In production"
    HOẶC
    "Testing" + đã add test user email
[ ] Scopes có: email, profile, openid
```

### Supabase Mandarin (piwdypvvskuwbyvgyktn):
```bash
[ ] Google provider enabled = ON
[ ] Client ID = copy từ Google Console
[ ] Client Secret = copy từ Google Console
[ ] Site URL = https://tiengtrunghsk3-0.vercel.app
[ ] Redirect URLs có:
    - https://tiengtrunghsk3-0.vercel.app/**
    - https://tiengtrunghsk3-0.vercel.app/mandarin/**
[ ] Đã Save
```

### Supabase Cantonese (jhjpgdldjunkhdbtopbs):
```bash
[ ] Google provider enabled = ON
[ ] Client ID = CÙNG với Mandarin
[ ] Client Secret = CÙNG với Mandarin
[ ] Site URL = https://tiengtrunghsk3-0.vercel.app
[ ] Redirect URLs có:
    - https://tiengtrunghsk3-0.vercel.app/**
    - https://tiengtrunghsk3-0.vercel.app/cantonese/**
[ ] Đã Save
```

---

## 💡 Nếu vẫn không được...

### Solution A: Recreate OAuth Client

**Có thể OAuth client bị corrupt:**

```bash
1. Google Cloud Console → Credentials
2. XÓA OAuth client cũ (hoặc disable)
3. CREATE CREDENTIALS → OAuth client ID
4. Type: Web application
5. Name: Tieng Trung Haohao Fresh
6. Authorized JavaScript origins:
   - https://tiengtrunghsk3-0.vercel.app
7. Authorized redirect URIs:
   - https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
   - https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
8. CREATE
9. Copy NEW Client ID + Secret
10. Update vào cả 2 Supabase projects
11. Đợi 10 phút
12. Test
```

### Solution B: Tạm dùng Email/Password

**Đang hoạt động 100%:**

```tsx
// Đã có sẵn trong code:
<EmailPasswordAuthForm />

✅ User có thể đăng ký/đăng nhập
✅ Không cần config phức tạp
✅ Không có 404 error
✅ Full features (reset password, etc.)
```

---

## 🎯 TL;DR

1. **JavaScript origins đúng rồi** ✅ (không phải nguyên nhân 404)
2. **Vấn đề thực sự:** Redirect URIs hoặc propagation time
3. **Giải pháp:**
   - Copy EXACT callback URLs từ Supabase
   - Add vào Google redirect URIs
   - Đợi 10 phút (không phải 2-3 phút)
   - Clear cache + incognito
   - Nếu không được → Recreate OAuth client

---

## 🆘 Debug Information Cần Thiết

Để tôi giúp tìm exact issue, share:

1. **Screenshot "Authorized redirect URIs"** trong Google Console
   - Show cả 2 URLs
   - Đảm bảo không có typo

2. **Network tab** khi bị 404:
   - F12 → Network → Preserve log
   - Click Google login → Nhập password
   - Screenshot requests màu đỏ

3. **Error URL**:
   - Copy toàn bộ URL trong address bar khi 404

4. **OAuth consent screen status**:
   - "In production" hay "Testing"?

→ Với thông tin này, tôi sẽ tìm ra exact issue ngay! 🎯

---

**Tóm lại:** JavaScript origins đã đúng rồi. Vấn đề có thể là:
- Redirect URIs chưa propagate (đợi thêm 10 phút)
- Client ID/Secret không match
- OAuth consent screen ở test mode chưa add user

Hãy làm lại checklist trên và đợi đủ thời gian! 🚀
