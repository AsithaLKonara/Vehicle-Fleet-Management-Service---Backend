import { prisma } from '../lib/prisma';
import { CreateVehicleInput, UpdateVehicleInput } from '../validators/vehicleValidator';
import { VehicleStatus } from '@prisma/client';

export const getAllVehicles = async (filters: { status?: VehicleStatus; type?: string; search?: string }) => {
  const { status, type, search } = filters;

  return prisma.vehicle.findMany({
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
  });
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
