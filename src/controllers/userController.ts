import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const listUsers = asyncWrapper(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});

export const createUser = asyncWrapper(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body, req.user!.id);
  res.status(201).json({ success: true, data: user });
});

export const updateUser = asyncWrapper(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id as string, req.body, req.user!.id);
  res.status(200).json({ success: true, data: user });
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id as string, req.user!.id);
  res.status(204).send();
});
