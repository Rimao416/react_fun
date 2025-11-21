import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/utils/errors';

/**
 * Middleware pour vérifier que l'utilisateur est un CLIENT
 */
export const requireClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Non authentifié', 401);
  }

  if (req.user.role !== 'CLIENT') {
    throw new AppError('Cette action est réservée aux clients', 403);
  }

  next();
};

/**
 * Middleware pour vérifier que l'utilisateur est un FREELANCER
 */
export const requireFreelancer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Non authentifié', 401);
  }

  if (req.user.role !== 'FREELANCER') {
    throw new AppError('Cette action est réservée aux freelancers', 403);
  }

  next();
};

/**
 * Middleware pour vérifier que l'email est vérifié
 */
export const requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Non authentifié', 401);
  }

  // Cette vérification devrait être faite en récupérant l'utilisateur depuis la DB
  // Pour l'instant on la laisse passer, mais à implémenter si nécessaire
  next();
};