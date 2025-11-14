-- Fix author_id to reference profiles instead of auth.users
-- This allows Supabase to perform joins correctly

-- Drop the old foreign key constraint
ALTER TABLE blog_posts
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

-- Add new foreign key to profiles
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES profiles(id)
ON DELETE SET NULL;

-- Do the same for blog_comments
ALTER TABLE blog_comments
DROP CONSTRAINT IF EXISTS blog_comments_author_id_fkey;

ALTER TABLE blog_comments
ADD CONSTRAINT blog_comments_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES profiles(id)
ON DELETE SET NULL;

COMMENT ON CONSTRAINT blog_posts_author_id_fkey ON blog_posts IS 'References profiles table for proper Supabase joins';
COMMENT ON CONSTRAINT blog_comments_author_id_fkey ON blog_comments IS 'References profiles table for proper Supabase joins';
