import { z } from 'zod';
import { VehicleStatus } from '@prisma/client';

export const createVehicleSchema = z.object({
  body: z.object({
    plateNumber: z.string().min(3, 'Plate number is too short'),
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    purchaseCost: z.number().positive(),
    status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE),
    type: z.string().optional(),
    mileage: z.number().int().nonnegative().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const updateVehicleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    plateNumber: z.string().min(3).optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().int().optional(),
    purchaseCost: z.number().positive().optional(),
    status: z.nativeEnum(VehicleStatus).optional(),
    type: z.string().optional(),
    mileage: z.number().int().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const getVehiclesQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(VehicleStatus).optional(),
    type: z.string().optional(),
    search: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>['body'];
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>['body'];
