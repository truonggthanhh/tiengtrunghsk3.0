# 🔐 GOOGLE OAUTH SETUP - FIX LỖI 404

## ❌ Vấn đề hiện tại

Khi đăng nhập Google OAuth → nhập mật khẩu → **Báo lỗi 404**

**Nguyên nhân:** Google Cloud Console chưa có **Authorized Redirect URIs** cho Supabase.

---

## ✅ Giải pháp (Follow từng bước)

### 🎯 BƯỚC 1: Lấy Supabase Callback URLs

#### A. Mandarin Project (piwdypvvskuwbyvgyktn)

```bash
1. Vào: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Click: Authentication → Providers
3. Tìm: Google
4. Copy URL "Callback URL (for OAuth)"
   → Nó sẽ giống: https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
```

**📋 Copy URL này:**
```
https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
```

#### B. Cantonese Project (jhjpgdldjunkhdbtopbs)

```bash
1. Vào: https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Click: Authentication → Providers
3. Tìm: Google
4. Copy URL "Callback URL (for OAuth)"
   → Nó sẽ giống: https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
```

**📋 Copy URL này:**
```
https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
```

---

### 🎯 BƯỚC 2: Config Google Cloud Console

#### 1. Mở Google Cloud Console
```
https://console.cloud.google.com/apis/credentials
```

#### 2. Chọn đúng Project
- Click dropdown ở góc trên bên trái
- Chọn project đang dùng cho app của bạn

#### 3. Tìm OAuth 2.0 Client IDs
- Trong danh sách **OAuth 2.0 Client IDs**
- Click vào Client ID đang dùng (thường tên là "Web client")

#### 4. Add Authorized Redirect URIs

**⚠️ QUAN TRỌNG:** Thêm **CẢ 2 URLs** này:

```
https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback
```

**Cách thêm:**
- Scroll xuống section **"Authorized redirect URIs"**
- Click **"+ ADD URI"**
- Paste URL thứ nhất
- Click **"+ ADD URI"** lần nữa
- Paste URL thứ hai
- Click **"SAVE"** ở cuối trang

#### 5. Đợi vài giây
Google cần 1-2 phút để apply changes.

---

### 🎯 BƯỚC 3: Verify Supabase Config

#### A. Mandarin Project

```bash
1. Vào: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Authentication → Providers → Google
3. Check:
   ✅ Google enabled = ON (toggle bật)
   ✅ Client ID đã điền
   ✅ Client Secret đã điền
   ✅ Callback URL hiển thị đúng
4. Click "Save" nếu có thay đổi
```

#### B. Cantonese Project

```bash
1. Vào: https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Authentication → Providers → Google
3. Check:
   ✅ Google enabled = ON
   ✅ Client ID đã điền
   ✅ Client Secret đã điền
   ✅ Callback URL hiển thị đúng
4. Click "Save" nếu có thay đổi
```

---

## 🧪 Test Google OAuth

### Test Mandarin:
```
1. Mở: https://tiengtrunghsk3-0.vercel.app/mandarin/login
2. Click "Continue with Google" (hoặc nút Google)
3. Chọn tài khoản Google
4. ✅ Phải redirect về /mandarin thành công
5. ✅ Không còn lỗi 404
```

### Test Cantonese:
```
1. Mở: https://tiengtrunghsk3-0.vercel.app/cantonese/login
2. Click "Continue with Google"
3. Chọn tài khoản Google
4. ✅ Phải redirect về /cantonese/lessons thành công
5. ✅ Không còn lỗi 404
```

---

## 🐛 Troubleshooting

### Vẫn báo lỗi 404?

#### Check 1: Verify Redirect URIs in Google
```bash
1. Vào Google Cloud Console
2. Credentials → OAuth 2.0 Client IDs
3. Click vào Client ID
4. Check section "Authorized redirect URIs"
5. Đảm bảo CẢ 2 Supabase callback URLs đã được add
```

#### Check 2: Client ID & Secret đúng?
```bash
Trong Supabase Dashboard:
1. Authentication → Providers → Google
2. Re-check Client ID
3. Re-check Client Secret
4. Phải match với Google Cloud Console
```

#### Check 3: Google Cloud Project đúng?
```bash
Đảm bảo bạn đang config đúng Google Cloud Project:
- Không phải project khác
- OAuth consent screen đã config
- APIs enabled (Google+ API)
```

#### Check 4: Clear browser cache
```bash
Ctrl + Shift + Delete → Clear cache
Hoặc thử Incognito mode
```

---

## 📋 Checklist Hoàn Chỉnh

