import { Request, Response } from 'express';
import * as auditService from '../services/auditService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const getAuditLogs = asyncWrapper(async (req: Request, res: Response) => {
  const logs = await auditService.getAuditLogs();
  res.status(200).json({ success: true, data: logs });
});
