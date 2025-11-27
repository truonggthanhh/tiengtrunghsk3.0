# 🚀 Cách Chạy Script Regenerate Bài Tập (ĐƠN GIẢN NHẤT)

## ⚠️  Tại sao không chạy được trong Docker?

Môi trường Docker có giới hạn mạng nghiêm ngặt:
- ✅ Curl: Hoạt động
- ❌ Node.js fetch: Bị chặn DNS (`EAI_AGAIN`)

Do đó, script PHẢI chạy trên máy local hoặc GitHub Actions.

---

## 🎯 CÁCH 1: Chạy Trên Máy Local (KHUYẾN NGHỊ - 5 PHÚT)

### Bước 1: Mở Terminal (CMD/PowerShell/Terminal)

### Bước 2: Clone repo (nếu chưa có)
```bash
git clone https://github.com/truonggthanhh/tiengtrunghsk3.0.git
cd tiengtrunghsk3.0
```

### Bước 3: Pull code mới nhất
```bash
git checkout claude/fix-pronunciation-selection-01Gx1J9NqRNi5eY96JxSpQyN
git pull
```

### Bước 4: Cài đặt dependencies
```bash
npm install
```

### Bước 5: Tạo file .env
**Trên Windows (PowerShell):**
```powershell
@"
VITE_SUPABASE_URL=https://jhjpgdldjunkhdbtopbs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mzk5OTMsImV4cCI6MjA3MTUxNTk5M30.TyNmKmM4rwgDIjngaIPkJKCKne781bcmzT6xF22kMg8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTkzOTk5MywiZXhwIjoyMDcxNTE1OTkzfQ.6_jKz85Qr2jIQs-g049D1yj_naazaiwV1zx6d98YrjQ
ANTHROPIC_API_KEY=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
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Trên Mac/Linux (Terminal):**
```bash
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://jhjpgdldjunkhdbtopbs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mzk5OTMsImV4cCI6MjA3MTUxNTk5M30.TyNmKmM4rwgDIjngaIPkJKCKne781bcmzT6xF22kMg8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTkzOTk5MywiZXhwIjoyMDcxNTE1OTkzfQ.6_jKz85Qr2jIQs-g049D1yj_naazaiwV1zx6d98YrjQ
ANTHROPIC_API_KEY=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
EOF
```

### Bước 6: Chạy script

**Script chính (dùng native fetch - ổn định hơn):**
```bash
npx tsx scripts/regenerate-cantonese-exercises-direct.ts
```

**Hoặc script cũ (dùng Supabase client):**
```bash
npx tsx scripts/regenerate-cantonese-exercises.ts
```

### Bước 7: Chờ đợi

Script sẽ chạy khoảng **4-5 phút**:
- 20 bài học
- 6 dạng bài tập/bài
- Delay 2 giây giữa mỗi request
- **Tổng: ~240 giây = 4 phút**

Bạn sẽ thấy output như:

```
✅ Loaded .env file
🚀 Starting Cantonese Exercise Regeneration

Focus: 100% Language Testing (No Content Questions)

📚 Fetching lessons...
✅ Found 20 lessons

📝 Processing: Bài 1 - Gặp gỡ
   ⏳ Generating FLASHCARD...
   ✅ FLASHCARD saved
   ⏳ Generating FILL_BLANK...
   ✅ FILL_BLANK saved
   ...
```

### Bước 8: Xong!

Khi thấy:
```
🎉 Regeneration Complete!
   Total processed: 120
   Successful: 120
   Failed: 0
```

Nghĩa là đã xong! Vào Dashboard Cantonese để kiểm tra bài tập mới.

---

## 🔒 Bảo mật sau khi chạy xong

```bash
# Xóa file .env (chứa API keys)
rm .env

# Hoặc trên Windows:
del .env
```

**QUAN TRỌNG:** Không commit file `.env` lên GitHub!

---

## 🐛 Xử lý lỗi

### Lỗi "No such file or directory"
Bạn chưa ở đúng thư mục. Chạy:
```bash
cd tiengtrunghsk3.0
```

### Lỗi "tsx: command not found"
Dependencies chưa được cài. Chạy:
```bash
npm install
```

### Lỗi "fetch failed" hoặc "EAI_AGAIN"
Máy bạn không kết nối được mạng. Kiểm tra:
1. Kết nối internet
2. Firewall/Proxy settings

### Lỗi Anthropic API
API key hết hạn hoặc hết credit. Check tại: https://console.anthropic.com/

---

## 🎯 CÁCH 2: Deploy Supabase Edge Function

### Bước 1: Cài Supabase CLI
```bash
npm install -g supabase
```

### Bước 2: Login
```bash
supabase login
```

### Bước 3: Link project
```bash
supabase link --project-ref jhjpgdldjunkhdbtopbs
```

### Bước 4: Set API key secret
```bash
supabase secrets set ANTHROPIC_API_KEY=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
```

### Bước 5: Deploy edge function
```bash
supabase functions deploy generate-exercises-v2
```

### Bước 6: Trigger từ Dashboard
Vào Dashboard Cantonese → Chọn bài → Bấm "Generate Exercises"

---

## 📞 Cần hỗ trợ?

1. Check log output để xem lỗi cụ thể
2. Đảm bảo đã cài Node.js >= 18
3. Đảm bảo có kết nối internet ổn định

---

## ✅ Kết quả mong đợi

Sau khi regenerate thành công, tất cả bài tập sẽ:

✅ Tập trung 100% vào kiểm tra NGÔN NGỮ
✅ Không còn câu hỏi về nội dung hội thoại
✅ MULTICHOICE chỉ hiển thị jyutping cho chữ Hán

Câu hỏi mẫu:
- ✅ "Chọn từ đúng: 我___去市場 (A. 想 B. 吃 C. 睡 D. 跑)"
- ✅ "Từ '早晨' có nghĩa là gì?"
- ✅ "Jyutping của '你好' là gì?"

Không còn:
- ❌ "Trong hội thoại, người phụ nữ đi đâu?"
- ❌ "Ai đã mua hoa quả?"
