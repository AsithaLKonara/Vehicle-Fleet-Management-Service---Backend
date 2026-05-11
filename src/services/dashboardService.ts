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

  // Calculate Utilization Trends for the last 7 days
  const trends = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const startOfDay = new Date(date);
    
    date.setHours(23, 59, 59, 999);
    const endOfDay = new Date(date);

    const count = await prisma.assignment.count({
      where: {
        assignedAt: { lte: endOfDay },
        OR: [
          { returnedAt: null },
          { returnedAt: { gte: startOfDay } }
        ]
      }
    });

    trends.push({
      name: startOfDay.toLocaleDateString('en-US', { weekday: 'short' }),
      value: count,
      date: startOfDay.toISOString().split('T')[0]
    });
  }

  return {
    totalUsers: userCount,
    totalVehicles: vehicleCount,
    activeAssignments,
    statusDistribution: vehicleStatusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    utilizationTrends: trends,
  };
};
