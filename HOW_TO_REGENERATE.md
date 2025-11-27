# 🚀 Hướng dẫn Regenerate Bài tập Cantonese

Môi trường Docker hiện tại không hỗ trợ chạy script. Bạn có 2 cách để regenerate:

## ✅ Cách 1: Chạy trên máy Local (Khuyến nghị)

### Bước 1: Clone repo về máy
```bash
git clone https://github.com/truonggthanhh/tiengtrunghsk3.0.git
cd tiengtrunghsk3.0
```

### Bước 2: Pull branch mới nhất
```bash
git checkout claude/fix-pronunciation-selection-01Gx1J9NqRNi5eY96JxSpQyN
git pull
```

### Bước 3: Cài đặt dependencies
```bash
npm install
```

### Bước 4: Tạo file .env
```bash
cat > .env << 'EOF'
VITE_SUPABASE_URL=https://jhjpgdldjunkhdbtopbs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mzk5OTMsImV4cCI6MjA3MTUxNTk5M30.TyNmKmM4rwgDIjngaIPkJKCKne781bcmzT6xF22kMg8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoanBnZGxkanVua2hkYnRvcGJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTkzOTk5MywiZXhwIjoyMDcxNTE1OTkzfQ.6_jKz85Qr2jIQs-g049D1yj_naazaiwV1zx6d98YrjQ
ANTHROPIC_API_KEY=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
EOF
```

### Bước 5: Chạy script
```bash
npx tsx scripts/regenerate-cantonese-exercises.ts
```

**Thời gian chạy:** ~4-5 phút cho 20 bài × 6 dạng bài tập

---

## ✅ Cách 2: Deploy Edge Function

### Bước 1: Cài Supabase CLI
```bash
npm install -g supabase
```

### Bước 2: Login Supabase
```bash
supabase login
```

### Bước 3: Link project
```bash
supabase link --project-ref jhjpgdldjunkhdbtopbs
```

### Bước 4: Set secrets
```bash
supabase secrets set ANTHROPIC_API_KEY=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
```

### Bước 5: Deploy edge function
```bash
supabase functions deploy generate-exercises-v2
```

### Bước 6: Trigger function
Vào Dashboard Cantonese → Chọn bài → Bấm nút "Generate Exercises"

---

## ✅ Cách 3: Manual regenerate qua Dashboard (Tạm thời)

Hiện tại bài tập đã được generate với prompt cũ. Để update:

1. Vào **Supabase Dashboard** > **Table Editor** > **exercises**
2. Xóa các exercises cũ
3. Vào Dashboard Cantonese > Chọn bài > Generate lại

**Lưu ý:** Cách này sẽ dùng edge function cũ. Để dùng prompt mới, cần deploy edge function v2 (Cách 2)

---

## 🎯 Kết quả mong đợi

Sau khi regenerate thành công:

✅ Tất cả bài tập tập trung 100% vào ngôn ngữ
✅ Không còn câu hỏi về nội dung hội thoại
✅ MULTICHOICE chỉ hiển thị jyutping cho chữ Hán

---

## 📞 Support

Nếu gặp vấn đề, liên hệ qua GitHub Issues.
