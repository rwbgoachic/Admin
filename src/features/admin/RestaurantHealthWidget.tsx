import React from 'react';
import { Card, CardContent, Typography, Box } from '@paysurity/ui';
import { LineChart } from '@mui/x-charts';

interface RestaurantMetrics {
  ordersPerHour: number;
  avgOrderValue: number;
  kitchenUtilization: number;
}

export const RestaurantHealthWidget: React.FC = () => {
  const [metrics, setMetrics] = React.useState<RestaurantMetrics>({
    ordersPerHour: 0,
    avgOrderValue: 0,
    kitchenUtilization: 0
  });

  const chartData = [
    { time: '9AM', orders: 10 },
    { time: '12PM', orders: 25 },
    { time: '3PM', orders: 15 },
    { time: '6PM', orders: 30 },
    { time: '9PM', orders: 20 }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Restaurant Health Metrics
        </Typography>
        <Box sx={{ height: 300 }}>
          <LineChart
            xAxis={[{ data: chartData.map(d => d.time), scaleType: 'band' }]}
            series={[{ data: chartData.map(d => d.orders), area: true }]}
            height={250}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>Orders per hour: {metrics.ordersPerHour}</Typography>
          <Typography>Average order value: ${metrics.avgOrderValue}</Typography>
          <Typography>Kitchen utilization: {metrics.kitchenUtilization}%</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};