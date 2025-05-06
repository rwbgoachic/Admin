const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const employeeAPI = require('./src/employeeAPI');
require('./src/utils/testScheduler');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/admin/system-health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    node_version: process.version
  };
  
  res.json(healthStatus);
});

// Mount the employee API routes
app.use('/api', employeeAPI);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});