# Changelog

## [Unreleased]

### Added (Features)
- **Cantonese Story Mode**: 10 chapters với 500 câu hỏi sử dụng Jyutping romanization
- **Mandarin Story Mode**: 10 chapters với 500 câu hỏi sử dụng Pinyin romanization
- Question types: meaning, pinyin/jyutping, hanzi, sentence

### Fixed (Bug Fixes)
- **User Registration**: Giảm password requirement từ 8 chars + complexity xuống 6 chars minimum
- **Database Error**: Fixed "Database error saving new user" với multi-layer fallback
- **Login Routing**: Implement returnUrl pattern - users quay về đúng vị trí sau khi đăng nhập
- **Cantonese Gamification**: Fixed blank screens do import conflicts và Header component issues
- **Gamification Dashboard**: Fixed API mismatch (userProgress vs userPoints)

### Changed
- Removed Header component từ tất cả Cantonese gamification pages (23 references)
- Updated imports to use correct Cantonese modules
- Enhanced password validation messages

### Technical Details
- API differences: Mandarin uses `{ userProgress, addXP }`, Cantonese uses `{ userPoints, addPoints }`
- Romanization: Mandarin uses Pinyin, Cantonese uses Jyutping
- Routing: Implemented returnUrl parameter for proper post-login navigation
- Database: Added exception handling in trigger + fallback initialization

## Commits in this PR
- 3717751 - Fix Cantonese Story Mode - Import và API errors
- c3159b3 - Fix Cantonese gamification pages - Import conflicts
- e5283d4 - Fix login redirect routing
- b768066 - Fix Cantonese Gamification Dashboard
- 0520b92 - Fix Cantonese Story Mode - Import và API errors (previous)
- e1d3cd0 - Fix Database error saving new user
- cd2f6c4 - Fix user registration password requirements
- 6a25235 - Hoàn thành Mandarin Story Mode: 500/500 câu
- 6b0e969 - Hoàn thành Cantonese Story Mode: 10 chương với 500 câu
