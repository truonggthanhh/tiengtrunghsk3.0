-- ============================================================================
-- SEED DATA: WHEEL REWARDS
-- Lucky wheel reward pool with probability weights
-- ============================================================================

INSERT INTO wheel_rewards (reward_type, reward_value, reward_label, probability, is_active) VALUES

-- ============================================================================
-- XP REWARDS (Most Common - 40% total)
-- ============================================================================
('xp', 50, '+50 XP', 15.0, true),
('xp', 100, '+100 XP', 12.0, true),
('xp', 200, '+200 XP', 8.0, true),
('xp', 500, '+500 XP', 5.0, true),

-- ============================================================================
-- CARD PACK REWARDS (Common - 30% total)
-- ============================================================================
('card_pack', 1, '1 Thẻ Ngẫu Nhiên', 12.0, true),
('card_pack', 3, '3 Thẻ Ngẫu Nhiên', 10.0, true),
('card_pack', 5, '5 Thẻ Ngẫu Nhiên', 5.0, true),
('card_pack', 10, '10 Thẻ Hiếm', 3.0, true),

-- ============================================================================
-- EXTRA SPIN REWARDS (Rare - 15% total)
-- ============================================================================
('extra_spin', 1, '+1 Lượt Quay', 8.0, true),
('extra_spin', 2, '+2 Lượt Quay', 5.0, true),
('extra_spin', 3, '+3 Lượt Quay', 2.0, true),

-- ============================================================================
-- SPECIAL REWARDS (Rare - 15% total)
-- ============================================================================
('xp', 1000, '+1000 XP Đại Thưởng!', 3.0, true),
('card_pack', 20, 'Gói 20 Thẻ Vàng!', 2.0, true),
('extra_spin', 5, '+5 Lượt Quay Vàng!', 1.0, true),
('xp', 2000, 'JACKPOT +2000 XP!!!', 0.5, true),
('card_pack', 50, 'SIÊU PHẨM 50 Thẻ!!!', 0.3, true),
('extra_spin', 10, 'HUYỀN THOẠI +10 Lượt!!!', 0.2, true)

ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFY TOTAL PROBABILITY (Should be ~100)
-- ============================================================================
-- SELECT SUM(probability) as total_probability FROM wheel_rewards WHERE is_active = true;
-- Expected: ~100.0

-- ============================================================================
-- END OF WHEEL REWARDS SEED DATA
-- ============================================================================
