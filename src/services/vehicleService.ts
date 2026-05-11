import { prisma } from '../lib/prisma';
import { CreateVehicleInput, UpdateVehicleInput } from '../validators/vehicleValidator';
import { VehicleStatus } from '@prisma/client';

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

export const createVehicle = async (input: CreateVehicleInput) => {
  return prisma.vehicle.create({
    data: input,
  });
};

export const updateVehicle = async (id: string, input: UpdateVehicleInput) => {
  return prisma.vehicle.update({
    where: { id },
    data: input,
  });
};

export const deleteVehicle = async (id: string) => {
  return prisma.vehicle.delete({
    where: { id },
  });
};
