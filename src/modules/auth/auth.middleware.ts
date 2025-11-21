import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@shared/utils/jwt.utils';
import { AppError } from '@shared/utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token manquant', 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Token invalide ou expiré', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Non authentifié', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Accès interdit', 403);
    }

    next();
  };
};