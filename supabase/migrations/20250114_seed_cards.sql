-- ============================================================================
-- SEED DATA: VOCABULARY CARDS
-- Sample cards for both Mandarin and Cantonese with rarity distribution
-- ============================================================================

INSERT INTO cards (card_type, rarity, language, chinese_text, pronunciation, meaning_vi, power_level, metadata) VALUES

-- ============================================================================
-- MANDARIN CARDS - COMMON (Basic HSK 1-2)
-- ============================================================================
('vocabulary', 'common', 'mandarin', '你好', 'nǐ hǎo', 'Xin chào', 1, '{"hsk_level": 1, "category": "greeting"}'),
('vocabulary', 'common', 'mandarin', '谢谢', 'xièxie', 'Cảm ơn', 1, '{"hsk_level": 1, "category": "courtesy"}'),
('vocabulary', 'common', 'mandarin', '再见', 'zàijiàn', 'Tạm biệt', 1, '{"hsk_level": 1, "category": "greeting"}'),
('vocabulary', 'common', 'mandarin', '对不起', 'duìbùqǐ', 'Xin lỗi', 1, '{"hsk_level": 1, "category": "courtesy"}'),
('vocabulary', 'common', 'mandarin', '是', 'shì', 'Là (to be)', 1, '{"hsk_level": 1, "category": "grammar"}'),
('vocabulary', 'common', 'mandarin', '不', 'bù', 'Không', 1, '{"hsk_level": 1, "category": "grammar"}'),
('vocabulary', 'common', 'mandarin', '我', 'wǒ', 'Tôi', 1, '{"hsk_level": 1, "category": "pronoun"}'),
('vocabulary', 'common', 'mandarin', '你', 'nǐ', 'Bạn', 1, '{"hsk_level": 1, "category": "pronoun"}'),
('vocabulary', 'common', 'mandarin', '他', 'tā', 'Anh ấy', 1, '{"hsk_level": 1, "category": "pronoun"}'),
('vocabulary', 'common', 'mandarin', '她', 'tā', 'Cô ấy', 1, '{"hsk_level": 1, "category": "pronoun"}'),
('vocabulary', 'common', 'mandarin', '吃', 'chī', 'Ăn', 1, '{"hsk_level": 1, "category": "verb"}'),
('vocabulary', 'common', 'mandarin', '喝', 'hē', 'Uống', 1, '{"hsk_level": 1, "category": "verb"}'),
('vocabulary', 'common', 'mandarin', '学习', 'xuéxí', 'Học tập', 1, '{"hsk_level": 1, "category": "verb"}'),
('vocabulary', 'common', 'mandarin', '工作', 'gōngzuò', 'Làm việc', 1, '{"hsk_level": 1, "category": "verb"}'),
('vocabulary', 'common', 'mandarin', '朋友', 'péngyou', 'Bạn bè', 1, '{"hsk_level": 1, "category": "noun"}'),

-- ============================================================================
-- MANDARIN CARDS - RARE (HSK 2-3)
-- ============================================================================
('vocabulary', 'rare', 'mandarin', '聪明', 'cōngming', 'Thông minh', 2, '{"hsk_level": 2, "category": "adjective"}'),
('vocabulary', 'rare', 'mandarin', '漂亮', 'piàoliang', 'Đẹp', 2, '{"hsk_level": 2, "category": "adjective"}'),
('vocabulary', 'rare', 'mandarin', '努力', 'nǔlì', 'Nỗ lực', 2, '{"hsk_level": 2, "category": "verb"}'),
('vocabulary', 'rare', 'mandarin', '考试', 'kǎoshì', 'Thi cử', 2, '{"hsk_level": 2, "category": "noun"}'),
('vocabulary', 'rare', 'mandarin', '旅游', 'lǚyóu', 'Du lịch', 2, '{"hsk_level": 2, "category": "verb"}'),
('vocabulary', 'rare', 'mandarin', '健康', 'jiànkāng', 'Sức khỏe', 3, '{"hsk_level": 3, "category": "noun"}'),
('vocabulary', 'rare', 'mandarin', '环境', 'huánjìng', 'Môi trường', 3, '{"hsk_level": 3, "category": "noun"}'),
('vocabulary', 'rare', 'mandarin', '经验', 'jīngyàn', 'Kinh nghiệm', 3, '{"hsk_level": 3, "category": "noun"}'),
('vocabulary', 'rare', 'mandarin', '成功', 'chénggōng', 'Thành công', 3, '{"hsk_level": 3, "category": "noun"}'),
('vocabulary', 'rare', 'mandarin', '态度', 'tàidu', 'Thái độ', 3, '{"hsk_level": 3, "category": "noun"}'),

