-- ============================================
-- DICTIONARY SCHEMA FOR CVDICT
-- Chinese-Vietnamese Dictionary Integration
-- ============================================

-- Drop existing table if exists
DROP TABLE IF EXISTS dictionary_entries CASCADE;

-- Create dictionary_entries table
CREATE TABLE dictionary_entries (
  id BIGSERIAL PRIMARY KEY,
  simplified TEXT NOT NULL,
  traditional TEXT,
  pinyin_number TEXT,  -- Format: han4 zi4
  pinyin_tone TEXT,    -- Format: hànzì (with tone marks)
  vietnamese TEXT NOT NULL,
  hsk_level INTEGER,   -- Optional: HSK 1-6 level
  frequency INTEGER,   -- Optional: word frequency rank
  source TEXT DEFAULT 'CVDICT',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast lookup
CREATE INDEX idx_dictionary_simplified ON dictionary_entries(simplified);
CREATE INDEX idx_dictionary_traditional ON dictionary_entries(traditional);
CREATE INDEX idx_dictionary_pinyin_number ON dictionary_entries(pinyin_number);
CREATE INDEX idx_dictionary_pinyin_tone ON dictionary_entries(pinyin_tone);
CREATE INDEX idx_dictionary_hsk_level ON dictionary_entries(hsk_level);

-- Create full-text search index for Vietnamese meanings
CREATE INDEX idx_dictionary_vietnamese_fts ON dictionary_entries
USING gin(to_tsvector('simple', vietnamese));

-- Create composite index for common search patterns
CREATE INDEX idx_dictionary_search ON dictionary_entries(simplified, traditional, pinyin_number);

-- Enable Row Level Security (allow public read access)
ALTER TABLE dictionary_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can SELECT (read) dictionary entries
CREATE POLICY "Allow public read access to dictionary"
  ON dictionary_entries FOR SELECT
  TO public
  USING (true);

-- Policy: Only authenticated users with admin role can INSERT/UPDATE/DELETE
CREATE POLICY "Only admins can modify dictionary"
  ON dictionary_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_dictionary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_dictionary_updated_at
  BEFORE UPDATE ON dictionary_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_dictionary_updated_at();

-- ============================================
-- SEARCH FUNCTIONS
-- ============================================

-- Function to search dictionary by multiple criteria
CREATE OR REPLACE FUNCTION search_dictionary(
  search_query TEXT,
  search_mode TEXT DEFAULT 'auto',
  max_results INTEGER DEFAULT 30,
  offset_val INTEGER DEFAULT 0
)
RETURNS TABLE (
  id BIGINT,
  simplified TEXT,
  traditional TEXT,
  pinyin_number TEXT,
  pinyin_tone TEXT,
  vietnamese TEXT,
  hsk_level INTEGER,
  frequency INTEGER,
  relevance FLOAT
) AS $$
BEGIN
  -- Auto-detect search mode if not specified
  IF search_mode = 'auto' THEN
    -- Check if query contains Chinese characters
    IF search_query ~ '[\u4e00-\u9fff]' THEN
      search_mode := 'hanzi';
    -- Check if query contains pinyin with numbers (e.g., ni3 hao3)
    ELSIF search_query ~ '[a-z]+[1-5]' THEN
      search_mode := 'pinyin';
    -- Otherwise assume Vietnamese
    ELSE
      search_mode := 'vietnamese';
    END IF;
  END IF;

  -- Search based on mode
  IF search_mode = 'hanzi' THEN
    -- Search by Hanzi (Chinese characters)
    RETURN QUERY
    SELECT * FROM (
      SELECT
        de.id,
        de.simplified,
        de.traditional,
        de.pinyin_number,
        de.pinyin_tone,
        de.vietnamese,
        de.hsk_level,
        de.frequency,
        CASE
          WHEN de.simplified = search_query THEN 1.0
          WHEN de.traditional = search_query THEN 0.95
          WHEN de.simplified LIKE search_query || '%' THEN 0.8
          WHEN de.simplified LIKE '%' || search_query || '%' THEN 0.6
          ELSE 0.5
        END AS relevance
      FROM dictionary_entries de
      WHERE de.simplified LIKE '%' || search_query || '%'
         OR de.traditional LIKE '%' || search_query || '%'
    ) subq
    ORDER BY subq.relevance DESC, subq.frequency ASC NULLS LAST
    LIMIT max_results OFFSET offset_val;

  ELSIF search_mode = 'pinyin' THEN
    -- Search by Pinyin
    RETURN QUERY
    SELECT * FROM (
      SELECT
        de.id,
        de.simplified,
        de.traditional,
        de.pinyin_number,
        de.pinyin_tone,
        de.vietnamese,
        de.hsk_level,
        de.frequency,
        CASE
          WHEN de.pinyin_number = LOWER(search_query) THEN 1.0
          WHEN de.pinyin_tone = LOWER(search_query) THEN 0.95
          WHEN de.pinyin_number LIKE LOWER(search_query) || '%' THEN 0.8
          WHEN de.pinyin_number LIKE '%' || LOWER(search_query) || '%' THEN 0.6
          ELSE 0.5
        END AS relevance
      FROM dictionary_entries de
      WHERE de.pinyin_number ILIKE '%' || search_query || '%'
         OR de.pinyin_tone ILIKE '%' || search_query || '%'
    ) subq
    ORDER BY subq.relevance DESC, subq.frequency ASC NULLS LAST
    LIMIT max_results OFFSET offset_val;

  ELSIF search_mode = 'vietnamese' THEN
    -- Search by Vietnamese
    RETURN QUERY
    SELECT * FROM (
      SELECT
        de.id,
        de.simplified,
        de.traditional,
        de.pinyin_number,
        de.pinyin_tone,
        de.vietnamese,
        de.hsk_level,
        de.frequency,
        ts_rank(to_tsvector('simple', de.vietnamese), plainto_tsquery('simple', search_query)) AS relevance
      FROM dictionary_entries de
      WHERE to_tsvector('simple', de.vietnamese) @@ plainto_tsquery('simple', search_query)
         OR de.vietnamese ILIKE '%' || search_query || '%'
    ) subq
    ORDER BY subq.relevance DESC, subq.frequency ASC NULLS LAST
    LIMIT max_results OFFSET offset_val;

  ELSE
    -- Fallback: search all fields
    RETURN QUERY
    SELECT * FROM (
      SELECT
        de.id,
        de.simplified,
        de.traditional,
        de.pinyin_number,
        de.pinyin_tone,
        de.vietnamese,
        de.hsk_level,
        de.frequency,
        0.5::FLOAT AS relevance
      FROM dictionary_entries de
      WHERE de.simplified LIKE '%' || search_query || '%'
         OR de.traditional LIKE '%' || search_query || '%'
         OR de.pinyin_number ILIKE '%' || search_query || '%'
         OR de.vietnamese ILIKE '%' || search_query || '%'
    ) subq
    ORDER BY subq.frequency ASC NULLS LAST
    LIMIT max_results OFFSET offset_val;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION search_dictionary TO public;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to get dictionary statistics
CREATE OR REPLACE FUNCTION get_dictionary_stats()
RETURNS JSON AS $$
SELECT json_build_object(
  'total_entries', COUNT(*),
  'entries_with_hsk', COUNT(*) FILTER (WHERE hsk_level IS NOT NULL),
  'entries_by_hsk', json_object_agg(
    'HSK' || hsk_level,
    COUNT(*)
  ) FILTER (WHERE hsk_level IS NOT NULL)
)
FROM dictionary_entries;
$$ LANGUAGE SQL STABLE;

GRANT EXECUTE ON FUNCTION get_dictionary_stats TO public;

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert some sample entries
INSERT INTO dictionary_entries (simplified, traditional, pinyin_number, pinyin_tone, vietnamese, hsk_level, frequency) VALUES
('你好', '你好', 'ni3 hao3', 'nǐ hǎo', 'xin chào; chào', 1, 1),
('谢谢', '謝謝', 'xie4 xie4', 'xièxiè', 'cảm ơn; cám ơn', 1, 2),
('再见', '再見', 'zai4 jian4', 'zàijiàn', 'tạm biệt; hẹn gặp lại', 1, 3),
('中国', '中國', 'zhong1 guo2', 'zhōngguó', 'Trung Quốc', 1, 4),
('汉字', '漢字', 'han4 zi4', 'hànzì', 'chữ Hán; Hán tự', 2, 100),
('学习', '學習', 'xue2 xi2', 'xuéxí', 'học tập; học hành', 1, 50),
('朋友', '朋友', 'peng2 you3', 'péngyǒu', 'bạn bè; bằng hữu', 1, 30),
('老师', '老師', 'lao3 shi1', 'lǎoshī', 'giáo viên; thầy giáo; cô giáo', 1, 25);

-- ============================================
-- END OF DICTIONARY SCHEMA
-- ============================================
