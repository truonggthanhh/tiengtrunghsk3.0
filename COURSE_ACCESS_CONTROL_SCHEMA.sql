-- =====================================================
-- COURSE ACCESS CONTROL SYSTEM
-- Hệ thống khóa/mở khóa bài học cho users
-- =====================================================

-- Table: user_course_access
-- Lưu trữ quyền truy cập của user cho từng course/lesson
CREATE TABLE IF NOT EXISTS user_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_type TEXT NOT NULL, -- 'hsk_1', 'hsk_2', ..., 'hsk_6', 'msutong_1', ..., 'msutong_4', 'cantonese_lesson_1', ..., 'cantonese_lesson_20'
  is_unlocked BOOLEAN DEFAULT false NOT NULL,
  unlocked_at TIMESTAMPTZ,
  unlocked_by_admin_id UUID REFERENCES profiles(id),
  notes TEXT, -- Ghi chú của admin khi unlock
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, course_type)
);

-- Index để tăng tốc query
CREATE INDEX IF NOT EXISTS idx_user_course_access_user_id ON user_course_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_access_course_type ON user_course_access(course_type);
CREATE INDEX IF NOT EXISTS idx_user_course_access_unlocked ON user_course_access(user_id, is_unlocked);

-- RLS Policies
ALTER TABLE user_course_access ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users có thể xem access của chính họ
DROP POLICY IF EXISTS "Users can view their own course access" ON user_course_access;
CREATE POLICY "Users can view their own course access"
  ON user_course_access FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Admins có thể xem tất cả
DROP POLICY IF EXISTS "Admins can view all course access" ON user_course_access;
CREATE POLICY "Admins can view all course access"
  ON user_course_access FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 3: Chỉ admins có thể insert/update/delete
DROP POLICY IF EXISTS "Only admins can manage course access" ON user_course_access;
CREATE POLICY "Only admins can manage course access"
  ON user_course_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function 1: Check if user has access to a course
CREATE OR REPLACE FUNCTION check_course_access(
  p_user_id UUID,
  p_course_type TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Admins luôn có quyền truy cập
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id AND role = 'admin'
  ) THEN
    RETURN true;
  END IF;

  -- Kiểm tra xem user có được unlock course này không
  RETURN EXISTS (
    SELECT 1 FROM user_course_access
    WHERE user_id = p_user_id
    AND course_type = p_course_type
    AND is_unlocked = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 2: Unlock course cho user (gọi bởi admin)
CREATE OR REPLACE FUNCTION unlock_course_for_user(
  p_user_id UUID,
  p_course_type TEXT,
  p_admin_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can unlock courses';
  END IF;

  -- Insert or update access record
  INSERT INTO user_course_access (
    user_id,
    course_type,
    is_unlocked,
    unlocked_at,
    unlocked_by_admin_id,
    notes
  )
  VALUES (
    p_user_id,
    p_course_type,
    true,
    now(),
    p_admin_id,
    p_notes
  )
  ON CONFLICT (user_id, course_type)
  DO UPDATE SET
    is_unlocked = true,
    unlocked_at = now(),
    unlocked_by_admin_id = p_admin_id,
    notes = COALESCE(EXCLUDED.notes, user_course_access.notes),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 3: Lock course cho user (revoke access)
CREATE OR REPLACE FUNCTION lock_course_for_user(
  p_user_id UUID,
  p_course_type TEXT,
  p_admin_id UUID
)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can lock courses';
  END IF;

  -- Update access record
  UPDATE user_course_access
  SET
    is_unlocked = false,
    updated_at = now()
  WHERE user_id = p_user_id
  AND course_type = p_course_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 4: Get all courses with access status for a user
CREATE OR REPLACE FUNCTION get_user_course_access(p_user_id UUID)
RETURNS TABLE (
  course_type TEXT,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMPTZ,
  unlocked_by_admin_name TEXT,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    uca.course_type,
    uca.is_unlocked,
    uca.unlocked_at,
    COALESCE(
      p.first_name || ' ' || p.last_name,
      p.email
    ) as unlocked_by_admin_name,
    uca.notes
  FROM user_course_access uca
  LEFT JOIN profiles p ON p.id = uca.unlocked_by_admin_id
  WHERE uca.user_id = p_user_id
  ORDER BY uca.course_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function 5: Bulk unlock multiple courses for a user
CREATE OR REPLACE FUNCTION bulk_unlock_courses(
  p_user_id UUID,
  p_course_types TEXT[],
  p_admin_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  course_type TEXT;
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can unlock courses';
  END IF;

  -- Loop through course types and unlock each
  FOREACH course_type IN ARRAY p_course_types
  LOOP
    PERFORM unlock_course_for_user(p_user_id, course_type, p_admin_id, p_notes);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA / DEFAULTS
-- =====================================================

-- Optional: Tạo function để auto-create access records khi user đăng ký
CREATE OR REPLACE FUNCTION initialize_user_course_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Mặc định tất cả courses đều locked cho user mới
  -- Admin sẽ phải manually unlock
  -- Không cần insert gì cả, chỉ return NEW
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger này có thể enable nếu muốn auto-create records
-- DROP TRIGGER IF EXISTS on_user_created ON auth.users;
-- CREATE TRIGGER on_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION initialize_user_course_access();

-- Function 6: Get all users with emails (for admin UI)
CREATE OR REPLACE FUNCTION get_all_users_with_emails()
RETURNS TABLE (
  id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    au.email::TEXT,  -- Cast VARCHAR to TEXT
    p.role::TEXT     -- Cast to TEXT
  FROM profiles p
  INNER JOIN auth.users au ON au.id = p.id
  ORDER BY au.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COURSE TYPE DEFINITIONS
-- =====================================================

/*
  MANDARIN COURSES:
  - hsk_1, hsk_2, hsk_3, hsk_4, hsk_5, hsk_6
  - msutong_1, msutong_2, msutong_3, msutong_4

  CANTONESE LESSONS:
  - cantonese_lesson_1 đến cantonese_lesson_20

  Example usage:

  -- Unlock HSK 1 cho user
  SELECT unlock_course_for_user(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'hsk_1',
    'admin-user-id'::uuid,
    'Học viên VIP đã thanh toán'
  );

  -- Check access
  SELECT check_course_access(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'hsk_1'
  );

  -- Get all access for user
  SELECT * FROM get_user_course_access('00000000-0000-0000-0000-000000000001'::uuid);

  -- Bulk unlock HSK 1-3
  SELECT bulk_unlock_courses(
    '00000000-0000-0000-0000-000000000001'::uuid,
    ARRAY['hsk_1', 'hsk_2', 'hsk_3'],
    'admin-user-id'::uuid,
    'Package HSK 1-3 đã thanh toán'
  );
*/
