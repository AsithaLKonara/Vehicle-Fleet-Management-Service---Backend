import { prisma } from '../lib/prisma';
import { CreateAssignmentInput } from '../validators/assignmentValidator';

export const getAllAssignments = async () => {
  return prisma.assignment.findMany({
    include: {
      vehicle: true,
      driver: true,
    },
    orderBy: { assignedAt: 'desc' },
  });
};

export const createAssignment = async (input: CreateAssignmentInput) => {
  return prisma.$transaction(async (tx) => {
    // 1. Check if vehicle is available
    const vehicle = await tx.vehicle.findUnique({
      where: { id: input.vehicleId },
    });

    if (!vehicle || vehicle.status !== 'AVAILABLE') {
      throw new Error('Vehicle is not available for assignment');
    }

    // 2. Create assignment
    const assignment = await tx.assignment.create({
      data: input,
    });

    // 3. Update vehicle status
    await tx.vehicle.update({
      where: { id: input.vehicleId },
      data: { status: 'ASSIGNED' },
    });

    return assignment;
  });
};

export const returnVehicle = async (id: string) => {
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

    // 3. Update vehicle status
    await tx.vehicle.update({
      where: { id: assignment.vehicleId },
      data: { status: 'AVAILABLE' },
    });

    return updatedAssignment;
  });
};
