import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { createApiRouter } from './modules/index.js';
import { createHealthRouter } from './modules/health/health.routes.js';

export function createApp({ trustProxy = false, authenticate } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));

  app.use('/health', createHealthRouter());
  app.use('/api', createApiRouter({ authenticate }));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
