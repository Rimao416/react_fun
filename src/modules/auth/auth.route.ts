import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@shared/middlewares/validate';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resendVerificationSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from './auth.dto';
import { rateLimitStrict } from '@shared/middlewares/rate-limite';
import { authenticate } from './auth.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', rateLimitStrict, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// Email Verification
router.get('/verify-email/:token', authController.verifyEmail);
router.post(
  '/resend-verification',
  rateLimitStrict,
  validate(resendVerificationSchema),
  authController.resendVerificationEmail
);

// Password Reset
router.post(
  '/forgot-password',
  rateLimitStrict,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/reset-password/:token',
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ===== PROTECTED ROUTES =====
router.use(authenticate); // Toutes les routes ci-dessous nécessitent authentification

// Profile
router.get('/me', authController.me);
router.get('/verification-status', authController.checkVerificationStatus);

// Password Change
router.post(
  '/change-password',
  validate(changePasswordSchema),
  authController.changePassword
);

// Logout
router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAllDevices);

// Sessions Management
router.get('/sessions', authController.getActiveSessions);
router.delete('/sessions/:sessionId', authController.deleteSession);

export default router;

