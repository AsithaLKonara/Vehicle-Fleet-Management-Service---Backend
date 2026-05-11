import { prisma } from '../lib/prisma';
import { CreateVehicleInput, UpdateVehicleInput } from '../validators/vehicleValidator';
import { VehicleStatus } from '@prisma/client';
import { logAction } from './auditService';

export const getAllVehicles = async (filters: { status?: VehicleStatus; type?: string; search?: string; page?: number; limit?: number }) => {
  const { status, type, search, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const [total, vehicles] = await Promise.all([
    prisma.vehicle.count({
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
    prisma.vehicle.findMany({
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

export const getVehicleById = async (id: string) => {
  return prisma.vehicle.findUnique({
    where: { id },
  });
};

export const createVehicle = async (input: CreateVehicleInput, performerId: string) => {
  const normalizedPlate = input.plateNumber.toUpperCase();
  const existing = await prisma.vehicle.findUnique({ where: { plateNumber: normalizedPlate } });
  if (existing) {
    throw new Error('Vehicle with this plate number already exists');
  }

  const vehicle = await prisma.vehicle.create({
    data: { ...input, plateNumber: normalizedPlate },
  });

  await logAction(performerId, 'CREATE', 'VEHICLE', vehicle.id, input);
  return vehicle;
};

export const updateVehicle = async (id: string, input: UpdateVehicleInput, performerId: string) => {
  if (input.plateNumber) {
    const normalizedPlate = input.plateNumber.toUpperCase();
    const existing = await prisma.vehicle.findFirst({
      where: {
        plateNumber: normalizedPlate,
        id: { not: id }
      }
    });
    if (existing) {
      throw new Error('Vehicle with this plate number already exists');
    }
    input.plateNumber = normalizedPlate;
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: input,
  });

  await logAction(performerId, 'UPDATE', 'VEHICLE', vehicle.id, input);
  return vehicle;
};

export const deleteVehicle = async (id: string, performerId: string) => {
  await logAction(performerId, 'DELETE', 'VEHICLE', id);
  return prisma.vehicle.delete({
    where: { id },
  });
};
