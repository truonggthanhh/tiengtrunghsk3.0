# 🎮 Hướng Dẫn Phát Triển Tính Năng Gamification

## 📚 Tổng Quan

Hệ thống gamification của nền tảng học tiếng Trung (Mandarin & Cantonese) bao gồm 8 hệ thống chính:

1. **XP/Level/Badge System** - Điểm kinh nghiệm, cấp độ và huy hiệu
2. **Card Collection System** - Thu thập thẻ bài (vocabulary, character, phrase, NPC)
3. **Missions System** - Nhiệm vụ hàng ngày, tuần, newbie, đặc biệt
4. **Boss Battle System** - Chiến đấu với boss để kiểm tra kiến thức
5. **Story Mode/Chapters** - Chế độ câu chuyện theo chương
6. **Lucky Wheel System** - Vòng quay may mắn
7. **Pronunciation Scoring** - Đánh giá phát âm
8. **Game Items & Inventory** - Vật phẩm và túi đồ

---

## 🏗️ Kiến Trúc Hệ Thống

### 📁 Cấu Trúc Thư Mục

```
src/
├── types/
│   └── gamification.ts           # Định nghĩa types cho toàn bộ hệ thống
│
├── lib/gamification/
│   ├── xpRules.ts                # Quy tắc tính XP
│   ├── cardSystem.ts             # Logic hệ thống thẻ bài
│   └── eventHandler.ts           # Client-side event handlers
│
├── components/gamification/
│   ├── GamificationProvider.tsx  # Context provider cho gamification
│   ├── GamificationWrapper.tsx   # Wrapper component
│   ├── XPProgressBar.tsx         # Thanh tiến trình XP
│   ├── XPGainAnimation.tsx       # Animation nhận XP
│   ├── StreakTracker.tsx         # Theo dõi chuỗi ngày học
│   ├── LevelUpModal.tsx          # Modal lên cấp
│   ├── BadgeShowcase.tsx         # Hiển thị huy hiệu
│   ├── BadgeUnlockNotification.tsx # Thông báo mở khóa huy hiệu
│   └── MissionCards.tsx          # Hiển thị nhiệm vụ
│
└── pages/api/gamification/
    ├── event.ts                  # Ghi nhận learning events
    ├── progress.ts               # Lấy tiến độ user
    ├── dashboard.ts              # Dashboard data
    ├── badges/
    │   ├── index.ts
    │   └── my.ts
    ├── cards/
    │   ├── open-pack.ts
    │   └── my-collection.ts
    ├── missions/
    │   └── my-progress.ts
    ├── boss/
    │   ├── start.ts
    │   └── answer.ts
    ├── story/
    │   ├── chapters.ts
    │   └── my-progress.ts
    └── wheel/
        ├── spin.ts
        └── available-spins.ts
```

---

## 🎯 1. XP/Level/Badge System

### Cách Hoạt Động

Khi user hoàn thành một hành động (quiz, lesson, pronunciation...), bạn gọi API để ghi nhận event:

```typescript
import { recordLearningEvent } from '@/lib/gamification/eventHandler';

// Ví dụ: User hoàn thành quiz
const response = await recordLearningEvent({
  event_type: 'quiz_complete',
  source_id: 'lesson_123',
  metadata: {
    score: 95,
    time_taken: 120,
    questions_count: 10
  }
});

// Response trả về:
// {
//   xp_earned: 50,
//   total_xp: 1250,
//   level_before: 5,
//   level_after: 6,
//   level_up: true,
//   badges_unlocked: [...],
//   missions_updated: ['daily_quiz_master']
// }
```

### Event Types Có Sẵn

```typescript
type XPEventType =
  | 'quiz_complete'           // Hoàn thành quiz
  | 'lesson_complete'         // Hoàn thành bài học
  | 'pronunciation_practice'  // Luyện phát âm
  | 'boss_win'               // Chiến thắng boss
  | 'mission_complete'        // Hoàn thành nhiệm vụ
  | 'daily_login'            // Đăng nhập hàng ngày
  | 'streak_milestone'        // Milestone chuỗi ngày
  | 'card_collected'         // Thu thập thẻ
  | 'vocabulary_mastered';    // Thành thạo từ vựng
```

### Thêm Event Type Mới

1. **Cập nhật type definition** trong `src/types/gamification.ts`:
```typescript
export type XPEventType =
  | 'quiz_complete'
  | 'your_new_event_type'; // Thêm ở đây
```

