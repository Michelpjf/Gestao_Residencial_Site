import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { errorHandler } from './middleware/error-handler.js';
import { notFound } from './middleware/not-found.js';
import { createApiRouter } from './modules/index.js';
import { createHealthRouter } from './modules/health/health.routes.js';

function createHelmetOptions(supabaseUrl) {
  if (!supabaseUrl) return undefined;

  const supabaseOrigin = new URL(supabaseUrl).origin;
  const supabaseWebSocketOrigin = supabaseOrigin.replace(/^https:/, 'wss:');

  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', supabaseOrigin],
        connectSrc: ["'self'", supabaseOrigin, supabaseWebSocketOrigin],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  };
}

export function createApp({
  trustProxy = false,
  staticDir = null,
  supabaseUrl,
  supabasePublishableKey,
  authenticate,
  buildingService,
  unitService,
  tenantService,
  contractService,
  reportService,
} = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', trustProxy);
  app.use(helmet(createHelmetOptions(supabaseUrl)));
  app.use(express.json({ limit: '100kb' }));

  app.use('/health', createHealthRouter());
  app.use('/api', createApiRouter({ authenticate, buildingService, unitService, tenantService, contractService, reportService }));
  app.use('/api', notFound);

  if (staticDir) {
    const resolvedStaticDir = path.resolve(staticDir);
    app.get('/config.js', (_req, res) => {
      res.set('Cache-Control', 'no-store');
      res.type('application/javascript').send(
        `window.BUENO_CONFIG = ${JSON.stringify({
          supabaseUrl,
          supabasePublishableKey,
        })};`,
      );
    });
    app.use(express.static(resolvedStaticDir, { dotfiles: 'deny', index: 'index.html' }));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
