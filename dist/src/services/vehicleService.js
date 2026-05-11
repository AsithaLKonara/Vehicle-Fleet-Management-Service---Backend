"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.getAllVehicles = void 0;
const prisma_1 = require("../lib/prisma");
const auditService_1 = require("./auditService");
const getAllVehicles = async (filters) => {
    const { status, type, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const [total, vehicles] = await Promise.all([
        prisma_1.prisma.vehicle.count({
            where: {
                AND: [
                    status ? { status } : {},
                    type ? { type: { contains: type, mode: 'insensitive' } } : {},
                    search
                        ? {
                            OR: [
                                { plateNumber: { contains: search, mode: 'insensitive' } },
                                { make: { contains: search, mode: 'insensitive' } },
                                { model: { contains: search, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                ],
            },
        }),
        prisma_1.prisma.vehicle.findMany({
            where: {
                AND: [
                    status ? { status } : {},
                    type ? { type: { contains: type, mode: 'insensitive' } } : {},
                    search
                        ? {
                            OR: [
                                { plateNumber: { contains: search, mode: 'insensitive' } },
                                { make: { contains: search, mode: 'insensitive' } },
                                { model: { contains: search, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                ],
            },
            orderBy: { plateNumber: 'asc' },
            skip,
            take: limit,
        }),
    ]);
    return { total, page, limit, vehicles };
};
exports.getAllVehicles = getAllVehicles;
const getVehicleById = async (id) => {
    return prisma_1.prisma.vehicle.findUnique({
        where: { id },
    });
};
exports.getVehicleById = getVehicleById;
const createVehicle = async (input, performerId) => {
    const vehicle = await prisma_1.prisma.vehicle.create({
        data: input,
    });
    await (0, auditService_1.logAction)(performerId, 'CREATE', 'VEHICLE', vehicle.id, input);
    return vehicle;
};
exports.createVehicle = createVehicle;
const updateVehicle = async (id, input, performerId) => {
    const vehicle = await prisma_1.prisma.vehicle.update({
        where: { id },
        data: input,
    });
    await (0, auditService_1.logAction)(performerId, 'UPDATE', 'VEHICLE', vehicle.id, input);
    return vehicle;
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (id, performerId) => {
    await (0, auditService_1.logAction)(performerId, 'DELETE', 'VEHICLE', id);
    return prisma_1.prisma.vehicle.delete({
        where: { id },
    });
};
exports.deleteVehicle = deleteVehicle;
