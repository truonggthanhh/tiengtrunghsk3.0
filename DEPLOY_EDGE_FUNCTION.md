# Deploy Dictionary Edge Function

## Vấn đề hiện tại
Bạn đang gặp lỗi **401 Unauthorized** khi tra cứu từ điển vì **Edge Function chưa được deploy lên Supabase**.

## Các bước deploy

### 1. Cài đặt Supabase CLI (nếu chưa có)

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Hoặc dùng npm
npm install -g supabase
```

### 2. Login vào Supabase

```bash
supabase login
```

Một browser window sẽ mở ra để bạn login.

### 3. Deploy Edge Function

```bash
supabase functions deploy dictionary-lookup --project-ref piwdypvvskuwbyvgyktn
```

Thay `piwdypvvskuwbyvgyktn` bằng Project Reference ID của bạn (lấy từ Supabase Dashboard > Project Settings > General).

### 4. Verify deployment

Sau khi deploy xong, test Edge Function:

```bash
curl "https://piwdypvvskuwbyvgyktn.supabase.co/functions/v1/dictionary-lookup?q=你好&mode=auto" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Kiểm tra trên Supabase Dashboard

1. Vào **Supabase Dashboard** > **Edge Functions**
2. Bạn sẽ thấy `dictionary-lookup` function đã được deploy
3. Click vào function để xem logs và test

## Troubleshooting

### Nếu gặp lỗi "Project ref not found"

Chạy lệnh này để link project:

```bash
supabase link --project-ref piwdypvvskuwbyvgyktn
```

### Nếu gặp lỗi về permissions

Đảm bảo bạn đã:
1. Login vào đúng account Supabase
2. Có quyền deploy functions trên project này
3. Project reference ID đúng

### Kiểm tra logs

```bash
supabase functions logs dictionary-lookup --project-ref piwdypvvskuwbyvgyktn
```

## Sau khi deploy xong

1. Refresh trang web dictionary
2. Thử tra cứu từ: "你好", "nihao", hoặc "xin chào"
3. Kiểm tra Console để đảm bảo không còn lỗi 401

## Lưu ý quan trọng

- ✅ Database schema đã được tạo (dictionary_entries table)
- ✅ Database function đã được tạo (search_dictionary)
- ⏳ Edge Function cần được deploy (bước này bạn đang làm)
- ⏳ Data cần được import (120k+ entries từ CVDICT.u8)

Sau khi deploy Edge Function xong, hãy chạy script convert và import data theo hướng dẫn trong `DICTIONARY_SETUP.md`.
