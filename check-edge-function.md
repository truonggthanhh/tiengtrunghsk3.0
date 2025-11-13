# Checklist để fix lỗi 401

## 1. Kiểm tra Edge Function đã deploy chưa

Vào Supabase Dashboard:
- Project Settings > Edge Functions
- Xem có function "dictionary-lookup" không?
- Nếu chưa có → chưa deploy

## 2. Set public access cho Edge Function

Edge Function cần được set public để không cần authentication:

### Cách 1: Qua Supabase Dashboard
1. Vào Dashboard > Edge Functions > dictionary-lookup
2. Click vào Settings tab
3. Tìm "Invoke Permissions" 
4. Set thành "Public" hoặc "Anon key can invoke"

### Cách 2: Qua CLI (nếu cách 1 không có)
Tạo file `supabase/functions/dictionary-lookup/cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

## 3. Kiểm tra RLS Policy

Chạy query này trong Supabase SQL Editor:

```sql
-- Kiểm tra RLS policies
SELECT * FROM pg_policies WHERE tablename = 'dictionary_entries';

-- Nếu không có policy "Allow public read access to dictionary", chạy lại:
CREATE POLICY "Allow public read access to dictionary"
  ON dictionary_entries FOR SELECT
  TO public
  USING (true);
```

## 4. Test Edge Function trực tiếp

```bash
curl -i "https://piwdypvvskuwbyvgyktn.supabase.co/functions/v1/dictionary-lookup?q=你好&mode=auto" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Nếu vẫn 401, thử không có Authorization header:

```bash
curl -i "https://piwdypvvskuwbyvgyktn.supabase.co/functions/v1/dictionary-lookup?q=你好&mode=auto"
```

## 5. Nếu vẫn lỗi - Redeploy với verify_jwt = false

Tạo file này: `supabase/functions/dictionary-lookup/.edge-runtime.json`

```json
{
  "verify_jwt": false
}
```

Sau đó deploy lại:

```bash
supabase functions deploy dictionary-lookup --project-ref piwdypvvskuwbyvgyktn --no-verify-jwt
```

