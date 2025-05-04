/*
  # Add Audit Logs and Commission Rate

  1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key)
      - `action` (text)
      - `entity_type` (text)
      - `entity_id` (text)
      - `user_id` (uuid, references auth.users)
      - `changes` (jsonb)
      - `created_at` (timestamptz)
    
    - `system_settings`
      - `key` (text, primary key)
      - `value` (text)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for audit logs:
      - Authenticated users can insert
      - Authenticated users can read their own logs
    - Add policies for system settings:
      - Everyone can read
      - Only authenticated users can update
*/

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  changes jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Audit logs policies
CREATE POLICY "Users can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System settings policies
CREATE POLICY "Everyone can read system settings"
  ON system_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can update system settings"
  ON system_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial commission rate
INSERT INTO system_settings (key, value)
VALUES ('delivery_commission_rate', '2.00')
ON CONFLICT (key) DO NOTHING;