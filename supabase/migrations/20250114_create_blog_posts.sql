-- Create blog_posts table for both Cantonese and Mandarin content
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly version of title
  excerpt TEXT, -- Short description for listing pages
  content TEXT NOT NULL, -- Full blog post content (supports HTML/Markdown)
  featured_image_url TEXT, -- Optional cover image

  -- Metadata
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  language TEXT NOT NULL CHECK (language IN ('cantonese', 'mandarin')), -- Which language site
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Categories/Tags (stored as JSONB array)
  tags JSONB DEFAULT '[]'::JSONB,

  -- Analytics
  view_count INTEGER DEFAULT 0
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Authenticated users can create drafts
CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own posts
CREATE POLICY "Authors can update their own blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Admins can do everything
CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_post_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_blog_post_view_count(UUID) TO anon, authenticated;

COMMENT ON TABLE blog_posts IS 'Blog posts for both Cantonese and Mandarin learning sites';
COMMENT ON COLUMN blog_posts.slug IS 'URL-friendly identifier for the post';
COMMENT ON COLUMN blog_posts.language IS 'Which language site this post belongs to (cantonese or mandarin)';
COMMENT ON COLUMN blog_posts.status IS 'Publication status: draft, published, or archived';
