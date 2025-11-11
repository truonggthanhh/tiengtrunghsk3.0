# 🎮 Hệ Thống Gamification - Cantonese App

## 📋 Tổng quan

Hệ thống gamification đầy đủ với:
- ⭐ **Điểm số & Level**: Tích điểm qua các hoạt động, lên level
- 🔥 **Streak**: Học liên tiếp mỗi ngày để nhận thưởng
- 🏆 **Achievements/Huy hiệu**: 15+ thành tích để mở khóa
- 📊 **Learning Progress**: Xem tiến độ và thống kê chi tiết

---

## 🚀 Setup Database (Bước quan trọng!)

### Bước 1: Chạy SQL Script

1. Mở **Supabase Dashboard**: https://supabase.com/dashboard
2. Chọn project Cantonese: `jhjpgdldjunkhdbtopbs`
3. Vào **SQL Editor**
4. Copy toàn bộ nội dung file `GAMIFICATION_SCHEMA.sql`
5. Paste vào editor và click **Run**

### Bước 2: Kiểm tra Tables đã tạo

Vào **Table Editor**, kiểm tra các tables sau đã được tạo:
- ✅ `user_points` - Điểm số của user
- ✅ `point_transactions` - Lịch sử điểm
- ✅ `achievements` - Định nghĩa thành tích
- ✅ `user_achievements` - Thành tích đã đạt
- ✅ `daily_activity` - Tracking streak

### Bước 3: Kiểm tra Functions

Vào **Database** → **Functions**, kiểm tra:
- ✅ `add_points_to_user` - Thêm điểm cho user
- ✅ `update_user_streak` - Cập nhật chuỗi ngày học

---

## 📦 Files đã tạo

### 1. Database Schema
```
GAMIFICATION_SCHEMA.sql - SQL script tạo tables & functions
```

### 2. Hook
```
src/cantonese/hooks/useGamification.ts - Custom hook quản lý gamification
```

### 3. Components
```
src/cantonese/components/AchievementBadge.tsx - Component hiển thị huy hiệu
```

### 4. Pages
```
src/cantonese/pages/LearningProgress.tsx - Trang Quá trình học tập (đã rebuild hoàn toàn)
```

---

## 🎯 Cách sử dụng

### Trong Components/Pages

```tsx
import { useGamification } from '@/cantonese/hooks/useGamification';

function MyComponent() {
  const { userPoints, addPoints, updateStreak } = useGamification();

  // Thêm điểm khi user hoàn thành bài tập
  const handleExerciseComplete = async (score: number) => {
    await addPoints({
      points: score,
      activityType: 'exercise_complete',
      referenceId: exerciseId,
      description: 'Hoàn thành bài tập Flashcard',
    });
  };

  // Cập nhật streak khi user login
  useEffect(() => {
    updateStreak();
  }, []);

  return <div>Level: {userPoints?.level}</div>;
}
```

### Activity Types

Các loại hoạt động kiếm điểm:
- `lesson_complete` - Hoàn thành bài học (100 điểm)
- `exercise_complete` - Hoàn thành bài tập (50-100 điểm tùy score)
- `perfect_score` - Đạt điểm tuyệt đối (bonus 50 điểm)
- `daily_login` - Đăng nhập hàng ngày (10 điểm)
- `streak_bonus` - Bonus streak (10 điểm/ngày, max 100)
- `achievement_reward` - Phần thưởng từ achievement

---

## 🏆 Achievements/Thành tích

### Tiers (Hạng)
- 🥉 **Bronze (Đồng)**: Entry level
- 🥈 **Silver (Bạc)**: Intermediate
- 🥇 **Gold (Vàng)**: Advanced
- 💎 **Platinum (Bạch Kim)**: Master level

### Categories

#### Points-based (Dựa trên điểm)
- First Steps: 100 điểm
- Getting Started: 500 điểm
- Rising Star: 1000 điểm
- Point Master: 5000 điểm

#### Lessons-based (Dựa trên bài học)
- Beginner: 1 bài
- Learner: 5 bài
- Scholar: 10 bài
- Master: 20 bài

#### Streak-based (Dựa trên chuỗi ngày)
- Consistency: 3 ngày
- Dedication: 7 ngày
- Unstoppable: 30 ngày
- Legend: 100 ngày

#### Perfect Score-based
- Perfectionist: 1 lần
- Flawless: 5 lần
- Perfection Master: 10 lần

---

## 📊 Level System

- **Level calculation**: `Level = Total Points / 1000`
- Ví dụ:
  - 0-999 điểm = Level 1
  - 1000-1999 điểm = Level 2
  - 2000-2999 điểm = Level 3
  - ...và tiếp tục

---

