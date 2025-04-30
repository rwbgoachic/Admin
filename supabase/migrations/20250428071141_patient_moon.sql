/*
  # Combined Schema Updates
  
  1. New Types
    - `wallet_type` enum for POS software instances
  
  2. Functions
    - `is_valid_wallet_type` to validate wallet type based on software category
  
  3. Changes
    - Add `wallet_type` column to software_instances
    - Add `site_url` and `mobile_app_url` columns
    - Add constraint to validate wallet type
  
  4. Security
    - Inherits existing RLS policies from software_instances table
*/

-- Create wallet type enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE wallet_type AS ENUM ('employer_employee', 'parent_child');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create a function to check wallet type validity
CREATE OR REPLACE FUNCTION is_valid_wallet_type(type_id UUID, wallet_type wallet_type)
RETURNS BOOLEAN AS $$
BEGIN
  IF wallet_type IS NULL THEN
    RETURN NOT EXISTS (
      SELECT 1
      FROM software_types
      WHERE id = type_id
      AND category IN ('pos_grocery', 'pos_restaurant')
    );
  ELSE
    RETURN EXISTS (
      SELECT 1
      FROM software_types
      WHERE id = type_id
      AND category IN ('pos_grocery', 'pos_restaurant')
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add columns if they don't exist
DO $$ 
BEGIN
  -- Add wallet_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'software_instances' AND column_name = 'wallet_type'
  ) THEN
    ALTER TABLE software_instances ADD COLUMN wallet_type wallet_type;
  END IF;

  -- Add site_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'software_instances' AND column_name = 'site_url'
  ) THEN
    ALTER TABLE software_instances ADD COLUMN site_url TEXT;
  END IF;

  -- Add mobile_app_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'software_instances' AND column_name = 'mobile_app_url'
  ) THEN
    ALTER TABLE software_instances ADD COLUMN mobile_app_url TEXT;
  END IF;
END $$;

-- Add check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'software_instances' AND constraint_name = 'valid_wallet_type'
  ) THEN
    ALTER TABLE software_instances
    ADD CONSTRAINT valid_wallet_type CHECK (is_valid_wallet_type(type_id, wallet_type));
  END IF;
END $$;