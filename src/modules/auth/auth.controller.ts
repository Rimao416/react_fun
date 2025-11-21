import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { RegisterDto, LoginDto } from './auth.dto';
import { prisma } from '@config/database';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request<{}, {}, RegisterDto>, res: Response) => {
    const result = await this.authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Inscription réussie. Vérifiez votre email.',
    });
  };

  login = async (req: Request<{}, {}, LoginDto>, res: Response) => {
    const result = await this.authService.login(req.body);
    res.json({
      success: true,
      data: result,
      message: 'Connexion réussie',
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshAccessToken(refreshToken);
    res.json({
      success: true,
      data: result,
    });
  };

  verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;
    const result = await this.authService.verifyEmail(token);
    res.json({
      success: true,
      data: result,
    });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await this.authService.forgotPassword(email);
    res.json({
      success: true,
      data: result,
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;
    const result = await this.authService.resetPassword(token, password);
    res.json({
      success: true,
      data: result,
    });
  };

  logout = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { refreshToken } = req.body;
    const result = await this.authService.logout(userId, refreshToken);
    res.json({
      success: true,
      data: result,
    });
  };

  me = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        profile: true, 
        reputation: true 
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  };
   resendVerificationEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await this.authService.resendVerificationEmail(email);
    res.json({
      success: true,
      data: result,
      message: result.message,
    });
  };

  checkVerificationStatus = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.authService.checkEmailVerificationStatus(userId);
    res.json({
      success: true,
      data: result,
    });
  };
 

  changePassword = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { oldPassword, newPassword } = req.body;
    const result = await this.authService.changePassword(userId, oldPassword, newPassword);
    res.json({
      success: true,
      data: result,
    });
  };
   logoutAllDevices = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await this.authService.logoutAllDevices(userId);
    res.json({
      success: true,
      data: result,
    });
  };

  // ===== SESSIONS =====
  getActiveSessions = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const sessions = await this.authService.getActiveSessions(userId);
    res.json({
      success: true,
      data: sessions,
    });
  };

  deleteSession = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;
    const result = await this.authService.deleteSession(userId, sessionId);
    res.json({
      success: true,
      data: result,
    });
  };


}