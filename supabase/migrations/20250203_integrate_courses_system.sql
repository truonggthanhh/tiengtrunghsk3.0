-- ============================================================================
-- INTEGRATE COURSES SYSTEM - Make courses table work with actual app
-- Date: 2025-02-03
-- ============================================================================
-- This migration:
-- 1. Seeds all HSK and Msutong courses into courses table
-- 2. Adds course_type_legacy for backward compatibility
-- 3. Updates course_access to reference courses.id instead of string
-- ============================================================================

-- ============================================================================
-- PART 1: Add legacy course_type column for mapping
-- ============================================================================
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS course_type_legacy TEXT UNIQUE;

COMMENT ON COLUMN courses.course_type_legacy IS
'Legacy course type mapping (hsk_1, msutong_1, etc.) for backward compatibility';

-- ============================================================================
-- PART 2: Seed HSK Courses
-- ============================================================================
INSERT INTO courses (name, slug, description, language, is_free, display_order, color, course_type_legacy) VALUES
('HSK 1', 'hsk-1', 'Khóa học HSK cấp độ 1 - Cơ bản nhất', 'mandarin', true, 10, '#EF4444', 'hsk_1'),
('HSK 2', 'hsk-2', 'Khóa học HSK cấp độ 2', 'mandarin', true, 11, '#F97316', 'hsk_2'),
('HSK 3', 'hsk-3', 'Khóa học HSK cấp độ 3', 'mandarin', false, 12, '#F59E0B', 'hsk_3'),
('HSK 4', 'hsk-4', 'Khóa học HSK cấp độ 4', 'mandarin', false, 13, '#84CC16', 'hsk_4'),
('HSK 5', 'hsk-5', 'Khóa học HSK cấp độ 5 - Trung cấp', 'mandarin', false, 14, '#10B981', 'hsk_5'),
('HSK 6', 'hsk-6', 'Khóa học HSK cấp độ 6 - Cao cấp nhất', 'mandarin', false, 15, '#06B6D4', 'hsk_6')
ON CONFLICT (course_type_legacy) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  color = EXCLUDED.color;

-- ============================================================================
-- PART 3: Seed Msutong (Mã Thượng Công) Courses
-- ============================================================================
INSERT INTO courses (name, slug, description, language, is_free, display_order, color, course_type_legacy) VALUES
('Msutong Sơ Cấp 1', 'msutong-so-cap-1', 'Giáo trình Mã Thượng Công Sơ cấp quyển 1', 'mandarin', false, 20, '#3B82F6', 'msutong_1'),
('Msutong Sơ Cấp 2', 'msutong-so-cap-2', 'Giáo trình Mã Thượng Công Sơ cấp quyển 2', 'mandarin', false, 21, '#6366F1', 'msutong_2'),
('Msutong Sơ Cấp 3', 'msutong-so-cap-3', 'Giáo trình Mã Thượng Công Sơ cấp quyển 3', 'mandarin', false, 22, '#8B5CF6', 'msutong_3'),
('Msutong Sơ Cấp 4', 'msutong-so-cap-4', 'Giáo trình Mã Thượng Công Sơ cấp quyển 4', 'mandarin', false, 23, '#A855F7', 'msutong_4')
ON CONFLICT (course_type_legacy) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  color = EXCLUDED.color;

-- ============================================================================
-- PART 4: Seed Cantonese Lessons (as courses)
-- ============================================================================
INSERT INTO courses (name, slug, description, language, is_free, display_order, color, course_type_legacy) VALUES
('Tiếng Quảng Bài 1', 'tieng-quang-bai-1', 'Bài học tiếng Quảng số 1', 'cantonese', true, 101, '#EC4899', 'cantonese_lesson_1'),
('Tiếng Quảng Bài 2', 'tieng-quang-bai-2', 'Bài học tiếng Quảng số 2', 'cantonese', true, 102, '#DB2777', 'cantonese_lesson_2'),
('Tiếng Quảng Bài 3', 'tieng-quang-bai-3', 'Bài học tiếng Quảng số 3', 'cantonese', false, 103, '#BE185D', 'cantonese_lesson_3'),
('Tiếng Quảng Bài 4', 'tieng-quang-bai-4', 'Bài học tiếng Quảng số 4', 'cantonese', false, 104, '#9F1239', 'cantonese_lesson_4'),
('Tiếng Quảng Bài 5', 'tieng-quang-bai-5', 'Bài học tiếng Quảng số 5', 'cantonese', false, 105, '#881337', 'cantonese_lesson_5')
ON CONFLICT (course_type_legacy) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  color = EXCLUDED.color;

