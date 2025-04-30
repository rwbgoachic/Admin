/*
  # System Tables and Policies

  1. New Tables
    - admin_audit_logs: Track admin actions
    - system_settings: Store system configuration
    - system_logs: General system logging
    - error_logs: Error tracking and resolution
    - audit_logs: User action auditing
    - test_scripts: Store and manage test scripts
    - paysurity_admins: Admin user management
    - paysurity_services: Service configuration
    - paysurity_service_access: Service access control
    - delivery_commission_reports: Commission tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for super admin access
    - Implement proper foreign key constraints
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Admin Audit Logs
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

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admin_audit_logs' 
    AND policyname = 'Super admins can manage admin audit logs'
  ) THEN
    CREATE POLICY "Super admins can manage admin audit logs"
      ON admin_audit_logs
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'system_settings' 
    AND policyname = 'Super admins can manage system settings'
  ) THEN
    CREATE POLICY "Super admins can manage system settings"
      ON system_settings
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- System Logs
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL,
  message text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'system_logs' 
    AND policyname = 'Super admins can manage system logs'
  ) THEN
    CREATE POLICY "Super admins can manage system logs"
      ON system_logs
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- Error Logs
CREATE TABLE IF NOT EXISTS error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message text NOT NULL,
  stack_trace text,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id)
);

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'error_logs' 
    AND policyname = 'Super admins can manage error logs'
  ) THEN
    CREATE POLICY "Super admins can manage error logs"
      ON error_logs
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'Super admins can manage audit logs'
  ) THEN
    CREATE POLICY "Super admins can manage audit logs"
      ON audit_logs
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- Test Scripts
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

ALTER TABLE test_scripts ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_test_scripts_updated_at ON test_scripts;
CREATE TRIGGER update_test_scripts_updated_at
  BEFORE UPDATE ON test_scripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'test_scripts' 
    AND policyname = 'Super admins can manage test scripts'
  ) THEN
    CREATE POLICY "Super admins can manage test scripts"
      ON test_scripts
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- Paysurity Admins
CREATE TABLE IF NOT EXISTS paysurity_admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role text NOT NULL,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

ALTER TABLE paysurity_admins ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_paysurity_admins_updated_at ON paysurity_admins;
CREATE TRIGGER update_paysurity_admins_updated_at
  BEFORE UPDATE ON paysurity_admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'paysurity_admins' 
    AND policyname = 'Super admins can manage paysurity admins'
  ) THEN
    CREATE POLICY "Super admins can manage paysurity admins"
      ON paysurity_admins
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins paysurity_admins_1
        WHERE paysurity_admins_1.id = auth.uid()
        AND paysurity_admins_1.role = 'super_admin'
      ));
  END IF;
END $$;

-- Paysurity Services
CREATE TABLE IF NOT EXISTS paysurity_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  config jsonb DEFAULT '{}'::jsonb,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE paysurity_services ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_paysurity_services_updated_at ON paysurity_services;
CREATE TRIGGER update_paysurity_services_updated_at
  BEFORE UPDATE ON paysurity_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'paysurity_services' 
    AND policyname = 'Super admins can manage paysurity services'
  ) THEN
    CREATE POLICY "Super admins can manage paysurity services"
      ON paysurity_services
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- Paysurity Service Access
CREATE TABLE IF NOT EXISTS paysurity_service_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES paysurity_services(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  permissions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(service_id, user_id)
);

ALTER TABLE paysurity_service_access ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_paysurity_service_access_updated_at ON paysurity_service_access;
CREATE TRIGGER update_paysurity_service_access_updated_at
  BEFORE UPDATE ON paysurity_service_access
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'paysurity_service_access' 
    AND policyname = 'Super admins can manage service access'
  ) THEN
    CREATE POLICY "Super admins can manage service access"
      ON paysurity_service_access
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;

-- Delivery Commission Reports
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

ALTER TABLE delivery_commission_reports ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_delivery_commission_reports_updated_at ON delivery_commission_reports;
CREATE TRIGGER update_delivery_commission_reports_updated_at
  BEFORE UPDATE ON delivery_commission_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'delivery_commission_reports' 
    AND policyname = 'Super admins can manage delivery commission reports'
  ) THEN
    CREATE POLICY "Super admins can manage delivery commission reports"
      ON delivery_commission_reports
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM paysurity_admins
        WHERE paysurity_admins.id = auth.uid()
        AND paysurity_admins.role = 'super_admin'
      ));
  END IF;
END $$;