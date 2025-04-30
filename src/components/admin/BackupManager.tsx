import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Upload } from 'lucide-react';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';

export function BackupManager() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const tables = [
        'software_types',
        'software_instances',
        'user_roles',
        'user_permissions',
        'system_settings',
        'paysurity_services',
      ];

      const data: Record<string, any> = {};

      await Promise.all(
        tables.map(async (table) => {
          const { data: tableData, error } = await supabase
            .from(table)
            .select('*');

          if (error) throw error;
          data[table] = tableData;
        })
      );

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paysurity-backup-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await logger.info('System backup exported', {
        tables,
        timestamp: new Date().toISOString(),
      });

      toast.success('Backup exported successfully');
    } catch (error) {
      toast.error('Failed to export backup');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return;

    setLoading(true);
    try {
      const file = event.target.files[0];
      const text = await file.text();
      const data = JSON.parse(text);

      for (const [table, records] of Object.entries(data)) {
        const { error } = await supabase
          .from(table)
          .upsert(records as any[]);

        if (error) throw error;
      }

      await logger.info('System backup imported', {
        filename: file.name,
        timestamp: new Date().toISOString(),
      });

      toast.success('Backup imported successfully');
      event.target.value = '';
    } catch (error) {
      toast.error('Failed to import backup');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Backup Manager</h2>
        <p className="mt-1 text-sm text-gray-500">
          Export or import system data for backup and recovery purposes.
        </p>

        <div className="mt-6 flex space-x-4">
          <TouchFriendlyButton
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Backup
          </TouchFriendlyButton>

          <label>
            <TouchFriendlyButton
              variant="secondary"
              disabled={loading}
              className="inline-flex items-center"
              onClick={() => document.getElementById('import-file')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Backup
            </TouchFriendlyButton>
            <input
              type="file"
              id="import-file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}