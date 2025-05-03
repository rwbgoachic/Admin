import React from 'react';
import { Card, CardContent, Typography, Box } from '@paysurity/ui';
import { LineChart } from '@mui/x-charts';

export const TokenUsageWidget: React.FC = () => {
  const [tokenMetrics, setTokenMetrics] = React.useState({
    dailyUsage: 0,
    monthlyUsage: 0,
    usageLimit: 1000000
  });

  const usageData = [
    { date: 'Mon', tokens: 150000 },
    { date: 'Tue', tokens: 180000 },
    { date: 'Wed', tokens: 160000 },
    { date: 'Thu', tokens: 200000 },
    { date: 'Fri', tokens: 170000 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Token Usage Metrics
        </Typography>
        <Box sx={{ height: 300 }}>
          <LineChart
            xAxis={[{ data: usageData.map(d => d.date), scaleType: 'band' }]}
            series={[{ data: usageData.map(d => d.tokens), area: true }]}
            height={250}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>Daily Usage: {tokenMetrics.dailyUsage.toLocaleString()} tokens</Typography>
          <Typography>Monthly Usage: {tokenMetrics.monthlyUsage.toLocaleString()} tokens</Typography>
          <Typography>Usage Limit: {tokenMetrics.usageLimit.toLocaleString()} tokens</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};