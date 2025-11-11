# 🔍 DEBUG GOOGLE OAUTH 404 - ADVANCED TROUBLESHOOTING

## ⚠️ Tình huống hiện tại

- ✅ Đã enable Google trong Supabase
- ✅ Đã add callback URLs vào Google Cloud Console
- ✅ Đã clear cache
- ❌ Vẫn báo 404 khi đăng nhập
- ❌ Console F12 không hiển thị gì

→ **Lỗi ở phía server (Google hoặc Supabase), không phải client!**

---

## 🎯 BƯỚC DEBUG CHI TIẾT

### DEBUG 1: Kiểm tra EXACT Error URL

Khi bấm Google login và bị 404, **ĐỪNG ĐÓNG** trang lỗi. Hãy:

```bash
1. Nhìn vào address bar (URL bar)
2. Copy TOÀN BỘ URL đang hiển thị lỗi 404
3. Paste vào notepad

URL lỗi sẽ trông giống:
https://xxxxxx.supabase.co/auth/v1/callback?code=...&state=...
HOẶC
https://accounts.google.com/...
HOẶC
https://tiengtrunghsk3-0.vercel.app/404
```

**→ Share URL này với tôi để phân tích!**

Từ URL này tôi sẽ biết:
- Lỗi xảy ra ở đâu (Google, Supabase, hay app)
- Có đang redirect đúng không
- Parameters có bị mất không

---

### DEBUG 2: Check Network Tab (Quan trọng!)

Console trống không có nghĩa Network cũng trống:

```bash
1. Mở trang login (Mandarin hoặc Cantonese)
2. F12 → Tab "Network"
3. Check "Preserve log" (checkbox ở trên)
4. Bấm "Continue with Google"
5. Nhập mật khẩu Google
6. Khi bị 404, ĐỪNG ĐÓNG tab Network
7. Scroll lên trên cùng Network tab
8. Tìm các requests màu ĐỎ (failed requests)
9. Click vào request ĐỎ
10. Tab "Headers" → xem "Status Code" và "Request URL"
11. Tab "Response" → xem nội dung error
```

**→ Screenshot Network tab và share!**

---

### DEBUG 3: Verify Google Cloud Console (Chi tiết)

#### A. Check OAuth Client Type
```bash
1. Google Cloud Console → Credentials
2. OAuth 2.0 Client IDs
3. Đảm bảo Type = "Web application" (KHÔNG phải Android/iOS)
```

#### B. Check Authorized Redirect URIs (Exact match!)

**⚠️ CỰC KỲ QUAN TRỌNG:** URL phải CHÍNH XÁC 100%, không sai 1 ký tự!

```bash
Google Cloud Console → OAuth Client → Authorized redirect URIs

PHẢI CÓ CHÍNH XÁC:
https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback

❌ SAI NẾU:
- Có trailing slash: .../callback/
- Có space: ... /callback
- Có typo: .../callbak
- HTTP thay vì HTTPS: http://...
- Thiếu /auth/v1/callback
```

**→ Copy chính xác URLs và so sánh từng ký tự!**

#### C. Check OAuth Consent Screen

```bash
1. Google Cloud Console → OAuth consent screen
2. Publishing status phải là:
   - "In production" (recommended)
   - HOẶC "Testing" (nhưng phải add test users)

3. Nếu là "Testing":
   → Scroll xuống "Test users"
   → Add email bạn đang dùng để login
   → Save
```

#### D. Check APIs Enabled

```bash
1. Google Cloud Console → APIs & Services → Library
2. Search "Google+ API"
3. Nếu chưa enable → Click "Enable"
4. HOẶC search "People API" → Enable
```

---

### DEBUG 4: Verify Supabase Config (Chi tiết)

#### A. Check URLs trong Supabase

Vào mỗi project, check **CHÍNH XÁC**:

**Mandarin (piwdypvvskuwbyvgyktn):**
```bash
1. Authentication → URL Configuration
2. Site URL phải là:
   https://tiengtrunghsk3-0.vercel.app

3. Redirect URLs phải có:
   https://tiengtrunghsk3-0.vercel.app/**
   https://tiengtrunghsk3-0.vercel.app/mandarin
   https://tiengtrunghsk3-0.vercel.app/mandarin/**

4. Authentication → Providers → Google
5. Callback URL hiển thị:
   https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
```

**Cantonese (jhjpgdldjunkhdbtopbs):**
```bash
1. Authentication → URL Configuration
2. Site URL phải là:
   https://tiengtrunghsk3-0.vercel.app

3. Redirect URLs phải có:
   https://tiengtrunghsk3-0.vercel.app/**
   https://tiengtrunghsk3-0.vercel.app/cantonese/**
   https://tiengtrunghsk3-0.vercel.app/cantonese/lessons

4. Authentication → Providers → Google
5. Callback URL hiển thị:
   https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
```

#### B. Check Client ID/Secret Match

**CỰC KỲ QUAN TRỌNG:** Client ID và Secret phải đúng!

```bash
1. Vào Google Cloud Console
2. OAuth 2.0 Client ID → Click vào Web client
3. Copy "Client ID"
4. Copy "Client secret"

5. Vào Supabase → Authentication → Providers → Google
6. Paste CHÍNH XÁC Client ID
7. Paste CHÍNH XÁC Client Secret
8. Click Save
```

**Common mistakes:**
- Copy thiếu/thừa ký tự
- Copy cả "Client ID: " (chỉ cần copy phần sau)
- Nhầm lẫn giữa Client ID và Project ID
- Dùng Client của project khác

