import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button } from '@paysurity/ui';
import { supabase } from '../../lib/supabase';
import { AuditService } from '../../services/audit-service';

export const CommissionRateWidget: React.FC = () => {
  const [rate, setRate] = useState<number>(0);
  const [newRate, setNewRate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentRate();
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

  const handleRateUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newRateNum = parseFloat(newRate);
      if (isNaN(newRateNum) || newRateNum < 0) {
        throw new Error('Invalid rate value');
      }

      const { error: updateError } = await supabase
        .from('system_settings')
        .update({ value: newRate })
        .eq('key', 'delivery_commission_rate');

      if (updateError) throw updateError;

      await AuditService.log(
        'update',
        'system_settings',
        'delivery_commission_rate',
        (await supabase.auth.getUser()).data.user?.id || '',
        { old_rate: rate, new_rate: newRateNum }
      );

      setRate(newRateNum);
      setNewRate('');
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
              helperText={error}
            />
            <Button
              variant="contained"
              onClick={handleRateUpdate}
              disabled={loading || !newRate}
            >
              Update Rate
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};