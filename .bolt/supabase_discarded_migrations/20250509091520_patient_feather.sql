/*
  # Simplify Client Feature Toggle Policies

  1. Changes
    - Remove existing policy for reading feature toggles
    - Create a single comprehensive policy for all operations
    - Ensure proper security for all CRUD operations

  2. Security
    - Single policy that allows users to manage only their own feature toggles
    - Policy covers SELECT, INSERT, UPDATE, and DELETE operations
    - Both row-level security check and WITH CHECK clause ensure user can only access their own data
*/

DROP POLICY IF EXISTS "Users can read own feature toggles" ON client_feature_toggles;

CREATE POLICY "Users can manage own features" ON client_feature_toggles
  FOR ALL USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);