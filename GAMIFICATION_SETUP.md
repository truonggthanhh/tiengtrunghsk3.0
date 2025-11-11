# 🎯 HƯỚNG DẪN SETUP GAMIFICATION - CẢ 2 APPS

## ✅ Đã Fix & Sync

### 1. ✅ Fix SQL Schema Error
**Lỗi cũ:** `column profiles.is_admin does not exist`

**Đã fix:** Chỉ check `profiles.role = 'admin'` thay vì check cả `is_admin` và `role`

**File:** `GAMIFICATION_SCHEMA.sql`

---

### 2. ✅ Đồng bộ cho cả Mandarin & Cantonese

**Files created/updated:**
```
src/hooks/useGamification.ts         - Shared hook cho cả 2 apps
src/components/AchievementBadge.tsx  - Shared component
src/pages/LearningProgressPage.tsx  - Mandarin learning progress page
src/App.tsx                           - Added route /mandarin/learning-progress
src/components/Header.tsx            - Added "Tiến độ" link
```

---

## 🚀 Setup Database (BẮT BUỘC!)

Bạn cần chạy SQL script cho **CẢ 2 Supabase projects**:

### A. Mandarin Project

```bash
1. Mở: https://supabase.com/dashboard
2. Chọn project: piwdypvvskuwbyvgyktn
3. Vào SQL Editor
4. Copy toàn bộ file GAMIFICATION_SCHEMA.sql
5. Paste và click "Run"
```

### B. Cantonese Project

```bash
1. Mở: https://supabase.com/dashboard
2. Chọn project: jhjpgdldjunkhdbtopbs
3. Vào SQL Editor
4. Copy toàn bộ file GAMIFICATION_SCHEMA.sql
5. Paste và click "Run"
```

**⚠️ QUAN TRỌNG:** Phải run cho CẢ 2 projects vì mỗi app dùng 1 database riêng!

---

## ✅ Verify Tables Created

Sau khi run SQL script, check **Table Editor** có các tables sau:

- ✅ `user_points` - Điểm số & level của user
- ✅ `point_transactions` - Lịch sử điểm
- ✅ `achievements` - Định nghĩa 15 thành tích
- ✅ `user_achievements` - Thành tích đã mở khóa
- ✅ `daily_activity` - Tracking streak

---

## 🎮 Gamification Features

### Cả 2 apps giờ đều có:

**1. Points & Levels** ⭐
- Mọi hoạt động đều kiếm điểm
- Mỗi 1000 điểm = lên 1 level
- Progress bar hiển thị tiến độ

**2. Streak System** 🔥
- Track học liên tiếp mỗi ngày
- Bonus 70 điểm mỗi 7 ngày
- Hiển thị record tốt nhất

**3. 15+ Achievements** 🏆
- 4 tiers: Bronze, Silver, Gold, Platinum
- Categories: Points, Lessons, Streak, Perfect Score
- Auto-unlock với toast notifications
- Reward points khi unlock

**4. Learning Progress Dashboard** 📊
- 4 stat cards với gradients đẹp
- Achievement collection grid
- Transaction history (20 gần nhất)
- Motivational streak banner

---

## 📍 Routes Available

### Mandarin App:
```
/mandarin/learning-progress
```

### Cantonese App:
```
/cantonese/learning-progress
```

---

## 🎨 UI Highlights

### Mandarin Styling:
- Purple/pink gradients
- Matches Mandarin theme
- Integrated with Header

### Cantonese Styling:
- Jade/cyan colors
- Matches Cantonese theme
- Integrated with PageWrapper

---

## 🔗 Navigation

### Mandarin Header:
- "Tiến độ" button (visible when logged in)
- Icon: BarChart2
- Position: Between "Hồ sơ" and "Quản trị"

### Cantonese UserMenu:
- "Quá trình học tập" link in dropdown
- Icon: GraduationCap
- Position: Below "Hồ sơ của tôi"

---

## 📊 Point System

### Earning Points:
```
🎓 Hoàn thành bài học: 100 điểm
✏️ Hoàn thành bài tập: 50-100 điểm (tùy score)
💯 Perfect score: Bonus 50 điểm
📅 Daily login: 10 điểm
🔥 Streak bonus: 70 điểm/7 ngày
🏆 Achievement reward: 50-1000 điểm
```

### Level Up:
```
Level 1: 0-999 điểm
Level 2: 1000-1999 điểm
Level 3: 2000-2999 điểm
...
```

---

## 🏆 Achievements List

