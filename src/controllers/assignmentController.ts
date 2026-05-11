import { Request, Response } from 'express';
import * as assignmentService from '../services/assignmentService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const listAssignments = asyncWrapper(async (req: Request, res: Response) => {
  const assignments = await assignmentService.getAllAssignments();
  res.status(200).json({ success: true, data: assignments });
});

export const createAssignment = asyncWrapper(async (req: Request, res: Response) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export const returnVehicle = asyncWrapper(async (req: Request, res: Response) => {
  try {
    const assignment = await assignmentService.returnVehicle(req.params.id as string);
    res.status(200).json({ success: true, data: assignment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});
