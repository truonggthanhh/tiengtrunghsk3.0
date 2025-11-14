-- ============================================================================
-- SEED DATA: MISSIONS
-- Daily, Weekly, and Newbie missions for gamification
-- ============================================================================

INSERT INTO missions (code, mission_type, title, description, language, condition_config, reward_xp, reward_cards, reward_spins, is_active, display_order) VALUES

-- ============================================================================
-- DAILY MISSIONS
-- ============================================================================
('daily_login', 'daily', 'Báo Đáo Hằng Ngày', 'Đăng nhập và học mỗi ngày', 'both',
  '{"type": "daily_login", "count": 1}',
  20, 0, 0, true, 1),

('daily_lesson_1', 'daily', 'Nhất Bài Mỗi Ngày', 'Hoàn thành 1 bài học', 'both',
  '{"type": "lessons_complete", "count": 1}',
  30, 1, 0, true, 2),

('daily_quiz_3', 'daily', 'Tam Quiz', 'Hoàn thành 3 bài quiz với điểm >= 70%', 'both',
  '{"type": "quiz_complete", "count": 3, "min_score_percentage": 70}',
  50, 1, 0, true, 3),

('daily_pronunciation_5', 'daily', 'Luyện Khẩu Ngũ Lần', 'Luyện phát âm 5 từ/câu', 'both',
  '{"type": "pronunciation_practice", "count": 5}',
  40, 0, 0, true, 4),

('daily_perfect_quiz', 'daily', 'Hoàn Hảo', 'Đạt 100% trong 1 bài quiz', 'both',
  '{"type": "perfect_quiz", "count": 1}',
  60, 2, 0, true, 5),

('daily_vocab_20', 'daily', 'Nhị Thập Từ Vựng', 'Học 20 từ vựng mới', 'both',
  '{"type": "vocabulary_learned", "count": 20}',
  50, 1, 0, true, 6),

-- ============================================================================
-- WEEKLY MISSIONS
-- ============================================================================
('weekly_streak_7', 'weekly', 'Tuần Bất Đoạn', 'Học 7 ngày liên tục trong tuần', 'both',
  '{"type": "streak_days", "count": 7}',
  200, 5, 1, true, 1),

('weekly_lessons_10', 'weekly', 'Thập Bài Tuần', 'Hoàn thành 10 bài học trong tuần', 'both',
  '{"type": "lessons_complete", "count": 10}',
  150, 3, 0, true, 2),

('weekly_quiz_20', 'weekly', 'Nhị Thập Quiz', 'Hoàn thành 20 bài quiz với điểm >= 70%', 'both',
  '{"type": "quiz_complete", "count": 20, "min_score_percentage": 70}',
  180, 4, 1, true, 3),

('weekly_pronunciation_30', 'weekly', 'Khẩu Âm Tinh Thông', 'Luyện phát âm 30 từ/câu với điểm >= 80', 'both',
  '{"type": "pronunciation_practice", "count": 30, "min_score": 80}',
  160, 3, 0, true, 4),

('weekly_boss', 'weekly', 'Chiến Boss', 'Đánh bại 1 Boss', 'both',
  '{"type": "boss_defeat", "count": 1}',
  250, 5, 2, true, 5),

('weekly_perfect_quiz_5', 'weekly', 'Ngũ Hoàn Mỹ', 'Đạt 100% trong 5 bài quiz', 'both',
  '{"type": "perfect_quiz", "count": 5}',
  200, 4, 1, true, 6),

('weekly_study_time', 'weekly', 'Thất Giờ Minh Sư', 'Học tổng 7 giờ trong tuần', 'both',
  '{"type": "study_minutes", "minutes": 420}',
  220, 5, 1, true, 7),

-- ============================================================================
-- NEWBIE MISSIONS (One-time onboarding)
-- ============================================================================
('newbie_first_lesson', 'newbie', 'Khởi Đầu Hành Trình', 'Hoàn thành bài học đầu tiên', 'both',
  '{"type": "lessons_complete", "count": 1}',
  50, 3, 1, true, 1),

('newbie_first_quiz', 'newbie', 'Thử Thách Đầu Tiên', 'Hoàn thành quiz đầu tiên', 'both',
  '{"type": "quiz_complete", "count": 1}',
  40, 2, 0, true, 2),

('newbie_profile_complete', 'newbie', 'Hoàn Thiện Hồ Sơ', 'Điền đầy đủ thông tin hồ sơ', 'both',
  '{"type": "profile_complete"}',
  30, 1, 0, true, 3),

('newbie_5_lessons', 'newbie', 'Ngũ Bài Tân Thủ', 'Hoàn thành 5 bài học đầu tiên', 'both',
  '{"type": "lessons_complete", "count": 5}',
  100, 5, 1, true, 4),

('newbie_first_perfect', 'newbie', 'Lần Đầu Hoàn Hảo', 'Đạt 100% trong quiz lần đầu', 'both',
  '{"type": "perfect_quiz", "count": 1}',
  80, 4, 0, true, 5),

('newbie_streak_3', 'newbie', 'Ba Ngày Kiên Trì', 'Học liên tục 3 ngày', 'both',
  '{"type": "streak_days", "count": 3}',
  90, 3, 1, true, 6),

('newbie_pronunciation', 'newbie', 'Tiếng Đầu Tiên', 'Luyện phát âm lần đầu', 'both',
  '{"type": "pronunciation_practice", "count": 1}',
  50, 2, 0, true, 7),

('newbie_10_cards', 'newbie', 'Thập Thẻ Tân Binh', 'Thu thập 10 thẻ đầu tiên', 'both',
  '{"type": "cards_collect", "count": 10}',
  70, 3, 0, true, 8),

('newbie_level_2', 'newbie', 'Học Đồ Thăng Cấp', 'Đạt Level 2', 'both',
  '{"type": "level_reach", "level": 2}',
  100, 5, 1, true, 9),

('newbie_wheel_spin', 'newbie', 'Thử Vận May', 'Quay bánh xe may mắn lần đầu', 'both',
  '{"type": "wheel_spin", "count": 1}',
  50, 2, 2, true, 10),

-- ============================================================================
-- LANGUAGE-SPECIFIC MISSIONS
-- ============================================================================
-- Mandarin
('mandarin_hsk1_progress', 'weekly', 'HSK 1 Tiến Bộ', 'Học 5 bài trong HSK 1', 'mandarin',
  '{"type": "course_lessons", "course": "hsk1", "count": 5}',
  150, 3, 0, true, 20),

('mandarin_tones', 'daily', 'Bốn Thanh Chuẩn', 'Phát âm đúng 10 từ có 4 thanh', 'mandarin',
  '{"type": "tone_practice", "count": 10, "tones": [1,2,3,4]}',
  60, 2, 0, true, 21),

-- Cantonese
('cantonese_jyutping', 'daily', 'Luyện Jyutping', 'Phát âm 10 từ Jyutping chuẩn', 'cantonese',
  '{"type": "pronunciation_practice", "count": 10, "min_score": 80}',
  60, 2, 0, true, 22),

('cantonese_hk_culture', 'weekly', 'Văn Hóa HK', 'Học 3 bài về văn hóa Hong Kong', 'cantonese',
  '{"type": "category_lessons", "category": "culture", "count": 3}',
  150, 4, 1, true, 23)

ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- END OF MISSIONS SEED DATA
-- ============================================================================
