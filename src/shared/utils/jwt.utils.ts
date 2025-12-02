import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { env } from '@config/env';

export const generateToken = (payload: { userId: string; role: string }) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as StringValue,
  });
};

export const generateRefreshToken = (payload: { userId: string }) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as StringValue,
  });
};


export const verifyToken = (token: string): { userId: string; role: string } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string; role: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};