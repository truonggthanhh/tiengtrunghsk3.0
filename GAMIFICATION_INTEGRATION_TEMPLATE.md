# 🎮 GAMIFICATION INTEGRATION TEMPLATE

Copy template này và điều chỉnh cho từng page.

## Template Code

```typescript
// ============================================================================
// IMPORT SECTION - Add this at the top
// ============================================================================

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
// ... other imports ...
import { usePinyin } from '@/contexts/PinyinContext';

// ⭐ ADD THIS LINE
import { GamificationWrapper, useGamificationTracking } from '@/components/gamification/GamificationWrapper';

// ============================================================================
// COMPONENT - Add hook after const { showPinyin } = usePinyin();
// ============================================================================

const YourQuizPage = () => {
  const { level } = useParams<{ level: string }>();
  const fullVocabulary = useMemo(() => getVocabularyByLevel(level || '1'), [level]);
  const { showPinyin } = usePinyin();

  // ⭐ ADD THESE LINES
  // Gamification tracking
  const { trackQuizCompletion } = useGamificationTracking();

  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // ... other states and functions ...

  // ============================================================================
  // useEffect - Add after other useEffects
  // ============================================================================

  // Existing useEffects...
  useEffect(() => {
    // ... existing code ...
  }, [/* deps */]);

  // ⭐ ADD THIS useEffect
  // Track quiz completion when showing results
  useEffect(() => {
    if (showResult && vocabulary.length > 0) {
      trackQuizCompletion(correctAnswers, vocabulary.length, {
        quiz_type: 'CHANGE_THIS_VALUE',  // ◄── IMPORTANT: Change for each page!
        level: level,
        question_count: questionCount,
      });
    }
  }, [showResult, correctAnswers, vocabulary.length, questionCount, level, trackQuizCompletion]);

  // ============================================================================
  // RETURN - Wrap with GamificationWrapper
  // ============================================================================

  // Keep all if/else statements BEFORE main return as-is
  if (fullVocabulary.length === 0) {
    return (
      <div>No vocabulary found...</div>
    );
  }

  if (!questionCount) {
    return (
      <div>Select question count...</div>
    );
  }

  if (showResult) {
    return (
      <div>Show results...</div>
    );
  }

  // ⭐ MAIN RETURN - Wrap this with GamificationWrapper
  return (
    <GamificationWrapper>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
          {/* Your existing quiz content - DON'T CHANGE ANYTHING HERE */}
        </main>
      </div>
    </GamificationWrapper>
  );
};

export default YourQuizPage;
```

## quiz_type Values for Each Page

```typescript
const QUIZ_TYPES = {
  'PinyinChoicePage.tsx': 'pinyin_choice',
  'MeaningChoicePage.tsx': 'meaning_choice',
  'SentenceChoicePage.tsx': 'sentence_choice',
  'FillInTheBlankPage.tsx': 'fill_blank',
  'SentenceScramblePage.tsx': 'sentence_scramble',
  'FlashcardPage.tsx': 'flashcard_review',
  'PronunciationPage.tsx': 'pronunciation_practice',
  'HandwritingPage.tsx': 'handwriting_practice',
};
```

## Step-by-Step Checklist

### For Each Quiz Page:

- [ ] Open the quiz page file
- [ ] Add import at the top (after usePinyin import)
- [ ] Add hook after `const { showPinyin } = usePinyin();`
- [ ] Add tracking useEffect after other useEffects
- [ ] Change `quiz_type` to match the page (see table above)
- [ ] Wrap main return statement with `<GamificationWrapper>`
- [ ] Save file
- [ ] Run `pnpm run build` to check for errors
- [ ] Test in browser
- [ ] Check animations work
- [ ] Commit changes

## Testing Checklist

After integration:

- [ ] Login to the app
- [ ] Navigate to the quiz page
- [ ] Complete a quiz
- [ ] See "+XP" animation ✨
- [ ] Check console for errors
- [ ] Test in both light & dark mode
- [ ] Test on mobile device

## Troubleshooting

### No animations showing?

1. Check console for errors (F12 → Console tab)
2. Verify user is logged in (check Header shows "Đăng xuất")
3. Add `console.log` in useEffect to verify it runs
4. Check GamificationWrapper is wrapping the return
5. Verify `trackQuizCompletion` is called (add console.log)

### Error: "useGamificationTracking must be used within GamificationWrapper"

- Make sure the hook is inside the component
- Make sure component return is wrapped with `<GamificationWrapper>`

### Error: "Cannot find module..."

- Check import path is correct
- Try relative path: `'../components/gamification/GamificationWrapper'`

## Complete Example: MeaningChoicePage

See `src/pages/PinyinChoicePage.tsx` for a working example.

The pattern is identical, just change `quiz_type` from `'pinyin_choice'` to `'meaning_choice'`.
