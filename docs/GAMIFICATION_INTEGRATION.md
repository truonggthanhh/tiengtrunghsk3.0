# Gamification Integration Guide

## Quick Start - Integrate vào Quiz Pages

### Bước 1: Wrap page với GamificationWrapper

```tsx
import { GamificationWrapper } from '@/components/gamification/GamificationWrapper';

function QuizPage() {
  return (
    <GamificationWrapper>
      {/* Your quiz content */}
    </GamificationWrapper>
  );
}
```

### Bước 2: Sử dụng useGamificationTracking hook

```tsx
import { useGamificationTracking } from '@/components/gamification/GamificationWrapper';

function QuizPage() {
  const { trackQuizCompletion } = useGamificationTracking();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [showResult, setShowResult] = useState(false);

  // Khi quiz kết thúc
  useEffect(() => {
    if (showResult) {
      trackQuizCompletion(correctAnswers, totalQuestions, {
        quiz_type: 'pinyin_choice',
        level: level,
      });
    }
  }, [showResult]);

  return (
    <GamificationWrapper>
      {/* Quiz content */}
    </GamificationWrapper>
  );
}
```

### Bước 3: DONE!

System sẽ tự động:
- ✅ Hiển thị +XP animation
- ✅ Show level up modal nếu lên cấp
- ✅ Show badge unlock notification nếu mở khóa huy hiệu
- ✅ Update user progress trong database

---

## Integration cho các loại khác nhau

### Quiz Completion (Pinyin Choice, Meaning Choice, etc.)

```tsx
const { trackQuizCompletion } = useGamificationTracking();

// When quiz ends
useEffect(() => {
  if (showResult && totalQuestions > 0) {
    trackQuizCompletion(correctAnswers, totalQuestions, {
      quiz_type: 'pinyin_choice', // hoặc 'meaning_choice', 'fill_blank', etc.
      level: currentLevel,
      difficulty: 'easy', // optional
    });
  }
}, [showResult, correctAnswers, totalQuestions]);
```

### Lesson Completion

```tsx
const { trackLessonCompletion } = useGamificationTracking();

// When lesson finishes
const handleLessonComplete = async () => {
  await trackLessonCompletion({
    lesson_id: lessonId,
    lesson_title: lessonTitle,
    time_spent: timeInSeconds,
  });
};
```

### Pronunciation Practice

```tsx
const { trackPronunciationPractice } = useGamificationTracking();

// After pronunciation attempt
const handlePronunciationAttempt = async (score: number) => {
  await trackPronunciationPractice({
    word: currentWord,
    score: score,
    attempts: attemptCount,
  });
};
```

---

## Example: Integrate vào PinyinChoicePage

```tsx
// /src/pages/PinyinChoicePage.tsx

import { GamificationWrapper, useGamificationTracking } from '@/components/gamification/GamificationWrapper';

const PinyinChoicePage = () => {
  const { level } = useParams<{ level: string }>();
  const { trackQuizCompletion } = useGamificationTracking();

  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);

  // Track quiz completion when result is shown
  useEffect(() => {
    if (showResult && vocabulary.length > 0) {
      trackQuizCompletion(correctAnswers, vocabulary.length, {
        quiz_type: 'pinyin_choice',
        level: level || '1',
      });
    }
  }, [showResult, correctAnswers, vocabulary.length, level, trackQuizCompletion]);

  return (
    <GamificationWrapper>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Header />
        {/* Rest of your quiz UI */}
      </div>
    </GamificationWrapper>
  );
};

export default PinyinChoicePage;
```

---

## Components Available

### 1. XPGainAnimation
Floating +XP animation (tự động show)

### 2. LevelUpModal
Modal celebration khi lên level (tự động show)

### 3. BadgeUnlockNotification
Toast notification khi unlock badge (tự động show)

### 4. GamificationWrapper
Wrapper component tích hợp tất cả animations

---

## Manual Integration (Advanced)

Nếu không muốn dùng GamificationWrapper:

```tsx
import { useGamificationIntegration } from '@/hooks/useGamificationIntegration';
import { XPGainAnimation } from '@/components/gamification/XPGainAnimation';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';

function MyPage() {
  const {
    trackQuizCompletion,
    showXPAnimation,
    xpEarned,
    showLevelUpModal,
    levelUpData,
    clearXPAnimation,
    clearLevelUpModal,
  } = useGamificationIntegration();

  // Manual tracking
  const handleQuizComplete = async () => {
    await trackQuizCompletion(score, total);
  };

  return (
    <>
      {/* Your content */}

      {showXPAnimation && (
        <XPGainAnimation xp={xpEarned} onComplete={clearXPAnimation} />
      )}

      {showLevelUpModal && levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.level}
          onClose={clearLevelUpModal}
        />
      )}
    </>
  );
}
```

---

## Display User Progress

```tsx
import { useGamification } from '@/components/gamification/GamificationProvider';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';

function ProfilePage() {
  const { userProgress, dashboard } = useGamification();

  return (
    <div>
      {userProgress && (
        <>
          <p>Level: {userProgress.current_level}</p>
          <p>XP: {userProgress.total_xp}</p>
          <p>Streak: {userProgress.current_streak} days</p>

          <XPProgressBar />
        </>
      )}
    </div>
  );
}
```

---

## Notes

- ✅ Gamification tracking is **non-blocking** - won't affect user experience if API fails
- ✅ All tracking is **asynchronous** - doesn't slow down UI
- ✅ Animations are **automatic** when using GamificationWrapper
- ✅ Works for both **Mandarin** and **Cantonese** pages
- ✅ User must be **logged in** for tracking to work

---

## Pages to Integrate (Priority Order)

### High Priority:
1. ✅ PinyinChoicePage
2. ✅ MeaningChoicePage
3. ✅ SentenceChoicePage
4. ✅ FillInTheBlankPage
5. ✅ FlashcardPage

### Medium Priority:
6. ✅ PronunciationPage
7. ✅ LessonDetail pages (Cantonese/Mandarin)

### Low Priority (Optional):
8. HandwritingPage
9. ReadingComprehensionPage

---

## API Reference

### trackQuizCompletion(score, total, metadata?)
- **score**: Number of correct answers
- **total**: Total number of questions
- **metadata**: Optional additional data (quiz_type, level, etc.)

### trackLessonCompletion(metadata?)
- **metadata**: Optional lesson data (lesson_id, title, time_spent, etc.)

### trackPronunciationPractice(metadata?)
- **metadata**: Optional pronunciation data (word, score, attempts, etc.)

---

## Testing

```tsx
// Test in browser console:
fetch('/api/gamification/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    event_type: 'quiz_complete',
    metadata: { score: 10, total: 10 }
  })
}).then(r => r.json()).then(console.log);
```
