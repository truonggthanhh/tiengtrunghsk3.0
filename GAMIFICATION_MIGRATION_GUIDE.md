# 🎮 Hướng dẫn chạy Gamification Migrations

## ❗ Quan trọng

Do hạn chế về network trong môi trường CI/CD, migrations cần được chạy từ **máy local** của bạn.

## 📋 Yêu cầu

- Node.js 16+ hoặc pnpm đã cài đặt
- Database password từ Supabase
- Internet connection

## 🚀 Cách chạy Migrations

### Phương án 1: Sử dụng Node.js script (Khuyến nghị ⭐)

```bash
# 1. Pull code mới nhất
git checkout claude/run-gamification-migrations-01EFsRvxUYRtDrHdKWdmfi7q
git pull

# 2. Cài đặt dependencies
pnpm install
# hoặc
npm install

# 3. Chạy migrations
SUPABASE_DB_PASSWORD="Tth38566362@" node run-migrations-pg.mjs
```

### Phương án 2: Sử dụng Bash script (Cần PostgreSQL client)

```bash
# 1. Cài đặt PostgreSQL client (nếu chưa có)
# macOS:
brew install postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql-client

# Windows (WSL):
sudo apt-get install postgresql-client

# 2. Chạy migrations
SUPABASE_DB_PASSWORD="Tth38566362@" bash run-migrations.sh
```

### Phương án 3: Sử dụng Supabase Dashboard (Manual)

Nếu scripts không hoạt động, bạn có thể chạy từng migration thủ công:

1. Truy cập [Supabase SQL Editor](https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn/sql/new)
2. Chạy lần lượt các migrations (copy & paste):
   - `supabase/migrations/20250114_gamification_system_clean.sql`
   - `supabase/migrations/20250114_seed_badges.sql`
   - `supabase/migrations/20250114_seed_missions.sql`
   - `supabase/migrations/20250114_seed_wheel_rewards.sql`
   - `supabase/migrations/20250114_seed_cards.sql`
   - `supabase/migrations/20250114_seed_bosses_story.sql`

## 📦 Migrations sẽ chạy (Theo thứ tự)

### 1. **gamification_system_clean.sql** - Schema chính
Tạo tất cả tables:
- ✅ `user_progress` - Tracking XP, level, streak
- ✅ `level_definitions` - 10 levels (Tân Thủ → Hán Hiệp)
- ✅ `badges` - Badge definitions
- ✅ `user_badges` - User badge collection
- ✅ `cards` - Card pool
- ✅ `user_cards` - User card collection
- ✅ `missions` - Mission definitions
- ✅ `user_missions` - Mission progress
- ✅ `bosses` - Boss battles
- ✅ `boss_battles` - Battle sessions
- ✅ `story_chapters` - Story mode
- ✅ `user_story_progress` - Story progress
- ✅ `wheel_rewards` - Lucky wheel pool
- ✅ `user_wheel_spins` - Spin tracking
- ✅ `wheel_spin_history` - Spin history
- ✅ `pronunciation_targets` - Pronunciation practice
- ✅ `user_pronunciation_scores` - Pronunciation scores
- ✅ `game_items` - Items (boosters, shields)
- ✅ `user_inventory` - User inventory
- ✅ `xp_events` - XP event log

Plus:
- Triggers & Functions
- Row Level Security (RLS) policies
- Indexes for performance

### 2. **seed_badges.sql** - Badge Data
Seeds badges với nhiều categories:
- Achievement badges
- Streak badges
- Learning milestones
- Special event badges

### 3. **seed_missions.sql** - Mission Data
Seeds missions:
- Daily missions (reset mỗi ngày)
- Weekly missions (reset mỗi tuần)
- Newbie missions (cho user mới)
- Special missions (events)

### 4. **seed_wheel_rewards.sql** - Wheel Rewards
Seeds lucky wheel rewards:
- XP rewards
- Card packs
- Extra spins
- Special items

### 5. **seed_cards.sql** - Card Collection
Seeds card pool:
- Vocabulary cards
- Character cards
- Phrase cards
- NPC cards

### 6. **seed_bosses_story.sql** - Boss & Story
Seeds:
- Boss battles (different difficulties)
- Story chapters & progression

## ✅ Kết quả mong đợi

Khi migrations chạy thành công, terminal sẽ hiển thị:

```
============================================
  Gamification Migrations Runner
============================================

📦 Project: piwdypvvskuwbyvgyktn
📁 Migration files: 6

🔍 Connecting to database...
✅ Connection successful

🔄 Running migration: 20250114_gamification_system_clean.sql
✅ Successfully completed: 20250114_gamification_system_clean.sql

🔄 Running migration: 20250114_seed_badges.sql
✅ Successfully completed: 20250114_seed_badges.sql

🔄 Running migration: 20250114_seed_missions.sql
✅ Successfully completed: 20250114_seed_missions.sql

🔄 Running migration: 20250114_seed_wheel_rewards.sql
✅ Successfully completed: 20250114_seed_wheel_rewards.sql

🔄 Running migration: 20250114_seed_cards.sql
✅ Successfully completed: 20250114_seed_cards.sql

🔄 Running migration: 20250114_seed_bosses_story.sql
✅ Successfully completed: 20250114_seed_bosses_story.sql

============================================
✅ Successful: 6
❌ Failed: 0
============================================

🎉 All migrations completed successfully!

Next steps:
  • Gamification tables have been created
  • Seed data has been loaded (levels, badges, missions, etc.)
  • Your app is ready to use the gamification system!
```

