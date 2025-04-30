/*
  # Admin Roles and Permissions Schema

  1. New Tables
    - `admin_roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `admin_permissions`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `admin_role_permissions`
      - `role_id` (uuid, references admin_roles)
      - `permission_id` (uuid, references admin_permissions)
      - Primary key on (role_id, permission_id)
    
    - `admin_users`
      - `user_id` (uuid, references auth.users)
      - `role_id` (uuid, references admin_roles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for super admin access
    - Add policies for sub admin access based on roles
*/

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create admin_role_permissions junction table
CREATE TABLE IF NOT EXISTS admin_role_permissions (
  role_id uuid REFERENCES admin_roles ON DELETE CASCADE,
  permission_id uuid REFERENCES admin_permissions ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  role_id uuid REFERENCES admin_roles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id)
);

-- Enable Row Level Security
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_roles
CREATE POLICY "Super admins can manage roles"
  ON admin_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND ar.name = 'super_admin'
    )
  );

CREATE POLICY "All admins can view roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for admin_permissions
CREATE POLICY "Super admins can manage permissions"
  ON admin_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND ar.name = 'super_admin'
    )
  );

CREATE POLICY "All admins can view permissions"
  ON admin_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for admin_role_permissions
CREATE POLICY "Super admins can manage role permissions"
  ON admin_role_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND ar.name = 'super_admin'
    )
  );

CREATE POLICY "All admins can view role permissions"
  ON admin_role_permissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for admin_users
CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      INNER JOIN admin_roles ar ON au.role_id = ar.id
      WHERE au.user_id = auth.uid()
      AND ar.name = 'super_admin'
    )
  );

CREATE POLICY "All admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Insert default roles
INSERT INTO admin_roles (name, description) VALUES
  ('super_admin', 'Full system access with ability to manage other admins'),
  ('sub_admin', 'Limited system access for day-to-day operations');

-- Insert default permissions
INSERT INTO admin_permissions (name, description) VALUES
  ('manage_admins', 'Can create, update, and delete admin users'),
  ('view_analytics', 'Can view system analytics and reports'),
  ('manage_merchants', 'Can manage merchant accounts'),
  ('view_merchants', 'Can view merchant details'),
  ('run_tests', 'Can execute system tests'),
  ('view_logs', 'Can view system logs');

-- Assign permissions to roles
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'super_admin';

INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM admin_roles r
CROSS JOIN admin_permissions p
WHERE r.name = 'sub_admin'
AND p.name IN ('view_analytics', 'view_merchants', 'view_logs');