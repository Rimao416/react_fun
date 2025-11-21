import { Request, Response, NextFunction } from 'express';
import { prisma } from '@config/database';
import { AppError } from '@shared/utils/errors';

/**
 * Middleware pour vérifier que l'onboarding est complété
 * Utiliser sur les routes qui nécessitent un profil complet
 */
export const requireOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      throw new AppError('Non authentifié', 401);
    }

    // Vérifier la progression
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      const error = new AppError(
        'Onboarding non commencé. Commence ton inscription !',
        403
      );
      // Ajouter les métadonnées directement à l'objet d'erreur
      (error as any).redirectTo = '/onboarding/initialize';
      throw error;
    }

    if (!progress.isCompleted) {
      const error = new AppError(
        `Complète ton profil (étape ${progress.currentStep}/10)`,
        403
      );
      (error as any).redirectTo = '/onboarding';
      (error as any).currentStep = progress.currentStep;
      (error as any).completedSteps = progress.completedSteps;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware pour vérifier une étape minimale
 * Ex: requireMinStep(5) = Au moins 5 étapes complétées
 */
export const requireMinStep = (minStep: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        throw new AppError('Non authentifié', 401);
      }

      const progress = await prisma.onboardingProgress.findUnique({
        where: { userId },
      });

      if (!progress || progress.currentStep < minStep) {
        const error = new AppError(
          `Complète au moins l'étape ${minStep} de ton profil`,
          403
        );
        (error as any).redirectTo = '/onboarding';
        (error as any).requiredStep = minStep;
        (error as any).currentStep = progress?.currentStep || 0;
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};