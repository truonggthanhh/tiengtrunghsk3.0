-- ============================================================================
-- CHECK AND CLEAN DUPLICATE CARDS
-- Run these queries to check for duplicates and clean if needed
-- ============================================================================

-- ============================================================================
-- STEP 1: Check current card counts
-- ============================================================================
SELECT
  language,
  rarity,
  COUNT(*) as count
FROM cards
GROUP BY language, rarity
ORDER BY language,
  CASE rarity
    WHEN 'common' THEN 1
    WHEN 'rare' THEN 2
    WHEN 'epic' THEN 3
    WHEN 'legendary' THEN 4
  END;

-- Expected results:
-- mandarin  | common    | 15
-- mandarin  | rare      | 10
-- mandarin  | epic      | 5
-- mandarin  | legendary | 3
-- cantonese | common    | 15
-- cantonese | rare      | 10
-- cantonese | epic      | 5
-- cantonese | legendary | 3

-- ============================================================================
-- STEP 2: Check for duplicate cards (same chinese_text + language)
-- ============================================================================
SELECT
  chinese_text,
  language,
  rarity,
  COUNT(*) as duplicate_count,
  ARRAY_AGG(id) as duplicate_ids
FROM cards
GROUP BY chinese_text, language, rarity
HAVING COUNT(*) > 1
ORDER BY language, duplicate_count DESC;

-- If this returns rows, you have duplicates!

-- ============================================================================
-- STEP 3: Delete duplicates (KEEP ONLY OLDEST record)
-- Run this ONLY if Step 2 shows duplicates
-- ============================================================================

-- Preview what will be deleted (run this first)
WITH duplicates AS (
  SELECT
    chinese_text,
    language,
    rarity,
    id,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY chinese_text, language, rarity
      ORDER BY created_at ASC
    ) as rn
  FROM cards
)
SELECT
  chinese_text,
  language,
  rarity,
  id,
  created_at,
  'WILL BE DELETED' as status
FROM duplicates
WHERE rn > 1
ORDER BY language, chinese_text;

-- ============================================================================
-- STEP 4: Actually delete duplicates (UNCOMMENT TO RUN)
-- WARNING: This will permanently delete duplicate records!
-- ============================================================================

/*
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY chinese_text, language, rarity
      ORDER BY created_at ASC
    ) as rn
  FROM cards
)
DELETE FROM cards
WHERE id IN (
  SELECT id
  FROM duplicates
  WHERE rn > 1
);

-- Check results after deletion
SELECT
  language,
  rarity,
  COUNT(*) as count
FROM cards
GROUP BY language, rarity
ORDER BY language, rarity;
*/

-- ============================================================================
-- STEP 5: Verify final counts (should match expected)
-- ============================================================================
SELECT
  'Total Mandarin Cards' as description,
  COUNT(*) as count
FROM cards
WHERE language = 'mandarin'
UNION ALL
SELECT
  'Total Cantonese Cards' as description,
  COUNT(*) as count
FROM cards
WHERE language = 'cantonese'
UNION ALL
SELECT
  'Total All Cards' as description,
  COUNT(*) as count
FROM cards;

-- Expected:
-- Total Mandarin Cards  | 33
-- Total Cantonese Cards | 33
-- Total All Cards       | 66

-- ============================================================================
-- BONUS: View sample cards from each rarity
-- ============================================================================
SELECT
  language,
  rarity,
  chinese_text,
  pronunciation,
  meaning_vi
FROM cards
WHERE language = 'mandarin'
ORDER BY
  CASE rarity
    WHEN 'common' THEN 1
    WHEN 'rare' THEN 2
    WHEN 'epic' THEN 3
    WHEN 'legendary' THEN 4
  END,
  created_at
LIMIT 5;

SELECT
  language,
  rarity,
  chinese_text,
  pronunciation,
  meaning_vi
FROM cards
WHERE language = 'cantonese'
ORDER BY
  CASE rarity
    WHEN 'common' THEN 1
    WHEN 'rare' THEN 2
    WHEN 'epic' THEN 3
    WHEN 'legendary' THEN 4
  END,
  created_at
LIMIT 5;
