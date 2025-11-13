# 📚 Hướng dẫn Setup Từ điển Trung–Việt

Tài liệu này hướng dẫn chi tiết cách setup module Từ điển Trung–Việt sử dụng CVDICT data.

## 📋 Tổng quan

- **Nguồn dữ liệu**: CVDICT (Chinese-Vietnamese Dictionary) - hơn 120,000 mục từ
- **Backend**: Supabase PostgreSQL + Edge Functions
- **Frontend**: React + TypeScript + Hong Kong retro style UI
- **Features**:
  - Tra cứu theo Hán tự (giản thể/phồn thể)
  - Tra cứu theo Pinyin (có hoặc không số thanh)
  - Tra cứu theo nghĩa tiếng Việt
  - Auto-detect loại tìm kiếm
  - Phân trang kết quả
  - HSK level hiển thị
  - Responsive UI với light/dark mode

---

## 🚀 Các bước Setup

### Bước 1: Download dữ liệu CVDICT

```bash
# Clone hoặc download CVDICT từ GitHub
git clone https://github.com/ph0ngp/CVDICT.git

# Hoặc download trực tiếp file CVDICT.u8
# https://github.com/ph0ngp/CVDICT/raw/master/CVDICT.u8

# Copy file vào thư mục project
cp CVDICT/CVDICT.u8 ./
```

### Bước 2: Tạo bảng dictionary trong Supabase

#### Option A: Qua Supabase Dashboard (khuyến nghị)

1. Mở Supabase Dashboard: https://app.supabase.com
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy toàn bộ nội dung file `DICTIONARY_SCHEMA.sql` và paste vào editor
5. Click **Run** để execute

#### Option B: Qua Supabase CLI

```bash
# Đảm bảo đã cài Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Run migration
supabase db push

# Hoặc execute trực tiếp file SQL
psql <your-database-url> < DICTIONARY_SCHEMA.sql
```

#### Verify bảng đã tạo thành công

```sql
-- Chạy query này trong SQL Editor
SELECT COUNT(*) FROM dictionary_entries;
-- Kết quả: 8 (sample data)

-- Kiểm tra indexes
SELECT tablename, indexname FROM pg_indexes
WHERE tablename = 'dictionary_entries';
```

### Bước 3: Convert và Import dữ liệu CVDICT

#### 3.1. Chạy script convert

```bash
# Chuyển đến thư mục project
cd /path/to/tiengtrunghsk3.0

# Chạy script convert (cần Node.js >= 14)
node scripts/convert-cvdict.js CVDICT.u8 ./dictionary-data

# Output:
# 📁 dictionary-data/
#   ├── dictionary.json          (toàn bộ data dạng JSON)
#   ├── dictionary.csv           (CSV format để import)
#   ├── dictionary-import.sql    (SQL INSERT statements)
#   └── conversion-stats.json    (thống kê conversion)
```

#### 3.2. Import vào Supabase

**Option A: Import CSV qua Dashboard** (dễ nhất, khuyến nghị cho < 50k rows)

1. Vào **Table Editor** → chọn bảng `dictionary_entries`
2. Click **Insert** → **Import data from CSV**
3. Upload file `dictionary-data/dictionary.csv`
4. Map columns: `simplified, traditional, pinyin_number, pinyin_tone, vietnamese, source`
5. Click **Import**

**Option B: Import SQL** (nhanh hơn cho dataset lớn)

```bash
# Method 1: Qua psql
psql <your-database-url> < dictionary-data/dictionary-import.sql

# Method 2: Qua Supabase SQL Editor
# Copy nội dung dictionary-import.sql và paste vào editor
# Click Run (có thể mất vài phút)
```

**Option C: Import qua Supabase CLI**

```bash
supabase db reset
supabase db push
# Sau đó import SQL như Option B
```

#### 3.3. Verify dữ liệu đã import

