# 🚀 Setup Guide - SRS & Analytics Features

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn thiết lập và sử dụng 3 tính năng mới:
1. **SRS (Spaced Repetition System)** - Hệ thống ôn tập ngắt quãng thông minh
2. **Speech Recognition** - Nhận dạng giọng nói và chấm điểm phát âm
3. **Advanced Analytics** - Thống kê và phân tích học tập chi tiết

---

## 🗄️ Bước 1: Chạy Database Migration

### Option 1: Sử dụng Supabase Dashboard (Khuyến nghị)

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **SQL Editor** (icon trong sidebar bên trái)
4. Mở file `/supabase/migrations/20250125_srs_and_analytics.sql`
5. Copy toàn bộ nội dung SQL
6. Paste vào SQL Editor
7. Click **Run** để execute

### Option 2: Sử dụng Supabase CLI

```bash
# Cài Supabase CLI nếu chưa có
npm install -g supabase

# Link với project
supabase link --project-ref YOUR_PROJECT_REF

# Chạy migration
supabase db push
```

### Option 3: Chạy qua Node.js Script

```bash
# Set environment variable
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Chạy script
node run-migrations.js
```

### ✅ Kiểm tra Migration thành công

Sau khi chạy migration, kiểm tra xem các tables đã được tạo:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'vocabulary_reviews',
  'practice_sessions',
  'session_answers',
  'user_learning_stats',
  'pronunciation_practice'
);
```

Nếu thấy 5 tables trên = migration thành công! ✅

---

## 🎤 Bước 2: Test Pronunciation Feature

### Yêu cầu
- **Trình duyệt**: Chrome hoặc Edge (có Web Speech API)
- **Microphone**: Cần cho phép truy cập microphone
- **Ngôn ngữ**: Hệ thống hỗ trợ Mandarin (zh-CN) và Cantonese (zh-HK)

### Test trên Mandarin

1. Vào trang chủ: `/mandarin`
2. Click vào section **"📊 Thống Kê Học Tập"** hoặc vào trực tiếp: `/mandarin/analytics`
3. Hoặc chọn HSK level và click **"Luyện phát âm với AI"**
4. URL sẽ là: `/mandarin/hsk/3/enhanced-pronunciation` (ví dụ HSK 3)

### Test trên Cantonese

1. Vào: `/cantonese`
2. Chọn level và vào pronunciation practice
3. URL: `/cantonese/so-cap/enhanced-pronunciation`

### Cách sử dụng

1. **Click microphone button** 🎤 để bắt đầu ghi âm
2. **Đọc to** từ vựng hiển thị trên màn hình
3. Hệ thống sẽ:
   - Nhận dạng giọng nói
   - Hiển thị text đã nhận dạng
   - Chấm điểm confidence (0-100%)
   - Cho biết đúng/sai với visual feedback
4. **Click speaker button** 🔊 để nghe phát âm chuẩn
5. Tự động chuyển câu sau 2 giây nếu đúng

---

## 📊 Bước 3: Xem Analytics Dashboard

### Truy cập Analytics

**Mandarin:**
```
/mandarin/analytics
```

**Cantonese:**
```
/cantonese/analytics
```

### Các chỉ số Analytics

Dashboard hiển thị:

#### 📈 Overview Stats (4 Cards)
- ⏰ **Tổng thời gian học** - Tổng thời gian + trung bình/buổi
- 📅 **Số buổi học** - Tổng số practice sessions
- 🎯 **Độ chính xác** - Overall accuracy với progress bar
- 🏆 **Từ đã học** - Số từ đã master + tổng câu hỏi

#### 📊 3 Tabs Chi tiết

1. **Tổng quan Tab**
   - 10 buổi học gần nhất
   - Accuracy, date, level cho mỗi buổi
   - Color-coded: xanh (≥80%), vàng (≥60%), đỏ (<60%)

2. **Tiến độ Tab**
   - Biểu đồ 30 ngày gần nhất
   - Accuracy theo thời gian
   - Số buổi học mỗi ngày
   - Tracking progress

3. **Điểm yếu Tab**
   - Top 10 từ cần ôn tập
   - Sorted by accuracy (thấp nhất trước)
   - Hiển thị: hanzi, accuracy %, số lần luyện tập
   - Chỉ hiển thị từ có ≥3 attempts

---

## 🧠 Bước 4: Hiểu SRS Algorithm (SM-2)

### SRS hoạt động như thế nào?

Khi user trả lời một từ:

1. **Tính quality score** (0-5):
   - `0`: Không nhớ gì (complete blackout)
   - `3`: Nhớ nhưng khó khăn
   - `4`: Nhớ sau khi do dự
   - `5`: Nhớ ngay lập tức (perfect)

2. **Update ease factor**:
   ```
   EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
   Minimum EF = 1.3
   ```

3. **Calculate next interval**:
   - Quality < 3: Reset về 1 ngày
   - Lần đầu đúng: 1 ngày
   - Lần thứ 2 đúng: 6 ngày
   - Sau đó: `interval * ease_factor`

### Ví dụ

```
User answer word "你好":
- Response time: 2.5s → quality = 4
- Current interval: 6 days
- Current EF: 2.5
- New EF: 2.6
- New interval: 6 * 2.6 = 15.6 ≈ 16 days
- Next review date: Today + 16 days
```

---

## 🔧 Bước 5: Integration Status

### ✅ Đã tích hợp SRS

- ✅ `PinyinChoicePage` - HSK Pinyin practice
- ⚠️ `MeaningChoicePage` - HSK Meaning practice (Partial)
- ⚠️ `FillInTheBlankPage` - HSK Fill blank practice (Partial)

**Partial** = Đã import hooks nhưng chưa hoàn chỉnh tất cả functions

### 🔲 Chưa tích hợp SRS

Các trang sau chưa có SRS:
- `FlashcardPage`
- `SentenceChoicePage`
- `SentenceScramblePage`
- `HandwritingPage`
- MSUTong practice pages (Cantonese)

### Cách tích hợp SRS vào page mới

Làm theo pattern trong `PinyinChoicePage.tsx`:

```typescript
// 1. Import hooks
import { useSRS } from '@/hooks/useSRS';
import { useAnalytics } from '@/hooks/useAnalytics';

