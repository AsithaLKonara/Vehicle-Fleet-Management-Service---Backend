import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@fleet.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'System Admin',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('✅ Admin user created:', admin.email);
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // Sample Staff/Managers
  const managerEmail = 'manager@fleet.com';
  const existingManager = await prisma.user.findUnique({ where: { email: managerEmail } });
  if (!existingManager) {
    const hashedPassword = await bcrypt.hash('manager123', 10);
    await prisma.user.create({
      data: {
        email: managerEmail,
        name: 'Fleet Manager',
        password: hashedPassword,
        role: Role.FLEET_MANAGER,
      },
    });
    console.log('✅ Manager user created');
  }

  const staffEmail = 'staff@fleet.com';
  const existingStaff = await prisma.user.findUnique({ where: { email: staffEmail } });
  if (!existingStaff) {
    const hashedPassword = await bcrypt.hash('staff123', 10);
    await prisma.user.create({
      data: {
        email: staffEmail,
        name: 'Fleet Staff',
        password: hashedPassword,
        role: Role.FLEET_STAFF,
      },
    });
    console.log('✅ Staff user created');
  }

  const vehicleCount = await prisma.vehicle.count();
  if (vehicleCount === 0) {
    await prisma.vehicle.createMany({
      data: [
        {
          plateNumber: 'ABC-1234',
          make: 'Toyota',
          model: 'Hiace',
          year: 2022,
          purchaseCost: 45000,
          status: 'AVAILABLE',
          type: 'Van',
          notes: 'Regular service done',
        },
        {
          plateNumber: 'XYZ-5678',
          make: 'Nissan',
          model: 'NV350',
          year: 2023,
          purchaseCost: 48000,
          status: 'AVAILABLE',
          type: 'Van',
          notes: 'New arrival',
        },
      ],
    });
    console.log('✅ Sample vehicles created');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
