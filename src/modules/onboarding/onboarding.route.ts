import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '@shared/middlewares/validate';
import {
  step1Schema, step2Schema, step3Schema, step4Schema, step5Schema,
  step6Schema, step7Schema, step8Schema, step9Schema, step10Schema,
} from './onboarding.dto';
import { OnboardingController } from './onboarding.contrroller';
import { UploadService } from '@modules/upload/upload.service';
import { uploadAvatar } from '@modules/upload/upload.middleware';
import { AppError } from '@shared/utils/errors';
import { authenticate } from '@modules/auth/auth.middleware';

const router = Router();
const controller = new OnboardingController();
const uploadService = new UploadService();

// Toutes les routes nécessitent authentification
router.use(authenticate);

router.post(
  '/upload-avatar',
  authenticate,
  uploadAvatar,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      
      if (!req.file) {
        throw new AppError('Aucun fichier fourni', 400);
      }
      const result = await uploadService.uploadAvatar(userId, req.file);
      
      res.json({
        success: true,
        data: result,
        message: 'Avatar uploadé avec succès',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Gestion progression
router.post('/initialize', controller.initialize);
router.get('/progress', controller.getProgress);
router.post('/complete', controller.complete);
router.patch('/go-to-step/:step', controller.goToStep);

// Étapes individuelles
router.post('/step-1', validate(step1Schema), controller.saveStep1);
router.post('/step-2', validate(step2Schema), controller.saveStep2);
router.post('/step-3', validate(step3Schema), controller.saveStep3);
router.post('/step-4', validate(step4Schema), controller.saveStep4);
router.post('/step-5', validate(step5Schema), controller.saveStep5);
router.post('/step-6', validate(step6Schema), controller.saveStep6);
router.post('/step-7', validate(step7Schema), controller.saveStep7);
router.post('/step-8', validate(step8Schema), controller.saveStep8);
router.post('/step-9', validate(step9Schema), controller.saveStep9);
router.post('/step-10', validate(step10Schema), controller.saveStep10);

export default router;