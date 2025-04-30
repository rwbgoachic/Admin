/*
  # Add wallet type support for software instances

  1. New Types
    - `wallet_type` enum with values:
      - `employer_employee`
      - `parent_child`

  2. Changes
    - Add `wallet_type` column to `software_instances` table
    - Add validation function to ensure wallet type is only set for POS software

  3. Security
    - Function is created with standard permissions
    - Inherits existing RLS policies from software_instances table
*/

-- Create wallet type enum
CREATE TYPE wallet_type AS ENUM ('employer_employee', 'parent_child');

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

-- Add wallet_type column to software_instances
ALTER TABLE software_instances
ADD COLUMN wallet_type wallet_type;

-- Add check constraint using the function
ALTER TABLE software_instances
ADD CONSTRAINT valid_wallet_type CHECK (is_valid_wallet_type(type_id, wallet_type));