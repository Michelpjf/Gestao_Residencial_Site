import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';

export function createApp({ trustProxy = false, authenticate } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  if (authenticate) {
    app.get('/api/auth/context', authenticate, (req, res) => {
      res.status(200).json(req.auth);
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
