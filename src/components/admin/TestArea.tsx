import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { TouchFriendlyButton } from '../shared/TouchFriendlyButton';
import { TouchFriendlyInput } from '../shared/TouchFriendlyInput';
import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';
import { trackError } from '../../lib/error-tracking';

export function TestArea() {
  const [testMessage, setTestMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleTestLog() {
    setLoading(true);
    try {
      await logger.info('Test log message', { message: testMessage });
      toast.success('Test log created successfully');
      setTestMessage('');
    } catch (error) {
      toast.error('Failed to create test log');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTestError() {
    setLoading(true);
    try {
      const error = new Error(testMessage || 'Test error message');
      await trackError(error, { source: 'TestArea' });
      toast.success('Test error logged successfully');
      setTestMessage('');
    } catch (error) {
      toast.error('Failed to log test error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleTestAudit() {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_audit_logs')
        .insert([{
          action: 'test',
          entity_type: 'test',
          details: { message: testMessage || 'Test audit log' },
        }]);

      if (error) throw error;
      toast.success('Test audit log created successfully');
      setTestMessage('');
    } catch (error) {
      toast.error('Failed to create test audit log');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Test Area</h2>
        <p className="mt-1 text-sm text-gray-500">
          Use this area to test various system functions and logging capabilities.
        </p>

        <div className="mt-6 space-y-4">
          <TouchFriendlyInput
            label="Test Message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test message..."
          />

          <div className="flex space-x-4">
            <TouchFriendlyButton
              onClick={handleTestLog}
              disabled={loading}
            >
              Test Log
            </TouchFriendlyButton>
            <TouchFriendlyButton
              onClick={handleTestError}
              disabled={loading}
              variant="danger"
            >
              Test Error
            </TouchFriendlyButton>
            <TouchFriendlyButton
              onClick={handleTestAudit}
              disabled={loading}
              variant="secondary"
            >
              Test Audit
            </TouchFriendlyButton>
          </div>
        </div>
      </div>
    </div>
  );
}