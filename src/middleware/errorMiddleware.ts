import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorMiddleware = (
  err: Error & { statusCode?: number; errors?: unknown[] },
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  // Log error with structured metadata
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`, {
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
    errors,
    userId: req.user?.id,
  });

  // Handle Prisma unique constraint violations
  if (err.message.includes('Unique constraint failed')) {
    return res.status(409).json({
      success: false,
      message: 'Asset conflict. This identifier is already registered in the registry.',
      errors: err.errors || [],
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
