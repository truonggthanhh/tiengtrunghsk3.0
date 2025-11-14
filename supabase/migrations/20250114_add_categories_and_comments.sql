-- Add blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  language TEXT NOT NULL CHECK (language IN ('cantonese', 'mandarin')),
  color TEXT, -- Hex color for UI display (e.g., #FF5733)

  -- For ordering
  display_order INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_language ON blog_categories(language);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Add category_id to blog_posts
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);

-- RLS for categories
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "Public can read categories"
  ON blog_categories
  FOR SELECT
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Blog Comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- For nested replies

  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),

  -- Helpful for moderation
  author_name TEXT, -- Store name in case user is deleted
  author_email TEXT,
  author_ip TEXT,

  -- Engagement
  likes_count INTEGER DEFAULT 0
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_author ON blog_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent ON blog_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON blog_comments(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_comments_updated_at();

-- RLS for comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Public can read approved comments
CREATE POLICY "Public can read approved comments"
  ON blog_comments
  FOR SELECT
  USING (status = 'approved');

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON blog_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON blog_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON blog_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Admins can manage all comments
CREATE POLICY "Admins can manage all comments"
  ON blog_comments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to get comment count for a post
CREATE OR REPLACE FUNCTION get_post_comment_count(post_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM blog_comments
    WHERE post_id = post_id_param
    AND status = 'approved'
  )::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_post_comment_count(UUID) TO anon, authenticated;

-- Function to increment comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_comment_likes(UUID) TO anon, authenticated;

-- Insert some default categories for Cantonese
INSERT INTO blog_categories (name, slug, description, language, color, display_order) VALUES
('Ngữ pháp', 'ngu-phap', 'Các bài viết về ngữ pháp tiếng Quảng', 'cantonese', '#3B82F6', 1),
('Từ vựng', 'tu-vung', 'Học từ vựng tiếng Quảng hàng ngày', 'cantonese', '#10B981', 2),
('Phát âm', 'phat-am', 'Hướng dẫn phát âm chuẩn', 'cantonese', '#F59E0B', 3),
('Văn hóa', 'van-hoa', 'Tìm hiểu văn hóa Hong Kong & Quảng Đông', 'cantonese', '#EF4444', 4),
('Tips & Tricks', 'tips-tricks', 'Mẹo học tiếng Quảng hiệu quả', 'cantonese', '#8B5CF6', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert some default categories for Mandarin
INSERT INTO blog_categories (name, slug, description, language, color, display_order) VALUES
('Ngữ pháp', 'ngu-phap-mandarin', 'Các bài viết về ngữ pháp tiếng Trung', 'mandarin', '#3B82F6', 1),
('Từ vựng HSK', 'tu-vung-hsk', 'Học từ vựng HSK', 'mandarin', '#10B981', 2),
('Phát âm', 'phat-am-mandarin', 'Hướng dẫn phát âm Pinyin', 'mandarin', '#F59E0B', 3),
('Văn hóa Trung Quốc', 'van-hoa-trung-quoc', 'Tìm hiểu văn hóa Trung Quốc', 'mandarin', '#EF4444', 4),
('Luyện thi HSK', 'luyen-thi-hsk', 'Chiến lược thi HSK', 'mandarin', '#8B5CF6', 5)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';
COMMENT ON TABLE blog_comments IS 'Comments and replies on blog posts';
COMMENT ON COLUMN blog_comments.parent_comment_id IS 'For nested/threaded comments - points to parent comment';
COMMENT ON COLUMN blog_comments.status IS 'Moderation status: pending, approved, spam, or deleted';