2. **Định nghĩa quy tắc XP** trong `src/lib/gamification/xpRules.ts`:
```typescript
export const XP_RULES = {
  quiz_complete: { base: 50, multiplier: 1.0 },
  your_new_event_type: { base: 30, multiplier: 1.2 }, // Thêm ở đây
};
```

3. **Backend sẽ tự động xử lý** dựa trên rules đã định nghĩa

### Tích Hợp Vào Component

```typescript
import { recordLearningEvent } from '@/lib/gamification/eventHandler';
import { useGamification } from '@/components/gamification/GamificationProvider';

function YourExercisePage() {
  const { refreshProgress } = useGamification();

  const handleComplete = async () => {
    // Logic hoàn thành bài tập của bạn

    // Ghi nhận event
    const result = await recordLearningEvent({
      event_type: 'quiz_complete',
      source_id: lessonId,
      metadata: { score, time_taken }
    });

    // Refresh gamification data
    await refreshProgress();

    // Hiển thị animation/notification
    if (result.level_up) {
      showLevelUpModal();
    }

    if (result.xp_earned > 0) {
      showXPGainAnimation(result.xp_earned);
    }
  };

  return (
    <div>
      {/* UI của bạn */}
      <XPProgressBar />
      <XPGainAnimation />
    </div>
  );
}
```

---

## 🃏 2. Card Collection System

### Concept

User thu thập thẻ bài khi:
- Hoàn thành quiz
- Chiến thắng boss
- Đăng nhập hàng ngày
- Quay vòng may mắn
- Hoàn thành nhiệm vụ
- Lên cấp

### Card Types

```typescript
type CardType = 'vocabulary' | 'character' | 'phrase' | 'npc';
type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';
```

### Mở Card Pack

```typescript
import { openCardPack } from '@/lib/gamification/eventHandler';

const result = await openCardPack('quiz_reward', 3); // Mở 3 thẻ
// {
//   cards: [Card, Card, Card],
//   total_cards_collected: 125,
//   new_cards: 2
// }
```

### Xem Collection

```typescript
import { getMyCardCollection } from '@/lib/gamification/eventHandler';

const collection = await getMyCardCollection();
```

### Thêm Card Mới Vào Database

Card được quản lý ở backend. Để thêm card mới, bạn cần:

1. Thêm vào bảng `cards` trong Supabase
2. Card sẽ tự động được phân phối khi user mở pack

Example seed data:
```sql
INSERT INTO cards (card_type, rarity, language, chinese_text, pronunciation, meaning_vi, power_level)
VALUES
  ('vocabulary', 'rare', 'mandarin', '学习', 'xuéxí', 'học tập', 50),
  ('character', 'epic', 'mandarin', '龍', 'lóng', 'rồng', 85);
```

---

## 🎯 3. Missions System

### Mission Types

```typescript
type MissionType = 'daily' | 'weekly' | 'newbie' | 'special';
```

### Mission Conditions

```typescript
type MissionConditionConfig =
  | { type: 'complete_lessons'; count: number; lesson_ids?: string[] }
  | { type: 'quiz_count'; count: number; min_score?: number }
  | { type: 'pronunciation_score'; count: number; min_score: number }
  | { type: 'boss_wins'; count: number; boss_ids?: string[] }
  | { type: 'cards_collect'; count: number; rarity?: CardRarity }
  | { type: 'streak_maintain'; days: number }
  | { type: 'vocabulary_practice'; count: number; language?: Language }
  | { type: 'listening_time'; minutes: number };
```

### Lấy Missions Của User

```typescript
import { getMyMissions } from '@/lib/gamification/eventHandler';

const missions = await getMyMissions();
// {
//   daily: UserMission[],
//   weekly: UserMission[],
//   newbie: UserMission[]
// }
```

### Hiển thị Missions

```typescript
import MissionCards from '@/components/gamification/MissionCards';

function Dashboard() {
  return (
    <div>
      <h2>Nhiệm vụ hàng ngày</h2>
      <MissionCards missions={dailyMissions} />
    </div>
  );
}
```

### Tự Động Cập Nhật Progress

Mission progress được tự động cập nhật khi bạn gọi `recordLearningEvent()`. Backend sẽ kiểm tra các missions liên quan và update progress.

---

## ⚔️ 4. Boss Battle System

### Flow

