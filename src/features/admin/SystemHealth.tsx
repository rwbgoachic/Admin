import React from 'react';
import { Grid } from '@paysurity/ui';
import { RestaurantHealthWidget } from './RestaurantHealthWidget';
import { TokenUsageWidget } from './TokenUsageWidget';
import { OfflineModeWidget } from './OfflineModeWidget';

export const SystemHealth: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <RestaurantHealthWidget />
      </Grid>
      <Grid item xs={12} md={6}>
        <TokenUsageWidget />
      </Grid>
      <Grid item xs={12} md={6}>
        <OfflineModeWidget />
      </Grid>
    </Grid>
  );
};