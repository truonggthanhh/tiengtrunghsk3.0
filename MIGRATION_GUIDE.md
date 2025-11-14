# 📘 Hướng dẫn chạy SQL Migration

## Cách 1: Sử dụng Supabase Dashboard (Khuyến nghị - Dễ nhất)

### Bước 1: Truy cập Supabase Dashboard
1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn (tiengtrunghsk3.0)

### Bước 2: Mở SQL Editor
1. Ở sidebar bên trái, click vào **SQL Editor**
2. Click **New query** để tạo query mới

### Bước 3: Copy & Paste Migration
1. Mở file `supabase/migrations/20250114_create_blog_posts.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL Editor

### Bước 4: Chạy Migration
1. Click nút **Run** (hoặc nhấn `Ctrl+Enter` / `Cmd+Enter`)
2. Nếu thành công, bạn sẽ thấy thông báo "Success"
3. Kiểm tra table mới:
   - Vào **Table Editor** → Sẽ thấy table `blog_posts`

### Bước 5: Verify (Kiểm tra)
```sql
-- Kiểm tra table đã được tạo chưa
SELECT * FROM blog_posts LIMIT 1;

-- Kiểm tra policies
SELECT * FROM pg_policies WHERE tablename = 'blog_posts';
```

---

## Cách 2: Sử dụng Supabase CLI (Cho developers)

### Bước 1: Cài đặt Supabase CLI
```bash
# Nếu chưa cài
npm install -g supabase

# Hoặc dùng brew (macOS)
brew install supabase/tap/supabase
```

### Bước 2: Link project với Supabase
```bash
# Ở thư mục root của project
supabase link --project-ref <your-project-ref>

# Nhập password khi được yêu cầu
```

### Bước 3: Chạy Migration
```bash
# Chạy tất cả migrations chưa được apply
supabase db push

# Hoặc chạy migration cụ thể
supabase migration up
```

### Bước 4: Verify
```bash
# Kiểm tra status của migrations
supabase migration list

# Kết nối vào database để test
supabase db shell
```

---

## Cách 3: Chạy trực tiếp qua psql (Advanced)

### Bước 1: Lấy connection string
1. Vào Supabase Dashboard → **Settings** → **Database**
2. Copy **Connection string** (Direct connection)
3. Thay `[YOUR-PASSWORD]` bằng database password của bạn

### Bước 2: Kết nối và chạy
```bash
# Kết nối vào database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Chạy migration file
\i supabase/migrations/20250114_create_blog_posts.sql

# Hoặc
psql -h db.[PROJECT-REF].supabase.co -U postgres -d postgres -f supabase/migrations/20250114_create_blog_posts.sql
```

---

## ✅ Sau khi chạy Migration thành công

### Kiểm tra table đã tạo
```sql
-- Xem cấu trúc table
\d blog_posts

-- Hoặc
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'blog_posts';
```

### Kiểm tra RLS Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'blog_posts';
```

### Test tạo blog post mẫu (optional)
```sql
-- Tạo 1 blog post test
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  language,
  status,
  author_id,
  tags
) VALUES (
  'Bài viết đầu tiên',
  'bai-viet-dau-tien',
  'Đây là bài viết đầu tiên trên blog',
  '<h1>Chào mừng!</h1><p>Đây là nội dung bài viết đầu tiên.</p>',
  'cantonese',
  'published',
  (SELECT id FROM auth.users LIMIT 1), -- Lấy user đầu tiên
  '["test", "demo"]'::jsonb
);

-- Xem kết quả
SELECT * FROM blog_posts;
```

---

## 🐛 Troubleshooting

### Lỗi: "permission denied"
- **Nguyên nhân**: Không có quyền admin
- **Giải pháp**: Đảm bảo bạn đang dùng user có role `postgres` hoặc `admin`

### Lỗi: "table already exists"
- **Nguyên nhân**: Table đã được tạo trước đó
- **Giải pháp**: Drop table cũ trước
```sql
DROP TABLE IF EXISTS blog_posts CASCADE;
-- Sau đó chạy lại migration
```

### Lỗi: "extension uuid-ossp does not exist"
- **Nguyên nhân**: Extension chưa được enable
- **Giải pháp**:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Lỗi khi test insert: "new row violates row-level security"
- **Nguyên nhân**: RLS policies chưa đúng hoặc user không có quyền
- **Giải pháp**: Kiểm tra lại policies hoặc tạo post với user có quyền admin

---

## 📝 Notes

- Migration file nằm ở: `supabase/migrations/20250114_create_blog_posts.sql`
- Nếu bạn dùng local development với Supabase, chạy: `supabase start` trước
- Luôn backup database trước khi chạy migration trong production
- Sau khi migration, test kỹ trên môi trường staging trước khi deploy lên production

---

## 🎯 Tiếp theo

Sau khi migration thành công:
1. ✅ Vào `/cantonese/blog` để xem blog listing page
2. ✅ Vào `/cantonese/dashboard` → tab **Blog** để tạo bài viết mới
3. ✅ Test tạo, sửa, xóa blog posts
4. ✅ Kiểm tra RLS policies bằng cách login với user khác nhau
