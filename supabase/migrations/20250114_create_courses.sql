-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Course information
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  language TEXT NOT NULL CHECK (language IN ('cantonese', 'mandarin')),

  -- Course settings
  is_free BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Visual
  thumbnail_url TEXT,
  color TEXT -- Hex color for UI
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_courses_language ON courses(language);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON courses(display_order);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);

-- Add course_id to lessons table
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);

-- RLS for courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Everyone can read active courses
CREATE POLICY "Public can read active courses"
  ON courses
  FOR SELECT
  USING (is_active = true);

-- Admins can manage all courses
CREATE POLICY "Admins can manage courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update trigger for courses
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_courses_updated_at();

-- Insert default courses for Cantonese
INSERT INTO courses (name, slug, description, language, is_free, display_order, color) VALUES
('Giáo trình cơ bản', 'giao-trinh-co-ban', 'Khóa học tiếng Quảng cơ bản cho người mới bắt đầu', 'cantonese', false, 1, '#3B82F6'),
('Giáo trình nâng cao', 'giao-trinh-nang-cao', 'Khóa học tiếng Quảng nâng cao', 'cantonese', false, 2, '#10B981'),
('Hội thoại giao tiếp', 'hoi-thoai-giao-tiep', 'Luyện hội thoại tiếng Quảng thực tế', 'cantonese', false, 3, '#F59E0B')
ON CONFLICT (slug) DO NOTHING;

-- Insert default courses for Mandarin
INSERT INTO courses (name, slug, description, language, is_free, display_order, color) VALUES
('Giáo trình Hán Ngữ', 'giao-trinh-han-ngu', 'Giáo trình Hán Ngữ chuẩn quốc tế', 'mandarin', false, 1, '#3B82F6'),
('Giáo trình Boya', 'giao-trinh-boya', 'Giáo trình Boya Trung Quốc', 'mandarin', false, 2, '#10B981'),
('HSK Luyện thi', 'hsk-luyen-thi', 'Khóa luyện thi HSK các cấp độ', 'mandarin', false, 3, '#F59E0B'),
('Giao tiếp cơ bản', 'giao-tiep-co-ban', 'Tiếng Trung giao tiếp hàng ngày', 'mandarin', true, 4, '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE courses IS 'Courses/Programs that contain multiple lessons';
COMMENT ON COLUMN courses.is_free IS 'Free courses are accessible to all authenticated users';
COMMENT ON COLUMN courses.is_active IS 'Inactive courses are hidden from students';
