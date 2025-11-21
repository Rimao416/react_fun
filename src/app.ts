import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, notFoundHandler } from '@shared/middlewares/error-handler';
import { env } from '@config/env';

// Routes
import authRoutes from '@modules/auth/auth.route';
import userRoutes from '@modules/users/user.route';
import onboardingRoutes from '@modules/onboarding/onboarding.route';
import referenceRoutes from '@modules/reference/reference.route';
import missionRoutes from '@modules/missions/mission.route';
import proposalRoutes from '@modules/proposals/proposal.route';

import { requestLogger } from '@shared/middlewares/logger';

export const createApp = (): Express => {
  const app = express();

  // Security
  app.use(helmet());
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }));

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  app.use(requestLogger);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'user-service' });
  });

  // Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/onboarding', onboardingRoutes);
  app.use('/api/v1/reference', referenceRoutes);
  app.use('/api/v1/missions', missionRoutes);
  app.use('/api/v1/proposals', proposalRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};