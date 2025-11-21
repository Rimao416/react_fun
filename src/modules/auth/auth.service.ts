// ===== auth.service.ts - VERSION COMPLÈTE =====

import { prisma } from '@config/database';
import { redis } from '@config/redis';
import { hashPassword, verifyPassword } from '@shared/utils/hash.utils';
import { generateToken, generateRefreshToken } from '@shared/utils/jwt.utils';
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail,
  sendWelcomeEmail 
} from '@shared/utils/email.utils';
import { randomBytes } from 'crypto';
import type { RegisterDto, LoginDto } from './auth.dto';
import { AppError } from '@shared/utils/errors';

export class AuthService {
  // ===== REGISTER =====
  async register(data: RegisterDto) {
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      throw new AppError('Email ou téléphone déjà utilisé', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        profile: {
          create: {},
        },
        reputation: {
          create: {},
        },
      },
      include: {
        profile: true,
        reputation: true,
      },
    });

    // Générer token de vérification email
    const verificationToken = randomBytes(32).toString('hex');
    await redis.setEx(
      `email_verification:${verificationToken}`,
      3600, // 1 heure
      user.id
    );

    // Envoyer email de vérification
    await sendVerificationEmail(user.email, verificationToken, {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    // Générer tokens JWT
    const accessToken = generateToken({ userId: user.id, role: user.role });
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      user: this.sanitizeUser(user),
      tokens: { accessToken, refreshToken },
    };
  }

  // ===== LOGIN =====
  async login(data: LoginDto) {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true, reputation: true },
    });

    if (!user) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Vérifier le statut
    if (user.status === 'BANNED') {
      throw new AppError('Compte banni. Contactez le support', 403);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Compte suspendu temporairement', 403);
    }

    // Vérifier le mot de passe
    const isValidPassword = await verifyPassword(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Mettre à jour last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Générer tokens
    const accessToken = generateToken({ userId: user.id, role: user.role });
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      user: this.sanitizeUser(user),
      tokens: { accessToken, refreshToken },
    };
  }

  // ===== REFRESH TOKEN =====
  async refreshAccessToken(token: string) {
    // Vérifier si le token existe
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Refresh token invalide ou expiré', 401);
    }

    // Générer nouveau access token
    const accessToken = generateToken({
      userId: storedToken.user.id,
      role: storedToken.user.role,
    });

    return { accessToken };
  }

  // ===== VERIFY EMAIL =====
  async verifyEmail(token: string) {
    // Récupérer l'userId depuis Redis
    const userId = await redis.get(`email_verification:${token}`);

    if (!userId) {
      throw new AppError('Token de vérification invalide ou expiré', 400);
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier si déjà vérifié
    if (user.emailVerified) {
      throw new AppError('Email déjà vérifié', 400);
    }

    // Mettre à jour le statut de vérification
    await prisma.user.update({
      where: { id: userId },
      data: { 
        emailVerified: true,
        updatedAt: new Date(),
      },
    });

    // Supprimer le token de Redis
    await redis.del(`email_verification:${token}`);

    // Envoyer l'email de bienvenue
    await sendWelcomeEmail(user.email, {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return { 
      message: 'Email vérifié avec succès',
      emailVerified: true,
    };
  }

  // ===== RESEND VERIFICATION EMAIL =====
  async resendVerificationEmail(email: string) {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'email existe (sécurité)
      return { 
        message: 'Si un compte existe avec cet email, un nouveau lien a été envoyé' 
      };
    }

    // Vérifier si déjà vérifié
    if (user.emailVerified) {
      throw new AppError('Email déjà vérifié', 400);
    }

    // Supprimer les anciens tokens de cet utilisateur
    const oldTokenPattern = `email_verification:*`;
    const keys = await redis.keys(oldTokenPattern);
    
    for (const key of keys) {
      const storedUserId = await redis.get(key);
      if (storedUserId === user.id) {
        await redis.del(key);
      }
    }

    // Générer nouveau token
    const verificationToken = randomBytes(32).toString('hex');
    
    // Stocker dans Redis avec expiration (1 heure)
    await redis.setEx(
      `email_verification:${verificationToken}`,
      3600,
      user.id
    );

    // Envoyer l'email
    await sendVerificationEmail(user.email, verificationToken, {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return { 
      message: 'Email de vérification renvoyé avec succès' 
    };
  }

  // ===== CHECK EMAIL VERIFICATION STATUS =====
  async checkEmailVerificationStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    return {
      email: user.email,
      verified: user.emailVerified,
    };
  }

  // ===== FORGOT PASSWORD =====
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Ne pas révéler si l'email existe
      return { message: 'Si un compte existe, un email a été envoyé' };
    }

    // Supprimer les anciens tokens de reset
    const oldResetPattern = `password_reset:*`;
    const keys = await redis.keys(oldResetPattern);
    
    for (const key of keys) {
      const storedUserId = await redis.get(key);
      if (storedUserId === user.id) {
        await redis.del(key);
      }
    }

    // Générer token de réinitialisation
    const resetToken = randomBytes(32).toString('hex');
    await redis.setEx(
      `password_reset:${resetToken}`,
      1800, // 30 minutes
      user.id
    );

    await sendPasswordResetEmail(user.email, resetToken, {
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return { message: 'Si un compte existe, un email a été envoyé' };
  }

  // ===== RESET PASSWORD =====
  async resetPassword(token: string, newPassword: string) {
    const userId = await redis.get(`password_reset:${token}`);

    if (!userId) {
      throw new AppError('Token de réinitialisation invalide ou expiré', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Supprimer tous les refresh tokens
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await redis.del(`password_reset:${token}`);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  // ===== CHANGE PASSWORD (authenticated user) =====
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await verifyPassword(oldPassword, user.password);
    if (!isValidPassword) {
      throw new AppError('Ancien mot de passe incorrect', 401);
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Supprimer tous les refresh tokens sauf le courant
    // (force re-login sur les autres appareils)
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Mot de passe changé avec succès' };
  }

  // ===== LOGOUT =====
  async logout(userId: string, refreshToken: string) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    return { message: 'Déconnexion réussie' };
  }

  // ===== LOGOUT ALL DEVICES =====
  async logoutAllDevices(userId: string) {
    // Supprimer tous les refresh tokens de l'utilisateur
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Déconnexion de tous les appareils réussie' };
  }

  // ===== GET ACTIVE SESSIONS =====
  async getActiveSessions(userId: string) {
    const sessions = await prisma.refreshToken.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map(session => ({
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isExpired: session.expiresAt < new Date(),
    }));
  }

  // ===== DELETE SESSION =====
  async deleteSession(userId: string, sessionId: string) {
    // Vérifier que la session appartient à l'utilisateur
    const session = await prisma.refreshToken.findFirst({
      where: {
        id: sessionId,
        userId: userId,
      },
    });

    if (!session) {
      throw new AppError('Session non trouvée', 404);
    }

    await prisma.refreshToken.delete({
      where: { id: sessionId },
    });

    return { message: 'Session supprimée avec succès' };
  }

  // ===== HELPERS =====
  private async createRefreshToken(userId: string) {
    const token = generateRefreshToken({ userId });

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
      },
    });

    return token;
  }

  private sanitizeUser(user: any) {
    const { password, twoFactorSecret, ...sanitized } = user;
    return sanitized;
  }
}