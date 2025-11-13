# Dictionary Lookup Edge Function

Supabase Edge Function để tra cứu từ điển Trung-Việt.

## 🚀 Deployment

### 1. Deploy edge function

```bash
# Make sure you're logged in to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Deploy the function
supabase functions deploy dictionary-lookup
```

### 2. Set environment variables (if needed)

Edge function tự động có access đến:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 📖 API Usage

### Endpoint

```
GET https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | ✅ Yes | - | Search query (Hán tự, pinyin, hoặc tiếng Việt) |
| `mode` | string | No | `auto` | Search mode: `auto`, `hanzi`, `pinyin`, `vietnamese` |
| `page` | number | No | `1` | Page number (starts from 1) |
| `pageSize` | number | No | `30` | Results per page (max 100) |

### Examples

#### 1. Auto-detect search (Hán tự)

```bash
curl -i --location --request GET \
  'https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=你好' \
  --header 'Authorization: Bearer <your-anon-key>' \
  --header 'Content-Type: application/json'
```

#### 2. Search by pinyin

```bash
curl -i --location --request GET \
  'https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=ni3%20hao3&mode=pinyin' \
  --header 'Authorization: Bearer <your-anon-key>'
```

#### 3. Search by Vietnamese

```bash
curl -i --location --request GET \
  'https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=xin%20chào&mode=vietnamese' \
  --header 'Authorization: Bearer <your-anon-key>'
```

#### 4. Pagination

```bash
curl -i --location --request GET \
  'https://<your-project-ref>.supabase.co/functions/v1/dictionary-lookup?q=学习&page=2&pageSize=20' \
  --header 'Authorization: Bearer <your-anon-key>'
```

### Response Format

```json
{
  "query": "你好",
  "mode": "hanzi",
  "data": [
    {
      "id": 1,
      "simplified": "你好",
      "traditional": "你好",
      "pinyin_number": "ni3 hao3",
      "pinyin_tone": "nǐ hǎo",
      "vietnamese": "xin chào; chào",
      "hsk_level": 1,
      "frequency": 1,
      "relevance": 1.0
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 30,
    "total": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## 🧪 Testing Locally

### 1. Start Supabase local development

```bash
supabase start
```

### 2. Serve function locally

```bash
supabase functions serve dictionary-lookup
```

### 3. Test with curl

```bash
curl -i --location --request GET \
  'http://localhost:54321/functions/v1/dictionary-lookup?q=你好' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  --header 'Content-Type: application/json'
```

## 🔍 Search Modes

### Auto Mode (default)

Function tự động detect loại search dựa vào query:

- **Hán tự**: Nếu query chứa ký tự Chinese (CJK: `\u4e00-\u9fff`)
- **Pinyin**: Nếu query chứa số tone (1-5) hoặc chỉ có chữ latin
- **Vietnamese**: Nếu query chứa dấu tiếng Việt hoặc mixed content

### Manual Modes

- `mode=hanzi`: Tìm kiếm theo Hán tự (giản thể hoặc phồn thể)
- `mode=pinyin`: Tìm kiếm theo pinyin (có hoặc không có tone marks)
- `mode=vietnamese`: Tìm kiếm theo nghĩa tiếng Việt

## 🎯 Search Algorithm

### Hanzi Search
- Exact match → relevance = 1.0
- Starts with query → relevance = 0.8
- Contains query → relevance = 0.6

### Pinyin Search
- Exact match → relevance = 1.0
- Starts with query → relevance = 0.8
- Contains query → relevance = 0.6

### Vietnamese Search
- Full-text search using PostgreSQL `ts_rank`
- ILIKE fallback for partial matches

Kết quả được sort theo:
1. Relevance (cao → thấp)
2. Frequency (thấp → cao, nghĩa là từ phổ biến hơn)

## 🔐 Security

- CORS được enable cho tất cả origins (`*`)
- Function sử dụng RLS policies của bảng `dictionary_entries`
- Chỉ cho phép SELECT operations (read-only)

## 📝 Notes

- Max pageSize: 100 (để tránh overload)
- Default pageSize: 30
- Function uses Deno runtime
- Compatible with Supabase CLI v1.x
