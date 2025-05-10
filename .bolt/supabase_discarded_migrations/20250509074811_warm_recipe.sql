/*
  # Add Client Feature Toggles Table

  1. New Tables
    - `client_feature_toggles`
      - `client_id` (uuid, references auth.users)
      - `feature_name` (text)
      - `is_enabled` (boolean)
      Primary key is composite of (client_id, feature_name)

  2. Security
    - Enable RLS on `client_feature_toggles` table
    - Add policies for:
      - Authenticated users can read their own feature toggles
      - Only authenticated users can update their own feature toggles
*/

CREATE TABLE IF NOT EXISTS client_feature_toggles (
  client_id uuid REFERENCES auth.users NOT NULL,
  feature_name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  PRIMARY KEY (client_id, feature_name)
);

ALTER TABLE client_feature_toggles ENABLE ROW LEVEL SECURITY;

-- Allow clients to read their own feature toggles
CREATE POLICY "Users can read own feature toggles" ON client_feature_toggles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Allow clients to update their own feature toggles
CREATE POLICY "Users can update own feature toggles" ON client_feature_toggles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);