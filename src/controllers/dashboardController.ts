import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getStats = asyncWrapper(async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});