// 2. Initialize hooks
const { updateReview, calculateQuality, getMixedVocabulary } = useSRS();
const { startSession, completeSession, recordAnswer } = useAnalytics();
const [sessionId, setSessionId] = useState<string | null>(null);
const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

// 3. Use getMixedVocabulary khi start
const handleStart = async (count: number) => {
  const mixedVocab = await getMixedVocabulary(
    fullVocabulary,
    'mandarin', // hoặc 'cantonese'
    'hsk3', // hoặc level tương ứng
    count
  );
  setVocabulary(mixedVocab);

  // Start analytics session
  const sid = await startSession('session_type', 'mandarin', 'hsk3', count);
  setSessionId(sid);
};

// 4. Update SRS khi answer
const handleAnswer = async (answer: string) => {
  const responseTime = Date.now() - questionStartTime;
  const isCorrect = checkAnswer(answer);

  // Update SRS
  const quality = calculateQuality(isCorrect, responseTime);
  await updateReview({
    wordId: currentWord.id,
    wordType: 'mandarin',
    level: 'hsk3',
    hanzi: currentWord.hanzi,
    pinyin: currentWord.pinyin,
    isCorrect,
    quality
  });

  // Record for analytics
  if (sessionId) {
    await recordAnswer(sessionId, {...}, 'session_type');
  }
};