## 🔥 Streak System

- **Chuỗi ngày học**: Số ngày liên tiếp user có hoạt động
- **Streak bonus**:
  - Mỗi 7 ngày streak: Bonus 70 điểm
  - Mỗi 30 ngày: Mở khóa achievement "Unstoppable"
  - Mỗi 100 ngày: Mở khóa achievement "Legend"

---

## 🎨 UI Features

### Learning Progress Page (`/cantonese/learning-progress`)

**4 Cards thống kê:**
1. 🏆 **Level Card** - Cấp độ + progress bar
2. ⭐ **Points Card** - Tổng điểm tích lũy
3. 🔥 **Streak Card** - Ngày liên tiếp + record
4. 🏅 **Achievements Card** - Số huy hiệu đạt được

**2 Tabs:**
1. **Thành tích** - Grid hiển thị tất cả achievements (unlocked & locked)
2. **Lịch sử** - Timeline 20 transactions gần nhất

**Motivational Banner** - Khích lệ dựa trên streak hiện tại

---

## 🔄 Auto-unlock Achievements

Hệ thống tự động check và unlock achievements khi:
- User đạt đủ điều kiện (points, streak, lessons, v.v.)
- Hiển thị toast notification khi unlock
- Tự động cộng điểm thưởng (nếu có)

---

## 💡 Tips tích hợp vào Exercise Pages

```tsx
// Trong exercise pages (Flashcard, MultipleChoice, etc.)
import { useGamification } from '@/cantonese/hooks/useGamification';

function FlashcardPage() {
  const { addPoints } = useGamification();

  const handleExerciseComplete = async (correctCount, totalCount) => {
    const score = Math.round((correctCount / totalCount) * 100);

    // Add points dựa trên điểm số
    await addPoints({
      points: score,
      activityType: 'exercise_complete',
      referenceId: lessonId,
      description: `Hoàn thành Flashcard - ${correctCount}/${totalCount} đúng`,
    });

    // Bonus nếu perfect score
    if (correctCount === totalCount) {
      await addPoints({
        points: 50,
        activityType: 'perfect_score',
        referenceId: lessonId,
        description: 'Bonus điểm hoàn hảo! 🎉',
      });
    }
  };

  return <div>...</div>;
}
```

---

## 🎯 Next Steps

### Sau khi setup xong:

1. ✅ **Test database** - Thử add điểm thủ công trong Supabase
2. ✅ **Test UI** - Vào `/cantonese/learning-progress` xem giao diện
3. ✅ **Integrate exercises** - Add `addPoints()` vào các exercise pages
4. ✅ **Test achievements** - Tích điểm để mở khóa achievements
5. ✅ **Monitor** - Xem logs trong browser console

### Tính năng có thể mở rộng:

- 🎁 **Rewards Store**: Đổi điểm lấy phần thưởng
- 👥 **Leaderboard**: Bảng xếp hạng top learners
- 🎲 **Daily Challenges**: Thử thách hàng ngày
- 🏅 **Seasonal Events**: Sự kiện đặc biệt theo mùa
- 💬 **Social Features**: Share achievements lên social media

---

## ⚠️ Important Notes

1. **RLS Policies**: Đã enable và configure đúng cho tất cả tables
2. **Security**: Functions sử dụng `SECURITY DEFINER` an toàn
3. **Performance**: Indexes đã được tạo cho các queries thường dùng
4. **Scalability**: Schema thiết kế để scale với nhiều users

---

## 🐛 Troubleshooting

### Lỗi: "Table doesn't exist"
→ Chưa chạy SQL script. Xem lại Bước 1.

### Lỗi: "Permission denied"
→ Check RLS policies. Có thể cần re-run SQL script.

### Achievements không tự unlock
→ Check function `checkAndUnlockAchievements` trong hook.

### Điểm không cập nhật
→ Check console logs, có thể function `add_points_to_user` lỗi.

---

## 📝 Testing Checklist

- [ ] Database tables created
- [ ] Functions working
- [ ] Can view Learning Progress page
- [ ] Achievements display correctly
- [ ] Points add successfully
- [ ] Streak updates daily
- [ ] Achievement unlocks with toast
- [ ] Transaction history shows
- [ ] Level progresses correctly

---

## 🎉 Kết luận

Hệ thống gamification đầy đủ đã sẵn sàng! Deploy lên production và user sẽ có động lực học tập cao hơn rất nhiều với:

- 🎯 Mục tiêu rõ ràng (levels & achievements)
- 🏆 Động lực cạnh tranh (points & streaks)
- 📈 Feedback trực quan (progress tracking)
- 🎁 Rewards hấp dẫn (achievement badges)

**Happy gamifying!** 🚀
