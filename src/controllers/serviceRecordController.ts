import { Request, Response } from 'express';
import * as serviceRecordService from '../services/serviceRecordService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getVehicleServices = asyncWrapper(async (req: Request, res: Response) => {
  const records = await serviceRecordService.getServiceRecordsByVehicle(req.params.id as string);
  res.status(200).json({ success: true, data: records });
});

export const addVehicleService = asyncWrapper(async (req: Request, res: Response) => {
  const record = await serviceRecordService.createServiceRecord(req.params.id as string, req.body);
  res.status(201).json({ success: true, data: record });
});
