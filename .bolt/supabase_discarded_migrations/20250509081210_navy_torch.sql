/*
  # Fix Client Feature Toggles Policies

  1. Changes
    - Add INSERT policy for client feature toggles
    - Add DELETE policy for client feature toggles
    - Ensure proper security for all operations

  2. Security
    - Allow authenticated users to insert their own feature toggles
    - Allow authenticated users to delete their own feature toggles
*/

-- Add INSERT policy for client feature toggles
CREATE POLICY "Users can insert own feature toggles" ON client_feature_toggles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Add DELETE policy for client feature toggles
CREATE POLICY "Users can delete own feature toggles" ON client_feature_toggles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = client_id);