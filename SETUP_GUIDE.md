# 🚀 Hướng dẫn Regenerate Bài tập Cantonese

## Bước 1: Cài đặt Dependencies ✅ (Đã xong)

```bash
npm install --save-dev tsx @anthropic-ai/sdk
```

## Bước 2: Cấu hình API Keys ⚠️ (CẦN LÀM)

File `.env` đã được tạo. Bạn cần cập nhật các giá trị sau:

### 2.1. Lấy Supabase Keys

1. Mở [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Settings** > **API**
4. Copy các giá trị:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** (Bấm "Reveal" để xem) → `SUPABASE_SERVICE_ROLE_KEY`

### 2.2. Lấy Anthropic API Key

1. Truy cập [console.anthropic.com](https://console.anthropic.com)
2. Đăng nhập
3. Vào **API Keys**
4. Tạo key mới hoặc copy key có sẵn → `ANTHROPIC_API_KEY`

### 2.3. Cập nhật file .env

Mở file `.env` và thay thế các giá trị:

```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-...
```

## Bước 3: Chạy Script

Sau khi đã cập nhật file `.env`, chạy lệnh:

```bash
npx tsx scripts/regenerate-cantonese-exercises.ts
```

## Bước 4: Kiểm tra Kết quả

Script sẽ:
- Lấy 20 bài học mới nhất
- Generate 6 dạng bài tập cho mỗi bài
- Tổng thời gian: ~4-5 phút
- Kết quả sẽ được lưu vào database

Sau khi chạy xong, vào Dashboard Cantonese và kiểm tra các bài tập đã được regenerate.

## ❗ Nếu Gặp Lỗi

### Lỗi: "Cannot find module"
```bash
npm install
```

### Lỗi: "Unauthorized" hoặc "Invalid API Key"
- Kiểm tra lại các API keys trong file `.env`
- Đảm bảo không có khoảng trắng thừa
- Service role key phải có quyền insert/update vào bảng `exercises`

### Lỗi: "Rate limit exceeded"
- Anthropic API có giới hạn request
- Script đã có delay 2s giữa mỗi request
- Nếu vẫn gặp lỗi, tăng delay trong script

## 🎯 Kết quả Mong đợi

Sau khi chạy thành công, tất cả bài tập sẽ:
✅ Tập trung 100% vào ngôn ngữ (từ vựng, ngữ pháp, phiên âm)
✅ Không còn câu hỏi về nội dung hội thoại
✅ Câu hỏi trắc nghiệm chỉ hiển thị jyutping cho chữ Hán

## 📞 Cần Hỗ trợ?

Nếu bạn không có API keys hoặc cần hỗ trợ, hãy:
1. Liên hệ admin để lấy keys
2. Hoặc sử dụng edge function (cần deploy lên Supabase)
