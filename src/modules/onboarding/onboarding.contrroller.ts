import { Request, Response } from 'express';
import { OnboardingService } from './onboarding.service';

export class OnboardingController {
  private service = new OnboardingService();

  // Initialiser
  initialize = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.initializeOnboarding(userId);
    res.json({ success: true, data: result });
  };

  // Récupérer progression
  getProgress = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const progress = await this.service.getProgress(userId);
    res.json({ success: true, data: progress });
  };

  // Étapes individuelles
  saveStep1 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep1(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep2 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep2(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep3 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep3(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep4 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep4(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep5 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep5(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep6 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep6(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep7 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep7(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep8 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep8(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep9 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep9(userId, req.body);
    res.json({ success: true, data: result });
  };

  saveStep10 = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.saveStep10(userId, req.body);
    res.json({ success: true, data: result });
  };

  // Finaliser
  complete = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.service.completeOnboarding(userId);
    res.json({ success: true, data: result });
  };

  // Navigation
  goToStep = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { step } = req.params;
    const result = await this.service.goToStep(userId, parseInt(step));
    res.json({ success: true, data: result });
  };
}