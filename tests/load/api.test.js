const request = require('supertest');
const app = require('../../index.js');

describe('Load Tests - API Endpoints', () => {
  test('Health endpoint handles multiple concurrent requests', async () => {
    const requests = Array(50).fill().map(() => 
      request(app).get('/admin/system-health')
    );
    
    const responses = await Promise.all(requests);
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});