-- ============================================================================
-- MANDARIN CARDS - EPIC (Advanced + Chengyu)
-- ============================================================================
('phrase', 'epic', 'mandarin', '一心一意', 'yì xīn yì yì', 'Chuyên tâm, toàn tâm toàn ý', 4, '{"type": "chengyu", "category": "idiom"}'),
('phrase', 'epic', 'mandarin', '马到成功', 'mǎ dào chéng gōng', 'Thành công ngay lập tức', 4, '{"type": "chengyu", "category": "idiom"}'),
('phrase', 'epic', 'mandarin', '千里之行，始于足下', 'qiān lǐ zhī xíng, shǐ yú zú xià', 'Ngàn dặm bắt đầu từ bước chân', 4, '{"type": "proverb", "category": "wisdom"}'),
('phrase', 'epic', 'mandarin', '画龙点睛', 'huà lóng diǎn jīng', 'Điểm tô hoàn thiện', 4, '{"type": "chengyu", "category": "idiom"}'),
('phrase', 'epic', 'mandarin', '一石二鸟', 'yì shí èr niǎo', 'Một mũi tên trúng hai đích', 4, '{"type": "chengyu", "category": "idiom"}'),

-- ============================================================================
-- MANDARIN CARDS - LEGENDARY (武俠 Theme)
-- ============================================================================
('character', 'legendary', 'mandarin', '侠', 'xiá', 'Hiệp - Người anh hùng', 5, '{"theme": "wuxia", "category": "character"}'),
('phrase', 'legendary', 'mandarin', '飞龙在天', 'fēi lóng zài tiān', 'Rồng bay trên trời', 5, '{"theme": "wuxia", "category": "idiom"}'),
('phrase', 'legendary', 'mandarin', '剑气纵横', 'jiàn qì zòng héng', 'Kiếm khí tung hoành', 5, '{"theme": "wuxia", "category": "idiom"}'),

-- ============================================================================
-- CANTONESE CARDS - COMMON (Daily Use)
-- ============================================================================
('vocabulary', 'common', 'cantonese', '你好', 'nei5 hou2', 'Xin chào', 1, '{"category": "greeting"}'),
('vocabulary', 'common', 'cantonese', '唔該', 'm4 goi1', 'Làm ơn / Cảm ơn', 1, '{"category": "courtesy"}'),
('vocabulary', 'common', 'cantonese', '對唔住', 'deoi3 m4 zyu6', 'Xin lỗi', 1, '{"category": "courtesy"}'),
('vocabulary', 'common', 'cantonese', '係', 'hai6', 'Là (to be)', 1, '{"category": "grammar"}'),
('vocabulary', 'common', 'cantonese', '唔係', 'm4 hai6', 'Không phải', 1, '{"category": "grammar"}'),
('vocabulary', 'common', 'cantonese', '我', 'ngo5', 'Tôi', 1, '{"category": "pronoun"}'),
('vocabulary', 'common', 'cantonese', '你', 'nei5', 'Bạn', 1, '{"category": "pronoun"}'),
('vocabulary', 'common', 'cantonese', '食', 'sik6', 'Ăn', 1, '{"category": "verb"}'),
('vocabulary', 'common', 'cantonese', '飲', 'jam2', 'Uống', 1, '{"category": "verb"}'),
('vocabulary', 'common', 'cantonese', '去', 'heoi3', 'Đi', 1, '{"category": "verb"}'),
('vocabulary', 'common', 'cantonese', '返', 'faan1', 'Về, trở lại', 1, '{"category": "verb"}'),
('vocabulary', 'common', 'cantonese', '做嘢', 'zou6 je5', 'Làm việc', 1, '{"category": "verb"}'),
('vocabulary', 'common', 'cantonese', '讀書', 'duk6 syu1', 'Đọc sách, học', 1, '{"category": "verb"}'),
('vocabulary', 'common', 'cantonese', '朋友', 'pang4 jau5', 'Bạn bè', 1, '{"category": "noun"}'),
('vocabulary', 'common', 'cantonese', '屋企', 'uk1 kei2', 'Nhà', 1, '{"category": "noun"}'),