// 5. Complete session khi finish
useEffect(() => {
  if (showResult && sessionId) {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    completeSession(sessionId, correctAnswers, duration);
  }
}, [showResult]);
```

---

## 🎯 Navigation Links

### Mandarin Index Page

✅ Đã thêm:
- **Luyện phát âm với AI** - trong exercise types list
- **📊 Thống Kê Học Tập** - prominent section card

### Cantonese Index Page

⚠️ **Cần thêm** - Follow same pattern như Mandarin

---

## 🐛 Troubleshooting

### Migration fails

**Problem**: `relation already exists` error

**Solution**: Tables đã tồn tại. Drop và recreate:
```sql
DROP TABLE IF EXISTS vocabulary_reviews CASCADE;
DROP TABLE IF EXISTS practice_sessions CASCADE;
DROP TABLE IF EXISTS session_answers CASCADE;
DROP TABLE IF EXISTS user_learning_stats CASCADE;
DROP TABLE IF EXISTS pronunciation_practice CASCADE;
-- Then run migration again
```

### Speech Recognition không hoạt động

**Problem**: Microphone access denied

**Solution**:
1. Check browser settings
2. Allow microphone permission cho website
3. Reload page

**Problem**: "Speech recognition not supported"

**Solution**:
- Chỉ Chrome/Edge hỗ trợ Web Speech API
- Safari và Firefox không support

### Analytics không hiển thị data

**Problem**: Dashboard trống

**Solution**:
1. Kiểm tra đã chạy migration chưa
2. Thử làm một buổi practice trước
3. Check browser console cho errors
4. Verify RLS policies trong Supabase

### SRS không lưu progress

**Problem**: Từ không được mark as reviewed

**Solution**:
1. Check authentication (user phải đăng nhập)
2. Verify `updateReview` function được call
3. Check Supabase logs cho errors
4. Verify RLS policies

---

## 📝 Database Schema Reference

### vocabulary_reviews

```sql
id UUID PRIMARY KEY
user_id UUID (references auth.users)
word_id INTEGER
word_type TEXT ('mandarin' | 'cantonese')
level TEXT ('hsk1', 'hsk2', ..., 'so-cap', etc.)
ease_factor DECIMAL (1.3 - 2.5+)
interval_days INTEGER
next_review_date TIMESTAMP
review_count INTEGER
correct_count INTEGER
incorrect_count INTEGER
hanzi TEXT
pinyin TEXT
jyutping TEXT
```

### practice_sessions

```sql
id UUID PRIMARY KEY
user_id UUID
session_type TEXT
language TEXT ('mandarin' | 'cantonese')
level TEXT
total_questions INTEGER
correct_answers INTEGER
accuracy DECIMAL
duration_seconds INTEGER
started_at TIMESTAMP
completed_at TIMESTAMP
metadata JSONB
```

### session_answers

```sql
id UUID PRIMARY KEY
session_id UUID (references practice_sessions)
user_id UUID
word_id INTEGER
hanzi TEXT
pinyin TEXT
jyutping TEXT
correct_answer TEXT
user_answer TEXT
is_correct BOOLEAN
response_time_ms INTEGER
question_type TEXT
```

---

## 🚀 Next Steps

### Recommended Enhancements

1. **Complete SRS Integration**
   - Finish MeaningChoicePage integration
   - Finish FillInTheBlankPage integration
   - Add to remaining practice pages

2. **Add Cantonese Navigation**
   - Clone Mandarin Index analytics section
   - Add enhanced pronunciation link
   - Update Cantonese lessons page

3. **Enhance Analytics**
   - Add more charts (recharts library)
   - Weekly/Monthly comparison
   - Export data functionality
   - Heatmap for daily activity

4. **Improve SRS**
   - Add manual quality adjustment
   - "Hard" / "Easy" / "Again" buttons
   - Custom SRS settings per user
   - Bulk review mode

5. **Speech Recognition Improvements**
   - Better pronunciation scoring
   - Waveform visualization
   - Playback user's recording
   - Tone recognition for Mandarin

---

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console cho errors
2. Check Supabase logs
3. Verify all migrations đã chạy
4. Test với user account khác

---

## ✅ Checklist Hoàn thành

- [x] Database migration file created
- [x] SRS hooks implemented
- [x] Analytics hooks implemented
- [x] Pronunciation component created
- [x] Analytics dashboard created
- [x] Routes added to App.tsx
- [x] Navigation links added (Mandarin)
- [x] PinyinChoicePage integrated with SRS
- [ ] MeaningChoicePage fully integrated
- [ ] FillInTheBlankPage fully integrated
- [ ] Cantonese navigation links added
- [ ] Database migration executed
- [ ] Features tested end-to-end

---

**Happy Learning! 🎉**
