import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler, notFoundHandler } from '@shared/middlewares/error-handler';
import { env } from '@config/env';

// Routes

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

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};