1. **Start Battle**: User chọn boss và bắt đầu battle
2. **Answer Questions**: User trả lời từng câu hỏi
3. **Track Errors**: Hệ thống theo dõi số lỗi
4. **Complete**: Khi hết câu hỏi hoặc quá số lỗi → kết thúc
5. **Reward**: Nếu thắng, user nhận rewards

### Code Example

```typescript
import { startBossBattle, submitBossAnswer } from '@/lib/gamification/eventHandler';

// 1. Start battle
const battleStart = await startBossBattle('boss_vocabulary_hsk3');
// {
//   battle: BossBattle,
//   first_question: BossQuestion
// }

// 2. Submit answer
const answerResult = await submitBossAnswer(
  battleStart.battle.id,
  'user_selected_answer'
);
// {
//   is_correct: boolean,
//   correct_answer: string,
//   battle_status: 'in_progress' | 'won' | 'lost',
//   next_question?: BossQuestion,
//   battle_result?: { rewards: ... }
// }

// 3. Lặp lại bước 2 cho các câu tiếp theo

// 4. Khi battle kết thúc, check battle_status
if (answerResult.battle_status === 'won') {
  const rewards = answerResult.battle_result.rewards;
  // Hiển thị rewards
}
```

### Tạo Boss Mới

Boss được quản lý trong database. Thêm vào bảng `bosses`:

```sql
INSERT INTO bosses (code, name, theme, language, difficulty, question_count, max_errors, reward_config)
VALUES (
  'boss_grammar_advanced',
  'Ngữ Pháp Ma Vương',
  'grammar',
  'mandarin',
  8, -- difficulty 1-10
  15, -- số câu hỏi
  3, -- số lỗi tối đa
  '{"xp": 500, "cards": 5, "card_rarity": "epic"}'::jsonb
);
```

---

## 📖 5. Story Mode/Chapters

### Concept

- User tiến qua các chapter như một câu chuyện
- Mỗi chapter có:
  - Lessons liên quan
  - Boss cuối chapter (optional)
  - Unlock conditions
  - Rewards khi hoàn thành

### Get Chapters

```typescript
import { getStoryChapters, getMyStoryProgress } from '@/lib/gamification/eventHandler';

const chapters = await getStoryChapters();
const progress = await getMyStoryProgress();
```

### Unlock Logic

Backend tự động kiểm tra unlock conditions:
```typescript
unlock_condition: {
  required_chapters?: number[], // Cần hoàn thành chapters nào
  min_level?: number,           // Cấp tối thiểu
  required_missions?: string[]  // Nhiệm vụ cần hoàn thành
}
```

### Complete Chapter

Khi user hoàn thành tất cả lessons + boss trong chapter:

```typescript
await recordLearningEvent({
  event_type: 'lesson_complete',
  source_id: `chapter_${chapterId}_completion`,
  metadata: { chapter_id: chapterId }
});
```

---

## 🎰 6. Lucky Wheel System

### Concept

User có lượt quay hàng ngày hoặc nhận từ rewards. Wheel có các rewards khác nhau với độ hiếm khác nhau.

### Spin Wheel

```typescript
import { spinWheel, getAvailableSpins } from '@/lib/gamification/eventHandler';

// Check số lượt quay
const { spins_available } = await getAvailableSpins();

// Quay
if (spins_available > 0) {
  const result = await spinWheel();
  // {
  //   reward: WheelReward,
  //   reward_claimed: { xp?: number, cards?: Card[], ... },
  //   spins_remaining: number
  // }
}
```

### Wheel Rewards

Rewards được định nghĩa trong bảng `wheel_rewards`:

```typescript
type WheelRewardType =
  | 'xp'
  | 'card'
  | 'badge'
  | 'item'
  | 'spin'          // Lượt quay thêm
  | 'streak_shield'; // Bảo vệ streak
```

---

## 🗣️ 7. Pronunciation Scoring

### Flow

1. User ghi âm giọng nói
2. Upload audio lên server
3. Server phân tích và cho điểm (0-100)
4. Trả về feedback chi tiết

### Code Example

```typescript
import { submitPronunciation } from '@/lib/gamification/eventHandler';

const result = await submitPronunciation({
  target_id: 'pronunciation_target_123',
  audio_blob: recordedAudio
});
// {
//   score: 85,
//   feedback: {
//     overall_score: 85,
//     tone_accuracy: 90,
//     pronunciation_issues: ['Tone 3 cần rõ hơn'],
//     suggestions: ['Thử phát âm chậm hơn']
//   }
// }

// Nếu đạt điểm cao → tặng XP
if (result.score >= 80) {
  await recordLearningEvent({
    event_type: 'pronunciation_practice',
    source_id: target_id,
    metadata: { score: result.score }
  });
}
```

