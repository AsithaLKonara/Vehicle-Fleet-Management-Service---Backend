"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnVehicle = exports.createAssignment = exports.getAllAssignments = void 0;
const prisma_1 = require("../lib/prisma");
const auditService_1 = require("./auditService");
const getAllAssignments = async () => {
    return prisma_1.prisma.assignment.findMany({
        include: {
            vehicle: true,
            driver: true,
            assignedBy: true,
        },
        orderBy: { assignedAt: 'desc' },
    });
};
exports.getAllAssignments = getAllAssignments;
const createAssignment = async (input, userId) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        // 1. Atomic update to check availability and mark as assigned simultaneously
        const updateResult = await tx.vehicle.updateMany({
            where: {
                id: input.vehicleId,
                status: 'AVAILABLE',
            },
            data: {
                status: 'ASSIGNED',
            },
        });
        if (updateResult.count === 0) {
            throw new Error('Vehicle is not available for assignment or does not exist');
        }
        // 2. Create assignment record
        const assignment = await tx.assignment.create({
            data: {
                ...input,
                assignedById: userId,
            },
        });
        // 3. Log Action
        await (0, auditService_1.logAction)(userId, 'CREATE', 'ASSIGNMENT', assignment.id, { vehicleId: input.vehicleId }, tx);
        return assignment;
    });
};
exports.createAssignment = createAssignment;
const returnVehicle = async (id, userId) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        // 1. Find the assignment
        const assignment = await tx.assignment.findUnique({
            where: { id },
        });
        if (!assignment || assignment.returnedAt) {
            throw new Error('Assignment not found or already returned');
        }
        // 2. Update assignment
        const updatedAssignment = await tx.assignment.update({
            where: { id },
            data: { returnedAt: new Date() },
        });
        // 3. Update vehicle status
        await tx.vehicle.update({
            where: { id: assignment.vehicleId },
            data: { status: 'AVAILABLE' },
        });
        // 4. Log Action
        await (0, auditService_1.logAction)(userId, 'RETURN', 'ASSIGNMENT', id, { vehicleId: assignment.vehicleId }, tx);
        return updatedAssignment;
    });
};
exports.returnVehicle = returnVehicle;
