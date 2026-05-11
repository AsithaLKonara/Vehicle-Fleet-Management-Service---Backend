import { prisma } from '../lib/prisma';

export interface CreateServiceRecordInput {
  title: string;
  description?: string;
  serviceDate: Date;
  cost: number;
}

export const getServiceRecordsByVehicle = async (vehicleId: string) => {
  return prisma.serviceRecord.findMany({
    where: { vehicleId },
    orderBy: { serviceDate: 'desc' },
  });
};

export const createServiceRecord = async (vehicleId: string, input: CreateServiceRecordInput) => {
  return prisma.serviceRecord.create({
    data: {
      ...input,
      vehicleId,
    },
  });
};
