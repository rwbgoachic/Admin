import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AdminRole {
  id: string;
  name: string;
  description: string;
}

interface AdminPermission {
  id: string;
  name: string;
  description: string;
}

interface AdminUser {
  role: AdminRole;
  permissions: AdminPermission[];
}

interface AdminContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminUser: AdminUser | null;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      if (!user) {
        setAdminUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select(`
            role:admin_roles (
              id,
              name,
              description
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (adminError || !adminData) {
          setAdminUser(null);
          setLoading(false);
          return;
        }

        const { data: permissions, error: permError } = await supabase
          .from('admin_role_permissions')
          .select(`
            permission:admin_permissions (
              id,
              name,
              description
            )
          `)
          .eq('role_id', adminData.role.id);

        if (permError) throw permError;

        setAdminUser({
          role: adminData.role,
          permissions: permissions.map(p => p.permission),
        });
      } catch (error) {
        console.error('Error loading admin data:', error);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, [user]);

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) return false;
    return adminUser.permissions.some(p => p.name === permission);
  };

  const value = {
    isAdmin: !!adminUser,
    isSuperAdmin: adminUser?.role.name === 'super_admin',
    adminUser,
    hasPermission,
    loading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}