## 🔍 Kiểm tra kết quả

### Trong Supabase Dashboard

1. Vào [Table Editor](https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn/editor)
2. Kiểm tra các tables đã được tạo:

**Core Tables:**
- `user_progress` - User XP & level data
- `level_definitions` - Có 10 levels

**Badge System:**
- `badges` - Badge definitions
- `user_badges` - User collections

**Card System:**
- `cards` - Card pool
- `user_cards` - User collections

**Mission System:**
- `missions` - Mission definitions
- `user_missions` - Progress tracking

**Battle System:**
- `bosses` - Boss definitions
- `boss_battles` - Battle sessions

**Lucky Wheel:**
- `wheel_rewards` - Reward pool
- `user_wheel_spins` - User spins

### Query để kiểm tra

```sql
-- Kiểm tra levels
SELECT * FROM level_definitions ORDER BY level_number;

-- Kiểm tra badges
SELECT code, name, rarity FROM badges;

-- Kiểm tra missions
SELECT mission_type, title FROM missions WHERE is_active = true;

-- Kiểm tra wheel rewards
SELECT reward_type, reward_label, probability FROM wheel_rewards WHERE is_active = true;

-- Kiểm tra cards
SELECT card_type, rarity, chinese_text FROM cards LIMIT 10;

-- Kiểm tra bosses
SELECT name, difficulty, level_requirement FROM bosses WHERE is_active = true;
```

## ❓ Troubleshooting

### Lỗi: Connection timeout / DNS resolution failure
```
❌ Fatal error: getaddrinfo EAI_AGAIN db.piwdypvvskuwbyvgyktn.supabase.co
```

**Giải pháp:**
- Kiểm tra internet connection
- Thử lại sau vài phút
- Dùng VPN nếu bị firewall block

### Lỗi: Authentication failed
```
❌ password authentication failed for user "postgres"
```

**Giải pháp:**
- Verify password: `Tth38566362@`
- Hoặc reset password trong [Database Settings](https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn/settings/database)

### Lỗi: Tables already exist
```
❌ relation "user_progress" already exists
```

**Giải pháp:**
- Migrations đã được chạy rồi
- Nếu muốn chạy lại từ đầu, cần drop tables:

```sql
-- ⚠️ CẢNH BÁO: Lệnh này sẽ XÓA TẤT CẢ DATA
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Lỗi: Permission denied
```
❌ permission denied to create extension
```

**Giải pháp:**
- Extensions đã được enable sẵn trong Supabase
- Nếu vẫn lỗi, contact Supabase support

### Script không chạy (Windows line endings)
```
$'\r': command not found
```

**Giải pháp:**
```bash
# Convert line endings
dos2unix run-migrations.sh
# Hoặc
sed -i 's/\r$//' run-migrations.sh
```

## 📝 Thông tin quan trọng

**Database Credentials:**
- Host: `db.piwdypvvskuwbyvgyktn.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: `Tth38566362@`

**Project Links:**
- Dashboard: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn
- SQL Editor: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn/sql/new
- Table Editor: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn/editor
- API Settings: https://supabase.com/dashboard/project/piwdypvvskuwbyvgyktn/settings/api

## 🎯 Sau khi migrations hoàn tất

Gamification system sẽ sẵn sàng với:

### Features đã có:
- ✅ **XP & Leveling** - 10 levels với titles tiếng Việt
- ✅ **Badge System** - Nhiều rarities (common, rare, epic, legendary)
- ✅ **Card Collection** - Vocabulary, characters, NPCs
- ✅ **Daily/Weekly Missions** - Auto-reset missions
- ✅ **Boss Battles** - Multiple difficulty levels
- ✅ **Story Mode** - Chapter-based progression
- ✅ **Lucky Wheel** - Spin rewards system
- ✅ **Streak System** - Daily login tracking
- ✅ **Pronunciation Scoring** - AI-powered feedback
- ✅ **Item & Inventory** - Boosters, shields, collectibles

### API Endpoints sẵn sàng:
```
POST /api/gamification/event          - Record XP events
GET  /api/gamification/progress       - Get user progress
GET  /api/gamification/dashboard      - Dashboard data
GET  /api/gamification/badges         - List badges
GET  /api/gamification/badges/my      - My badges
GET  /api/gamification/cards/my-collection - My cards
POST /api/gamification/cards/open-pack     - Open card pack
GET  /api/gamification/missions/my-progress - Mission progress
POST /api/gamification/boss/start     - Start boss battle
POST /api/gamification/boss/answer    - Answer boss question
GET  /api/gamification/wheel/available-spins - Check spins
POST /api/gamification/wheel/spin     - Spin wheel
GET  /api/gamification/story/chapters - Story chapters
GET  /api/gamification/story/my-progress - Story progress
```

### Frontend Components ready:
- GamificationProvider (context)
- useGamification hook
- Progress tracking UI
- Badge displays
- Card collection viewer
- Mission tracker
- Boss battle interface
- Wheel spinner

## 🚀 Next Steps

1. **Test API endpoints** - Thử các endpoints trong Postman/Thunder Client
2. **Verify RLS policies** - Đảm bảo users chỉ thấy data của mình
3. **Test frontend integration** - Kiểm tra UI components
4. **Monitor performance** - Check query performance với indexes
5. **Setup analytics** - Track user engagement với gamification

---

**Chúc bạn thành công! 🎉**

Nếu gặp vấn đề, tham khảo [Supabase Documentation](https://supabase.com/docs) hoặc check code trong `src/pages/api/gamification/`.