### Points-based:
- ⭐ First Steps (100 pts) - Bronze
- ⭐ Getting Started (500 pts) - Silver
- ⭐ Rising Star (1000 pts) - Gold
- ⭐ Point Master (5000 pts) - Platinum

### Lessons-based:
- 📚 Beginner (1 lesson) - Bronze
- 📚 Learner (5 lessons) - Silver
- 📚 Scholar (10 lessons) - Gold
- 📚 Master (20 lessons) - Platinum

### Streak-based:
- 🔥 Consistency (3 days) - Bronze
- 🔥 Dedication (7 days) - Silver
- 🔥 Unstoppable (30 days) - Gold
- 🔥 Legend (100 days) - Platinum

### Perfect Score:
- 💯 Perfectionist (1 perfect) - Bronze
- 💯 Flawless (5 perfect) - Silver
- 💯 Perfection Master (10 perfect) - Gold

---

## 💻 Integration Example

Để tự động add points khi user hoàn thành bài tập:

```tsx
import { useGamification } from '@/hooks/useGamification'; // Mandarin
// hoặc
import { useGamification } from '@/cantonese/hooks/useGamification'; // Cantonese

function ExercisePage() {
  const { addPoints, updateStreak } = useGamification();

  // Update streak on login
  useEffect(() => {
    updateStreak();
  }, []);

  // Add points on exercise complete
  const handleComplete = async (score: number) => {
    await addPoints({
      points: score,
      activityType: 'exercise_complete',
      referenceId: exerciseId,
      description: 'Hoàn thành Flashcard',
    });

    // Bonus for perfect score
    if (score === 100) {
      await addPoints({
        points: 50,
        activityType: 'perfect_score',
        referenceId: exerciseId,
        description: 'Bonus điểm hoàn hảo! 🎉',
      });
    }
  };

  return <div>...</div>;
}
```

---

## 🧪 Testing Checklist

### Sau khi setup:

**Database:**
- [ ] Run SQL script cho Mandarin project
- [ ] Run SQL script cho Cantonese project
- [ ] Verify tables created
- [ ] Check functions exist

**Mandarin App:**
- [ ] Access `/mandarin/learning-progress`
- [ ] See 4 stat cards
- [ ] View achievements grid
- [ ] Check transaction history
- [ ] "Tiến độ" link in Header works

**Cantonese App:**
- [ ] Access `/cantonese/learning-progress`
- [ ] See 4 stat cards
- [ ] View achievements grid
- [ ] Check transaction history
- [ ] "Quá trình học tập" in UserMenu works

**Functionality:**
- [ ] Points display correctly
- [ ] Level calculates right (pts/1000)
- [ ] Streak updates daily
- [ ] Achievements unlock with toast
- [ ] Transaction history shows activities

---

## 🐛 Troubleshooting

### Lỗi: "Table doesn't exist"
**Fix:** Chưa run SQL script. Xem lại phần Setup Database.

### Lỗi: "Permission denied for table"
**Fix:** RLS policies chưa được tạo. Re-run SQL script.

### Lỗi: "Function add_points_to_user does not exist"
**Fix:** Functions chưa được tạo. Re-run SQL script.

### Achievements không unlock
**Fix:** Check console logs. Có thể logic check chưa đúng.

### Points không update
**Fix:** Check network tab. API call có thành công không?

---

## 📚 Documentation

**Full docs:** `GAMIFICATION_README.md`

**SQL Schema:** `GAMIFICATION_SCHEMA.sql`

---

## 🎉 Summary

✅ **Fixed:** SQL schema error với profile.is_admin

✅ **Created:** Shared gamification system

✅ **Synced:** Mandarin app có đầy đủ features như Cantonese

✅ **Added:** Navigation links ở cả 2 apps

✅ **Ready:** Chỉ cần run SQL script là xong!

**Deploy status:** Đã push lên branch, Vercel đang auto-deploy (~2-3 phút)

---

## 🚀 Next Steps

1. **Run SQL scripts** cho cả 2 Supabase projects ⚠️ BẮT BUỘC
2. **Test** cả 2 apps trên production
3. **Integrate** `addPoints()` vào exercise pages (optional)
4. **Monitor** user engagement & achievements
5. **Expand** thêm achievements theo mùa/sự kiện

---

**🎊 Chúc mừng! Cả 2 apps giờ có hệ thống gamification đầy đủ!**

Users sẽ có động lực học tập cao hơn với điểm số, cấp độ, streak và huy hiệu! 🏆🔥⭐
