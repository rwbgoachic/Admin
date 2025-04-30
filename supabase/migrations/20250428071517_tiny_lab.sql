/*
  # Admin Tables Migration
  
  1. New Tables
    - admin_audit_logs: Track admin actions
    - system_settings: Global system configuration
    - system_logs: System-level logging
    - error_logs: Application error tracking
    - audit_logs: General audit trail
    - test_scripts: Stored test scripts
    - paysurity_admins: Admin user management
    - paysurity_services: Available services
    - paysurity_service_access: Service access control
    - delivery_commission_reports: Delivery commission tracking
  
  2. Security
    - Enable RLS on all tables
    - Add policies for super admin access
*/

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Create system_logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  message text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  stack_trace text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create test_scripts table
CREATE TABLE IF NOT EXISTS test_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  script text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_run_at timestamptz,
  last_run_status text,
  enabled boolean DEFAULT true
);

-- Create paysurity_admins table
CREATE TABLE IF NOT EXISTS paysurity_admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

-- Create paysurity_services table
CREATE TABLE IF NOT EXISTS paysurity_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  config jsonb DEFAULT '{}'::jsonb,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create paysurity_service_access table
CREATE TABLE IF NOT EXISTS paysurity_service_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES paysurity_services(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(service_id, user_id)
);

-- Create delivery_commission_reports table
CREATE TABLE IF NOT EXISTS delivery_commission_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date date NOT NULL,
  store_id uuid NOT NULL,
  total_orders integer DEFAULT 0,
  total_commission numeric(10,2) DEFAULT 0,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable RLS on all tables
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE paysurity_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE paysurity_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE paysurity_service_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_commission_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for super admin access
CREATE POLICY "Super admins can manage admin audit logs"
  ON admin_audit_logs
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage system settings"
  ON system_settings
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage system logs"
  ON system_logs
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage error logs"
  ON error_logs
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage audit logs"
  ON audit_logs
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage test scripts"
  ON test_scripts
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage paysurity admins"
  ON paysurity_admins
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage paysurity services"
  ON paysurity_services
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage service access"
  ON paysurity_service_access
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage delivery commission reports"
  ON delivery_commission_reports
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM paysurity_admins
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON system_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_scripts_updated_at
    BEFORE UPDATE ON test_scripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paysurity_admins_updated_at
    BEFORE UPDATE ON paysurity_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paysurity_services_updated_at
    BEFORE UPDATE ON paysurity_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paysurity_service_access_updated_at
    BEFORE UPDATE ON paysurity_service_access
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_commission_reports_updated_at
    BEFORE UPDATE ON delivery_commission_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();