import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { asyncWrapper } from '../utils/asyncWrapper';

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  if (!result) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});
