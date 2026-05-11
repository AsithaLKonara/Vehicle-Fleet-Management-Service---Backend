import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { asyncWrapper } from '../utils/asyncWrapper';
import { config } from '../config';

const router = Router();

// ONLY enable this in development/test environments
if (config.NODE_ENV !== 'production') {
  router.post('/reset', asyncWrapper(async (req, res) => {
    try {
      const bcrypt = require('bcrypt');
      
      // Delete everything in a transaction
      await prisma.$transaction([
        prisma.serviceRecord.deleteMany(),
        prisma.assignment.deleteMany(),
        prisma.auditLog.deleteMany(),
        prisma.vehicle.deleteMany(),
        prisma.user.deleteMany(),
      ]);
      
      // 1. Create Users
      const adminPassword = await bcrypt.hash('admin123', 10);
      const managerPassword = await bcrypt.hash('manager123', 10);
      const staffPassword = await bcrypt.hash('staff123', 10);

      await prisma.user.createMany({
        data: [
          { email: 'admin@fleet.com', name: 'System Admin', password: adminPassword, role: 'ADMIN' },
          { email: 'manager@fleet.com', name: 'Fleet Manager', password: managerPassword, role: 'FLEET_MANAGER' },
          { email: 'staff@fleet.com', name: 'Fleet Staff', password: staffPassword, role: 'FLEET_STAFF' },
        ]
      });

      // 2. Create Vehicles
      await prisma.vehicle.createMany({
        data: [
          {
            id: 'c0a80101-0000-0000-0000-000000000001',
            plateNumber: 'ABC-1234',
            make: 'Toyota',
            model: 'Hiace',
            year: 2022,
            purchaseCost: 45000,
            status: 'AVAILABLE',
            type: 'Van',
          },
          {
            id: 'c0a80101-0000-0000-0000-000000000002',
            plateNumber: 'XYZ-5678',
            make: 'Nissan',
            model: 'NV350',
            year: 2023,
            purchaseCost: 48000,
            status: 'AVAILABLE',
            type: 'Van',
          }
        ]
      });

      // 3. Create historical assignments for trends
      const staff = await prisma.user.findFirst({ where: { role: 'FLEET_STAFF' } });
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      
      if (staff && admin) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        await prisma.assignment.create({
          data: {
            vehicleId: 'c0a80101-0000-0000-0000-000000000002',
            driverId: staff.id,
            assignedById: admin.id,
            assignedAt: yesterday,
            returnedAt: new Date()
          }
        });
      }
      
      res.status(200).json({ success: true, message: 'Test database reset and full seed complete' });
    } catch (error: any) {
      console.error('❌ Reset Failed:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }));
}

export default router;
