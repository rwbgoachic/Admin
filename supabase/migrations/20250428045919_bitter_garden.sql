/*
  # Core Data Model for PaySurity Platform

  1. New Tables
    - `software_types` - Defines different types of sub-softwares (e.g., GroceryStorePOS, Payroll)
    - `software_instances` - Individual instances of sub-softwares for different organizations
    - `user_roles` - Role definitions for the platform
    - `user_permissions` - User permissions for specific software instances
    
  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Ensure super admins have full access
    - Regular users can only access their assigned instances
*/

-- Create enum for software types
CREATE TYPE software_category AS ENUM ('pos_grocery', 'pos_restaurant', 'payroll', 'inventory');

-- Software types table
CREATE TABLE IF NOT EXISTS software_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category software_category NOT NULL,
  name text NOT NULL,
  description text,
  features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Software instances table
CREATE TABLE IF NOT EXISTS software_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id uuid REFERENCES software_types(id) ON DELETE RESTRICT,
  name text NOT NULL,
  settings jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User permissions table (junction table)
CREATE TABLE IF NOT EXISTS user_permissions (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  instance_id uuid REFERENCES software_instances(id) ON DELETE CASCADE,
  role_id uuid REFERENCES user_roles(id) ON DELETE RESTRICT,
  custom_permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, instance_id)
);

-- Enable RLS
ALTER TABLE software_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- Policies for software_types
CREATE POLICY "Everyone can read software types"
  ON software_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage software types"
  ON software_types
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN user_permissions up ON ur.id = up.role_id
      WHERE up.user_id = auth.uid()
      AND ur.name = 'super_admin'
    )
  );

-- Policies for software_instances
CREATE POLICY "Users can read assigned instances"
  ON software_instances
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_id = auth.uid()
      AND instance_id = software_instances.id
    )
  );

CREATE POLICY "Super admins can manage instances"
  ON software_instances
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN user_permissions up ON ur.id = up.role_id
      WHERE up.user_id = auth.uid()
      AND ur.name = 'super_admin'
    )
  );

-- Policies for user_roles
CREATE POLICY "Everyone can read roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage roles"
  ON user_roles
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN user_permissions up ON ur.id = up.role_id
      WHERE up.user_id = auth.uid()
      AND ur.name = 'super_admin'
    )
  );

-- Policies for user_permissions
CREATE POLICY "Users can read own permissions"
  ON user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage permissions"
  ON user_permissions
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      INNER JOIN user_permissions up ON ur.id = up.role_id
      WHERE up.user_id = auth.uid()
      AND ur.name = 'super_admin'
    )
  );

-- Create updated_at triggers
CREATE TRIGGER update_software_types_updated_at
  BEFORE UPDATE ON software_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_software_instances_updated_at
  BEFORE UPDATE ON software_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default roles
INSERT INTO user_roles (name, description, permissions) VALUES
  ('super_admin', 'Full system access', '{"all": true}'::jsonb),
  ('admin', 'Instance administrator', '{"manage_users": true, "manage_settings": true}'::jsonb),
  ('user', 'Regular user', '{"use_software": true}'::jsonb);

-- Insert default software types
INSERT INTO software_types (category, name, description) VALUES
  ('pos_grocery', 'GroceryStorePOS', 'Point of sale system for grocery stores'),
  ('pos_restaurant', 'RestaurantPOS', 'Point of sale system for restaurants'),
  ('payroll', 'Payroll', 'Payroll management system'),
  ('inventory', 'Inventory', 'Inventory management system');