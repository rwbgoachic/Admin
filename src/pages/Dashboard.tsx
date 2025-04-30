import { Layout } from '../components/Layout';
import { SoftwareTypeList } from '../components/admin/SoftwareTypeList';
import { SoftwareInstanceList } from '../components/admin/SoftwareInstanceList';

export function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-4 text-gray-600">
            Welcome to the Paysurity Admin dashboard. This is where you'll manage your Paysurity services.
          </p>
        </div>

        <SoftwareTypeList />
        <SoftwareInstanceList />
      </div>
    </Layout>
  );
}