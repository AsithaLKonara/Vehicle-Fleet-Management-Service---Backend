import { prisma } from '../lib/prisma';

export const getDashboardStats = async () => {
  const [userCount, vehicleCount, activeAssignments, vehicleStatusCounts] = await Promise.all([
    prisma.user.count(),
    prisma.vehicle.count(),
    prisma.assignment.count({ where: { returnedAt: null } }),
    prisma.vehicle.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    }),
  ]);

  return {
    totalUsers: userCount,
    totalVehicles: vehicleCount,
    activeAssignments,
    statusDistribution: vehicleStatusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
  };
};
