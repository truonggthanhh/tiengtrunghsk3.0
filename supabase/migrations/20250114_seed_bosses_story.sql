-- ============================================================================
-- SEED DATA: BOSSES & STORY CHAPTERS
-- 武俠 themed bosses and story mode progression
-- ============================================================================

-- ============================================================================
-- BOSSES
-- ============================================================================

INSERT INTO bosses (code, name, title, description, language, difficulty, hp, level_requirement, questions, reward_xp, reward_card_pack, is_active) VALUES

-- Mandarin Bosses
('mandarin_boss_1', '方师傅', '茶餐厅掌柜', 'Boss đầu tiên - Chủ tiệm trà cổ truyền. Test kiến thức HSK 1 cơ bản về chào hỏi và giao tiếp.', 'mandarin', 1, 100, 1,
  '[
    {"question": "你好 nghĩa là gì?", "options": ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], "correct": 0},
    {"question": "谢谢 phát âm như thế nào?", "options": ["xièxie", "zàijiàn", "duìbùqǐ", "nǐhǎo"], "correct": 0},
    {"question": "我 nghĩa là?", "options": ["Bạn", "Anh ấy", "Tôi", "Cô ấy"], "correct": 2}
  ]'::jsonb,
  200, 3, true),

('mandarin_boss_2', '李师兄', '武馆大师兄', 'Sư huynh của võ quán. Test HSK 2 về động từ và tính từ.', 'mandarin', 3, 150, 3,
  '[
    {"question": "聪明 nghĩa là gì?", "options": ["Đẹp", "Thông minh", "Cao", "Mạnh"], "correct": 1},
    {"question": "努力 có nghĩa?", "options": ["Nghỉ ngơi", "Nỗ lực", "Vui vẻ", "Buồn bã"], "correct": 1}
  ]'::jsonb,
  400, 5, true),

('mandarin_boss_3', '剑圣', '九天剑圣', 'Kiếm Thánh huyền thoại. Thách thức với thành ngữ và câu cổ.', 'mandarin', 5, 200, 5,
  '[
    {"question": "一心一意 nghĩa là?", "options": ["Chia rẽ", "Chuyên tâm", "Lười biếng", "Vội vàng"], "correct": 1},
    {"question": "马到成功 có nghĩa?", "options": ["Thất bại", "Chậm trễ", "Thành công ngay", "Từ từ"], "correct": 2}
  ]'::jsonb,
  800, 10, true),

-- Cantonese Bosses
('cantonese_boss_1', '陳伯', '街市老闆', 'Ông Trần - Chủ chợ Hong Kong. Test từ vựng Quảng Đông cơ bản.', 'cantonese', 1, 100, 1,
  '[
    {"question": "唔該 nghĩa là gì?", "options": ["Làm ơn/Cảm ơn", "Tạm biệt", "Xin lỗi", "Không"], "correct": 0},
    {"question": "食 có nghĩa?", "options": ["Uống", "Ăn", "Ngủ", "Đi"], "correct": 1},
    {"question": "返工 nghĩa là?", "options": ["Về nhà", "Đi làm", "Tan làm", "Đi chơi"], "correct": 1}
  ]'::jsonb,
  200, 3, true),

('cantonese_boss_2', '王師傅', '茶樓點心師傅', 'Sư phụ làm dim sum. Test về văn hóa ẩm thực HK.', 'cantonese', 3, 150, 3,
  '[
    {"question": "得閒飲茶 có nghĩa?", "options": ["Bận rộn", "Rảnh đi uống trà", "Làm việc", "Ngủ ngày"], "correct": 1},
    {"question": "抵食 nghĩa là?", "options": ["Đắt đỏ", "Dở tệ", "Ngon rẻ", "Xa xôi"], "correct": 2}
  ]'::jsonb,
  400, 5, true),

('cantonese_boss_3', '李小龍', '功夫巨星', 'Huyền thoại võ thuật Lý Tiểu Long! Thử thách cuối cùng.', 'cantonese', 5, 200, 5,
  '[
    {"question": "香港精神 là gì?", "options": ["Tinh thần HK", "Văn hóa Trung Quốc", "Ẩm thực", "Du lịch"], "correct": 0},
    {"question": "獅子山下 tượng trưng cho?", "options": ["Núi cao", "Tinh thần HK", "Địa danh", "Động vật"], "correct": 1}
  ]'::jsonb,
  800, 10, true);

-- ============================================================================
-- STORY CHAPTERS
-- ============================================================================

INSERT INTO story_chapters (chapter_number, code, title, description, language, level_requirement, reward_xp, is_active) VALUES

-- Mandarin Story Chapters
(1, 'mandarin_ch1', '初到港城', 'Chương 1: Lần đầu đến Hong Kong. Học cách chào hỏi và giao tiếp cơ bản.', 'mandarin', 1, 100, true),
(2, 'mandarin_ch2', '茶餐厅奇遇', 'Chương 2: Cuộc gặp gỡ tại tiệm trà. Đặt đồ ăn và giao tiếp trong nhà hàng.', 'mandarin', 2, 150, true),
(3, 'mandarin_ch3', '武馆学艺', 'Chương 3: Học võ tại võ quán. Từ vựng về thể thao và rèn luyện.', 'mandarin', 3, 200, true),
(4, 'mandarin_ch4', '市场风云', 'Chương 4: Phong ba tại chợ. Mua sắm và thương lượng giá cả.', 'mandarin', 4, 250, true),
(5, 'mandarin_ch5', '剑圣传说', 'Chương 5: Huyền thoại Kiếm Thánh. Thành ngữ và văn hóa cổ truyền.', 'mandarin', 5, 300, true),

-- Cantonese Story Chapters
(6, 'cantonese_ch1', '港島初體驗', 'Chương 1: Trải nghiệm đầu tiên tại Hong Kong Island. Jyutping cơ bản.', 'cantonese', 1, 100, true),
(7, 'cantonese_ch2', '茶樓飲茶', 'Chương 2: Yum Cha tại lầu trà. Văn hóa ẩm thực Hong Kong.', 'cantonese', 2, 150, true),
(8, 'cantonese_ch3', '街市尋寶', 'Chương 3: Tìm kho báu tại chợ. Từ vựng mua sắm và trò chuyện.', 'cantonese', 3, 200, true),
(9, 'cantonese_ch4', '獅子山精神', 'Chương 4: Tinh thần dưới núi Sư Tử. Lịch sử và văn hóa HK.', 'cantonese', 4, 250, true),
(10, 'cantonese_ch5', '功夫傳奇', 'Chương 5: Truyền thuyết Kung Fu. Di sản võ thuật Hong Kong.', 'cantonese', 5, 300, true);

-- ============================================================================
-- END OF BOSSES & STORY SEED DATA
-- ============================================================================