-- ============================================================================
-- CANTONESE CARDS - RARE (Hong Kong Slang)
-- ============================================================================
('vocabulary', 'rare', 'cantonese', '好靚', 'hou2 leng3', 'Rất đẹp', 2, '{"category": "adjective", "slang": true}'),
('vocabulary', 'rare', 'cantonese', '巴閉', 'baa1 bai3', 'Kiêu ngạo, tự phụ', 2, '{"category": "slang", "tone": "negative"}'),
('vocabulary', 'rare', 'cantonese', '搞掂', 'gaau2 dim6', 'Xong xuôi, OK', 2, '{"category": "slang"}'),
('vocabulary', 'rare', 'cantonese', '收工', 'sau1 gung1', 'Tan làm', 2, '{"category": "work"}'),
('vocabulary', 'rare', 'cantonese', '返工', 'faan1 gung1', 'Đi làm', 2, '{"category": "work"}'),
('vocabulary', 'rare', 'cantonese', '打工仔', 'daa2 gung1 zai2', 'Nhân viên văn phòng', 2, '{"category": "work", "slang": true}'),
('vocabulary', 'rare', 'cantonese', '發達', 'faat3 daat6', 'Làm giàu, phát tài', 2, '{"category": "money"}'),
('vocabulary', 'rare', 'cantonese', '抵食', 'dai2 sik6', 'Đáng ăn (ngon rẻ)', 2, '{"category": "food", "slang": true}'),
('vocabulary', 'rare', 'cantonese', '正', 'zeng3', 'Tuyệt vời, cool', 2, '{"category": "slang"}'),
('vocabulary', 'rare', 'cantonese', '慘', 'caam2', 'Tệ, thảm', 2, '{"category": "emotion"}'),

-- ============================================================================
-- CANTONESE CARDS - EPIC (Hong Kong Culture)
-- ============================================================================
('phrase', 'epic', 'cantonese', '得閒飲茶', 'dak1 haan4 jam2 caa4', 'Rảnh đi uống trà (yum cha)', 4, '{"category": "culture", "context": "invitation"}'),
('phrase', 'epic', 'cantonese', '一齊去飲糖水', 'jat1 cai4 heoi3 jam2 tong4 seoi2', 'Cùng đi ăn chè', 4, '{"category": "food", "culture": "hk"}'),
('phrase', 'epic', 'cantonese', '好彩', 'hou2 coi2', 'May mắn', 4, '{"category": "luck"}'),
('phrase', 'epic', 'cantonese', '恭喜發財', 'gung1 hei2 faat3 coi4', 'Chúc mừng phát tài', 4, '{"category": "greeting", "context": "new_year"}'),
('phrase', 'epic', 'cantonese', '身體健康', 'san1 tai2 gin6 hong1', 'Sức khỏe dồi dào', 4, '{"category": "blessing"}'),

-- ============================================================================
-- CANTONESE CARDS - LEGENDARY (Hong Kong Icons)
-- ============================================================================
('npc', 'legendary', 'cantonese', '李小龍', 'lei5 siu2 lung4', 'Lý Tiểu Long - Huyền thoại võ thuật', 5, '{"type": "icon", "category": "martial_arts"}'),
('phrase', 'legendary', 'cantonese', '香港精神', 'hoeng1 gong2 zing1 san4', 'Tinh thần Hong Kong', 5, '{"theme": "culture", "category": "spirit"}'),
('phrase', 'legendary', 'cantonese', '獅子山下', 'si1 zi2 saan1 haa6', 'Dưới núi Sư Tử (tinh thần HK)', 5, '{"theme": "culture", "category": "spirit"}');

-- ============================================================================
-- END OF CARDS SEED DATA
-- ============================================================================
