# ✅ Dictionary Feature - Ready to Test!

## Đã fix lỗi 401!

**Giải pháp**: Frontend bây giờ gọi **trực tiếp RPC function** thay vì Edge Function → không còn lỗi 401 nữa!

## Checklist deploy

### 1. ✅ Database Schema (DONE)
Đã tạo bảng `dictionary_entries` và function `search_dictionary()`

### 2. ⏳ Import Data (BẠN CẦN LÀM)

Bạn cần import data CVDICT vào database:

```bash
# Bước 1: Chạy script convert
node scripts/convert-cvdict.js CVDICT.u8 ./dictionary-data

# Bước 2: Import vào Supabase
# Cách 1: Import CSV qua Supabase Dashboard
# - Vào Table Editor > dictionary_entries
# - Click "Insert" > "Import data from CSV"
# - Upload file dictionary-data/dictionary.csv

# Cách 2: Chạy SQL file
# - Copy nội dung file dictionary-data/dictionary-import.sql
# - Paste vào SQL Editor và Run
```

### 3. ✅ Frontend Integration (DONE)
Đã tích hợp vào `/mandarin/dictionary`

## Test ngay bây giờ

1. **Deploy frontend lên Vercel/Netlify**
2. **Vào trang dictionary**: `/mandarin/dictionary`
3. **Thử tra các từ sau**:
   - `你好` (Hán tự - sẽ thấy 8 mẫu entries nếu chưa import data đầy đủ)
   - `nihao` hoặc `ni3 hao3` (Pinyin)
   - `xin chào` (Tiếng Việt)

## Kết quả mong đợi

### Nếu chưa import data đầy đủ:
- Tra `你好` → Sẽ thấy 1 entry từ sample data
- Tra `谢谢` → Sẽ thấy 1 entry
- Tra `nihao` → Không có kết quả (vì sample data dùng `ni3 hao3`)

### Sau khi import data đầy đủ (120k+ entries):
- Tra bất kỳ từ nào → Sẽ có nhiều kết quả
- Pagination hoạt động
- Auto-detect mode hoạt động

## Troubleshooting

### Vẫn thấy lỗi "Failed to search dictionary"?

Kiểm tra RLS policy:

```sql
-- Chạy trong Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'dictionary_entries';

-- Phải có policy "Allow public read access to dictionary"
-- Nếu không có, chạy lại:
CREATE POLICY "Allow public read access to dictionary"
  ON dictionary_entries FOR SELECT
  TO public
  USING (true);

-- Test RPC function:
SELECT * FROM search_dictionary('你好', 'auto', 10, 0);
```

### Sample data không hiện?

Kiểm tra xem đã insert sample data chưa:

```sql
SELECT COUNT(*) FROM dictionary_entries;
-- Phải có ít nhất 8 rows từ DICTIONARY_SCHEMA.sql
```

## Không cần Edge Function nữa!

Edge Function code vẫn còn trong repo nhưng **KHÔNG CẦN DEPLOY**. Frontend gọi trực tiếp database RPC function, đơn giản và nhanh hơn!

---

**Ready to go! 🚀** Deploy frontend và test ngay!
