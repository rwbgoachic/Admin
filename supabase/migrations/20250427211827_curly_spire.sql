/*
  # Create blog tables

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `content` (text)
      - `excerpt` (text)
      - `author_id` (uuid, references users)
      - `published` (boolean)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
    - `blog_post_categories`
      - Junction table for posts and categories
      - `post_id` (uuid, references blog_posts)
      - `category_id` (uuid, references blog_categories)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read published posts
    - Add policies for admin users to manage posts and categories
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  author_id uuid REFERENCES auth.users NOT NULL,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_post_categories junction table
CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id uuid REFERENCES blog_posts ON DELETE CASCADE,
  category_id uuid REFERENCES blog_categories ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
CREATE POLICY "Anyone can read published posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authors can manage their own posts"
  ON blog_posts
  FOR ALL
  USING (auth.uid() = author_id);

-- Policies for blog_categories
CREATE POLICY "Anyone can read categories"
  ON blog_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can manage categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for blog_post_categories
CREATE POLICY "Anyone can read post categories"
  ON blog_post_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authors can manage their post categories"
  ON blog_post_categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM blog_posts
    WHERE blog_posts.id = post_id
    AND blog_posts.author_id = auth.uid()
  ));