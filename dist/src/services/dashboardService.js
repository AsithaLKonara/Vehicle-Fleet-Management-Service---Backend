"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const prisma_1 = require("../lib/prisma");
const getDashboardStats = async () => {
    const [userCount, vehicleCount, activeAssignments, vehicleStatusCounts] = await Promise.all([
        prisma_1.prisma.user.count(),
        prisma_1.prisma.vehicle.count(),
        prisma_1.prisma.assignment.count({ where: { returnedAt: null } }),
        prisma_1.prisma.vehicle.groupBy({
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
exports.getDashboardStats = getDashboardStats;
