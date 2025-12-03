# 🔒 Hướng dẫn Fix Security Warnings - Supabase

## 📊 Tóm tắt Warnings

| Warning | Mức độ | Cách fix |
|---------|--------|----------|
| Function Search Path Mutable | WARN | ✅ **ĐÃ FIX** bằng migration |
| Leaked Password Protection | WARN | ⚙️ Config trên Dashboard |
| Postgres Version Outdated | WARN | ⬆️ Upgrade qua Dashboard |

---

## ✅ 1. Function Search Path Mutable (ĐÃ FIX)

### Migration đã được tạo: `20250203_fix_function_search_path.sql`

**Cách áp dụng:**

### **Cho HSK Database:**
1. Vào SQL Editor của project HSK (quangdong - jhjpgdldjunkhdbtopbs)
2. Copy nội dung file `supabase/migrations/20250203_fix_function_search_path.sql`
3. Paste và Run
4. Kiểm tra Security Advisor → Các warning về functions sẽ biến mất

### **Cho Cantonese Database:**
1. Vào SQL Editor của project Cantonese (TiengttrungHaohao - piwdypvvskuwbyvgyktn)
2. Copy nội dung file `supabase/migrations/20250203_fix_function_search_path.sql`
3. Paste và Run
4. Kiểm tra Security Advisor → Các warning về functions sẽ biến mất

---

## 🔐 2. Leaked Password Protection

### Vấn đề:
Supabase Auth chưa bật tính năng kiểm tra mật khẩu bị leak từ [HaveIBeenPwned.org](https://haveibeenpwned.com/)

### Cách fix (qua Dashboard):

#### **HSK Database:**
1. Vào https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Sidebar → **Authentication**
3. Click vào **Policies** → **Password Policy**
4. Bật option: **"Check against leaked passwords (HaveIBeenPwned)"**
5. Click **Save**

#### **Cantonese Database:**
1. Vào https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Sidebar → **Authentication**
3. Click vào **Policies** → **Password Policy**
4. Bật option: **"Check against leaked passwords (HaveIBeenPwned)"**
5. Click **Save**

**Kết quả:** Warning `auth_leaked_password_protection` sẽ biến mất

---

## ⬆️ 3. Postgres Version Upgrade

### Vấn đề:
- **HSK DB**: Đang dùng `supabase-postgres-17.4.1.069` (có patches mới hơn)
- **Cantonese DB**: Đang dùng `supabase-postgres-17.4.1.074` (có patches mới hơn)

### Cách upgrade (qua Dashboard):

#### **HSK Database:**
1. Vào https://supabase.com/dashboard/project/jhjpgdldjunkhdbtopbs
2. Sidebar → **Settings** (icon ⚙️ ở dưới cùng)
3. Click vào **Infrastructure**
4. Tìm phần **Postgres version**
5. Click **Upgrade available** (nếu có)
6. Chọn version mới nhất
7. Click **Upgrade database**
8. ⚠️ **Lưu ý:** Database sẽ restart (downtime ~2-5 phút)

#### **Cantonese Database:**
1. Vào https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
2. Sidebar → **Settings** (icon ⚙️ ở dưới cùng)
3. Click vào **Infrastructure**
4. Tìm phần **Postgres version**
5. Click **Upgrade available** (nếu có)
6. Chọn version mới nhất
7. Click **Upgrade database**
8. ⚠️ **Lưu ý:** Database sẽ restart (downtime ~2-5 phút)

**Kết quả:** Warning `vulnerable_postgres_version` sẽ biến mất

---

## 🎯 Checklist Hoàn thành

### Migrations (SQL):
- [x] Fix RLS errors (20250203_fix_rls_security_errors.sql)
- [ ] Fix Function Search Path (20250203_fix_function_search_path.sql)

### Dashboard Config:
- [ ] Enable Leaked Password Protection (HSK)
- [ ] Enable Leaked Password Protection (Cantonese)
- [ ] Upgrade Postgres (HSK)
- [ ] Upgrade Postgres (Cantonese)

---

## 📝 Thứ tự thực hiện (Khuyến nghị):

1. ✅ **Chạy migration RLS** (ĐÃ XONG)
2. ⏳ **Chạy migration Function Search Path** (TIẾP THEO)
3. ⏳ Enable Leaked Password Protection (5 phút)
4. ⏳ Upgrade Postgres (thực hiện vào giờ thấp điểm, có downtime)

---

## ✨ Kết quả mong đợi:

Sau khi hoàn thành tất cả:
- ✅ **0 ERROR** level issues
- ✅ **0 WARN** level issues (hoặc chỉ còn Postgres upgrade nếu chưa muốn upgrade ngay)
- 🎉 **100% Security Compliance**

---

**Ngày tạo:** 2025-02-03
**Người thực hiện:** truonggthanhh
**Branch:** claude/fix-database-errors-014TuiprcbmmjcqT1zSzeZKx
