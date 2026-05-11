import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import jwt from 'jsonwebtoken';
import { config } from '../src/config';

describe('Dashboard Module', () => {
  let adminToken: string;

  beforeAll(async () => {
    let admin = await prisma.user.findUnique({ where: { email: 'admin-user@test.com' } });
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: 'admin-user@test.com',
          password: 'password123',
          name: 'Admin User',
          role: 'ADMIN',
        },
      });
    }
    adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, config.JWT_SECRET);
  });

  it('should get dashboard stats', async () => {
    const res = await request(app)
      .get('/dashboard/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('totalUsers');
    expect(res.body.data).toHaveProperty('totalVehicles');
    expect(res.body.data).toHaveProperty('activeAssignments');
    expect(Array.isArray(res.body.data.statusDistribution)).toBe(true);
  });
});
