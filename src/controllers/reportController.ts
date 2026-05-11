import { Request, Response } from 'express';
import * as reportService from '../services/reportService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const exportVehicles = asyncWrapper(async (req: Request, res: Response) => {
  const csv = await reportService.exportVehiclesCsv();
  res.header('Content-Type', 'text/csv');
  res.attachment('vehicles-report.csv');
  res.send(csv);
});

export const exportAssignments = asyncWrapper(async (req: Request, res: Response) => {
  const csv = await reportService.exportAssignmentsCsv();
  res.header('Content-Type', 'text/csv');
  res.attachment('assignments-report.csv');
  res.send(csv);
});

export const exportAuditLogs = asyncWrapper(async (req: Request, res: Response) => {
  const csv = await reportService.exportAuditLogsCsv();
  res.header('Content-Type', 'text/csv');
  res.attachment('audit-logs-report.csv');
  res.send(csv);
});
