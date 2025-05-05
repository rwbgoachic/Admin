import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button } from '@paysurity/ui';
import { supabase } from '../../lib/supabase';
import { AuditService } from '../../services/audit-service';

export const CommissionRateWidget: React.FC = () => {
  const [rate, setRate] = useState<number>(0);
  const [newRate, setNewRate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchCurrentRate();
    fetchRateHistory();
  }, []);

  const fetchCurrentRate = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'delivery_commission_rate')
        .single();

      if (error) throw error;
      setRate(parseFloat(data.value));
    } catch (err) {
      console.error('Error fetching commission rate:', err);
      setError('Failed to load commission rate');
    }
  };

  const fetchRateHistory = async () => {
    try {
      const logs = await AuditService.getEntityHistory(
        'system_settings',
        'delivery_commission_rate'
      );
      setHistory(logs);
    } catch (err) {
      console.error('Error fetching rate history:', err);
    }
  };

  const validateRate = (value: number): string | null => {
    if (isNaN(value)) return 'Rate must be a number';
    if (value < 0) return 'Rate cannot be negative';
    if (value > 10) return 'Rate cannot exceed 10%';
    return null;
  };

  const handleRateUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newRateNum = parseFloat(newRate);
      const validationError = validateRate(newRateNum);
      if (validationError) {
        throw new Error(validationError);
      }

      const { error: updateError } = await supabase
        .from('system_settings')
        .update({ value: newRate })
        .eq('key', 'delivery_commission_rate');

      if (updateError) throw updateError;

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      await AuditService.log(
        'update',
        'system_settings',
        'delivery_commission_rate',
        userId,
        { old_rate: rate, new_rate: newRateNum }
      );

      setRate(newRateNum);
      setNewRate('');
      await fetchRateHistory();
    } catch (err) {
      console.error('Error updating commission rate:', err);
      setError(err instanceof Error ? err.message : 'Failed to update rate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Delivery Commission Rate
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Current Rate: {rate.toFixed(2)}%
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="New Rate (%)"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              type="number"
              size="small"
              error={!!error}
              helperText={error || 'Enter a rate between 0-10%'}
              inputProps={{ min: 0, max: 10, step: 0.01 }}
            />
            <Button
              variant="contained"
              onClick={handleRateUpdate}
              disabled={loading || !newRate}
            >
              Update Rate
            </Button>
          </Box>
          {history.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Rate Change History
              </Typography>
              {history.map((log) => (
                <Typography key={log.id} variant="body2" color="text.secondary">
                  {new Date(log.created_at).toLocaleString()}: {log.changes.old_rate}% → {log.changes.new_rate}%
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};