---

## 🎒 8. Game Items & Inventory

### Item Types

```typescript
type ItemType =
  | 'consumable'   // Dùng 1 lần (XP boost, streak shield)
  | 'permanent'    // Vĩnh viễn (Avatar frame, theme)
  | 'collectible'; // Sưu tầm (Trophy, achievement)
```

### Get Inventory

```typescript
import { getMyInventory } from '@/lib/gamification/eventHandler';

const inventory = await getMyInventory();
// [
//   { item: GameItem, quantity: 3 },
//   { item: GameItem, quantity: 1 }
// ]
```

### Use Item

```typescript
import { useItem } from '@/lib/gamification/eventHandler';

await useItem('item_xp_boost_2x', { duration_minutes: 30 });
```

---

## 🎨 UI Components Có Sẵn

### 1. GamificationProvider

Wrap toàn bộ app để cung cấp gamification context:

```typescript
import { GamificationProvider } from '@/components/gamification/GamificationProvider';

<GamificationProvider>
  <App />
</GamificationProvider>
```

### 2. XPProgressBar

Hiển thị thanh tiến trình XP:

```typescript
import XPProgressBar from '@/components/gamification/XPProgressBar';

<XPProgressBar
  currentXP={userProgress.total_xp}
  levelInfo={levelInfo}
  nextLevelInfo={nextLevelInfo}
/>
```

### 3. XPGainAnimation

Animation khi nhận XP:

```typescript
import XPGainAnimation from '@/components/gamification/XPGainAnimation';

<XPGainAnimation
  xpGained={50}
  onComplete={() => console.log('Animation done')}
/>
```

### 4. StreakTracker

Hiển thị chuỗi ngày học:

```typescript
import StreakTracker from '@/components/gamification/StreakTracker';

<StreakTracker
  currentStreak={userProgress.current_streak}
  longestStreak={userProgress.longest_streak}
/>
```

### 5. LevelUpModal

Modal hiển thị khi lên cấp:

```typescript
import LevelUpModal from '@/components/gamification/LevelUpModal';

const [showLevelUp, setShowLevelUp] = useState(false);

<LevelUpModal
  isOpen={showLevelUp}
  onClose={() => setShowLevelUp(false)}
  oldLevel={5}
  newLevel={6}
  rewards={rewards}
/>
```

### 6. BadgeShowcase

Hiển thị huy hiệu:

```typescript
import BadgeShowcase from '@/components/gamification/BadgeShowcase';

<BadgeShowcase badges={userBadges} />
```

### 7. MissionCards

Hiển thị danh sách nhiệm vụ:

```typescript
import MissionCards from '@/components/gamification/MissionCards';

<MissionCards
  missions={dailyMissions}
  onMissionClick={(mission) => console.log(mission)}
/>
```

---

## 🚀 Quy Trình Thêm Tính Năng Mới

### Example: Thêm "Reading Comprehension" Exercise

#### Bước 1: Định nghĩa Event Type

```typescript
// src/types/gamification.ts
export type XPEventType =
  | 'quiz_complete'
  | 'reading_comprehension_complete'; // Thêm mới
```

#### Bước 2: Định nghĩa XP Rules

```typescript
// src/lib/gamification/xpRules.ts
export const XP_RULES = {
  quiz_complete: { base: 50, multiplier: 1.0 },
  reading_comprehension_complete: {
    base: 75,      // Base XP
    multiplier: 1.2 // Bonus nếu đạt điểm cao
  },
};
```

#### Bước 3: Implement Exercise Component

