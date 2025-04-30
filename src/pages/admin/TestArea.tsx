import { Layout } from '../../components/Layout';
import { TestArea as TestAreaComponent } from '../../components/admin/TestArea';
import { BackupManager } from '../../components/admin/BackupManager';

export function TestArea() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900">Test Area</h1>
          <p className="mt-2 text-gray-600">
            Test system functionality and manage backups.
          </p>
        </div>

        <TestAreaComponent />
        <BackupManager />
      </div>
    </Layout>
  );
}