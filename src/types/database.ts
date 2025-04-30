export type SoftwareCategory = 'pos_grocery' | 'pos_restaurant' | 'payroll' | 'inventory';
export type WalletType = 'employer_employee' | 'parent_child';

export interface SoftwareType {
  id: string;
  category: SoftwareCategory;
  name: string;
  description: string | null;
  features: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SoftwareInstance {
  id: string;
  type_id: string;
  name: string;
  settings: Record<string, unknown>;
  active: boolean;
  wallet_type: WalletType | null;
  site_url: string | null;
  mobile_app_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  user_id: string;
  instance_id: string;
  role_id: string;
  custom_permissions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface SystemLog {
  id: string;
  level: string;
  message: string;
  context: Record<string, unknown>;
  created_at: string;
}

export interface ErrorLog {
  id: string;
  error_message: string;
  stack_trace: string | null;
  context: Record<string, unknown>;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface TestScript {
  id: string;
  name: string;
  description: string | null;
  script: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
  last_run_status: string | null;
  enabled: boolean;
}

export interface PaysurityAdmin {
  id: string;
  role: string;
  permissions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface PaysurityService {
  id: string;
  name: string;
  description: string | null;
  config: Record<string, unknown>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaysurityServiceAccess {
  id: string;
  service_id: string;
  user_id: string;
  permissions: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DeliveryCommissionReport {
  id: string;
  report_date: string;
  store_id: string;
  total_orders: number;
  total_commission: number;
  details: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  status: string;
}