---

### DEBUG 5: Test với Simple Flow

Thử flow đơn giản hơn để isolate issue:

#### Test A: Direct Supabase Callback
```bash
1. Copy callback URL từ Supabase:
   https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback

2. Paste vào browser address bar
3. Enter

4. Nếu hiện lỗi "invalid_request" → OK (expected)
5. Nếu hiện 404 → Supabase project có vấn đề
```

#### Test B: Manual OAuth URL
```bash
Tạo URL test thủ công:

https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback&
  response_type=code&
  scope=openid email profile

Thay YOUR_CLIENT_ID bằng Client ID thật
Paste vào browser → Xem có redirect về Supabase không
```

---

## 🔬 Phân Tích Lỗi Thường Gặp

### Scenario 1: 404 ngay tại Google
**URL lỗi:** `https://accounts.google.com/...404`

**Nguyên nhân:**
- Client ID không tồn tại
- OAuth client bị xóa
- Project ID sai

**Fix:**
- Verify Client ID trong Google Console
- Re-create OAuth client nếu cần

---

### Scenario 2: 404 tại Supabase callback
**URL lỗi:** `https://xxx.supabase.co/auth/v1/callback?code=...` → 404

**Nguyên nhân:**
- Redirect URI trong Google Console không match
- Typo trong callback URL

**Fix:**
- Copy EXACT callback URL từ Supabase
- Paste vào Google Console (không sửa gì)
- Double-check không có space/typo

---

### Scenario 3: 404 tại app domain
**URL lỗi:** `https://tiengtrunghsk3-0.vercel.app/404`

**Nguyên nhân:**
- Route `/404` không tồn tại trong app
- Hoặc redirectTo config sai trong Supabase

**Fix:**
- Check Authentication → Providers → Google → redirectTo
- Should be: `https://tiengtrunghsk3-0.vercel.app/mandarin` hoặc `/cantonese/lessons`

---

### Scenario 4: Redirect loop → 404
**Hiện tượng:** Redirect nhiều lần rồi 404

**Nguyên nhân:**
- Site URL trong Supabase sai
- Redirect URLs không đủ

**Fix:**
- Add wildcard redirect: `https://tiengtrunghsk3-0.vercel.app/**`

---

## 🧪 Test Matrix

Hãy test từng trường hợp:

| Test | Action | Expected | Your Result |
|------|--------|----------|-------------|
| 1 | Access Supabase callback URL directly | "invalid_request" | ? |
| 2 | Click Google login button | Redirect to Google | ? |
| 3 | Enter email at Google | Password prompt | ? |
| 4 | Enter password | Redirect to Supabase | ? |
| 5 | Supabase processes | Redirect to app | ? |
| 6 | Final redirect | Login success | ? |

**→ Ở step nào bị 404?**

---

## 📋 Information I Need

Để giúp debug, tôi cần:

1. **Error URL** - URL đầy đủ khi bị 404
2. **Network screenshot** - Network tab khi bị lỗi
3. **Which step fails?** - Bước nào trong test matrix bị lỗi
4. **OAuth Client screenshot** - Google Console OAuth client config
5. **Supabase Google provider screenshot** - Config trong Supabase

---

## 🎯 Quick Checks

Trước khi debug sâu, check nhanh:

```bash
✅ Google Cloud Console:
[ ] OAuth client type = "Web application"
[ ] Có 2 redirect URIs (Mandarin + Cantonese)
[ ] URLs không có typo
[ ] URLs không có trailing slash
[ ] Đã click Save
[ ] Đợi 2-3 phút sau khi save

✅ Supabase (both projects):
[ ] Google enabled = ON
[ ] Client ID correct
[ ] Client Secret correct
[ ] Site URL = https://tiengtrunghsk3-0.vercel.app
[ ] Redirect URLs có **
[ ] Đã click Save

✅ Testing:
[ ] Cleared browser cache
[ ] Tried incognito mode
[ ] Tried different browser
[ ] Waited 5 minutes after changes
```

---

## 💡 Alternative Solution

Nếu vẫn không được, thử **tạo mới OAuth client**:

```bash
1. Google Cloud Console → Credentials
2. CREATE CREDENTIALS → OAuth client ID
3. Application type: Web application
4. Name: "Tieng Trung Haohao New"
5. Authorized redirect URIs:
   - Add: https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
   - Add: https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
6. CREATE
7. Copy NEW Client ID và Client Secret
8. Update vào Supabase (both projects)
9. Test lại
```

---

## 🆘 Last Resort

Nếu Google OAuth quá phức tạp, **tạm thời disable** và dùng Email/Password:

```bash
Ưu điểm Email/Password:
✅ Không cần config Google Cloud
✅ Hoạt động ngay lập tức
✅ Không bị 404
✅ User vẫn có thể đăng ký/đăng nhập

Code đã có sẵn trong:
- src/cantonese/components/auth/EmailPasswordAuthForm.tsx
- Đang hoạt động tốt

Google OAuth có thể enable sau khi debug xong.
```

---

## 📞 Next Steps

**Hãy làm theo thứ tự:**

1. ⭐ **Check Network tab** (quan trọng nhất!)
2. ⭐ **Copy error URL**
3. Copy Google OAuth client config screenshot
4. Copy Supabase Google provider screenshot
5. Share với tôi để phân tích

**→ Với thông tin trên, tôi sẽ tìm ra exact issue!**

---

**Remember:** 404 thường do URL mismatch. Double-check mỗi ký tự trong redirect URIs! 🔍
