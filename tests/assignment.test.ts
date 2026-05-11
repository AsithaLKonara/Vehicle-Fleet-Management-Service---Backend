import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/lib/prisma';
import jwt from 'jsonwebtoken';
import { config } from '../src/config';

describe('Assignment Management Module', () => {
  let adminToken: string;
  let vehicleId: string;
  let driverId: string;
  let assignmentId: string;

  beforeAll(async () => {
    // Cleanup
    await prisma.assignment.deleteMany({});
    await prisma.vehicle.deleteMany({ where: { plateNumber: 'ASGN-001' } });
    await prisma.user.deleteMany({ where: { email: { in: ['admin@test.com', 'driver@test.com'] } } });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: 'password123',
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    const driver = await prisma.user.create({
      data: {
        email: 'driver@test.com',
        password: 'password123',
        name: 'Driver User',
        role: 'FLEET_STAFF',
      },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber: 'ASGN-001',
        make: 'Ford',
        model: 'F-150',
        year: 2023,
        purchaseCost: 45000,
        status: 'AVAILABLE',
      },
    });

    adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, config.JWT_SECRET);
    vehicleId = vehicle.id;
    driverId = driver.id;
  });

  afterAll(async () => {
    await prisma.assignment.deleteMany({});
    await prisma.vehicle.deleteMany({ where: { id: vehicleId } });
    await prisma.user.deleteMany({ where: { id: { in: [driverId] } } });
    await prisma.$disconnect();
  });

  it('should assign a vehicle to a driver', async () => {
    const res = await request(app)
      .post('/assignments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        vehicleId,
        driverId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    assignmentId = res.body.data.id;

    // Verify vehicle status
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    expect(vehicle?.status).toBe('ASSIGNED');
  });

  it('should block assigning an already assigned vehicle', async () => {
    const res = await request(app)
      .post('/assignments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        vehicleId,
        driverId,
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Vehicle is not available for assignment');
  });

  it('should return a assigned vehicle', async () => {
    const res = await request(app)
      .patch(`/assignments/${assignmentId}/return`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.returnedAt).not.toBeNull();

    // Verify vehicle status
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    expect(vehicle?.status).toBe('AVAILABLE');
  });
});
