import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { SystemMonitor } from '../../components/admin/SystemMonitor';
import { AuditLog } from '../../components/admin/AuditLog';
import { PaysurityAdminList } from '../../components/admin/PaysurityAdminList';
import { PaysurityServiceList } from '../../components/admin/PaysurityServiceList';
import { FAQManager } from '../../components/admin/FAQManager';
import { TouchFriendlyButton } from '../../components/shared/TouchFriendlyButton';

type Tab = 'system' | 'audit' | 'admins' | 'services' | 'faqs';

export function SuperAdmin() {
  const [activeTab, setActiveTab] = useState<Tab>('system');

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor system health, view audit logs, and manage administrative functions.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-6" aria-label="Tabs">
              <TouchFriendlyButton
                variant={activeTab === 'system' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('system')}
              >
                System Monitor
              </TouchFriendlyButton>
              <TouchFriendlyButton
                variant={activeTab === 'audit' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('audit')}
              >
                Audit Logs
              </TouchFriendlyButton>
              <TouchFriendlyButton
                variant={activeTab === 'admins' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('admins')}
              >
                Admins
              </TouchFriendlyButton>
              <TouchFriendlyButton
                variant={activeTab === 'services' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('services')}
              >
                Services
              </TouchFriendlyButton>
              <TouchFriendlyButton
                variant={activeTab === 'faqs' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs
              </TouchFriendlyButton>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'system' && <SystemMonitor />}
            {activeTab === 'audit' && <AuditLog />}
            {activeTab === 'admins' && <PaysurityAdminList />}
            {activeTab === 'services' && <PaysurityServiceList />}
            {activeTab === 'faqs' && <FAQManager />}
          </div>
        </div>
      </div>
    </Layout>
  );
}