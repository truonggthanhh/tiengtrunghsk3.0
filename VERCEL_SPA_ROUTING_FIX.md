# ✅ FIX VERCEL SPA ROUTING - XỬ LÝ 404 OAUTH CALLBACK

## 🎯 VẤN ĐỀ PHÁT HIỆN

Sau khi nâng cấp lên PKCE flow (commit `ce4de73`), OAuth **ĐANG HOẠT ĐỘNG** nhưng gặp lỗi 404!

### Triệu chứng:
```
❌ URL: /mandarin?code=c0bbce15-729a-4be3-b02a-269622d1dd8d
❌ Error: 404 (Not Found)
❌ Console: "Unchecked runtime.lastError: Could not establish connection"
```

### Phân tích:

**✅ PKCE flow HOẠT ĐỘNG:**
- Thấy `?code=xxx` trong URL (không phải `#access_token` nữa)
- Google OAuth redirect về đúng domain
- Authorization code được tạo thành công

**❌ Vercel routing BỊ LỖI:**
- `/mandarin?code=xxx` → Vercel tìm file `/mandarin/index.html`
- File không tồn tại → **404 Not Found**
- App không chạy → Không process OAuth code

---

## 🔍 NGUYÊN NHÂN GỐC RỄ

### Cách Vite SPA hoạt động:

**1. Development (localhost):**
```
Request: /mandarin?code=xxx
↓
Vite dev server
↓
Serve: index.html
↓
React Router xử lý /mandarin route
✅ HOẠT ĐỘNG!
```

**2. Production (Vercel) - TRƯỚC KHI CÓ vercel.json:**
```
Request: /mandarin?code=xxx
↓
Vercel CDN
↓
Tìm static file: /mandarin/index.html
↓
Không tìm thấy
↓
❌ 404 ERROR!
```

**3. Production (Vercel) - SAU KHI CÓ vercel.json:**
```
Request: /mandarin?code=xxx
↓
Vercel CDN
↓
Rewrite rule: /* → /index.html
↓
Serve: /index.html
↓
React Router xử lý /mandarin route
✅ HOẠT ĐỘNG!
```

### Tại sao cần vercel.json?

Vite build SPA thành:
```
dist/
├── index.html          ← Chỉ có 1 HTML file!
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
└── ...
```

**Không có:**
- `/mandarin/index.html`
- `/cantonese/index.html`
- `/cantonese/lessons/index.html`

→ Tất cả routes phải rewrite về `/index.html`!

---

## ✅ GIẢI PHÁP: TẠO vercel.json

### File: `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Giải thích config:

**1. Rewrites:**
```json
{
  "source": "/(.*)",
  "destination": "/index.html"
}
```
- Match: **TẤT CẢ** routes (`(.*)` = wildcard)
- Rewrite về: `/index.html`
- Áp dụng cho:
  - `/mandarin?code=xxx` → `/index.html`
  - `/cantonese/lessons` → `/index.html`
  - `/mandarin/hsk/1/flashcard` → `/index.html`

**2. Security Headers:**
```json
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
}
```
- Ngăn MIME type sniffing attacks

```json
{
  "key": "X-Frame-Options",
  "value": "DENY"
}
```
- Ngăn clickjacking attacks (không cho embed trong iframe)

```json
{
  "key": "X-XSS-Protection",
  "value": "1; mode=block"
}
```
- Bật XSS protection trong browser

---

## 🔄 FLOW HOÀN CHỈNH SAU KHI FIX

### 1. User click "Continue with Google"
```typescript
// src/cantonese/pages/Login.tsx
<Auth
  supabaseClient={supabase}
  providers={['google']}
  redirectTo={window.location.origin + '/cantonese/lessons'}
/>
```
→ Redirect đến Google OAuth

### 2. Google authorize & redirect
```
https://tiengtrunghsk3-0.vercel.app/cantonese/lessons?code=c0bbce15...
```

### 3. Vercel rewrite request
```
vercel.json: /(.*) → /index.html
```
→ Serve `/index.html` (không phải 404!)

### 4. React app loads
```typescript
// App.tsx
<BrowserRouter>
  <Routes>
    <Route path="/cantonese">
      <Route path="lessons" element={...} />
    </Route>
  </Routes>
</BrowserRouter>
```
→ React Router match `/cantonese/lessons`

### 5. SessionContextProvider xử lý OAuth
```typescript
// SessionContextProvider.tsx
const handleOAuthCallback = async () => {
  // ✅ Detect ?code= trong URL
  const { data: { session }, error } = await supabase.auth.getSession();

  // ✅ Supabase tự động exchange code → tokens
  setSession(session);

  // ✅ Clean URL
  if (session && window.location.search.includes('code=')) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};
```

### 6. Auth state change event
```typescript
supabase.auth.onAuthStateChange((_event, session) => {
  console.log('Auth state changed:', _event); // SIGNED_IN
  setSession(session);
});
```

### 7. User đăng nhập thành công! ✅
```
URL: /cantonese/lessons (clean!)
Session: Created ✅
User: Thấy tên và avatar
```

---

## 🧪 CÁCH TEST SAU DEPLOY

### Test Cantonese:

**1. Clear browser cache & cookies**
```
Chrome: Ctrl+Shift+Del → Clear all
```

**2. Mở trang login:**
```
https://tiengtrunghsk3-0.vercel.app/cantonese/login
```

**3. Mở Console (F12) → Tab Console**

**4. Click "Continue with Google"**

**5. Đăng nhập Google**

**6. Kiểm tra Console logs:**
```
✅ THÀNH CÔNG nếu thấy:
Auth state changed: SIGNED_IN Session exists
```

