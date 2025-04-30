import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';
import type { AdminAuditLog, AuditLog } from '../../types/database';

type CombinedAuditLog = (AdminAuditLog | AuditLog) & {
  user?: { email: string } | null;
};

export function AuditLog() {
  const [logs, setLogs] = useState<CombinedAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [uniqueActions, setUniqueActions] = useState<string[]>([]);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  async function loadAuditLogs() {
    try {
      const [adminLogsResponse, auditLogsResponse] = await Promise.all([
        supabase
          .from('admin_audit_logs')
          .select(`
            *,
            user:admin_id (
              email
            )
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('audit_logs')
          .select(`
            *,
            user:user_id (
              email
            )
          `)
          .order('created_at', { ascending: false }),
      ]);

      if (adminLogsResponse.error) throw adminLogsResponse.error;
      if (auditLogsResponse.error) throw auditLogsResponse.error;

      const combinedLogs = [
        ...(adminLogsResponse.data || []),
        ...(auditLogsResponse.data || []),
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Extract unique actions for filtering
      const actions = new Set(combinedLogs.map(log => log.action));
      setUniqueActions(Array.from(actions));
      
      setLogs(combinedLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = selectedAction === 'all' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <TouchFriendlyInput
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          icon={<Search className="h-4 w-4 text-gray-400" />}
          placeholder="Search logs..."
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Action Filter
          </label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[44px]"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(log.created_at), 'PPpp')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.user?.email || 'System'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center">
                    {log.action}
                    {log.entity_type && (
                      <span className="ml-1 text-gray-500">
                        ({log.entity_type})
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No audit logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}