-- Add more Cantonese lessons up to 20
DO $$
BEGIN
  FOR i IN 6..20 LOOP
    INSERT INTO courses (name, slug, description, language, is_free, display_order, color, course_type_legacy)
    VALUES (
      'Tiếng Quảng Bài ' || i,
      'tieng-quang-bai-' || i,
      'Bài học tiếng Quảng số ' || i,
      'cantonese',
      false,
      100 + i,
      '#' || substring(md5(i::text), 1, 6), -- Generate unique color
      'cantonese_lesson_' || i
    )
    ON CONFLICT (course_type_legacy) DO NOTHING;
  END LOOP;
END $$;

-- ============================================================================
-- PART 5: Create and migrate course_access table
-- ============================================================================

-- Create course_access table if not exists
CREATE TABLE IF NOT EXISTS course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  unlocked_by_admin_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_course_access_user ON course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_course_access_course_id ON course_access(course_id);

-- Enable RLS
ALTER TABLE course_access ENABLE ROW LEVEL SECURITY;

-- Note: Table already has course_id column from CREATE TABLE above
-- This section handles data migration if there was old data (there isn't for fresh install)

-- Update RLS policies for course_access
DROP POLICY IF EXISTS "Users can view their own course access" ON course_access;
DROP POLICY IF EXISTS "Admins can manage all course access" ON course_access;

CREATE POLICY "Users can view their own course access"
ON course_access FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all course access"
ON course_access FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- ============================================================================
-- PART 6: Update RPC functions to use course_id
-- ============================================================================

-- Drop old functions
DROP FUNCTION IF EXISTS check_course_access(UUID, TEXT);
DROP FUNCTION IF EXISTS get_user_course_access(UUID);
DROP FUNCTION IF EXISTS unlock_course_for_user(UUID, UUID);
DROP FUNCTION IF EXISTS lock_course_for_user(UUID, UUID);

-- Create new function with course_id
CREATE OR REPLACE FUNCTION check_course_access(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  -- Check if user is admin
  SELECT CASE
    WHEN EXISTS (
      SELECT 1 FROM profiles
      WHERE id = p_user_id AND is_admin = true
    ) THEN true
    -- Check if course is free
    WHEN EXISTS (
      SELECT 1 FROM courses
      WHERE id = p_course_id AND is_free = true
    ) THEN true
    -- Check course_access table
    WHEN EXISTS (
      SELECT 1 FROM course_access
      WHERE user_id = p_user_id
      AND course_id = p_course_id
      AND is_unlocked = true
    ) THEN true
    ELSE false
  END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_course_access(UUID, UUID) TO authenticated;

-- Get all course access for a user
CREATE OR REPLACE FUNCTION get_user_course_access(
  p_user_id UUID
)
RETURNS TABLE (
  course_id UUID,
  course_name TEXT,
  course_slug TEXT,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT
    c.id as course_id,
    c.name as course_name,
    c.slug as course_slug,
    COALESCE(ca.is_unlocked, c.is_free, false) as is_unlocked,
    ca.unlocked_at
  FROM courses c
  LEFT JOIN course_access ca ON ca.course_id = c.id AND ca.user_id = p_user_id
  WHERE c.is_active = true
  ORDER BY c.display_order;
$$;

GRANT EXECUTE ON FUNCTION get_user_course_access(UUID) TO authenticated;

-- Unlock course for user
CREATE OR REPLACE FUNCTION unlock_course_for_user(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  INSERT INTO course_access (user_id, course_id, is_unlocked, unlocked_at)
  VALUES (p_user_id, p_course_id, true, NOW())
  ON CONFLICT (user_id, course_id)
  DO UPDATE SET is_unlocked = true, unlocked_at = NOW();
$$;

GRANT EXECUTE ON FUNCTION unlock_course_for_user(UUID, UUID) TO authenticated;

-- Lock course for user
CREATE OR REPLACE FUNCTION lock_course_for_user(
  p_user_id UUID,
  p_course_id UUID
)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  UPDATE course_access
  SET is_unlocked = false
  WHERE user_id = p_user_id AND course_id = p_course_id;
$$;

GRANT EXECUTE ON FUNCTION lock_course_for_user(UUID, UUID) TO authenticated;

-- ============================================================================
-- PART 7: Add helpful views
-- ============================================================================

-- View to see all courses with their legacy types (for debugging)
CREATE OR REPLACE VIEW courses_with_legacy AS
SELECT
  id,
  name,
  slug,
  course_type_legacy,
  language,
  is_free,
  is_active,
  display_order,
  color
FROM courses
ORDER BY language, display_order;

GRANT SELECT ON courses_with_legacy TO authenticated;

-- ============================================================================
-- SECURITY NOTES & COMMENTS
-- ============================================================================

COMMENT ON COLUMN courses.course_type_legacy IS
'Maps to old hardcoded course types for backward compatibility. Will be deprecated once frontend migrates.';

COMMENT ON FUNCTION check_course_access IS
'Checks if user has access to a course. Returns true for: admins, free courses, or unlocked courses.';

COMMENT ON FUNCTION get_user_course_access IS
'Returns all courses with their access status for a specific user. Used by course listing pages.';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
