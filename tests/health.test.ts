import request from 'supertest';
import app from '../src/app';

describe('Backend Foundation - Health Check', () => {
  it('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ success: true });
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toEqual(404);
  });
});
