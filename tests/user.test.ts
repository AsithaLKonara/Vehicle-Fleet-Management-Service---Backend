import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import jwt from 'jsonwebtoken';
import { config } from '../src/config';

describe('User Management Module', () => {
  let adminToken: string;
  let managerToken: string;

  beforeAll(async () => {
    await prisma.assignment.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { in: ['admin-user@test.com', 'manager-user@test.com', 'new-user@test.com'] } } });

    const admin = await prisma.user.create({
      data: {
        email: 'admin-user@test.com',
        password: 'password123',
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    const manager = await prisma.user.create({
      data: {
        email: 'manager-user@test.com',
        password: 'password123',
        name: 'Manager User',
        role: 'FLEET_MANAGER',
      },
    });

    adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, config.JWT_SECRET);
    managerToken = jwt.sign({ id: manager.id, email: manager.email, role: manager.role }, config.JWT_SECRET);
  });

  afterAll(async () => {
    await prisma.assignment.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.user.deleteMany({ where: { email: { in: ['admin-user@test.com', 'manager-user@test.com', 'new-user@test.com'] } } });
    await prisma.$disconnect();
  });

  it('should list users for admin', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should block non-admin from listing users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.statusCode).toEqual(403);
  });

  it('should create a new user by admin', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New User',
        email: 'new-user@test.com',
        password: 'password123',
        role: 'FLEET_STAFF',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.email).toBe('new-user@test.com');
  });
});
