import rateLimit from 'express-rate-limit';
import { redis } from '@config/redis';

export const rateLimitStrict = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes max
  message: 'Trop de tentatives. Réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const rateLimitModerate = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Limite de requêtes atteinte',
});