# Cantonese Exercise Regeneration Script

Script này được tạo để regenerate lại các bài tập tiếng Quảng Đông với focus 100% vào kiểm tra ngôn ngữ, thay vì hỏi về nội dung hội thoại.

## Thay đổi chính

### ❌ CŨ (Hỏi về nội dung):
- "Trong hội thoại, người phụ nữ đi đâu?"
- "Ai đã mua hoa quả?"
- "Câu chuyện nói về điều gì?"

### ✅ MỚI (Kiểm tra ngôn ngữ):
- "Chọn từ đúng: 我___去市場 (A. 想 B. 吃 C. 睡 D. 跑)"
- "Từ '早晨' có nghĩa là gì?"
- "Jyutping của '你好' là gì?"

## Cài đặt

```bash
# Install dependencies
npm install @supabase/supabase-js @anthropic-ai/sdk
```

## Cấu hình

Tạo file `.env` với các biến sau:

```env
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Chạy script

```bash
# Compile TypeScript
npx tsx scripts/regenerate-cantonese-exercises.ts

# Hoặc compile trước
npx tsc scripts/regenerate-cantonese-exercises.ts
node scripts/regenerate-cantonese-exercises.js
```

## Cách hoạt động

1. Lấy 20 bài học mới nhất từ database
2. Cho mỗi bài học, regenerate 6 dạng bài tập:
   - FLASHCARD (Thẻ ghi nhớ)
   - FILL_BLANK (Điền từ)
   - MULTICHOICE (Trắc nghiệm)
   - TRUE_FALSE (Đúng/Sai)
   - REORDER (Sắp xếp từ)
   - HANZI_WRITE (Luyện viết)

3. Sử dụng Claude 3.5 Sonnet với prompt mới tập trung ngôn ngữ
4. Upsert vào bảng `exercises` (ghi đè bài tập cũ)

## Lưu ý

- Script có delay 2 giây giữa mỗi request để tránh rate limit
- Tổng thời gian chạy: ~4 phút cho 20 bài (20 bài × 6 dạng × 2s = 240s)
- Cần có service role key để có thể upsert exercises

## Kiểm tra kết quả

Sau khi chạy xong, vào Dashboard và check lại các bài tập đã được regenerate.
