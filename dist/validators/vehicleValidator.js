"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehiclesQuerySchema = exports.updateVehicleSchema = exports.createVehicleSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createVehicleSchema = zod_1.z.object({
    body: zod_1.z.object({
        plateNumber: zod_1.z.string().min(3, 'Plate number is too short'),
        make: zod_1.z.string().min(1, 'Make is required'),
        model: zod_1.z.string().min(1, 'Model is required'),
        year: zod_1.z.number().int().min(1900).max(new Date().getFullYear() + 1),
        purchaseCost: zod_1.z.number().positive(),
        status: zod_1.z.nativeEnum(client_1.VehicleStatus).default(client_1.VehicleStatus.AVAILABLE),
        type: zod_1.z.string().optional(),
        mileage: zod_1.z.number().int().nonnegative().optional(),
    }),
});
exports.updateVehicleSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    }),
    body: zod_1.z.object({
        plateNumber: zod_1.z.string().min(3).optional(),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        year: zod_1.z.number().int().optional(),
        purchaseCost: zod_1.z.number().positive().optional(),
        status: zod_1.z.nativeEnum(client_1.VehicleStatus).optional(),
        type: zod_1.z.string().optional(),
        mileage: zod_1.z.number().int().optional(),
    }),
});
exports.getVehiclesQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.VehicleStatus).optional(),
        type: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
