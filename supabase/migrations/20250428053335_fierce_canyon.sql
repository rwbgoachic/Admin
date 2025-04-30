/*
  # Add URL fields to software instances

  1. Changes
    - Add `site_url` column to store web application URLs
    - Add `mobile_app_url` column to store mobile application URLs

  2. Security
    - Inherits existing RLS policies from software_instances table
*/

-- Add site_url and mobile_app_url columns to software_instances
ALTER TABLE software_instances
ADD COLUMN IF NOT EXISTS site_url TEXT,
ADD COLUMN IF NOT EXISTS mobile_app_url TEXT;