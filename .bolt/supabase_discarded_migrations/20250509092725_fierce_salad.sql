/*
  # Final Fix for Client Feature Toggle Policies

  1. Changes
    - Drop the redundant read policy
    - Update the "manage own features" policy to be more permissive
*/

DROP POLICY IF EXISTS "Users can read own feature toggles" ON client_feature_toggles;
ALTER POLICY "Users can manage own features" ON client_feature_toggles USING (true);