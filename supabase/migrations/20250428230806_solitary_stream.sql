/*
  # Add FAQs table and chatbot settings

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `category` (text)
      - `service` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references auth.users)
      - `updated_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on `faqs` table
    - Add policy for super admins to manage FAQs
    - Add policy for authenticated users to read FAQs
*/

-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  service text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faqs' 
    AND policyname = 'Super admins can manage FAQs'
  ) THEN
    CREATE POLICY "Super admins can manage FAQs"
      ON faqs
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faqs' 
    AND policyname = 'Authenticated users can read FAQs'
  ) THEN
    CREATE POLICY "Authenticated users can read FAQs"
      ON faqs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;