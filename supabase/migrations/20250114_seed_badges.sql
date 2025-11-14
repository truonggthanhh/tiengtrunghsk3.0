-- ============================================================================
-- SEED DATA: BADGES
-- Hong Kong Retro + 武俠 themed badges for gamification system
-- ============================================================================

INSERT INTO badges (code, name, description, rarity, unlock_condition, language) VALUES

-- ============================================================================
-- COMMON BADGES (Streak & Daily Activity)
-- ============================================================================
('first_login', 'Tân Binh Đường Phố', 'Bước chân đầu tiên vào thế giới Hoa ngữ', 'common', '{"type": "first_login"}', 'both'),
('streak_3', 'Kiên Trì Tam Ngày', 'Học liên tục 3 ngày', 'common', '{"type": "streak", "days": 3}', 'both'),
('streak_7', 'Nhất Tuần Bất Đoạn', 'Học liên tục 7 ngày', 'common', '{"type": "streak", "days": 7}', 'both'),
('lessons_5', 'Tiểu Học Đồ', 'Hoàn thành 5 bài học', 'common', '{"type": "lessons_completed", "count": 5}', 'both'),
('lessons_10', 'Cần Mẫn', 'Hoàn thành 10 bài học', 'common', '{"type": "lessons_completed", "count": 10}', 'both'),

-- ============================================================================
-- RARE BADGES (Achievements & Milestones)
-- ============================================================================
('streak_14', 'Song Tuần Kiên Trì', 'Học liên tục 14 ngày', 'rare', '{"type": "streak", "days": 14}', 'both'),
('streak_30', 'Nhất Nguyệt Chân Nhân', 'Học liên tục 30 ngày', 'rare', '{"type": "streak", "days": 30}', 'both'),
('perfect_quiz_10', 'Thập Toàn Thập Mỹ', 'Đạt 100% trong 10 bài quiz', 'rare', '{"type": "perfect_quiz", "count": 10}', 'both'),
('lessons_50', 'Bán Bách Lộ Trình', 'Hoàn thành 50 bài học', 'rare', '{"type": "lessons_completed", "count": 50}', 'both'),
('level_5', 'Đại Sư Đệ', 'Đạt Level 5', 'rare', '{"type": "level_reached", "level": 5}', 'both'),
('cards_50', 'Tiểu Sưu Tập Gia', 'Thu thập 50 thẻ', 'rare', '{"type": "cards_collected", "count": 50}', 'both'),

-- ============================================================================
-- EPIC BADGES (Major Achievements)
-- ============================================================================
('streak_60', 'Lưỡng Nguyệt Chân Truyện', 'Học liên tục 60 ngày', 'epic', '{"type": "streak", "days": 60}', 'both'),
('streak_100', 'Bách Nhật Tôn Giả', 'Học liên tục 100 ngày - Huyền thoại!', 'epic', '{"type": "streak", "days": 100}', 'both'),
('lessons_100', 'Bách Bộ Xuyên Dương', 'Hoàn thành 100 bài học', 'epic', '{"type": "lessons_completed", "count": 100}', 'both'),
('level_8', 'Tông Sư', 'Đạt Level 8', 'epic', '{"type": "level_reached", "level": 8}', 'both'),
('boss_slayer', 'Đồ Long Đao', 'Đánh bại 5 Boss', 'epic', '{"type": "bosses_defeated", "count": 5}', 'both'),
('cards_100', 'Thu Tập Tông Sư', 'Thu thập 100 thẻ', 'epic', '{"type": "cards_collected", "count": 100}', 'both'),
('pronunciation_master', 'Khẩu Âm Cao Thủ', 'Đạt 90+ điểm trong 50 bài phát âm', 'epic', '{"type": "pronunciation_score", "min_score": 90, "count": 50}', 'both'),

-- ============================================================================
-- LEGENDARY BADGES (Ultimate Achievements)
-- ============================================================================
('streak_365', 'Nhất Niên Chân Đế', 'Học liên tục 365 ngày - Huyền thoại bất tử!', 'legendary', '{"type": "streak", "days": 365}', 'both'),
('level_10', 'Hán Hiệp', 'Đạt Level 10 - Đỉnh cao!', 'legendary', '{"type": "level_reached", "level": 10}', 'both'),
('all_bosses', 'Thiên Hạ Vô Địch', 'Đánh bại tất cả Boss', 'legendary', '{"type": "all_bosses_defeated"}', 'both'),
('collection_master', 'Toàn Tập Chân Kinh', 'Thu thập đầy đủ tất cả thẻ', 'legendary', '{"type": "collection_complete", "percentage": 100}', 'both'),
('lessons_500', 'Ngũ Bách La Hán', 'Hoàn thành 500 bài học', 'legendary', '{"type": "lessons_completed", "count": 500}', 'both'),

-- ============================================================================
-- LANGUAGE-SPECIFIC BADGES
-- ============================================================================
-- Mandarin
('mandarin_master', 'Quan Thoại Tông Sư', 'Hoàn thành tất cả bài học tiếng Quan Thoại', 'epic', '{"type": "language_complete", "language": "mandarin"}', 'mandarin'),
('tone_master', 'Tứ Thanh Cao Thủ', 'Phát âm đúng 4 thanh trong 100 từ', 'rare', '{"type": "tone_accuracy", "count": 100}', 'mandarin'),
('hsk1_complete', 'Hán Ngữ Sơ Đẳng', 'Hoàn thành HSK 1', 'rare', '{"type": "hsk_level_complete", "level": 1}', 'mandarin'),
('hsk3_complete', 'Hán Ngữ Trung Đẳng', 'Hoàn thành HSK 3', 'epic', '{"type": "hsk_level_complete", "level": 3}', 'mandarin'),

-- Cantonese
('cantonese_master', 'Quảng Đông Tông Sư', 'Hoàn thành tất cả bài học tiếng Quảng Đông', 'epic', '{"type": "language_complete", "language": "cantonese"}', 'cantonese'),
('nine_tones', 'Cửu Thanh Chân Nhân', 'Phát âm đúng 9 thanh trong 100 từ', 'epic', '{"type": "tone_accuracy", "count": 100}', 'cantonese'),
('hk_slang', 'Cảng Ngữ Đại Sư', 'Học thuộc 50 từ lóng Hong Kong', 'rare', '{"type": "slang_learned", "count": 50}', 'cantonese'),

-- ============================================================================
-- SPECIAL/EVENT BADGES
-- ============================================================================
('early_bird', 'Nhất Nhật Chi Kế', 'Học trước 8h sáng trong 7 ngày', 'rare', '{"type": "time_based", "hour": 8, "days": 7}', 'both'),
('night_owl', 'Dạ Chiến Võ Sĩ', 'Học sau 10h đêm trong 7 ngày', 'rare', '{"type": "time_based", "hour": 22, "days": 7}', 'both'),
('weekend_warrior', 'Tuần Mạt Kiếm Khách', 'Học vào cuối tuần 4 tuần liên tiếp', 'rare', '{"type": "weekend_streak", "weeks": 4}', 'both'),
('lunar_new_year', 'Tết Nguyên Đán', 'Học trong Tết Nguyên Đán', 'epic', '{"type": "event", "event": "lunar_new_year"}', 'both')

ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- END OF BADGES SEED DATA
-- ============================================================================
