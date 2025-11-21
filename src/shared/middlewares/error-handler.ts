import { Request, Response, NextFunction } from 'express';
import { env } from '@config/env';
import { AppError } from '@shared/utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} non trouvée`,
  });
};