```typescript
// src/pages/ReadingComprehensionPage.tsx
import { recordLearningEvent } from '@/lib/gamification/eventHandler';
import { useGamification } from '@/components/gamification/GamificationProvider';
import XPGainAnimation from '@/components/gamification/XPGainAnimation';

function ReadingComprehensionPage() {
  const { refreshProgress, refreshDashboard } = useGamification();
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXPGained] = useState(0);

  const handleComplete = async (score: number, timeSpent: number) => {
    try {
      // Record event
      const result = await recordLearningEvent({
        event_type: 'reading_comprehension_complete',
        source_id: articleId,
        metadata: {
          score,
          time_spent: timeSpent,
          difficulty_level: 'intermediate'
        }
      });

      // Update gamification state
      await refreshProgress();
      await refreshDashboard();

      // Show XP gain animation
      setXPGained(result.xp_earned);
      setShowXPGain(true);

      // Check for level up
      if (result.level_up) {
        showLevelUpModal(result.level_before, result.level_after);
      }

      // Check for new badges
      if (result.badges_unlocked.length > 0) {
        showBadgeUnlockNotification(result.badges_unlocked);
      }

    } catch (error) {
      console.error('Failed to record event:', error);
    }
  };

  return (
    <div>
      <h1>Reading Comprehension</h1>
      {/* Your exercise UI */}

      <button onClick={() => handleComplete(score, timeSpent)}>
        Hoàn thành
      </button>

      {showXPGain && (
        <XPGainAnimation
          xpGained={xpGained}
          onComplete={() => setShowXPGain(false)}
        />
      )}
    </div>
  );
}
```

#### Bước 4: (Optional) Thêm Related Mission

```sql
-- Thêm nhiệm vụ liên quan
INSERT INTO missions (
  code, mission_type, title, description,
  condition_config, reward_xp, reward_cards
)
VALUES (
  'daily_reading_master',
  'daily',
  'Đọc hiểu chuyên sâu',
  'Hoàn thành 3 bài đọc hiểu',
  '{"type": "reading_count", "count": 3, "min_score": 70}'::jsonb,
  100,
  2
);
```

#### Bước 5: (Optional) Thêm Related Badge

```sql
-- Thêm huy hiệu liên quan
INSERT INTO badges (
  code, name, description, rarity, unlock_condition
)
VALUES (
  'reading_champion',
  'Vua Đọc Hiểu',
  'Hoàn thành 50 bài đọc hiểu với điểm trên 80',
  'epic',
  '{"type": "reading_completed", "count": 50, "min_score": 80}'::jsonb
);
```

---

## 📊 Dashboard & Analytics

### Get Full Dashboard Data

```typescript
import { getGamificationDashboard } from '@/lib/gamification/eventHandler';

const dashboard = await getGamificationDashboard();
// {
//   user_progress: { total_xp, current_level, current_streak, ... },
//   level_info: { level_number, xp_required, title, ... },
//   next_level_info: { ... },
//   xp_to_next_level: 450,
//
//   badges: {
//     total: 50,
//     unlocked: [...],
//     available: [...]
//   },
//
//   missions: {
//     daily: [...],
//     weekly: [...],
//     newbie: [...]
//   },
//
//   cards: {
//     total_collected: 125,
//     unique_cards: 95,
//     collection_completion_percentage: 76,
//     recent_cards: [...]
//   },
//
//   story: {
//     current_chapter: {...},
//     unlocked_chapters: [...],
//     completion_percentage: 45
//   },
//
//   wheel: {
//     spins_available: 2,
//     last_spin_date: '2025-01-15'
//   }
// }
```

### Build Dashboard UI

```typescript
import { useGamification } from '@/components/gamification/GamificationProvider';

function GamificationDashboard() {
  const { userProgress, dashboard, isLoading } = useGamification();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Gamification Dashboard</h1>

      {/* XP Progress */}
      <section>
        <h2>Level {dashboard.user_progress.current_level}</h2>
        <XPProgressBar {...dashboard} />
      </section>

      {/* Streak */}
      <section>
        <StreakTracker
          currentStreak={dashboard.user_progress.current_streak}
          longestStreak={dashboard.user_progress.longest_streak}
        />
      </section>

      {/* Badges */}
      <section>
        <h2>Huy hiệu ({dashboard.badges.unlocked.length}/{dashboard.badges.total})</h2>
        <BadgeShowcase badges={dashboard.badges.unlocked} />
      </section>

      {/* Missions */}
      <section>
        <h2>Nhiệm vụ hàng ngày</h2>
        <MissionCards missions={dashboard.missions.daily} />
      </section>

      {/* Cards Collection */}
      <section>
        <h2>Bộ sưu tập thẻ bài</h2>
        <p>{dashboard.cards.collection_completion_percentage}% hoàn thành</p>
        <CardCollection cards={dashboard.cards.recent_cards} />
      </section>

      {/* Lucky Wheel */}
      <section>
        <h2>Vòng quay may mắn</h2>
        <p>{dashboard.wheel.spins_available} lượt quay</p>
        <WheelComponent />
      </section>
    </div>
  );
}
```

