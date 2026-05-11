import { prisma } from '../lib/prisma';
import { CreateAssignmentInput } from '../validators/assignmentValidator';
import { logAction } from './auditService';

export const getAllAssignments = async () => {
  return prisma.assignment.findMany({
    include: {
      vehicle: true,
      driver: true,
      assignedBy: true,
    },
    orderBy: { assignedAt: 'desc' },
  });
};

export const createAssignment = async (input: CreateAssignmentInput, userId: string) => {
  return prisma.$transaction(async (tx) => {
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
    await logAction(userId, 'CREATE', 'ASSIGNMENT', assignment.id, { vehicleId: input.vehicleId }, tx);

    return assignment;
  });
};

export const returnVehicle = async (id: string, userId: string) => {
  return prisma.$transaction(async (tx) => {
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

    // 3. Update vehicle status - only if it is currently ASSIGNED
    // This prevents accidentally marking a vehicle as AVAILABLE if it was moved to MAINTENANCE
    await tx.vehicle.updateMany({
      where: { 
        id: assignment.vehicleId,
        status: 'ASSIGNED'
      },
      data: { status: 'AVAILABLE' },
    });

    // 4. Log Action
    await logAction(userId, 'RETURN', 'ASSIGNMENT', id, { vehicleId: assignment.vehicleId }, tx);

    return updatedAssignment;
  });
};
