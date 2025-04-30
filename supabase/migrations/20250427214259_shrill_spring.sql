/*
  # Add source URL to blog posts

  1. Changes
    - Add source_url column to blog_posts table for tracking original article sources
    - Add system_generated column to identify auto-generated posts

  2. Notes
    - source_url is nullable since not all posts will be from external sources
    - system_generated helps distinguish between human and bot-created content
*/

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS source_url text,
ADD COLUMN IF NOT EXISTS system_generated boolean DEFAULT false;

-- Create index for faster queries on system_generated posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_system_generated ON blog_posts(system_generated);