import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';
import { asyncWrapper } from '../utils/asyncWrapper';
import { VehicleStatus } from '@prisma/client';

export const listVehicles = asyncWrapper(async (req: Request, res: Response) => {
  const { status, type, search, driverName, page, limit } = req.query;
  const result = await vehicleService.getAllVehicles({
    status: status as VehicleStatus,
    type: type as string,
    search: search as string,
    driverName: driverName as string,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });
  res.status(200).json({ success: true, data: result.vehicles, meta: { total: result.total, page: result.page, limit: result.limit } });
});

export const getVehicle = asyncWrapper(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id as string);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  res.status(200).json({ success: true, data: vehicle });
});

export const createVehicle = asyncWrapper(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.createVehicle(req.body, req.user!.id);
  res.status(201).json({ success: true, data: vehicle });
});

export const updateVehicle = asyncWrapper(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id as string, req.body, req.user!.id);
  res.status(200).json({ success: true, data: vehicle });
});

export const deleteVehicle = asyncWrapper(async (req: Request, res: Response) => {
  await vehicleService.deleteVehicle(req.params.id as string, req.user!.id);
  res.status(204).send();
});
