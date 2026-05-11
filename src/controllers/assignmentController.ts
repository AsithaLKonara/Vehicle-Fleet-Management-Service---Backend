import { Request, Response } from 'express';
import * as assignmentService from '../services/assignmentService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const listAssignments = asyncWrapper(async (req: Request, res: Response) => {
  const assignments = await assignmentService.getAllAssignments();
  res.status(200).json({ success: true, data: assignments });
});

export const createAssignment = asyncWrapper(async (req: Request, res: Response) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body, req.user!.id);
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ success: false, message });
  }
});

export const returnVehicle = asyncWrapper(async (req: Request, res: Response) => {
  try {
    const assignment = await assignmentService.returnVehicle(req.params.id as string, req.user!.id);
    res.status(200).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});