---

## 🔧 Best Practices

### 1. Always Wrap Events in Try-Catch

```typescript
try {
  const result = await recordLearningEvent(event);
  // Handle success
} catch (error) {
  console.error('Failed to record event:', error);
  // Show error to user
  toast.error('Không thể lưu tiến độ');
}
```

### 2. Refresh Gamification Data After Events

```typescript
const { refreshProgress, refreshDashboard } = useGamification();

await recordLearningEvent(event);
await refreshProgress();    // Update XP/level
await refreshDashboard();   // Update missions/badges
```

### 3. Show Feedback to User

```typescript
// XP Gain
if (result.xp_earned > 0) {
  showXPGainAnimation(result.xp_earned);
}

// Level Up
if (result.level_up) {
  showLevelUpModal(result.level_before, result.level_after);
}

// Badges
if (result.badges_unlocked.length > 0) {
  showBadgeUnlockNotification(result.badges_unlocked);
}

// Missions Progress
if (result.missions_updated.length > 0) {
  toast.success(`Cập nhật ${result.missions_updated.length} nhiệm vụ`);
}
```

### 4. Optimize API Calls

```typescript
// ❌ Bad: Multiple separate calls
await recordLearningEvent(event1);
await recordLearningEvent(event2);
await recordLearningEvent(event3);

// ✅ Good: Batch if possible
await Promise.all([
  recordLearningEvent(event1),
  recordLearningEvent(event2),
  recordLearningEvent(event3)
]);
```

### 5. Handle Loading States

```typescript
const { isLoading } = useGamification();

if (isLoading) {
  return <LoadingSpinner />;
}
```

---

## 🐛 Debugging

### Check User Progress

```typescript
import { getUserProgress } from '@/lib/gamification/eventHandler';

const progress = await getUserProgress();
console.log('Current XP:', progress.total_xp);
console.log('Current Level:', progress.current_level);
console.log('Current Streak:', progress.current_streak);
```

### Check Missions

```typescript
import { getMyMissions } from '@/lib/gamification/eventHandler';

const missions = await getMyMissions();
console.log('Daily missions:', missions.daily);
console.log('Active missions:', missions.daily.filter(m => !m.is_completed));
```

### Check Event History

Truy cập Supabase Dashboard → Table `xp_events` để xem lịch sử events của user.

---

## 📚 Tài Liệu Tham Khảo

- **Types**: `src/types/gamification.ts`
- **Event Handler**: `src/lib/gamification/eventHandler.ts`
- **XP Rules**: `src/lib/gamification/xpRules.ts`
- **Provider**: `src/components/gamification/GamificationProvider.tsx`
- **API Routes**: `src/pages/api/gamification/*`

---

## ❓ FAQ

### Q: Làm sao để test gamification locally?

A:
1. Đảm bảo Supabase đã được config đúng
2. Seed data cho `level_definitions`, `badges`, `missions`
3. Gọi `recordLearningEvent()` từ console hoặc test component

### Q: Tôi có thể tùy chỉnh lượng XP cho từng event không?

A: Có, chỉnh trong `src/lib/gamification/xpRules.ts`

### Q: Mission progress được update tự động hay manual?

A: Tự động. Khi bạn gọi `recordLearningEvent()`, backend sẽ check và update các missions liên quan.

### Q: Làm sao để tạo badge unlock animation?

A: Sử dụng component `BadgeUnlockNotification`:

```typescript
import BadgeUnlockNotification from '@/components/gamification/BadgeUnlockNotification';

<BadgeUnlockNotification
  badge={newBadge}
  isOpen={showBadgeNotif}
  onClose={() => setShowBadgeNotif(false)}
/>
```

### Q: Card rarity được quyết định như thế nào?

A: Backend sử dụng weighted random dựa trên `weight` field trong bảng `cards`. Bạn có thể điều chỉnh weights trong seed data.

---

## 🎉 Kết Luận

Hệ thống gamification đã được implement khá đầy đủ với các thành phần cốt lõi. Để thêm tính năng mới:

1. Định nghĩa event type mới (nếu cần)
2. Thêm XP rules
3. Implement UI component
4. Gọi `recordLearningEvent()` khi user hoàn thành action
5. Refresh gamification data
6. Show feedback UI

**Happy coding!** 🚀