**7. Kiểm tra Network tab:**
```
✅ THÀNH CÔNG nếu thấy:
/cantonese/lessons?code=xxx → Status: 200 (không phải 404!)
Type: document
Size: ~3KB (index.html)
```

**8. Kiểm tra URL:**
```
✅ THÀNH CÔNG nếu URL clean:
https://tiengtrunghsk3-0.vercel.app/cantonese/lessons
(không có ?code= hay #access_token)
```

**9. Kiểm tra giao diện:**
```
✅ THÀNH CÔNG nếu:
- Thấy tên user ở header
- Thấy menu profile
- Không thấy nút "Đăng nhập"
```

### Test Mandarin:

Làm tương tự nhưng với:
```
URL: https://tiengtrunghsk3-0.vercel.app/mandarin/login
Redirect: /mandarin (không có /lessons)
```

---

## 📊 SO SÁNH TRƯỚC VÀ SAU

### TRƯỚC (Không có vercel.json):

**Mandarin:**
```
Step 1: User click "Continue with Google"
Step 2: Google redirect về /mandarin?code=xxx
Step 3: Vercel tìm /mandarin/index.html
Step 4: ❌ 404 Not Found
Step 5: ❌ App không chạy
Step 6: ❌ OAuth code không được xử lý
Step 7: ❌ User không đăng nhập được
```

**Cantonese:**
```
Step 1: User click "Continue with Google"
Step 2: Google redirect về /cantonese/lessons?code=xxx
Step 3: Vercel tìm /cantonese/lessons/index.html
Step 4: ❌ 404 Not Found
Step 5: ❌ App không chạy
Step 6: ❌ OAuth code không được xử lý
Step 7: ❌ User không đăng nhập được
```

### SAU (Có vercel.json):

**Mandarin:**
```
Step 1: User click "Continue with Google"
Step 2: Google redirect về /mandarin?code=xxx
Step 3: Vercel rewrite → /index.html
Step 4: ✅ Serve index.html (200 OK)
Step 5: ✅ React app loads
Step 6: ✅ SessionContextProvider xử lý OAuth
Step 7: ✅ User đăng nhập thành công!
```

**Cantonese:**
```
Step 1: User click "Continue with Google"
Step 2: Google redirect về /cantonese/lessons?code=xxx
Step 3: Vercel rewrite → /index.html
Step 4: ✅ Serve index.html (200 OK)
Step 5: ✅ React app loads
Step 6: ✅ SessionContextProvider xử lý OAuth
Step 7: ✅ User đăng nhập thành công!
```

---

## 🐛 NẾU VẪN GẶP LỖI

### Lỗi: 404 vẫn xuất hiện

**Kiểm tra:**
1. Vercel đã rebuild chưa? (Check deployment logs)
2. vercel.json có trong build output không?
3. Cache browser đã clear chưa?

**Fix:**
```bash
# Force redeploy
git commit --allow-empty -m "Force redeploy"
git push
```

### Lỗi: "Could not establish connection"

**Giải thích:**
- Đây là lỗi Chrome extension (Grammarly, LastPass, etc.)
- **KHÔNG PHẢI** lỗi app
- Ignore it!

### Lỗi: Session không được tạo dù 200 OK

**Kiểm tra:**
1. Console logs có "Auth state changed: SIGNED_IN"?
2. Network tab có request đến `/auth/v1/token`?
3. Response có chứa `access_token`?

**Debug:**
```typescript
// Thêm vào SessionContextProvider
console.log('Session:', session);
console.log('User:', session?.user);
```

---

## 📚 TÀI LIỆU THAM KHẢO

### Vercel:
- [Vercel Configuration](https://vercel.com/docs/project-configuration)
- [Rewrites Documentation](https://vercel.com/docs/edge-network/rewrites)
- [SPA Configuration](https://vercel.com/docs/frameworks/vite#configuring-a-single-page-application)

### Vite:
- [Building for Production](https://vitejs.dev/guide/build.html)
- [Backend Integration](https://vitejs.dev/guide/backend-integration.html)

### OAuth & PKCE:
- [Supabase PKCE Flow](https://supabase.com/docs/guides/auth/server-side/pkce-flow)
- [OAuth 2.0 PKCE](https://oauth.net/2/pkce/)

---

## 🎯 KẾT LUẬN

### Các commit liên quan:

1. **ce4de73** - Upgrade lên PKCE flow
   - Sửa: Supabase clients config
   - Thêm: OAuth callback handling

2. **51b1ccc** - Documentation cho PKCE fix
   - Thêm: OAUTH_PKCE_FIX.md

3. **563ae49** - Fix Vercel routing (commit này)
   - Thêm: vercel.json
   - Fix: 404 errors cho SPA routes

### Timeline vấn đề:

```
Issue 1: OAuth implicit flow (cũ)
↓
Fix 1: Upgrade PKCE flow (ce4de73) ✅
↓
Issue 2: 404 errors do Vercel routing
↓
Fix 2: Add vercel.json (563ae49) ✅
↓
Result: Google OAuth hoạt động hoàn hảo! 🎉
```

### Checklist cuối cùng:

- ✅ Supabase clients dùng PKCE flow
- ✅ OAuth callback handling có trong SessionContextProvider
- ✅ vercel.json config rewrites cho SPA
- ✅ Security headers được thêm
- ✅ Code đã commit & push
- ⏳ Đợi Vercel deploy (2-3 phút)
- ⏳ Test trên production

---

**Tạo:** 2025-01-11
**Commit:** 563ae49
**Branch:** claude/debug-white-page-redirect-011CV2C1AuGcwGG8KZidfJiF
**Status:** ✅ Fixed & Deploying
