import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { SystemLog, ErrorLog } from '../../types/database';

export function SystemMonitor() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [logsResponse, errorsResponse] = await Promise.all([
        supabase
          .from('system_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('error_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (logsResponse.error) throw logsResponse.error;
      if (errorsResponse.error) throw errorsResponse.error;

      setLogs(logsResponse.data);
      setErrors(errorsResponse.data);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Active Errors</h3>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          {errors.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {errors.map((error) => (
                <li key={error.id} className="p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{error.error_message}</p>
                      {error.stack_trace && (
                        <pre className="mt-1 text-xs text-gray-500 overflow-auto">
                          {error.stack_trace}
                        </pre>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {format(new Date(error.created_at), 'PPpp')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No active errors
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Recent System Logs</h3>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log.id} className="p-4">
                <div className="flex items-start">
                  {log.level === 'error' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />}
                  {log.level === 'warn' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                  {log.level === 'info' && <Info className="h-5 w-5 text-blue-500 mt-0.5" />}
                  {log.level === 'debug' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    {Object.keys(log.context).length > 0 && (
                      <pre className="mt-1 text-xs text-gray-500 overflow-auto">
                        {JSON.stringify(log.context, null, 2)}
                      </pre>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {format(new Date(log.created_at), 'PPpp')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}