### Google Cloud Console:
- [ ] Đã mở đúng project
- [ ] Đã tìm đúng OAuth 2.0 Client ID
- [ ] Đã add redirect URI cho Mandarin
- [ ] Đã add redirect URI cho Cantonese
- [ ] Đã click Save
- [ ] Đợi 1-2 phút để apply

### Supabase Mandarin:
- [ ] Google provider enabled
- [ ] Client ID điền đúng
- [ ] Client Secret điền đúng
- [ ] Callback URL copy từ Supabase

### Supabase Cantonese:
- [ ] Google provider enabled
- [ ] Client ID điền đúng
- [ ] Client Secret điền đúng
- [ ] Callback URL copy từ Supabase

### Testing:
- [ ] Test Mandarin login → Success
- [ ] Test Cantonese login → Success
- [ ] Không còn 404 error

---

## 📸 Screenshots Hướng Dẫn

### Google Cloud Console - Add Redirect URI:

```
1. Credentials page:
   ┌─────────────────────────────────────┐
   │ OAuth 2.0 Client IDs                │
   │                                     │
   │ ○ Web client                        │  ← Click vào đây
   │   Client ID: 123...                 │
   │   Created: ...                      │
   └─────────────────────────────────────┘

2. Edit OAuth client:
   ┌─────────────────────────────────────────────────────┐
   │ Authorized redirect URIs                            │
   │ ┌─────────────────────────────────────────────────┐ │
   │ │ https://piwdypvvskuwbyvgyktn.supabase.co/...   │ │ ← Add URI 1
   │ └─────────────────────────────────────────────────┘ │
   │ ┌─────────────────────────────────────────────────┐ │
   │ │ https://jhjpgdldjunkhdbtopbs.supabase.co/...   │ │ ← Add URI 2
   │ └─────────────────────────────────────────────────┘ │
   │                                                     │
   │ [+ ADD URI]                                         │ ← Click to add more
   │                                                     │
   │                           [Cancel]  [SAVE] ←────────┤ Click SAVE
   └─────────────────────────────────────────────────────┘
```

### Supabase - Copy Callback URL:

```
Authentication → Providers → Google:
┌──────────────────────────────────────────────┐
│ Google                                  [ON] │ ← Toggle ON
│                                              │
│ Client ID:                                   │
│ ┌──────────────────────────────────────────┐ │
│ │ 123456789-abc.apps.googleusercontent.com │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Client Secret:                               │
│ ┌──────────────────────────────────────────┐ │
│ │ GOCSPX-...                               │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Callback URL (for OAuth):                   │
│ ┌──────────────────────────────────────────┐ │
│ │ https://xxx.supabase.co/auth/v1/callback│ │ ← COPY THIS
│ └──────────────────────────────────────────┘ │
│                                              │
│                                 [Save]       │
└──────────────────────────────────────────────┘
```

---

## ⚠️ QUAN TRỌNG

### Nếu dùng 1 Google Project cho cả 2 apps:

**Phải add CẢ 2 callback URLs** vào cùng 1 OAuth Client:
```
✅ Đúng:
OAuth Client "Web client"
├── https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
└── https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback

❌ Sai:
Tạo 2 OAuth Clients riêng (không cần thiết)
```

### Nếu dùng 2 Google Projects riêng:

Mandarin Project → OAuth Client → Add Mandarin callback
Cantonese Project → OAuth Client → Add Cantonese callback

**Lưu ý:** Phải điền đúng Client ID/Secret tương ứng vào mỗi Supabase project.

---

## 🎯 Quick Fix Summary

```bash
# Step 1: Get callback URLs from Supabase
Mandarin:  https://piwdypvvskuwbyvgyktn.supabase.co/auth/v1/callback
Cantonese: https://jhjpgdldjunkhdbtopbs.supabase.co/auth/v1/callback

# Step 2: Add to Google Cloud Console
→ Credentials → OAuth 2.0 Client ID → Authorized redirect URIs
→ Add both URLs
→ Save

# Step 3: Test
→ Clear cache
→ Try login with Google
→ Should work ✅
```

---

## 📞 Support

Nếu vẫn lỗi sau khi làm theo:
1. Screenshot Google Cloud Console redirect URIs section
2. Screenshot Supabase Google provider config
3. Check browser console (F12) khi login
4. Share error details

---

## ✅ Expected Result

Sau khi setup đúng:

```
User clicks "Continue with Google"
   ↓
Redirect to Google login
   ↓
User chọn tài khoản
   ↓
Google redirects to: https://xxx.supabase.co/auth/v1/callback
   ↓
Supabase processes auth
   ↓
Redirect to app: /mandarin hoặc /cantonese/lessons
   ↓
✅ User logged in successfully!
```

**Không có 404 error nữa!** 🎉

---

**Good luck! Làm theo từng bước là sẽ fix được! 🚀**