```sql
-- Kiểm tra tổng số records
SELECT COUNT(*) FROM dictionary_entries;
-- Kết quả: ~120,000+ rows

-- Kiểm tra một số records mẫu
SELECT * FROM dictionary_entries
WHERE simplified = '你好'
LIMIT 5;

-- Kiểm tra distribution theo HSK level (nếu có)
SELECT hsk_level, COUNT(*)
FROM dictionary_entries
WHERE hsk_level IS NOT NULL
GROUP BY hsk_level
ORDER BY hsk_level;

-- Test search function
SELECT * FROM search_dictionary('你好', 'auto', 10, 0);
```

### Bước 4: Deploy Supabase Edge Function

#### 4.1. Setup Supabase CLI (nếu chưa có)

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>
```

#### 4.2. Deploy function

```bash
# Deploy dictionary-lookup function
supabase functions deploy dictionary-lookup

# Verify deployment
supabase functions list

# Test locally trước khi deploy (optional)
supabase start
supabase functions serve dictionary-lookup

# Test với curl
curl -i --location --request GET \
  'http://localhost:54321/functions/v1/dictionary-lookup?q=你好' \
  --header 'Authorization: Bearer <your-anon-key>' \
  --header 'Content-Type: application/json'
```

#### 4.3. Get Edge Function URL

Sau khi deploy thành công, function sẽ có URL:
```
https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup
```

URL này đã được configure sẵn trong `DictionaryPage.tsx` qua env variable:
```typescript
`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dictionary-lookup`
```

### Bước 5: Cấu hình Frontend

Các file cần thiết đã được tạo sẵn:

✅ `src/pages/DictionaryPage.tsx` - Main dictionary page
✅ `src/App.tsx` - Routing đã được thêm
✅ `src/components/Header.tsx` - Navigation link đã được thêm

Không cần thay đổi gì thêm!

### Bước 6: Deploy Frontend

```bash
# Build frontend
npm run build

# Deploy lên Vercel (nếu dùng Vercel)
vercel --prod

# Hoặc deploy lên platform khác theo hướng dẫn của platform
```

---

## 🧪 Testing

### Test Edge Function

```bash
# Test search by Hanzi
curl "https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=你好" \
  -H "Authorization: Bearer <anon-key>"

# Test search by Pinyin
curl "https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=ni3%20hao3&mode=pinyin" \
  -H "Authorization: Bearer <anon-key>"

# Test search by Vietnamese
curl "https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=xin%20chào&mode=vietnamese" \
  -H "Authorization: Bearer <anon-key>"

# Test pagination
curl "https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=学习&page=2&pageSize=20" \
  -H "Authorization: Bearer <anon-key>"
```

### Test Frontend

1. Mở browser: `http://localhost:5173/mandarin/dictionary` (dev) hoặc deployed URL
2. Test các scenarios:
   - ✅ Search với Hán tự: `你好`, `学习`, `中国`
   - ✅ Search với Pinyin: `ni3 hao3`, `xuéxí`, `zhongguo`
   - ✅ Search với tiếng Việt: `xin chào`, `học tập`, `Trung Quốc`
   - ✅ Switch giữa các search modes
   - ✅ Pagination
   - ✅ Click vào entry để xem chi tiết
   - ✅ Light/dark mode toggle

---

## 📊 Performance Optimization (Optional)

### Tối ưu database indexes

```sql
-- Nếu search chậm, có thể tạo thêm GIN index cho full-text search
CREATE INDEX idx_dictionary_vietnamese_gin
ON dictionary_entries
USING gin(to_tsvector('simple', vietnamese));

-- Index cho frequency-based sorting
CREATE INDEX idx_dictionary_frequency
ON dictionary_entries(frequency ASC NULLS LAST);

-- Composite index cho common queries
CREATE INDEX idx_dictionary_common_search
ON dictionary_entries(simplified, pinyin_number, frequency);

-- Analyze để update statistics
ANALYZE dictionary_entries;
```

### Cache với React Query

Frontend đã tích hợp sẵn `@tanstack/react-query` để cache kết quả:
- Cache time: 5 phút (default)
- Stale time: 30 giây
- Auto refetch on window focus: enabled

### Edge Function Caching (Advanced)

Nếu muốn cache response ở edge level, có thể thêm cache headers vào response:

```typescript
// Trong dictionary-lookup/index.ts
return new Response(
  JSON.stringify(response),
  {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300', // Cache 5 phút
    },
  }
)
```

---

## 🐛 Troubleshooting

### Issue: "Function not found"

**Nguyên nhân**: Edge function chưa được deploy

**Giải pháp**:
```bash
supabase functions deploy dictionary-lookup
```

### Issue: "Database query failed"

**Nguyên nhân**: Bảng chưa được tạo hoặc chưa có data

**Giải pháp**:
```sql
-- Kiểm tra bảng có tồn tại không
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_name = 'dictionary_entries'
);

-- Kiểm tra số lượng records
SELECT COUNT(*) FROM dictionary_entries;
```

### Issue: "No results found" cho tất cả queries

**Nguyên nhân**:
1. Data chưa được import
2. RLS policy quá strict
3. Indexes chưa được tạo

**Giải pháp**:
```sql
-- Kiểm tra RLS policies
SELECT * FROM pg_policies WHERE tablename = 'dictionary_entries';

-- Kiểm tra có data không
SELECT * FROM dictionary_entries LIMIT 5;

-- Disable RLS tạm thời để test (KHÔNG làm trên production!)
ALTER TABLE dictionary_entries DISABLE ROW LEVEL SECURITY;
```

### Issue: Search quá chậm

**Giải pháp**:
```sql
-- Rebuild indexes
REINDEX TABLE dictionary_entries;

-- Update statistics
ANALYZE dictionary_entries;

-- Kiểm tra query plan
EXPLAIN ANALYZE
SELECT * FROM search_dictionary('你好', 'hanzi', 30, 0);
```

### Issue: Frontend không connect được Edge Function

**Kiểm tra**:
1. Env variables có đúng không (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
2. CORS có được configure đúng không
3. Network tab trong browser DevTools để xem error chi tiết

---

## 📁 File Structure

```
tiengtrunghsk3.0/
├── DICTIONARY_SCHEMA.sql                     # Database schema migration
├── DICTIONARY_SETUP.md                       # Tài liệu này
├── scripts/
│   └── convert-cvdict.js                     # Script convert CVDICT data
├── supabase/
│   └── functions/
│       └── dictionary-lookup/
│           ├── index.ts                      # Edge function code
│           └── README.md                     # Edge function docs
└── src/
    ├── pages/
    │   └── DictionaryPage.tsx                # Dictionary UI
    ├── components/
    │   └── Header.tsx                        # Navigation (đã thêm link)
    └── App.tsx                               # Routing (đã thêm route)
```

---

## 🔗 Resources

- **CVDICT GitHub**: https://github.com/ph0ngp/CVDICT
- **Supabase Docs**: https://supabase.com/docs
- **Edge Functions Guide**: https://supabase.com/docs/guides/functions
- **React Query**: https://tanstack.com/query/latest

---

## ✅ Checklist Deployment

- [ ] Download CVDICT.u8 file
- [ ] Chạy `DICTIONARY_SCHEMA.sql` trong Supabase
- [ ] Convert data: `node scripts/convert-cvdict.js CVDICT.u8`
- [ ] Import data vào Supabase (CSV hoặc SQL)
- [ ] Deploy edge function: `supabase functions deploy dictionary-lookup`
- [ ] Test edge function với curl
- [ ] Build frontend: `npm run build`
- [ ] Deploy frontend lên Vercel/hosting
- [ ] Test toàn bộ flow trên production
- [ ] (Optional) Setup monitoring & analytics

---

## 🎉 Kết luận

Sau khi hoàn thành các bước trên, bạn sẽ có:

✨ Từ điển Trung–Việt với 120,000+ mục từ
✨ Tra cứu thông minh tự động nhận diện loại query
✨ UI đẹp mắt với Hong Kong retro style
✨ Light/dark mode support
✨ Performance tốt với caching & indexes
✨ Mobile-friendly responsive design

**Truy cập**: `https://your-domain.com/mandarin/dictionary` để sử dụng!

---

_Tài liệu này được tạo tự động cho module Từ điển Trung–Việt_
