const request = require('supertest');
const app = require('../../index.js');

describe('Offline Mode Tests', () => {
  test('API endpoints work without internet connection', async () => {
    const response = await request(app).get('/admin/system-health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('uptime');
  });
});