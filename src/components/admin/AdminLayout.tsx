import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import {
  ChartBarIcon,
  UserGroupIcon,
  BeakerIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { hasPermission } = useAdmin();

  const navigation = [
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      permission: 'view_analytics',
    },
    {
      name: 'Merchants',
      href: '/admin/merchants',
      icon: UserGroupIcon,
      permission: 'view_merchants',
    },
    {
      name: 'System Tests',
      href: '/admin/tests',
      icon: BeakerIcon,
      permission: 'run_tests',
    },
    {
      name: 'Admin Management',
      href: '/admin/admins',
      icon: ShieldCheckIcon,
      permission: 'manage_admins',
    },
    {
      name: 'System Logs',
      href: '/admin/logs',
      icon: DocumentTextIcon,
      permission: 'view_logs',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-semibold text-gray-900">Admin Dashboard</span>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => {
                  if (!hasPermission(item.permission)) return null;
                  
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-6 w-6 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 pb-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}