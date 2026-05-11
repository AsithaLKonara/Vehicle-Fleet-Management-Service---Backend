export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown[];

  constructor(message: string, statusCode: number = 500, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', errors?: unknown[]) {
    super(message, 400, errors);
  }
}
