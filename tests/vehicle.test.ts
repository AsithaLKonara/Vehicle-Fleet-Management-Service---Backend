import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import jwt from 'jsonwebtoken';
import { config } from '../src/config';

describe('Vehicle Management Module', () => {
  let adminToken: string;
  let staffToken: string;
  let vehicleId: string;

  beforeAll(async () => {
    await prisma.vehicle.deleteMany({ where: { plateNumber: 'TEST-999' } });
    await prisma.user.deleteMany({ where: { email: 'staff-user@test.com' } });

    const admin = await prisma.user.findUnique({ where: { email: 'admin-user@test.com' } });
    const staff = await prisma.user.create({
      data: {
        email: 'staff-user@test.com',
        password: 'password123',
        name: 'Staff User',
        role: 'FLEET_STAFF',
      },
    });

    adminToken = jwt.sign({ id: admin!.id, email: admin!.email, role: admin!.role }, config.JWT_SECRET);
    staffToken = jwt.sign({ id: staff.id, email: staff.email, role: staff.role }, config.JWT_SECRET);
  });

  afterAll(async () => {
    await prisma.vehicle.deleteMany({ where: { plateNumber: 'TEST-999' } });
    await prisma.user.deleteMany({ where: { email: 'staff-user@test.com' } });
    await prisma.$disconnect();
  });

  it('should create a new vehicle by admin', async () => {
    const res = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        plateNumber: 'TEST-999',
        make: 'Tesla',
        model: 'Model 3',
        year: 2024,
        purchaseCost: 55000,
        status: 'AVAILABLE',
        type: 'Sedan',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.plateNumber).toBe('TEST-999');
    vehicleId = res.body.data.id;
  });

  it('should block staff from creating vehicle', async () => {
    const res = await request(app)
      .post('/vehicles')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        plateNumber: 'STF-001',
        make: 'Ford',
        model: 'Transit',
        year: 2023,
        purchaseCost: 35000,
        status: 'AVAILABLE',
      });

    expect(res.statusCode).toEqual(403);
  });

  it('should list vehicles for staff', async () => {
    const res = await request(app)
      .get('/vehicles')
      .set('Authorization', `Bearer ${staffToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should filter vehicles by status', async () => {
    const res = await request(app)
      .get('/vehicles?status=AVAILABLE')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.every((v: any) => v.status === 'AVAILABLE')).toBe(true);
  });

  it('should update vehicle status', async () => {
    const res = await request(app)
      .patch(`/vehicles/${vehicleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'MAINTENANCE',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.status).toBe('MAINTENANCE');
  });
});
