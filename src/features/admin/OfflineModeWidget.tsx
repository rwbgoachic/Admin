import React from 'react';
import { Card, CardContent, Typography, Box } from '@paysurity/ui';

export const OfflineModeWidget: React.FC = () => {
  const [offlineStatus, setOfflineStatus] = React.useState({
    isOffline: false,
    lastSync: new Date().toISOString(),
    pendingTransactions: 0
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Offline Mode Status
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography>
            Status: {offlineStatus.isOffline ? 'Offline' : 'Online'}
          </Typography>
          <Typography>
            Last Sync: {new Date(offlineStatus.lastSync).toLocaleString()}
          </Typography>
          <Typography>
            Pending Transactions: {offlineStatus.pendingTransactions}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};